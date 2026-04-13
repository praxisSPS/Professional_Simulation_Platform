/**
 * Praxis Simulation Engine
 * The central controller that manages the real-time flow of a simulation session.
 * Runs in the browser, polls for time-based triggers, fires tasks,
 * and handles the consequence cascade when decisions are made.
 *
 * Architecture: This is a client-side state machine.
 * It reads the simulation script for the user's career path + sim_day,
 * then fires tasks at the correct offsets from clock-in time.
 */

import { createClient } from '@/lib/supabase/client'
import { SIMULATION_SCRIPTS, SimTask, DecisionOption, CareerScript } from './simulation-scripts'

export interface EngineState {
  sessionId: string
  careerPath: string
  simDay: number
  clockInTime: Date
  activeTask: SimTask | null
  completedTaskIds: Set<string>
  pendingTaskIds: Set<string>
  kpis: {
    reliability: number
    responsiveness: number
    quality: number
    scope_control: number
    performance_index: number
  }
  xp: number
  messages: EngineMessage[]
}

export interface EngineMessage {
  id: string
  type: 'consequence' | 'boss_reaction' | 'coworker_reaction' | 'kpi_update' | 'system'
  text: string
  severity: 'positive' | 'negative' | 'neutral'
  timestamp: Date
}

type EngineListener = (state: EngineState) => void

class SimulationEngine {
  private state: EngineState | null = null
  private listeners: EngineListener[] = []
  private tickInterval: ReturnType<typeof setInterval> | null = null
  private script: CareerScript | null = null
  private supabase = createClient()

  // ── Start a session ──────────────────────────────────────────

  async start(params: {
    sessionId: string
    careerPath: string
    simDay: number
    userId: string
    initialKPIs?: EngineState['kpis']
  }) {
    const script = SIMULATION_SCRIPTS[params.careerPath]
    if (!script) throw new Error(`No script found for career path: ${params.careerPath}`)

    this.script = script
    this.state = {
      sessionId: params.sessionId,
      careerPath: params.careerPath,
      simDay: params.simDay,
      clockInTime: new Date(),
      activeTask: null,
      completedTaskIds: new Set(),
      pendingTaskIds: new Set(script.tasks.map(t => t.id)),
      kpis: params.initialKPIs ?? {
        reliability: 75,
        responsiveness: 75,
        quality: 75,
        scope_control: 75,
        performance_index: 75,
      },
      xp: 0,
      messages: [],
    }

    // Start the tick loop — checks every 10 real seconds
    // In the real app, 1 real minute = 15 sim minutes (so a 9-5 = ~32 real mins)
    // For demo purposes the ratio can be adjusted
    this.tickInterval = setInterval(() => this.tick(), 10_000)
    this.tick() // fire immediately
    this.emit()
  }

  stop() {
    if (this.tickInterval) clearInterval(this.tickInterval)
    this.tickInterval = null
  }

  // ── Core tick loop ───────────────────────────────────────────

  private tick() {
    if (!this.state || !this.script) return

    const elapsedRealMs = Date.now() - this.state.clockInTime.getTime()
    // Sim time compression: 1 real second = 2 sim minutes
    const elapsedSimMinutes = (elapsedRealMs / 1000) * 2

    // Find tasks that should have fired by now but haven't
    for (const task of this.script.tasks) {
      if (this.state.completedTaskIds.has(task.id)) continue
      if (this.state.activeTask?.id === task.id) continue
      if (task.trigger_minutes_after_clockin <= elapsedSimMinutes) {
        this.activateTask(task)
        break // one task at a time
      }
    }

    // Apply responsiveness penalty if active urgent task is overdue
    if (this.state.activeTask?.urgency === 'urgent') {
      const taskElapsedMs = elapsedRealMs - (this.state.activeTask.trigger_minutes_after_clockin / 2 * 1000)
      if (taskElapsedMs > 60_000) { // 1 real minute overdue on urgent = penalty
        this.applyKPIDelta({ responsiveness: -1 }, 'silent')
      }
    }
  }

  private activateTask(task: SimTask) {
    if (!this.state) return
    this.state = { ...this.state, activeTask: task }
    this.state.pendingTaskIds.delete(task.id)

    // Notify the UI
    this.addMessage({
      type: 'system',
      text: task.urgency === 'urgent'
        ? `Urgent: "${task.title}" — this requires an immediate response.`
        : `New task: "${task.title}"`,
      severity: task.urgency === 'urgent' ? 'negative' : 'neutral',
    })

    this.emit()
  }

  // ── Decision resolution ──────────────────────────────────────

  async resolveDecision(optionId: 'A' | 'B' | 'C') {
    if (!this.state?.activeTask?.options) return
    const task = this.state.activeTask
    const option = task.options.find(o => o.id === optionId)
    if (!option) return

    // Apply KPI impacts
    this.applyKPIDelta(option.kpi_impact, option.quality)

    // Add XP
    this.state = {
      ...this.state,
      xp: this.state.xp + option.xp,
      activeTask: null,
      completedTaskIds: new Set([...this.state.completedTaskIds, task.id]),
    }

    // Add consequence message
    this.addMessage({
      type: 'consequence',
      text: option.consequence,
      severity: option.quality === 'good' ? 'positive' : 'negative',
    })

    // Persist to database
    await this.persistTaskCompletion(task, option)

    this.emit()
  }

  async resolveTextTask(taskId: string, response: string, score: number) {
    if (!this.state) return

    this.state = {
      ...this.state,
      activeTask: null,
      completedTaskIds: new Set([...this.state.completedTaskIds, taskId]),
      xp: this.state.xp + (score >= 80 ? 25 : score >= 60 ? 15 : 5),
    }

    const delta = score >= 80 ? 10 : score >= 60 ? 0 : -8
    this.applyKPIDelta({ quality: delta, reliability: 5 }, score >= 80 ? 'good' : 'medium')

    this.addMessage({
      type: 'boss_reaction',
      text: score >= 80
        ? 'Good work on that task. Clear and precise — that\'s what I need.'
        : score >= 60
          ? 'Acceptable, but there\'s room to be sharper. Review the feedback and try to tighten your approach.'
          : 'This needs work. Let\'s discuss at your next 1:1.',
      severity: score >= 80 ? 'positive' : score >= 60 ? 'neutral' : 'negative',
    })

    this.emit()
  }

  // ── KPI helpers ──────────────────────────────────────────────

  private applyKPIDelta(
    delta: Record<string, number>,
    quality: 'good' | 'medium' | 'bad' | 'silent' | string
  ) {
    if (!this.state) return
    const k = { ...this.state.kpis }

    for (const [key, change] of Object.entries(delta)) {
      const k2 = key as keyof typeof k
      if (k2 in k) {
        k[k2] = Math.max(0, Math.min(100, k[k2] + change))
      }
    }

    // Recalculate PI
    k.performance_index = Math.round(
      k.reliability     * 0.25 +
      k.quality         * 0.30 +
      k.responsiveness  * 0.20 +
      (k as any).communication * 0.15 +
      k.scope_control   * 0.10
    )

    this.state = { ...this.state, kpis: k }

    if (quality !== 'silent') {
      this.addMessage({
        type: 'kpi_update',
        text: `KPI updated — Performance Index: ${k.performance_index}`,
        severity: quality === 'good' ? 'positive' : quality === 'bad' ? 'negative' : 'neutral',
      })
    }
  }

  // ── Persistence ──────────────────────────────────────────────

  private async persistTaskCompletion(task: SimTask, option: DecisionOption) {
    if (!this.state) return
    try {
      await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.state.sessionId,
          task_type: task.type,
          user_response: option.text,
          decision_choice: option.id,
          decision_quality: option.quality,
        }),
      })
    } catch (_) {
      // Non-critical — state is already updated in-memory
    }
  }

  // ── Observer pattern ─────────────────────────────────────────

  subscribe(listener: EngineListener) {
    this.listeners.push(listener)
    return () => { this.listeners = this.listeners.filter(l => l !== listener) }
  }

  private emit() {
    if (this.state) this.listeners.forEach(l => l(this.state!))
  }

  private addMessage(msg: Omit<EngineMessage, 'id' | 'timestamp'>) {
    if (!this.state) return
    const full: EngineMessage = {
      ...msg,
      id: Math.random().toString(36).slice(2),
      timestamp: new Date(),
    }
    this.state = {
      ...this.state,
      messages: [full, ...this.state.messages].slice(0, 20), // keep last 20
    }
  }

  getState() { return this.state }
}

// Singleton — one engine per browser session
export const simulationEngine = new SimulationEngine()
