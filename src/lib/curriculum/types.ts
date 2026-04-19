export interface CurriculumTask {
  title: string
  type: 'email_reply' | 'decision' | 'scope_decision' | 'document' | 'standup' | 'report'
  urgency: 'urgent' | 'high' | 'normal'
  description: string
  xp: number
  due_offset_mins: number
  project_ref: string
  kpi_tag: string
  artefact_type?: 'table' | 'document'
  artefact_title?: string
  artefact_content?: string
}

export type Curriculum = {
  [sim_day: number]: {
    [level: number]: CurriculumTask[]
  }
}
