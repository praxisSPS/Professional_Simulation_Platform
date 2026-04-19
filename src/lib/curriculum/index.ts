import type { CurriculumTask } from './types'

const CURRICULUM_MAP: Record<string, () => Promise<{ CURRICULUM: any }>> = {
  data_engineering:        () => import('./data-engineering'),
  reliability_engineering: () => import('./reliability-engineering'),
  financial_analysis:      () => import('./financial-analysis'),
  product_management:      () => import('./product-management'),
  project_management:      () => import('./project-management'),
  digital_marketing:       () => import('./digital-marketing'),
}

/**
 * Returns tasks for a given career path, sim day, and level.
 * Falls back to level 1 if the specific level has no tasks.
 * Falls back to day 1 if the specific day has no tasks.
 */
export async function getTasks(
  careerPath: string,
  simDay: number,
  level: number
): Promise<CurriculumTask[]> {
  const loader = CURRICULUM_MAP[careerPath]
  if (!loader) return []

  try {
    const mod = await loader()
    const curriculum = mod.CURRICULUM

    const day = Math.min(Math.max(simDay, 1), 5)
    const lvl = Math.min(Math.max(level, 1), 7)

    const dayData = curriculum[day] ?? curriculum[5] ?? curriculum[1] ?? {}
    const tasks: CurriculumTask[] = dayData[lvl] ?? dayData[1] ?? []

    return tasks
  } catch {
    return []
  }
}

export type { CurriculumTask }
