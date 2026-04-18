import type { Curriculum } from './types'

export const CURRICULUM: Curriculum = {
  1: {
    1: [
      { title: 'URGENT: Bearing failure — Conveyor 3, Line 2', type: 'decision', urgency: 'urgent', description: 'You arrive on shift at 06:00. Outgoing technician reports unusual noise on Conveyor 3 since 04:30. Production is running. You identify a failing main drive bearing. No spare on site. Downtime costs GBP4,200/hour. What do you do?', xp: 40, due_offset_mins: 30, project_ref: 'line-2-reliability', kpi_tag: 'quality' },
      { title: 'Write your shift handover notes', type: 'document', urgency: 'normal', description: 'End of shift. Line 2 was stopped 2.5 hours for bearing replacement (now resolved). 3 of 5 PM tasks completed. 2 overdue PM tasks remain on Pasteuriser 1. Oil leak on Compressor 2 — needs monitoring. Write your handover notes.', xp: 25, due_offset_mins: 90, project_ref: 'line-2-reliability', kpi_tag: 'communication' },
      { title: 'Production manager asking why Line 2 stopped', type: 'email_reply', urgency: 'urgent', description: 'David Okafor (Production Manager) has emailed asking for an explanation of the Line 2 stoppage for his 3pm meeting. He needs: what happened, why, and what was done. Reply professionally.', xp: 30, due_offset_mins: 45, project_ref: 'line-2-reliability', kpi_tag: 'communication' },
      { title: 'Overdue PM decision — Pasteuriser 1', type: 'decision', urgency: 'normal', description: 'Two PM tasks on Pasteuriser 1 are 1 week overdue. Each takes 45 minutes. Production can only offer a 30-minute CIP break tomorrow. Maintenance lead wants them done. What do you recommend?', xp: 35, due_offset_mins: 180, project_ref: 'pasteuriser-pm', kpi_tag: 'quality' },
    ],
    2: [
      { title: 'Root cause analysis: Conveyor 3 bearing failure', type: 'report', urgency: 'high', description: 'Mike Kowalski wants a formal RCA for the Conveyor 3 bearing failure. Cover: failure mechanism, contributing factors (was the bearing underspecified, lubrication failure, or overload?), and preventive recommendations.', xp: 40, due_offset_mins: 90, project_ref: 'line-2-reliability', kpi_tag: 'quality' },
      { title: 'PM schedule recovery plan for Pasteuriser 1', type: 'document', urgency: 'high', description: 'Write a recovery plan to clear the Pasteuriser 1 PM backlog this week. Identify the specific tasks, propose production windows, estimate labour, and get sign-off from David Okafor.', xp: 35, due_offset_mins: 60, project_ref: 'pasteuriser-pm', kpi_tag: 'reliability' },
      { title: 'Compressor 2 oil leak — monitoring protocol', type: 'decision', urgency: 'urgent', description: 'The Compressor 2 oil leak has persisted for 2 days. Mike wants a formal decision: continue monitoring, schedule a controlled shutdown, or stop immediately. Justify your recommendation with risk analysis.', xp: 45, due_offset_mins: 45, project_ref: 'compressor-2-maint', kpi_tag: 'quality' },
    ],
    3: [
      { title: 'Reliability improvement proposal — Line 2 predictive maintenance', type: 'document', urgency: 'high', description: 'Following the bearing failure, propose a predictive maintenance programme for Line 2. Cover: sensors required, condition monitoring approach, alert thresholds, and expected reduction in unplanned downtime.', xp: 55, due_offset_mins: 120, project_ref: 'line-2-reliability', kpi_tag: 'reliability' },
      { title: 'H&S risk assessment update — Compressor 2 oil leak', type: 'report', urgency: 'high', description: 'Sandra Nwosu requires a formal risk assessment update for the Compressor 2 oil leak. Use the standard 5x5 risk matrix. Identify: hazards, persons at risk, current controls, and additional controls required.', xp: 40, due_offset_mins: 90, project_ref: 'compressor-2-maint', kpi_tag: 'quality' },
    ],
  },
  2: {
    1: [
      { title: 'Shift start check — verify Compressor 2 and Pasteuriser 1 status', type: 'standup', urgency: 'high', description: 'Start of Day 2 shift. Report the current status of: (1) Compressor 2 oil leak — better, same, or worse? (2) Pasteuriser 1 — did the morning PM window happen? What was completed?', xp: 20, due_offset_mins: 30, project_ref: 'compressor-2-maint', kpi_tag: 'reliability' },
      { title: 'Emergency: Compressor 2 oil leak has worsened', type: 'decision', urgency: 'urgent', description: 'The Compressor 2 oil leak has worsened overnight. Output pressure is dropping. Production wants to keep running. You have two options: (A) stop and investigate now, or (B) monitor and plan a controlled shutdown tonight. What do you recommend and why?', xp: 45, due_offset_mins: 20, project_ref: 'compressor-2-maint', kpi_tag: 'quality' },
      { title: 'Update maintenance log for Day 2 events', type: 'document', urgency: 'normal', description: 'Update the maintenance log: (1) Compressor 2 oil leak — current status and your Day 2 decision, (2) Pasteuriser 1 PM — what was completed in the morning window, (3) Line 2 — post-bearing-replacement status. Be factual and timestamped.', xp: 20, due_offset_mins: 90, project_ref: 'compressor-2-maint', kpi_tag: 'communication' },
    ],
    2: [
      { title: 'Write Compressor 2 shutdown procedure', type: 'document', urgency: 'urgent', description: 'Following the decision to schedule a controlled shutdown of Compressor 2, write the shutdown procedure: preparation steps, LOTO requirements, sequence of operations, safety checks, and who must be notified.', xp: 40, due_offset_mins: 60, project_ref: 'compressor-2-maint', kpi_tag: 'reliability' },
      { title: 'Procurement request: emergency spares review', type: 'scope_decision', urgency: 'high', description: 'Following yesterday\'s bearing emergency, Tony Briggs (Procurement) wants a review of the critical spares holding policy. Recommend which bearings and seals should be held on site vs ordered on demand, with justification.', xp: 35, due_offset_mins: 90, project_ref: 'line-2-reliability', kpi_tag: 'scope_control' },
    ],
    3: [
      { title: 'Total Productive Maintenance assessment for Line 2', type: 'report', urgency: 'high', description: 'Mike wants a TPM assessment for Line 2. Calculate OEE (Availability × Performance × Quality) using this week\'s data. Identify the biggest OEE loss and propose a focused improvement project.', xp: 60, due_offset_mins: 120, project_ref: 'line-2-reliability', kpi_tag: 'quality' },
    ],
  },
  3: {
    1: [
      { title: 'Post-shutdown inspection report — Compressor 2', type: 'report', urgency: 'high', description: 'Compressor 2 has been shut down. Write the post-inspection report: what was found, the recommended repair (with part numbers and estimated time), and the go/no-go recommendation for restart.', xp: 40, due_offset_mins: 60, project_ref: 'compressor-2-maint', kpi_tag: 'quality' },
      { title: 'Pasteuriser 1 PM — document completion and sign-off', type: 'document', urgency: 'normal', description: 'The Pasteuriser 1 PM tasks are now complete. Document the completion: tasks performed, findings, parts replaced, and post-PM condition check. Get Mike\'s sign-off.', xp: 20, due_offset_mins: 90, project_ref: 'pasteuriser-pm', kpi_tag: 'reliability' },
      { title: 'Weekly maintenance KPIs — report to Mike', type: 'report', urgency: 'high', description: 'Mike needs the weekly maintenance KPI report: PM compliance rate, MTTR (mean time to repair), number of unplanned stoppages, and cost of unplanned downtime. Compare to target. This week was below target.', xp: 35, due_offset_mins: 120, project_ref: 'line-2-reliability', kpi_tag: 'reliability' },
    ],
    2: [
      { title: 'Compressor 2 repair decision — in-house vs. specialist contractor', type: 'decision', urgency: 'urgent', description: 'The inspection reveals the Compressor 2 shaft seal needs replacing. In-house repair: 3 days. Specialist contractor: 1 day but GBP 8,400 cost vs GBP 2,100 in-house. Production is currently using backup. What do you recommend?', xp: 50, due_offset_mins: 45, project_ref: 'compressor-2-maint', kpi_tag: 'quality' },
      { title: 'H&S audit preparation — maintenance records review', type: 'document', urgency: 'high', description: 'Sandra Nwosu has given 3 days notice of an internal H&S audit. Review the maintenance records for the last 30 days and identify any gaps, overdue items, or documentation issues that need resolving before the audit.', xp: 35, due_offset_mins: 90, project_ref: 'pasteuriser-pm', kpi_tag: 'reliability' },
    ],
    3: [
      { title: 'Maintenance strategy review — reactive vs preventive vs predictive mix', type: 'document', urgency: 'high', description: 'Mike wants a strategic review of the current maintenance approach. For each of the three main asset classes (conveyors, compressors, pasteurisers), recommend the optimal maintenance strategy and justify it with cost and risk data.', xp: 65, due_offset_mins: 150, project_ref: 'line-2-reliability', kpi_tag: 'quality' },
    ],
  },
  4: {
    1: [
      { title: 'New engineer onboarding — write site safety induction', type: 'document', urgency: 'normal', description: 'A new junior technician starts Monday. Write a site safety induction document covering: PPE requirements, emergency procedures, LOTO protocol, permit-to-work process, and the first week priorities.', xp: 25, due_offset_mins: 180, project_ref: 'line-2-reliability', kpi_tag: 'communication' },
      { title: 'Line 3 conveyor wear — plan or run?', type: 'decision', urgency: 'high', description: 'Kwame has flagged unusual wear on the Line 3 conveyor drive chain. The production schedule is full for 2 weeks. You have two options: (A) schedule an immediate 4-hour maintenance window, (B) monitor daily and plan for next month. Justify your recommendation.', xp: 40, due_offset_mins: 60, project_ref: 'line-2-reliability', kpi_tag: 'quality' },
    ],
    2: [
      { title: 'Criticality analysis — rank top 10 assets by failure risk', type: 'report', urgency: 'high', description: 'Following three unplanned stoppages this week, Mike wants a criticality analysis for the top 10 plant assets. Use Failure Mode and Effects Analysis (FMEA) approach. Rank by risk priority number.', xp: 50, due_offset_mins: 120, project_ref: 'line-2-reliability', kpi_tag: 'quality' },
    ],
    3: [
      { title: 'Condition monitoring implementation plan — vibration analysis', type: 'document', urgency: 'high', description: 'Propose an implementation plan for vibration monitoring on the top 5 rotating assets. Cover: sensor selection, baseline data collection, alert threshold setting, and the maintenance workflow when an alert fires.', xp: 65, due_offset_mins: 150, project_ref: 'line-2-reliability', kpi_tag: 'reliability' },
    ],
  },
  5: {
    1: [
      { title: 'End-of-week shift handover — full plant status', type: 'document', urgency: 'high', description: 'Write the end-of-week shift handover document. Cover: all active work orders, known equipment risks, PM compliance this week, outstanding actions, and recommendations for the weekend on-call engineer.', xp: 30, due_offset_mins: 60, project_ref: 'line-2-reliability', kpi_tag: 'communication' },
    ],
    2: [
      { title: 'Monthly maintenance performance review', type: 'report', urgency: 'high', description: 'Write the monthly maintenance performance review for Mike and the plant manager. Include: OEE trend, PM compliance %, unplanned downtime hours, top 3 failure causes, and the actions for next month.', xp: 45, due_offset_mins: 90, project_ref: 'line-2-reliability', kpi_tag: 'reliability' },
    ],
    3: [
      { title: 'Capital expenditure proposal — condition monitoring system', type: 'document', urgency: 'urgent', description: 'Write a capital expenditure proposal for a plant-wide condition monitoring system. Include: investment required, expected reduction in unplanned downtime, payback period, and risk if not approved. This goes to the plant director.', xp: 75, due_offset_mins: 120, project_ref: 'line-2-reliability', kpi_tag: 'quality' },
    ],
  },
}
