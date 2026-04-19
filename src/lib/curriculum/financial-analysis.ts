import type { Curriculum } from './types'

export const CURRICULUM: Curriculum = {
  1: {
    1: [
      { title: 'Variance analysis — Q4 actuals vs budget', type: 'report', urgency: 'high', description: 'Q4 actuals are in. Revenue is up 15% YoY but net profit has fallen. Write a variance analysis identifying the key drivers of the profit decline.', xp: 40, due_offset_mins: 90, project_ref: 'q4-close', kpi_tag: 'quality' },
      { title: 'Three-scenario model for board presentation', type: 'document', urgency: 'urgent', description: 'Amara needs three financial scenarios (base, upside, downside) for a new product launch. Board meeting is tomorrow 9am. You have 4 hours. Prioritise the most sensitive assumptions.', xp: 45, due_offset_mins: 240, project_ref: 'product-launch-fa', kpi_tag: 'quality' },
      { title: 'Daily standup', type: 'standup', urgency: 'normal', description: 'Write your standup: yesterday, today, blockers.', xp: 15, due_offset_mins: 90, project_ref: 'q4-close', kpi_tag: 'communication' },
      { title: 'EBITDA bridge — explain the gap', type: 'report', urgency: 'normal', description: 'The business unit leader wants to understand why EBITDA is GBP 2.3M below plan. Build a waterfall bridge analysis identifying the key contributors.', xp: 35, due_offset_mins: 180, project_ref: 'q4-close', kpi_tag: 'quality' },
    ],
    2: [
      { title: 'Profit decline commentary — deeper driver analysis', type: 'report', urgency: 'high', description: 'Following yesterday\'s variance analysis, Amara wants deeper commentary on the two biggest profit drivers. Separate volume effects from price/mix effects and identify which are structural vs one-off.', xp: 45, due_offset_mins: 90, project_ref: 'q4-close', kpi_tag: 'quality' },
      { title: 'Review colleague\'s revenue growth assumption', type: 'decision', urgency: 'normal', description: 'A colleague has assumed 8% revenue growth in the base case. Your analysis suggests 5-6% is more realistic given Q4 trends. Do you challenge this? Write your response — you will copy Amara.', xp: 35, due_offset_mins: 120, project_ref: 'product-launch-fa', kpi_tag: 'scope_control' },
      { title: 'Cost reduction opportunity analysis', type: 'document', urgency: 'normal', description: 'Chris Okafor has asked Finance to identify GBP 500k of cost savings for Q1. Analyse the cost base and write a structured list of opportunities with estimated savings, risk rating, and implementation timeline.', xp: 40, due_offset_mins: 180, project_ref: 'q4-close', kpi_tag: 'quality' },
    ],
    3: [
      { title: 'Board presentation: Q4 financial story', type: 'document', urgency: 'urgent', description: 'Write the Q4 financial narrative for the board presentation. Frame the results as a coherent story: the headline numbers, the key decisions that drove the outcome, and the implications for Q1. Maximum 3 slides of content.', xp: 55, due_offset_mins: 90, project_ref: 'q4-close', kpi_tag: 'communication' },
      { title: 'Sensitivity analysis: product launch scenarios', type: 'report', urgency: 'high', description: 'For the product launch model, run a sensitivity analysis on the three key assumptions (market size, penetration rate, pricing). Show how the NPV changes across a reasonable range. Identify the assumption with the highest sensitivity.', xp: 50, due_offset_mins: 120, project_ref: 'product-launch-fa', kpi_tag: 'quality' },
    ],
  },
  2: {
    1: [
      { title: 'Respond to board Q4 question — revenue quality', type: 'email_reply', urgency: 'urgent', description: 'A board member has emailed Amara asking about the quality of the Q4 revenue — specifically whether any of the revenue uplift is from one-off items that won\'t repeat. Amara has forwarded it to you. Draft her response.', xp: 40, due_offset_mins: 30, project_ref: 'q4-close', kpi_tag: 'communication' },
      { title: 'Month-end close checklist — validate all accruals', type: 'document', urgency: 'high', description: 'Daniel Yeboah needs you to validate the top 5 accruals before month-end close. For each: review the supporting calculation, confirm the accounting treatment, and sign off or flag any issues.', xp: 35, due_offset_mins: 90, project_ref: 'q4-close', kpi_tag: 'reliability' },
      { title: 'Cash flow forecast — Q1 update', type: 'report', urgency: 'normal', description: 'Following the Q4 close, update the Q1 cash flow forecast. Include the impact of the product launch investment, the revised revenue growth assumption, and the proposed cost savings. Show best and worst case.', xp: 40, due_offset_mins: 180, project_ref: 'product-launch-fa', kpi_tag: 'quality' },
    ],
    2: [
      { title: 'Audit query: bad debt provision methodology', type: 'document', urgency: 'high', description: 'Fatima Al-Hassan (EY) has queried the bad debt provision. Write a clear, defensible explanation of the methodology, key assumptions, and why the provision level is appropriate. This is a formal audit response.', xp: 45, due_offset_mins: 90, project_ref: 'q4-close', kpi_tag: 'quality' },
      { title: 'Product launch: refine the downside scenario', type: 'report', urgency: 'urgent', description: 'Amara wants the downside scenario strengthened before the board sees it. Revise the FX assumption from 8% to 12% depreciation. Show the updated P&L impact and the break-even analysis.', xp: 50, due_offset_mins: 60, project_ref: 'product-launch-fa', kpi_tag: 'quality' },
    ],
    3: [
      { title: 'Financial due diligence — acquisition target preliminary review', type: 'report', urgency: 'high', description: 'Nexus is considering a small acquisition. Amara wants a preliminary financial due diligence on the target company based on 3 years of management accounts. Identify: revenue quality, margin trends, working capital, and red flags.', xp: 65, due_offset_mins: 150, project_ref: 'q4-close', kpi_tag: 'quality' },
    ],
  },
  3: {
    1: [
      { title: 'Q1 budget reforecast — incorporate Q4 learnings', type: 'report', urgency: 'high', description: 'Based on the Q4 actuals and the analysis you have done this week, produce an updated Q1 budget reforecast. Identify the three biggest changes from the original budget and justify each adjustment.', xp: 45, due_offset_mins: 90, project_ref: 'q4-close', kpi_tag: 'quality' },
      { title: 'Standup — finance team weekly priorities', type: 'standup', urgency: 'normal', description: 'Write your standup for the finance team weekly meeting. Cover: Q4 close status, product launch model progress, and the audit response outstanding items.', xp: 15, due_offset_mins: 30, project_ref: 'q4-close', kpi_tag: 'communication' },
      {
        title: 'Review Daniel\'s variance analysis',
        type: 'report', urgency: 'high',
        description: 'Daniel Yeboah has submitted his Q4 variance analysis. Amara wants your review before it goes to the board. Check the numbers carefully — there may be errors. Write your review identifying any issues and corrections needed.',
        xp: 35, due_offset_mins: 90, project_ref: 'q4-close', kpi_tag: 'quality',
        artefact_type: 'document',
        artefact_title: 'Q4 Variance Analysis — Daniel Yeboah',
        artefact_content: `Q4 VARIANCE ANALYSIS — DANIEL YEBOAH
Prepared for: Board Pack Submission

REVENUE VARIANCE
  Budget:   £4,200,000
  Actual:   £4,800,000
  Variance: +£600,000 (+14.3%)
  Driver:   Hartwell contract signed in November ahead of schedule

COST OF GOODS SOLD
  Budget:   £1,900,000
  Actual:   £2,400,000
  Variance: -£500,000 (-26.3%)
  Driver:   Supplier price increase Q4; higher direct materials usage

OVERHEAD ALLOCATION
  Basis: 142 FTE at £8,200 per head
  Total: £1,164,400

GROSS MARGIN
  Budget:   54.8%
  Actual:   50.0%
  Driver:   Supplier cost pressure eroding margin despite revenue growth

---
⚠ ERROR IN THIS ANALYSIS:
The overhead allocation uses 142 FTE. Current headcount is 158 FTE.
This understates overhead costs by: (158 - 142) × £8,200 = £131,600.
Gross margin in the analysis is overstated as a result.
The correct actual gross margin is lower than 50.0% — recalculation required before board submission.`,
      },
      {
        title: 'Sense-check the scenario model',
        type: 'report', urgency: 'urgent',
        description: 'The product launch scenario model is going to the board tomorrow. Amara wants a final sanity check on the assumptions. Review the three scenarios carefully — something doesn\'t look right in the numbers.',
        xp: 40, due_offset_mins: 60, project_ref: 'product-launch-fa', kpi_tag: 'quality',
        artefact_type: 'table',
        artefact_title: 'Product Launch Scenarios v1.0',
        artefact_content: `| Metric | Base Case | Upside Case | Downside Case |
| --- | --- | --- | --- |
| Revenue Growth | 6% | 9% | 7% |
| Cost Inflation | 3% | 2% | 4% |
| EBITDA Margin | 18% | 23% | 16% |
| NPV (£M) | 4.2 | 6.8 | 3.1 |
| Break-even Month | Month 14 | Month 10 | Month 18 |

⚠ CRITICAL ERROR IN THIS MODEL:
The Downside revenue growth (7%) is HIGHER than the Base Case revenue growth (6%).
This is logically impossible — a downside scenario must represent a worse outcome than base.
If the Base Case is 6% growth, the Downside must be BELOW 6% (e.g. 3–4%).
Presenting this to the board as-is would be embarrassing and undermine credibility.
The downside scenario must be reworked before tomorrow's board meeting.`,
      },
    ],
    2: [
      { title: 'Build the working capital model for Q1', type: 'document', urgency: 'high', description: 'Amara wants a working capital model for Q1 that shows the cash conversion cycle, the key levers (debtor days, creditor days, stock days), and the projected working capital requirement. Include sensitivity to revenue growth.', xp: 50, due_offset_mins: 120, project_ref: 'q4-close', kpi_tag: 'quality' },
      { title: 'Marketing budget approval decision', type: 'decision', urgency: 'urgent', description: 'Marketing have requested GBP 180k budget uplift for Q1 paid media, projecting 3x return. Amara wants your recommendation before she signs. Analyse the request and recommend: approve, decline, or approve with conditions.', xp: 45, due_offset_mins: 60, project_ref: 'product-launch-fa', kpi_tag: 'scope_control' },
    ],
    3: [
      { title: 'Investor presentation: financial performance narrative', type: 'document', urgency: 'urgent', description: 'Nexus is preparing for an investor meeting. Write the financial performance narrative for the presentation: Q4 results framed positively, the Q1 growth story, and the medium-term financial targets. Must be compelling and accurate.', xp: 70, due_offset_mins: 120, project_ref: 'q4-close', kpi_tag: 'communication' },
    ],
  },
  4: {
    1: [
      { title: 'Treasury policy review — FX hedging decision', type: 'decision', urgency: 'high', description: 'Nexus has USD-denominated revenue that is currently unhedged. Given the downside scenario of 12% GBP/USD depreciation, Amara wants a recommendation on whether to implement FX hedging and at what level.', xp: 40, due_offset_mins: 90, project_ref: 'product-launch-fa', kpi_tag: 'quality' },
    ],
    2: [
      { title: 'Business unit financial review — full P&L commentary', type: 'report', urgency: 'high', description: 'Write a full P&L commentary for the business unit\'s Q4 performance. Cover all major line items, explain material variances, and conclude with a clear view on whether the business is on track for its annual targets.', xp: 55, due_offset_mins: 120, project_ref: 'q4-close', kpi_tag: 'quality' },
    ],
    3: [
      { title: 'Long-range plan: 3-year financial model', type: 'document', urgency: 'high', description: 'Amara wants a 3-year long-range financial model for the strategy review. Build the model with clear assumptions for revenue growth, margin expansion, capex, and free cash flow. Include three scenarios and key risks.', xp: 75, due_offset_mins: 180, project_ref: 'product-launch-fa', kpi_tag: 'quality' },
    ],
  },
  5: {
    1: [
      { title: 'Month-end close sign-off — confirm all journals posted', type: 'report', urgency: 'high', description: 'It\'s the last day of the month. Confirm all journals have been posted, accruals are complete, and the TB balances. Write a sign-off note for Amara confirming the close is complete and any issues resolved.', xp: 30, due_offset_mins: 60, project_ref: 'q4-close', kpi_tag: 'reliability' },
    ],
    2: [
      { title: 'End-of-week finance review — key findings and next week actions', type: 'report', urgency: 'normal', description: 'Write an end-of-week finance review for the team: top 3 findings this week, outstanding items, and priorities for next week. Keep it under one page.', xp: 35, due_offset_mins: 90, project_ref: 'q4-close', kpi_tag: 'communication' },
    ],
    3: [
      { title: 'Finance team strategy day — prepare analysis for the away day', type: 'document', urgency: 'urgent', description: 'The finance team strategy day is next Friday. Prepare an analysis pack: current team capabilities vs what will be needed in 2 years, the technology investment gap, and a proposal for the team\'s strategic priorities. Amara will present this.', xp: 70, due_offset_mins: 120, project_ref: 'q4-close', kpi_tag: 'quality' },
    ],
  },
}
