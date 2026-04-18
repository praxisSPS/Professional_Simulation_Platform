// POST — evaluates code/diagram submissions for technical tasks
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { task_id, code, language, task_description, rubric } = await req.json()

  if (!code?.trim()) {
    return NextResponse.json({ score: 0, grade: 'F', summary: 'No code submitted.', issues: ['You must submit code to receive a score.'], strengths: [], feedback: '' })
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const languageLabel = language === 'sql' ? 'SQL query'
    : language === 'python' ? 'Python script'
    : language === 'diagram' ? 'architecture diagram or technical design'
    : 'code submission'

  const prompt = `
You are an expert technical assessor for a professional workplace simulation platform.
A junior professional has submitted a ${languageLabel} for the following task:

Task description: "${task_description}"

Scoring rubric:
${(rubric ?? ['Code addresses the task requirements', 'Code is clear and correct', 'Approach is professional']).map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}

The submission:
\`\`\`${language}
${code}
\`\`\`

Score this submission strictly and professionally. For ${language === 'diagram' ? 'a diagram/design' : 'code'}, assess: correctness, completeness, clarity, and professional quality.

Respond ONLY with valid JSON (no markdown):
{
  "score": <integer 0-100>,
  "grade": "<A|B|C|D|F>",
  "summary": "<one sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "issues": ["<issue 1>", "<issue 2>"],
  "feedback": "<what a senior engineer or analyst would say in a code review — direct, 1-2 sentences>"
}

Scoring guide: 90-100 (A): Excellent, 75-89 (B): Good with minor issues, 60-74 (C): Acceptable but incomplete, 40-59 (D): Below standard, 0-39 (F): Does not meet requirements
`

  let parsed: any = null

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim().replace(/```json\n?|\n?```/g, '')
    parsed = JSON.parse(text)
    parsed.score = Math.max(0, Math.min(100, parseInt(parsed.score) || 0))
  } catch {
    const lineCount = code.trim().split('\n').length
    const fallbackScore = Math.min(65, Math.max(30, lineCount * 4))
    parsed = {
      score: fallbackScore,
      grade: fallbackScore >= 60 ? 'C' : 'D',
      summary: 'Submission received and evaluated.',
      strengths: ['Submission completed'],
      issues: ['Could not fully evaluate — ensure your submission is complete'],
      feedback: 'Your submission was received. Ensure it fully addresses all rubric points.',
    }
  }

  // Update the task record if task_id is provided
  if (task_id) {
    const quality = parsed.score >= 75 ? 'good' : parsed.score >= 55 ? 'medium' : 'bad'
    const xpEarned = Math.round(40 * (parsed.score / 100))

    await adminSupabase
      .from('tasks')
      .update({
        completed_at: new Date().toISOString(),
        status: 'completed',
        score: parsed.score,
        ai_feedback: parsed.feedback,
        decision_quality: quality,
        xp_earned: xpEarned,
      })
      .eq('id', task_id)
      .eq('user_id', user.id)

    // Update profile XP
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('experience_points')
      .eq('id', user.id)
      .single()

    if (profile) {
      await adminSupabase
        .from('profiles')
        .update({ experience_points: (profile.experience_points ?? 0) + xpEarned })
        .eq('id', user.id)
    }

    return NextResponse.json({ ...parsed, xp_earned: xpEarned })
  }

  return NextResponse.json(parsed)
}
