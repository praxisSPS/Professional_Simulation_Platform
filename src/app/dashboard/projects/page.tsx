import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { COLLEAGUES } from '@/lib/colleagues'
import ProjectsClient from '@/components/ProjectsClient'

export const metadata = { title: 'Projects' }

function buildProjectTeamMap(careerPath: string): Record<string, Array<{ name: string; role: string }>> {
  const map: Record<string, Array<{ name: string; role: string }>> = {}
  const colleagues = COLLEAGUES[careerPath] ?? []
  for (const c of colleagues) {
    const refs = new Set(c.templates.map(t => t.project_ref))
    for (const ref of refs) {
      if (!map[ref]) map[ref] = []
      if (!map[ref].some(m => m.name === c.name)) {
        map[ref].push({ name: c.name, role: c.role })
      }
    }
  }
  return map
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('career_path, sim_day, current_level')
    .eq('id', user.id)
    .single()

  if (!profile?.career_path) redirect('/onboarding')

  const [{ data: projects }, { data: tasks }] = await Promise.all([
    adminSupabase
      .from('projects')
      .select('id, name, description, start_day, end_day, career_path')
      .eq('career_path', profile.career_path)
      .order('start_day'),
    adminSupabase
      .from('tasks')
      .select('id, title, type, score, xp_earned, completed_at, project_ref, assigned_at, urgency')
      .eq('user_id', user.id)
      .order('assigned_at', { ascending: false }),
  ])

  const teamMap = buildProjectTeamMap(profile.career_path)

  const projectsWithStats = (projects ?? []).map(p => {
    const ptasks = (tasks ?? []).filter(t => t.project_ref === p.name)
    const completedCount = ptasks.filter(t => t.completed_at).length
    const status =
      ptasks.length === 0 ? 'not_started'
      : completedCount === ptasks.length ? 'complete'
      : 'in_progress'
    return {
      ...p,
      totalTasks: ptasks.length,
      completedTasks: completedCount,
      status: status as 'not_started' | 'in_progress' | 'complete',
      team: teamMap[p.name] ?? [],
      tasks: ptasks,
    }
  })

  return (
    <ProjectsClient
      projects={projectsWithStats}
      simDay={profile.sim_day ?? 1}
    />
  )
}
