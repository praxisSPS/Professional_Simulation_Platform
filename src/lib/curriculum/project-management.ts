import type { Curriculum } from './types'

export const CURRICULUM: Curriculum = {
  1: {
    1: [
      { title: 'Project status report — RAG update', type: 'report', urgency: 'high', description: 'Your weekly RAG status report is due to the board by 10am. The project is currently Amber. Update the report with this week\'s progress and risks. Be honest — boards respect honesty, not spin.', xp: 35, due_offset_mins: 60, project_ref: 'nexus-crm-rollout', kpi_tag: 'communication' },
      { title: 'Scope change request — client wants 3 new features', type: 'scope_decision', urgency: 'urgent', description: 'The client has submitted a change request adding 3 new features to a project that is 75% complete. Assess the impact on timeline, cost, and resource, then respond professionally.', xp: 40, due_offset_mins: 30, project_ref: 'nexus-crm-rollout', kpi_tag: 'scope_control' },
      { title: 'Daily standup', type: 'standup', urgency: 'normal', description: 'Write your standup: yesterday, today, blockers.', xp: 15, due_offset_mins: 90, project_ref: 'nexus-crm-rollout', kpi_tag: 'communication' },
      { title: 'Risk register update', type: 'document', urgency: 'normal', description: 'Review the RAID log and update the risk register with two new risks identified in this week\'s team meeting: resource dependency and scope ambiguity.', xp: 25, due_offset_mins: 180, project_ref: 'nexus-crm-rollout', kpi_tag: 'quality' },
    ],
    2: [
      { title: 'Impact assessment: scope change request', type: 'scope_decision', urgency: 'urgent', description: 'Following yesterday\'s change request, produce a formal impact assessment: additional effort (days), timeline extension, cost estimate, and risk analysis. Present to James and the client before making a decision.', xp: 45, due_offset_mins: 60, project_ref: 'nexus-crm-rollout', kpi_tag: 'scope_control' },
      { title: 'Stakeholder communications plan', type: 'document', urgency: 'high', description: 'James wants a stakeholder communications plan for the next phase. Map all stakeholders, their interest level, preferred communication method, and what they need to receive and when.', xp: 30, due_offset_mins: 90, project_ref: 'nexus-crm-rollout', kpi_tag: 'communication' },
      { title: 'Client sponsor wants an emergency call', type: 'email_reply', urgency: 'urgent', description: 'The client\'s project sponsor has heard the project is behind and wants an emergency call today. Respond: propose a time, confirm the agenda, and prepare a 3-point brief for your team.', xp: 35, due_offset_mins: 25, project_ref: 'nexus-crm-rollout', kpi_tag: 'communication' },
    ],
    3: [
      { title: 'Project recovery plan — get back to Green', type: 'document', urgency: 'urgent', description: 'James wants a recovery plan to bring the project back to Green within 2 weeks. Define: the specific actions, owners, timeline, and what needs to stop or be descoped to make this feasible.', xp: 55, due_offset_mins: 90, project_ref: 'nexus-crm-rollout', kpi_tag: 'quality' },
      { title: 'Financial impact assessment of the delay', type: 'report', urgency: 'high', description: 'The project sponsor wants to understand the financial impact of the current Amber status. Quantify: cost of delay (staff time), any contractual penalties, and the potential cost of the scope change. Present honestly.', xp: 45, due_offset_mins: 120, project_ref: 'nexus-crm-rollout', kpi_tag: 'quality' },
    ],
  },
  2: {
    1: [
      { title: 'Follow-up after emergency client call — written summary', type: 'email_reply', urgency: 'high', description: 'Following yesterday\'s emergency call with the client sponsor, write a formal meeting summary: decisions made, actions agreed, owners, and timelines. This becomes the formal record.', xp: 30, due_offset_mins: 45, project_ref: 'nexus-crm-rollout', kpi_tag: 'communication' },
      { title: 'Resource plan update — reflect scope change impact', type: 'document', urgency: 'high', description: 'Update the resource plan to reflect the impact of the scope change decision. Show: current resource allocation, the additional resource needed, and where it comes from (hire, reallocation, contractor).', xp: 35, due_offset_mins: 90, project_ref: 'nexus-crm-rollout', kpi_tag: 'reliability' },
      { title: 'Variation Order: client change request', type: 'document', urgency: 'high', description: 'Sandra Nwosu (Legal) has asked you to draft a Variation Order for the accepted change request. Include: scope description, additional effort, cost, timeline impact, and client sign-off block.', xp: 40, due_offset_mins: 60, project_ref: 'nexus-crm-rollout', kpi_tag: 'scope_control' },
    ],
    2: [
      { title: 'Team performance issue — one workstream lead is blocking progress', type: 'decision', urgency: 'urgent', description: 'Ben Afolabi has flagged that one workstream lead is consistently missing deadlines and the team morale is suffering. You need to address this: decide the right approach (1:1, formal review, escalation) and draft your action plan.', xp: 50, due_offset_mins: 45, project_ref: 'nexus-crm-rollout', kpi_tag: 'quality' },
      { title: 'Weekly progress report — Week 2', type: 'report', urgency: 'high', description: 'Write Week 2 progress report. Compare planned vs actual progress on the work breakdown structure. Identify slippage and the corrective actions being taken. RAG should be improving from Amber.', xp: 35, due_offset_mins: 90, project_ref: 'nexus-crm-rollout', kpi_tag: 'reliability' },
    ],
    3: [
      { title: 'Benefits realisation framework — define the post-project metrics', type: 'document', urgency: 'high', description: 'James wants a benefits realisation framework before go-live. Define: what business benefits the project will deliver, how each will be measured, baseline values, targets, and measurement timeline post go-live.', xp: 60, due_offset_mins: 150, project_ref: 'nexus-crm-rollout', kpi_tag: 'quality' },
    ],
  },
  3: {
    1: [
      { title: 'Client project board meeting prep', type: 'document', urgency: 'urgent', description: 'The client project board meets in 2 hours. Prepare: updated RAG, revised timeline, scope change status, top 3 risks, and the ask from the board. One page maximum — board members don\'t read more.', xp: 40, due_offset_mins: 30, project_ref: 'nexus-crm-rollout', kpi_tag: 'communication' },
      { title: 'RAID log review and refresh', type: 'document', urgency: 'normal', description: 'The RAID log hasn\'t been updated in a week. Review all items: close resolved issues, update risk status, add the two new dependencies identified this week, and ensure all owners are still correct.', xp: 25, due_offset_mins: 90, project_ref: 'nexus-crm-rollout', kpi_tag: 'reliability' },
      { title: 'Go-live readiness checklist', type: 'document', urgency: 'high', description: 'Go-live is in 2 weeks. Write a go-live readiness checklist covering: UAT sign-off, data migration, training completion, support model, rollback plan, and stakeholder sign-offs needed.', xp: 35, due_offset_mins: 120, project_ref: 'nexus-crm-rollout', kpi_tag: 'reliability' },
    ],
    2: [
      { title: 'Critical path analysis — can we hit the go-live date?', type: 'decision', urgency: 'urgent', description: 'Three tasks on the critical path are running 3 days late. Assess: is go-live in 2 weeks still achievable? If yes, what needs to happen today? If no, what are the options and what do you recommend?', xp: 55, due_offset_mins: 45, project_ref: 'nexus-crm-rollout', kpi_tag: 'quality' },
      { title: 'Training plan for end users', type: 'document', urgency: 'high', description: 'Write the end-user training plan for the CRM rollout. Cover: training format (classroom, e-learning, on-the-job), audience segmentation, schedule, success criteria, and how you will manage the 30 users who haven\'t confirmed attendance.', xp: 35, due_offset_mins: 90, project_ref: 'nexus-crm-rollout', kpi_tag: 'communication' },
    ],
    3: [
      { title: 'Programme risk escalation: legal query on data handling', type: 'scope_decision', urgency: 'urgent', description: 'Sandra Nwosu has flagged a potential GDPR issue with the data migration approach. The legal review could take 5 days and would push go-live back. You need to decide: pause migration and assess, or proceed under risk and resolve in parallel?', xp: 65, due_offset_mins: 60, project_ref: 'nexus-crm-rollout', kpi_tag: 'scope_control' },
    ],
  },
  4: {
    1: [
      { title: 'Go-live communication to all stakeholders', type: 'email_reply', urgency: 'high', description: 'Write the go-live announcement email to all project stakeholders: what is going live, when, the support arrangements, and what to do if issues arise. This is their first notification — be clear and positive.', xp: 30, due_offset_mins: 60, project_ref: 'nexus-crm-rollout', kpi_tag: 'communication' },
    ],
    2: [
      { title: 'Post-go-live issue management plan', type: 'document', urgency: 'urgent', description: 'Write the post-go-live issue management plan. Cover: issue logging process, severity classification (P1-P4), SLA for each severity, escalation path, and the daily stand-up format for the hypercare period.', xp: 45, due_offset_mins: 60, project_ref: 'nexus-crm-rollout', kpi_tag: 'reliability' },
    ],
    3: [
      { title: 'Lessons learned report for the programme', type: 'report', urgency: 'high', description: 'Write a full lessons learned report for the programme: what went well, what went badly, root causes of the issues encountered, and recommendations for future projects. This will be shared across the business.', xp: 65, due_offset_mins: 150, project_ref: 'nexus-crm-rollout', kpi_tag: 'quality' },
    ],
  },
  5: {
    1: [
      { title: 'Hypercare period daily stand-up notes', type: 'standup', urgency: 'normal', description: 'Write your hypercare daily stand-up notes: open issues and their severity, actions in progress, any escalations needed, and the confidence level for ending hypercare on schedule.', xp: 20, due_offset_mins: 30, project_ref: 'nexus-crm-rollout', kpi_tag: 'reliability' },
    ],
    2: [
      { title: 'Benefits realisation review — month 1 post go-live', type: 'report', urgency: 'high', description: 'One month post go-live. Write the first benefits realisation review: actual outcomes vs projected, any variances, root causes, and the outlook for achieving the projected benefits by end of year.', xp: 45, due_offset_mins: 90, project_ref: 'nexus-crm-rollout', kpi_tag: 'quality' },
    ],
    3: [
      { title: 'Project closure report and handover to BAU', type: 'document', urgency: 'urgent', description: 'Write the formal project closure report and handover plan to the BAU (business as usual) team. Cover: project objectives vs actual delivery, costs vs budget, outstanding items, support model going forward, and formal sign-off.', xp: 75, due_offset_mins: 120, project_ref: 'nexus-crm-rollout', kpi_tag: 'quality' },
    ],
  },
}
