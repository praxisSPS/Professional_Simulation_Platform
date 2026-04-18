import type { Curriculum } from './types'

export const CURRICULUM: Curriculum = {
  1: {
    1: [
      { title: 'Prioritise sprint backlog — 3 urgent items, 1 slot', type: 'decision', urgency: 'urgent', description: 'Three stakeholders have each marked their feature as the top priority for this sprint. You have capacity for one. Decide which to build and communicate the decision clearly to all three.', xp: 40, due_offset_mins: 45, project_ref: 'nexus-platform-q1', kpi_tag: 'quality' },
      { title: 'Write user story for the new reporting feature', type: 'document', urgency: 'normal', description: 'The reporting feature has been approved. Write a complete user story with acceptance criteria before the dev team\'s planning session at 2pm. Must be dev-ready — no ambiguity.', xp: 30, due_offset_mins: 120, project_ref: 'nexus-platform-q1', kpi_tag: 'quality' },
      { title: 'Daily standup', type: 'standup', urgency: 'normal', description: 'Write your standup covering yesterday, today, and blockers.', xp: 15, due_offset_mins: 90, project_ref: 'nexus-platform-q1', kpi_tag: 'communication' },
      { title: 'Respond to Priya Shah escalation', type: 'email_reply', urgency: 'urgent', description: 'Priya Shah has emailed asking why the feature promised last week is not live. Your manager James is copied in. Respond professionally — acknowledge, explain, propose next steps.', xp: 35, due_offset_mins: 30, project_ref: 'vantage-integration', kpi_tag: 'communication' },
    ],
    2: [
      { title: 'Sprint backlog decision — communicate to losing stakeholders', type: 'email_reply', urgency: 'high', description: 'Following yesterday\'s sprint prioritisation decision, draft emails to the two stakeholders whose features were not selected. Be transparent about the reason, give a realistic next-sprint commitment, and manage expectations professionally.', xp: 35, due_offset_mins: 60, project_ref: 'nexus-platform-q1', kpi_tag: 'communication' },
      { title: 'User story gaps: Sarah Chen has flagged issues', type: 'document', urgency: 'urgent', description: 'Sarah Chen (Lead Dev) has returned the reporting feature user story as incomplete. Rewrite it to dev-ready standard: full acceptance criteria including edge cases, clear data source definition, and success metrics.', xp: 40, due_offset_mins: 45, project_ref: 'nexus-platform-q1', kpi_tag: 'quality' },
      { title: 'Product roadmap update — Q1 priorities', type: 'document', urgency: 'normal', description: 'James wants an updated Q1 product roadmap reflecting the sprint backlog decision. Show: what\'s confirmed for each sprint, what\'s on hold, and what the dependencies are. Distribute to all stakeholders.', xp: 35, due_offset_mins: 150, project_ref: 'nexus-platform-q1', kpi_tag: 'scope_control' },
    ],
    3: [
      { title: 'OKR proposal for Q1 product team', type: 'document', urgency: 'high', description: 'James wants the product team\'s Q1 OKRs defined. Write 3 Objectives with 2-3 Key Results each. KRs must be measurable and time-bound. Align with the company\'s revenue and customer satisfaction goals.', xp: 50, due_offset_mins: 120, project_ref: 'nexus-platform-q1', kpi_tag: 'quality' },
      { title: 'Competitive landscape analysis', type: 'report', urgency: 'normal', description: 'James wants a competitive analysis before next month\'s strategy review. Analyse 3 competitors on: feature set, pricing model, positioning, and areas of differentiation. Identify where Nexus has a gap.', xp: 45, due_offset_mins: 180, project_ref: 'nexus-platform-q1', kpi_tag: 'quality' },
    ],
  },
  2: {
    1: [
      { title: 'Priya follow-up: feature delay impact assessment', type: 'email_reply', urgency: 'urgent', description: 'Priya Shah has replied to your Day 1 response asking for a concrete delivery date. Before you respond, check with Sarah Chen on the revised dev estimate, then draft a response with a specific date and what happens if it slips.', xp: 40, due_offset_mins: 30, project_ref: 'vantage-integration', kpi_tag: 'communication' },
      { title: 'Marcus over-promise: assess the new feature feasibility', type: 'scope_decision', urgency: 'urgent', description: 'Marcus has committed the client to a bulk export feature by Friday without consulting the product team. Assess the actual dev effort and decide: is Friday possible? If not, what do you tell the client? Write a plan.', xp: 45, due_offset_mins: 45, project_ref: 'vantage-integration', kpi_tag: 'scope_control' },
      { title: 'Sprint review prep — write the demo script', type: 'document', urgency: 'normal', description: 'Sprint review is tomorrow. Write a 10-minute demo script for the feature that was shipped this sprint. Cover: user problem being solved, the feature walkthrough, and how we will measure success.', xp: 25, due_offset_mins: 150, project_ref: 'nexus-platform-q1', kpi_tag: 'communication' },
    ],
    2: [
      { title: 'Bulk export feature: negotiate with Sarah and respond to client', type: 'scope_decision', urgency: 'urgent', description: 'You have assessed the bulk export feature. Friday is not feasible. Write: (1) an honest email to the client proposing a realistic date, (2) a message to Marcus explaining the process for feature commitments going forward. Both must be professional.', xp: 50, due_offset_mins: 45, project_ref: 'vantage-integration', kpi_tag: 'scope_control' },
      { title: 'Yemi needs a UX brief for the onboarding flow', type: 'document', urgency: 'normal', description: 'Yemi Adeyinka (UX Designer) is ready to start on the new user onboarding flow but needs a product brief. Write a clear UX brief covering: target user, key jobs-to-be-done, success definition, and non-negotiables.', xp: 30, due_offset_mins: 120, project_ref: 'nexus-platform-q1', kpi_tag: 'quality' },
    ],
    3: [
      { title: 'Write the product strategy memo for James', type: 'document', urgency: 'high', description: 'James wants a product strategy memo outlining your view on the platform\'s strategic direction for the next 12 months. Cover: the core bet, key features to build, features to kill or defer, and how we differentiate from competitors.', xp: 60, due_offset_mins: 150, project_ref: 'nexus-platform-q1', kpi_tag: 'quality' },
    ],
  },
  3: {
    1: [
      { title: 'Sprint retrospective — what went wrong this sprint?', type: 'standup', urgency: 'normal', description: 'Run a sprint retrospective and document: (1) what went well, (2) what didn\'t — specifically the scope commitment issue with Marcus, (3) the top 3 actions to improve next sprint. Be honest.', xp: 20, due_offset_mins: 60, project_ref: 'nexus-platform-q1', kpi_tag: 'quality' },
      { title: 'James wants a prioritisation framework — write it', type: 'document', urgency: 'high', description: 'Following the sprint backlog conflicts, James wants a formal prioritisation framework for the product team. Define the scoring model (value vs effort vs strategic fit), how it will be applied, and how decisions will be communicated to stakeholders.', xp: 40, due_offset_mins: 90, project_ref: 'nexus-platform-q1', kpi_tag: 'scope_control' },
      { title: 'Customer discovery: interview debrief', type: 'report', urgency: 'normal', description: 'You ran 3 customer interviews this week. Write a debrief covering: key themes, unmet needs, feature requests (and your assessment of their priority), and how the findings affect the roadmap.', xp: 35, due_offset_mins: 150, project_ref: 'nexus-platform-q1', kpi_tag: 'quality' },
    ],
    2: [
      { title: 'Write the Vantage Corp feature release note', type: 'document', urgency: 'normal', description: 'The bulk export feature is now ready for release. Write the release notes for Priya Shah: what the feature does (user-facing language, not technical), how to use it, and any known limitations.', xp: 30, due_offset_mins: 90, project_ref: 'vantage-integration', kpi_tag: 'communication' },
      { title: 'Build vs buy decision: analytics module', type: 'decision', urgency: 'high', description: 'James wants your recommendation on whether to build the analytics module in-house or license a third-party solution. Consider: build cost and timeline, licensing cost, integration complexity, and long-term strategic value. Write your recommendation.', xp: 50, due_offset_mins: 60, project_ref: 'nexus-platform-q1', kpi_tag: 'quality' },
    ],
    3: [
      { title: 'Go-to-market plan for the new analytics feature', type: 'document', urgency: 'high', description: 'Write a go-to-market plan for the analytics module launching next quarter. Cover: target segments, messaging, pricing, launch sequence, and success metrics. Coordinate with Marcus (Sales) and James (Head of Growth).', xp: 65, due_offset_mins: 150, project_ref: 'nexus-platform-q1', kpi_tag: 'quality' },
    ],
  },
  4: {
    1: [
      { title: 'Priya quarterly review — product roadmap presentation', type: 'document', urgency: 'high', description: 'Prepare a one-page product roadmap summary for Priya\'s quarterly review. Show: what\'s shipped this quarter, what\'s confirmed for next quarter, and the 6-month horizon. Be honest about what\'s slipped and why.', xp: 35, due_offset_mins: 90, project_ref: 'vantage-integration', kpi_tag: 'communication' },
    ],
    2: [
      { title: 'Product metrics dashboard: define the north star', type: 'document', urgency: 'high', description: 'James wants a product metrics framework. Define the north star metric, 3-5 input metrics, and the guardrail metrics. Explain how each metric will be measured and what good looks like for each.', xp: 50, due_offset_mins: 120, project_ref: 'nexus-platform-q1', kpi_tag: 'quality' },
    ],
    3: [
      { title: 'Annual product review: strategy vs outcomes', type: 'report', urgency: 'high', description: 'Write an annual product review comparing the original Q1-Q4 strategy with actual outcomes. Be honest: what did we get right, what did we get wrong, and what are the 3 biggest learnings for the team next year?', xp: 70, due_offset_mins: 150, project_ref: 'nexus-platform-q1', kpi_tag: 'quality' },
    ],
  },
  5: {
    1: [
      { title: 'End of week: priorities for next sprint', type: 'standup', urgency: 'normal', description: 'Write an end-of-week summary for James: sprint performance this week, the confirmed priorities for next sprint, and any stakeholder issues outstanding.', xp: 20, due_offset_mins: 60, project_ref: 'nexus-platform-q1', kpi_tag: 'communication' },
    ],
    2: [
      { title: 'Platform reliability SLA decision — what do we commit to clients?', type: 'scope_decision', urgency: 'high', description: 'Following a client complaint about downtime, James wants the team to define an SLA to commit to enterprise customers. Propose an SLA level, the implications for the engineering team, and how we will handle SLA breaches.', xp: 45, due_offset_mins: 90, project_ref: 'nexus-platform-q1', kpi_tag: 'scope_control' },
    ],
    3: [
      { title: 'Board presentation: product strategy and investment ask', type: 'document', urgency: 'urgent', description: 'James needs a board-ready product strategy presentation: where we are now, where we are going in 12 months, and the investment needed (headcount, technology). Build the business case with supporting data.', xp: 75, due_offset_mins: 120, project_ref: 'nexus-platform-q1', kpi_tag: 'quality' },
    ],
  },
}
