import type { Curriculum } from './types'

export const CURRICULUM: Curriculum = {
  1: {
    1: [
      { title: 'Campaign performance review — email vs paid social', type: 'report', urgency: 'high', description: 'Last week\'s email campaign had a 35% open rate but 1.2% CTR. Paid social ROAS dropped 22%. Write a performance summary with the key insights and recommendations.', xp: 35, due_offset_mins: 90, project_ref: 'q1-growth-campaign', kpi_tag: 'quality' },
      { title: 'Budget cut response — 40% reduction mid-campaign', type: 'decision', urgency: 'urgent', description: 'Finance has cut the paid social budget by 40% effective immediately. You have 3 active ad sets running. Decide how to redistribute the remaining budget across the three ad sets.', xp: 40, due_offset_mins: 30, project_ref: 'q1-growth-campaign', kpi_tag: 'scope_control' },
      { title: 'Daily standup', type: 'standup', urgency: 'normal', description: 'Write your standup: yesterday, today, blockers.', xp: 15, due_offset_mins: 90, project_ref: 'q1-growth-campaign', kpi_tag: 'communication' },
      { title: 'A/B test plan — landing page headline', type: 'document', urgency: 'normal', description: 'Set up an A/B test plan for the new landing page headline. Define the hypothesis, sample size, duration, and success metric.', xp: 30, due_offset_mins: 180, project_ref: 'q1-growth-campaign', kpi_tag: 'quality' },
    ],
    2: [
      { title: 'Post-budget-cut analysis: which ad sets to keep', type: 'report', urgency: 'high', description: 'Following yesterday\'s budget reallocation decision, write a performance rationale: why you kept the ad sets you kept, what data supported the decision, and how you will monitor performance over the next 72 hours.', xp: 35, due_offset_mins: 90, project_ref: 'q1-growth-campaign', kpi_tag: 'quality' },
      { title: 'Email CTR improvement plan', type: 'document', urgency: 'high', description: 'The 1.2% email CTR is well below the 3.5% benchmark. Diagnose the issue (subject line, content, CTA, list quality) and write a 3-step improvement plan for the next campaign. Include specific changes with expected impact.', xp: 40, due_offset_mins: 60, project_ref: 'q1-growth-campaign', kpi_tag: 'quality' },
      { title: 'Competitor campaign launched — how do we respond?', type: 'decision', urgency: 'urgent', description: 'A key competitor has just launched a large paid social campaign targeting your exact audience. Your budget is already cut. What is your recommended response? Consider creative, channel, and timing options.', xp: 40, due_offset_mins: 30, project_ref: 'q1-growth-campaign', kpi_tag: 'scope_control' },
    ],
    3: [
      { title: 'Channel attribution framework — build from scratch', type: 'document', urgency: 'high', description: 'James wants a channel attribution framework to replace the current last-click model. Define: the attribution model (first-touch, multi-touch, data-driven), the rationale, implementation plan, and how you will handle the GA4/CRM discrepancy.', xp: 55, due_offset_mins: 120, project_ref: 'q1-growth-campaign', kpi_tag: 'quality' },
      { title: 'Quarterly marketing budget reforecast', type: 'report', urgency: 'high', description: 'Following the 40% budget cut, reforecast the quarterly marketing budget. Show: original vs revised spend by channel, expected impact on pipeline and revenue, and what you are stopping to fund the priorities.', xp: 45, due_offset_mins: 150, project_ref: 'q1-growth-campaign', kpi_tag: 'scope_control' },
    ],
  },
  2: {
    1: [
      { title: 'Rachel Mensah: lead quality complaint — respond', type: 'email_reply', urgency: 'urgent', description: 'Rachel Mensah (Head of Sales) has emailed saying paid media leads have a 4% close rate and the quality is too low. Draft a professional response: acknowledge the issue, outline your investigation approach, and propose a joint ICP review.', xp: 35, due_offset_mins: 30, project_ref: 'q1-growth-campaign', kpi_tag: 'communication' },
      { title: 'Lead scoring model — define and document', type: 'document', urgency: 'high', description: 'Following the lead quality complaint, build a lead scoring model with Rachel\'s input. Define: scoring dimensions (firmographics, behaviour), threshold for MQL, and how the score will be shared with the sales team.', xp: 40, due_offset_mins: 90, project_ref: 'q1-growth-campaign', kpi_tag: 'quality' },
      { title: 'A/B test: email subject line variants', type: 'document', urgency: 'normal', description: 'Based on yesterday\'s CTR improvement plan, write 3 email subject line variants for the next campaign. For each: the hypothesis, the target metric improvement, and the audience segment you\'ll test it on.', xp: 25, due_offset_mins: 150, project_ref: 'q1-growth-campaign', kpi_tag: 'quality' },
    ],
    2: [
      { title: 'Content strategy for the new product launch', type: 'document', urgency: 'high', description: 'Write the content strategy for the new product launch. Cover: target audience and stage-of-funnel content mix, channels, content types and cadence, SEO keywords, and how you\'ll measure content effectiveness.', xp: 45, due_offset_mins: 90, project_ref: 'nexus-product-launch', kpi_tag: 'quality' },
      { title: 'Paid media targeting overhaul — new audience strategy', type: 'decision', urgency: 'urgent', description: 'Following the lead quality complaint, propose a new audience targeting strategy for paid media. Include: changes to ICP definition, audience exclusion lists, lookalike audience approach, and expected impact on volume vs quality.', xp: 50, due_offset_mins: 60, project_ref: 'q1-growth-campaign', kpi_tag: 'scope_control' },
    ],
    3: [
      { title: 'Brand positioning statement — rewrite for the enterprise segment', type: 'document', urgency: 'high', description: 'James wants the brand positioning statement updated to reflect the pivot towards enterprise. Write a new positioning statement: for whom, what we do, how we\'re different, and why it matters. Get buy-in from James and Rachel.', xp: 60, due_offset_mins: 150, project_ref: 'nexus-product-launch', kpi_tag: 'quality' },
    ],
  },
  3: {
    1: [
      { title: 'Campaign performance: 72-hour review post budget reallocation', type: 'report', urgency: 'high', description: 'It\'s been 72 hours since the budget reallocation. Write a performance review: ROAS by ad set, CPC trends, impressions change, and whether the reallocation has improved results. Include a recommendation for next steps.', xp: 35, due_offset_mins: 60, project_ref: 'q1-growth-campaign', kpi_tag: 'quality' },
      { title: 'Marketing ops: fix the UTM tagging inconsistency', type: 'document', urgency: 'high', description: 'Daniel Yeboah has flagged that UTM tags are inconsistent across campaigns, causing attribution errors. Write a UTM naming convention document, apply it to all current campaigns, and document the rollout plan.', xp: 30, due_offset_mins: 90, project_ref: 'q1-growth-campaign', kpi_tag: 'reliability' },
    ],
    2: [
      { title: 'Product launch: write the launch email sequence', type: 'document', urgency: 'high', description: 'Write a 3-email launch sequence for the new product: (1) teaser — build curiosity, (2) launch — announce the feature with the key benefit, (3) follow-up — case study and CTA. Audience: existing customers who haven\'t adopted the new feature.', xp: 40, due_offset_mins: 90, project_ref: 'nexus-product-launch', kpi_tag: 'communication' },
      { title: 'SEO content gap analysis', type: 'report', urgency: 'normal', description: 'Write an SEO content gap analysis for the product launch. Identify: 5 high-value keywords the site is not currently ranking for, search intent for each, and the recommended content format to target them.', xp: 35, due_offset_mins: 150, project_ref: 'nexus-product-launch', kpi_tag: 'quality' },
    ],
    3: [
      { title: 'Marketing attribution report for the board', type: 'report', urgency: 'urgent', description: 'Write the quarterly marketing attribution report for the board. Show: revenue influenced by marketing by channel, cost per acquisition by channel, the multi-touch attribution model, and the ROI on the Q1 marketing investment.', xp: 65, due_offset_mins: 90, project_ref: 'q1-growth-campaign', kpi_tag: 'quality' },
    ],
  },
  4: {
    1: [
      { title: 'Lead generation: design a new inbound campaign', type: 'document', urgency: 'high', description: 'Write a campaign brief for a new inbound lead generation campaign targeting mid-market B2B buyers. Cover: campaign theme, content offer, landing page structure, nurture sequence, and the target MQL volume.', xp: 35, due_offset_mins: 90, project_ref: 'q1-growth-campaign', kpi_tag: 'quality' },
    ],
    2: [
      { title: 'Marketing budget Q2 proposal — build the business case', type: 'document', urgency: 'high', description: 'Write the Q2 marketing budget proposal for James and Rachel. Include: channel budget allocation, projected pipeline contribution per channel, assumptions, and the ROI target. You are asking for 15% more than Q1.', xp: 50, due_offset_mins: 120, project_ref: 'q1-growth-campaign', kpi_tag: 'scope_control' },
    ],
    3: [
      { title: 'Marketing technology stack audit — build vs buy vs extend', type: 'report', urgency: 'high', description: 'Write a marketing tech stack audit. Assess: current tools and their effectiveness, gaps vs industry benchmark, build vs buy decision for the top 2 gaps, and the total cost of ownership of the recommended stack.', xp: 70, due_offset_mins: 150, project_ref: 'nexus-product-launch', kpi_tag: 'quality' },
    ],
  },
  5: {
    1: [
      { title: 'End of week: campaign performance summary for James', type: 'report', urgency: 'normal', description: 'Write an end-of-week campaign performance summary for James: top performing and worst performing content this week, key insights, and the one change you\'re making next week based on the data.', xp: 25, due_offset_mins: 60, project_ref: 'q1-growth-campaign', kpi_tag: 'communication' },
    ],
    2: [
      { title: 'Q1 marketing review: results vs targets', type: 'report', urgency: 'high', description: 'Write the Q1 marketing review. Compare results against each target (MQLs, pipeline contribution, email open rate, ROAS). For each miss: root cause and what you\'re changing in Q2. For each hit: what can be scaled?', xp: 45, due_offset_mins: 90, project_ref: 'q1-growth-campaign', kpi_tag: 'quality' },
    ],
    3: [
      { title: 'Marketing strategy for H2 — present to the leadership team', type: 'document', urgency: 'urgent', description: 'Write the H2 marketing strategy presentation for the leadership team. Cover: Q1 learnings, the strategic bets for H2, channel mix, budget requirement, and the 3 metrics you\'ll be held accountable to.', xp: 75, due_offset_mins: 120, project_ref: 'nexus-product-launch', kpi_tag: 'quality' },
    ],
  },
}
