import type { Curriculum } from './types'

export const CURRICULUM: Curriculum = {
  1: {
    1: [
      { title: 'Review yesterday\'s pipeline failure report', type: 'document', urgency: 'high', description: 'Sarah flagged that the nightly ETL job failed twice last week. Review the error logs and write a short summary of root cause and proposed fix.', xp: 25, due_offset_mins: 60, project_ref: 'nexus-pipeline-v2', kpi_tag: 'quality' },
      { title: 'Scope creep decision — client wants new dashboard features', type: 'scope_decision', urgency: 'urgent', description: 'Marcus has promised Priya Shah two new dashboard features by Friday. Current sprint ends Thursday. Respond to Marcus professionally about capacity and next steps.', xp: 40, due_offset_mins: 30, project_ref: 'vantage-dashboard', kpi_tag: 'scope_control' },
      { title: 'Daily standup notes', type: 'standup', urgency: 'normal', description: 'Write your standup update: what you did yesterday, what you are doing today, any blockers.', xp: 15, due_offset_mins: 90, project_ref: 'nexus-pipeline-v2', kpi_tag: 'communication' },
      { title: 'Data quality audit — Q4 sales table', type: 'report', urgency: 'normal', description: 'Sarah has asked for a data quality report on the Q4 sales table before it goes to the board. Check for nulls, duplicates, and anomalies.', xp: 35, due_offset_mins: 240, project_ref: 'vantage-dashboard', kpi_tag: 'quality' },
    ],
    2: [
      { title: 'Root cause analysis: pipeline failure pattern', type: 'report', urgency: 'high', description: 'Sarah wants a deeper analysis of the ETL failures. Identify whether this is a data volume issue, a schema change, or infrastructure. Produce a structured RCA with recommendations.', xp: 40, due_offset_mins: 90, project_ref: 'nexus-pipeline-v2', kpi_tag: 'quality' },
      { title: 'Scope change impact assessment — Priya\'s features', type: 'scope_decision', urgency: 'urgent', description: 'Following yesterday\'s standup, Marcus is pressing for a written impact assessment of adding Priya\'s features. Estimate dev effort, testing time, and the impact on the sprint deadline.', xp: 45, due_offset_mins: 45, project_ref: 'vantage-dashboard', kpi_tag: 'scope_control' },
      { title: 'Data pipeline monitoring dashboard brief', type: 'document', urgency: 'normal', description: 'Sarah wants a brief for a monitoring dashboard that gives the team visibility of pipeline health in real time. Define the key metrics, alert thresholds, and tooling recommendation.', xp: 30, due_offset_mins: 180, project_ref: 'nexus-pipeline-v2', kpi_tag: 'quality' },
    ],
    3: [
      { title: 'Pipeline architecture review — scalability risk assessment', type: 'report', urgency: 'high', description: 'Sarah wants a technical assessment of whether the current pipeline architecture can handle 3x data volume by Q2. Identify bottlenecks and propose a scalability roadmap.', xp: 50, due_offset_mins: 120, project_ref: 'nexus-pipeline-v2', kpi_tag: 'quality' },
      { title: 'Data contract definition for Vantage Corp integration', type: 'document', urgency: 'normal', description: 'Define a data contract for the Vantage Corp dashboard integration: expected fields, data types, refresh frequency, SLA, and error handling protocol.', xp: 35, due_offset_mins: 180, project_ref: 'vantage-dashboard', kpi_tag: 'communication' },
    ],
  },
  2: {
    1: [
      { title: 'Follow up on pipeline fix — did it hold overnight?', type: 'standup', urgency: 'high', description: 'The ETL fix you recommended yesterday was deployed. Check the overnight run logs and report back to Sarah. Was the fix successful? Any new issues?', xp: 20, due_offset_mins: 30, project_ref: 'nexus-pipeline-v2', kpi_tag: 'reliability' },
      { title: 'Client response: Priya\'s dashboard feature request', type: 'email_reply', urgency: 'urgent', description: 'Priya Shah has emailed asking for an update on the two features Marcus promised. You need to respond professionally — acknowledge the request, set realistic expectations, and propose a timeline.', xp: 35, due_offset_mins: 30, project_ref: 'vantage-dashboard', kpi_tag: 'communication' },
      { title: 'Write SQL query: revenue by customer segment', type: 'document', urgency: 'normal', description: 'Sarah needs a SQL query for the board pack: total revenue by customer segment for Q4, with YoY comparison. Include a brief explanation of your approach.', xp: 25, due_offset_mins: 120, project_ref: 'vantage-dashboard', kpi_tag: 'quality' },
      { title: 'Data pipeline SLA — define and document', type: 'document', urgency: 'normal', description: 'Following last week\'s failures, Sarah wants a documented SLA for the ETL pipeline: uptime target, max acceptable latency, incident response time, and escalation path.', xp: 30, due_offset_mins: 180, project_ref: 'nexus-pipeline-v2', kpi_tag: 'reliability' },
    ],
    2: [
      { title: 'Validate pipeline fix against yesterday\'s failure scenarios', type: 'report', urgency: 'high', description: 'The overnight run was clean but you need to validate the fix against the three original failure scenarios. Write a test summary confirming the fix is robust.', xp: 40, due_offset_mins: 60, project_ref: 'nexus-pipeline-v2', kpi_tag: 'quality' },
      { title: 'Negotiate scope with Marcus — email response plan', type: 'scope_decision', urgency: 'urgent', description: 'Marcus is still pushing for the two features by Friday. Draft a professional email proposing a phased delivery: feature 1 in sprint 2, feature 2 in sprint 3. Include capacity rationale.', xp: 45, due_offset_mins: 45, project_ref: 'vantage-dashboard', kpi_tag: 'scope_control' },
      { title: 'Data dictionary update for Q4 sales schema', type: 'document', urgency: 'normal', description: 'The Q4 sales schema changed last month and the data dictionary is out of date. Update it with the new fields, deprecated fields, and their business definitions.', xp: 25, due_offset_mins: 150, project_ref: 'nexus-pipeline-v2', kpi_tag: 'quality' },
    ],
    3: [
      { title: 'Design data observability framework for the pipeline', type: 'document', urgency: 'high', description: 'Following the repeated pipeline issues, Sarah wants a data observability framework. Design a solution covering: data freshness, completeness, validity, and consistency checks. Recommend tooling.', xp: 55, due_offset_mins: 120, project_ref: 'nexus-pipeline-v2', kpi_tag: 'quality' },
      { title: 'Capacity planning — Q1 infrastructure forecast', type: 'report', urgency: 'normal', description: 'Rachel Mensah from Finance needs a Q1 infrastructure cost forecast. Based on projected data volume growth of 40%, model three scenarios (base, upside, downside) with cost implications.', xp: 40, due_offset_mins: 180, project_ref: 'nexus-pipeline-v2', kpi_tag: 'reliability' },
    ],
  },
  3: {
    1: [
      { title: 'Standup — report progress on pipeline stabilisation', type: 'standup', urgency: 'normal', description: 'Day 3 standup. Report your progress on the pipeline stabilisation project. What\'s done, what\'s remaining, and what risks remain?', xp: 15, due_offset_mins: 30, project_ref: 'nexus-pipeline-v2', kpi_tag: 'communication' },
      { title: 'New client request — data model assessment needed', type: 'scope_decision', urgency: 'urgent', description: 'Marcus has brought in a new prospect who wants to integrate their CRM data with Nexus. Before committing, assess what the integration would require technically and whether it\'s feasible in Q1.', xp: 40, due_offset_mins: 45, project_ref: 'vantage-dashboard', kpi_tag: 'scope_control' },
      { title: 'Write the Q4 data quality report for the board', type: 'report', urgency: 'high', description: 'Sarah has asked you to write the Q4 data quality report for the board. Include: overall quality score, key issues identified, actions taken, and the Q1 improvement plan.', xp: 45, due_offset_mins: 120, project_ref: 'vantage-dashboard', kpi_tag: 'quality' },
    ],
    2: [
      { title: 'Incident report — pipeline failures week of Day 1', type: 'report', urgency: 'high', description: 'Write a formal incident report covering the Day 1 pipeline failures. Include: timeline, root cause, impact assessment, resolution, and preventive measures. This will go to the CTO.', xp: 45, due_offset_mins: 90, project_ref: 'nexus-pipeline-v2', kpi_tag: 'reliability' },
      { title: 'Assess CRM integration scope with Marcus', type: 'scope_decision', urgency: 'urgent', description: 'Marcus needs a written scope assessment for the CRM integration prospect. Define what\'s in scope, estimated effort, technical dependencies, and a risk register. Do not commit to a timeline.', xp: 50, due_offset_mins: 60, project_ref: 'vantage-dashboard', kpi_tag: 'scope_control' },
      { title: 'Data governance policy — first draft', type: 'document', urgency: 'normal', description: 'Sarah wants a data governance policy for Nexus covering: data ownership, access control, retention policy, and breach response. First draft only — to be reviewed by Legal.', xp: 35, due_offset_mins: 180, project_ref: 'nexus-pipeline-v2', kpi_tag: 'quality' },
    ],
    3: [
      { title: 'Propose a self-service data platform strategy', type: 'document', urgency: 'high', description: 'Sarah wants a strategic proposal for enabling Nexus\'s internal teams to access data self-service. Cover: tooling options, data access tiers, governance controls, and phased rollout plan.', xp: 60, due_offset_mins: 150, project_ref: 'nexus-pipeline-v2', kpi_tag: 'quality' },
      { title: 'Review James Obi\'s data analysis for Q3 client report', type: 'decision', urgency: 'normal', description: 'James Obi has completed his first solo analysis for the Q3 client report. Review it, identify any errors or improvements, and write coaching feedback for him.', xp: 30, due_offset_mins: 120, project_ref: 'vantage-dashboard', kpi_tag: 'communication' },
    ],
  },
  4: {
    1: [
      { title: 'Dashboard performance optimisation decision', type: 'decision', urgency: 'urgent', description: 'The Vantage dashboard is timing out for some users. You have three options: (A) query optimisation, (B) caching layer, (C) data pre-aggregation. Recommend an approach with justification.', xp: 40, due_offset_mins: 45, project_ref: 'vantage-dashboard', kpi_tag: 'quality' },
      { title: 'Write data engineer onboarding guide', type: 'document', urgency: 'normal', description: 'A new junior data engineer joins next week. Write a one-page onboarding guide covering: key systems, access setup, coding standards, deployment process, and the first week priorities.', xp: 25, due_offset_mins: 180, project_ref: 'nexus-pipeline-v2', kpi_tag: 'communication' },
    ],
    2: [
      { title: 'Benchmark dashboard query performance — pre and post optimisation', type: 'report', urgency: 'high', description: 'Following the performance decision on Day 4, write a before/after performance report. Include query execution times, P95 latency, and user-perceived load times. Quantify the improvement.', xp: 40, due_offset_mins: 90, project_ref: 'vantage-dashboard', kpi_tag: 'quality' },
      { title: 'Scope decision — Priya requests real-time data refresh', type: 'scope_decision', urgency: 'urgent', description: 'Priya Shah wants the dashboard to refresh in real-time (currently 4-hour batches). Assess the technical and cost implications. Recommend: implement, defer, or propose a compromise.', xp: 50, due_offset_mins: 60, project_ref: 'vantage-dashboard', kpi_tag: 'scope_control' },
    ],
    3: [
      { title: 'ML feature pipeline design for recommendation engine', type: 'document', urgency: 'high', description: 'Sarah wants a design document for an ML feature pipeline to support a product recommendation engine for Nexus. Cover: feature store, training data pipeline, feature freshness requirements, and monitoring.', xp: 65, due_offset_mins: 150, project_ref: 'nexus-pipeline-v2', kpi_tag: 'quality' },
    ],
  },
  5: {
    1: [
      { title: 'End of week standup — retrospective on the pipeline project', type: 'standup', urgency: 'normal', description: 'Write your end-of-week retrospective. What went well this week? What would you do differently? What is your main priority for next week?', xp: 20, due_offset_mins: 60, project_ref: 'nexus-pipeline-v2', kpi_tag: 'communication' },
      { title: 'Handover notes for the weekend on-call engineer', type: 'document', urgency: 'high', description: 'Write handover notes for the weekend on-call engineer. Include: current pipeline status, known risks, escalation contacts, and the monitoring checklist.', xp: 30, due_offset_mins: 90, project_ref: 'nexus-pipeline-v2', kpi_tag: 'reliability' },
    ],
    2: [
      { title: 'Write sprint retrospective for the data team', type: 'report', urgency: 'normal', description: 'Facilitate and write the sprint retrospective for the data team. Cover: what went well, what didn\'t, root causes of the pipeline issues, and the top 3 actions for next sprint.', xp: 35, due_offset_mins: 120, project_ref: 'nexus-pipeline-v2', kpi_tag: 'quality' },
      { title: 'Priya quarterly review — data capability scorecard', type: 'document', urgency: 'high', description: 'Write a data capability scorecard for Priya Shah\'s quarterly review. Cover: pipeline reliability, dashboard performance, data quality scores, and the roadmap for Q1. Present the data honestly.', xp: 45, due_offset_mins: 90, project_ref: 'vantage-dashboard', kpi_tag: 'communication' },
    ],
    3: [
      { title: 'Data strategy proposal for Q1 board presentation', type: 'document', urgency: 'urgent', description: 'Sarah wants a data strategy proposal for the Q1 board presentation. Cover: current state, gaps, the proposed platform investment, ROI projections, and the 90-day roadmap. This will go to the board.', xp: 70, due_offset_mins: 120, project_ref: 'nexus-pipeline-v2', kpi_tag: 'quality' },
    ],
  },
}
