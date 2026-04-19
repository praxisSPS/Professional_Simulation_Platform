// POST — evaluates code/diagram/image submissions for technical tasks
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createPortfolioEvidence } from '@/lib/portfolio-entry'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { task_id, code, language, task_description, rubric, image_base64, image_mime_type } = await req.json()

  const hasImage = !!image_base64
  const hasCode = !!code?.trim()

  if (!hasImage && !hasCode) {
    return NextResponse.json({ score: 0, grade: 'F', summary: 'Nothing submitted.', issues: ['You must submit code or an image to receive a score.'], strengths: [], feedback: '' })
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const languageLabel = language === 'sql' ? 'SQL query'
    : language === 'python' ? 'Python script'
    : language === 'diagram' ? 'architecture diagram'
    : 'code submission'

  const rubricLines = (rubric ?? ['Covers all required components', 'Design is clear and correct', 'Professional quality'])
    .map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')

  const isDiagram = language === 'diagram'

  const textPrompt = isDiagram
    ? `You are an expert technical assessor for a professional workplace simulation platform.
A junior professional has submitted an architecture diagram for the following task:

Task description: "${task_description}"

Scoring rubric:
${rubricLines}

Assess the diagram image provided. Evaluate it on these four dimensions:
1. Task coverage — does the diagram address all the requirements stated in the task description?
2. Logical soundness — are the components and their relationships coherent and technically correct?
3. Completeness — are all required components present and correctly labelled? What is missing?
4. Connections — are the arrows, flows, and dependencies between components correct and unambiguous?

Be strict. A diagram that is partially complete should score below 70. A blank or near-blank diagram scores 0–20.

Respond ONLY with valid JSON (no markdown):
{
  "score": <integer 0-100>,
  "grade": "<A|B|C|D|F>",
  "summary": "<one sentence overall assessment of the diagram>",
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "issues": ["<specific gap or error 1>", "<specific gap or error 2>"],
  "feedback": "<what a senior architect would say in a design review — direct, specific, 1-2 sentences>"
}

Scoring guide: 90-100 (A): Complete and correct, 75-89 (B): Good with minor gaps, 60-74 (C): Partially complete, 40-59 (D): Significant gaps, 0-39 (F): Does not meet requirements or near-blank`
    : `You are an expert technical assessor for a professional workplace simulation platform.
A junior professional has submitted a ${languageLabel} for the following task:

Task description: "${task_description}"

Scoring rubric:
${rubricLines}

The submission:
\`\`\`${language}
${code}
\`\`\`

Score this submission strictly and professionally.

Respond ONLY with valid JSON (no markdown):
{
  "score": <integer 0-100>,
  "grade": "<A|B|C|D|F>",
  "summary": "<one sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "issues": ["<issue 1>", "<issue 2>"],
  "feedback": "<what a senior engineer or analyst would say in a code review — direct, 1-2 sentences>"
}

Scoring guide: 90-100 (A): Excellent, 75-89 (B): Good with minor issues, 60-74 (C): Acceptable but incomplete, 40-59 (D): Below standard, 0-39 (F): Does not meet requirements`

  let parsed: any = null

  try {
    let result
    if (hasImage) {
      result = await model.generateContent([
        { inlineData: { mimeType: (image_mime_type ?? 'image/png') as any, data: image_base64 } },
        textPrompt,
      ])
    } else if (hasCode) {
      result = await model.generateContent(textPrompt)
    } else {
      throw new Error('No content to evaluate')
    }
    const text = result.response.text().trim().replace(/```json\n?|\n?```/g, '')
    parsed = JSON.parse(text)
    parsed.score = Math.max(0, Math.min(100, parseInt(parsed.score) || 0))
  } catch {
    const lineCount = hasCode ? code.trim().split('\n').length : 5
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

    const [{ data: task }, { data: profile }] = await Promise.all([
      adminSupabase.from('tasks').select('id, title, kpi_tag, assigned_at').eq('id', task_id).single(),
      adminSupabase.from('profiles').select('experience_points, career_path, current_level, organisation_id').eq('id', user.id).single(),
    ])

    if (profile) {
      await adminSupabase
        .from('profiles')
        .update({ experience_points: (profile.experience_points ?? 0) + xpEarned })
        .eq('id', user.id)
    }

    if (parsed.score >= 75 && task && profile) {
      const { data: org } = await adminSupabase
        .from('organisations')
        .select('name')
        .eq('id', profile.organisation_id)
        .maybeSingle()

      void createPortfolioEvidence(adminSupabase, user.id, {
        ...task,
        completed_at: new Date().toISOString(),
        score: parsed.score,
        ai_feedback: parsed.feedback ?? '',
      }, profile, org?.name ?? 'Nexus Digital')
    }

    return NextResponse.json({ ...parsed, xp_earned: xpEarned })
  }

  return NextResponse.json(parsed)
}
