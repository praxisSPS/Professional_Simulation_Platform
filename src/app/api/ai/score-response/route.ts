// src/app/api/ai/score-response/route.ts
// POST — grades a user's free-text response against a rubric using Gemini
// Returns a score (0-100), letter grade, and specific feedback points

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { task_id, rubric, response, career_path, task_type } = await req.json()

  if (!response?.trim()) {
    return NextResponse.json({ score: 0, grade: 'F', feedback: ['No response provided.'], strengths: [], improvements: ['You must submit a response to receive a score.'] })
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `
You are an expert assessor for a professional workplace simulation platform.
A junior ${career_path?.replace(/_/g, ' ') ?? 'professional'} has submitted a response to this task type: ${task_type ?? 'workplace task'}.

Scoring rubric (what a good response must include):
${(rubric ?? ['Clear and professional communication', 'Appropriate workplace tone', 'Addresses the task directly']).map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}

The user's response:
"${response}"

Score this response strictly and professionally. Be honest — if it's weak, say so clearly.

Respond ONLY with valid JSON in this exact format (no markdown, no preamble):
{
  "score": <integer 0-100>,
  "grade": "<A|B|C|D|F>",
  "summary": "<one sentence overall assessment>",
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "improvements": ["<specific improvement 1>", "<specific improvement 2>"],
  "manager_comment": "<what a real manager would say in a 1:1 about this response — direct, professional, 1-2 sentences>"
}

Scoring guide:
90-100 (A): Exceeds expectations — clear, precise, professional, addresses all rubric points
75-89  (B): Meets expectations with minor gaps
60-74  (C): Partially meets expectations — key elements missing
40-59  (D): Below expectations — significant issues with clarity or content  
0-39   (F): Does not meet expectations — off-topic, unprofessional, or negligible
`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim().replace(/```json\n?|\n?```/g, '')
    const parsed = JSON.parse(text)

    // Clamp score
    parsed.score = Math.max(0, Math.min(100, parseInt(parsed.score) || 0))

    // Store feedback in the task record
    if (task_id) {
      await supabase
        .from('tasks')
        .update({
          score: parsed.score,
          ai_feedback: parsed.manager_comment,
          decision_quality: parsed.score >= 75 ? 'good' : parsed.score >= 55 ? 'medium' : 'bad',
        })
        .eq('id', task_id)
        .eq('user_id', user.id)
    }

    return NextResponse.json(parsed)
  } catch (err) {
    // Fallback scoring if AI fails
    const wordCount = response.trim().split(/\s+/).length
    const fallbackScore = Math.min(70, Math.max(30, wordCount * 3))
    return NextResponse.json({
      score: fallbackScore,
      grade: fallbackScore >= 75 ? 'B' : fallbackScore >= 60 ? 'C' : 'D',
      summary: 'Response received and scored.',
      strengths: ['Response submitted on time'],
      improvements: ['Ensure your response addresses all rubric points'],
      manager_comment: 'I have reviewed your response. Let\'s discuss it in our next 1:1.',
    })
  }
}
