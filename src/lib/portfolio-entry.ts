export const KPI_TAG_TO_COMPETENCY: Record<string, string[]> = {
  quality:       ['Analytical Thinking', 'Decision Making', 'Problem Solving'],
  communication: ['Written Communication', 'Stakeholder Management', 'Professional Presence'],
  reliability:   ['Task Management', 'Attention to Detail', 'Dependability'],
  scope_control: ['Negotiation', 'Boundary Setting', 'Scope Management'],
}

interface TaskData {
  id: string
  title: string
  kpi_tag?: string | null
  assigned_at?: string | null
  completed_at?: string | null
  score?: number | null
  ai_feedback?: string | null
}

interface ProfileData {
  career_path: string
  current_level: number
  organisation_id?: string | null
}

export async function createPortfolioEvidence(
  adminSupabase: any,
  userId: string,
  task: TaskData,
  profile: ProfileData,
  orgName = 'Nexus Digital'
) {
  const competencyTags = KPI_TAG_TO_COMPETENCY[task.kpi_tag ?? 'quality'] ?? ['Professional Skills']

  const { error } = await adminSupabase.from('portfolio_entries').insert({
    user_id: userId,
    career_path: profile.career_path,
    level_achieved: profile.current_level ?? 1,
    organisation_name: orgName,
    start_date: task.assigned_at ?? new Date().toISOString(),
    end_date: task.completed_at ?? new Date().toISOString(),
    final_pi_score: task.score ?? 0,
    key_achievements: [`Scored ${task.score}% on: ${task.title}`],
    certificate_id: null,
    is_public: false,
    entry_type: 'competency_evidence',
    evidence: task.ai_feedback ?? '',
    competency_tags: competencyTags,
    score: task.score ?? 0,
  })

  if (error) console.error('Portfolio entry creation failed:', error.message)
}
