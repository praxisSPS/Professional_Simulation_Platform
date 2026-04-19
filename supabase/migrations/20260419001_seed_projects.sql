-- Seed all projects referenced in curriculum files
-- name values match the project_ref slugs used in curriculum tasks

INSERT INTO projects (career_path, name, description, start_day, end_day) VALUES

  -- ── Data Engineering ──────────────────────────────────────────
  ('data_engineering',
   'nexus-pipeline-v2',
   'Core ETL pipeline ingesting sales, CRM and product data into the Nexus data warehouse. Recurring failures in Days 1–2 drive the reliability and incident-reporting track for the week.',
   1, 5),

  ('data_engineering',
   'vantage-dashboard',
   'Client-facing analytics dashboard for Vantage Corp. Scope creep from client requests and dashboard performance issues run as a parallel workstream across all five days.',
   1, 5),

  -- ── Reliability Engineering ───────────────────────────────────
  ('reliability_engineering',
   'line-2-reliability',
   'Structured programme to reduce unplanned downtime on Production Line 2 following the Conveyor 3 main drive bearing failure. Covers RCA, predictive maintenance proposal, and TPM assessment.',
   1, 5),

  ('reliability_engineering',
   'pasteuriser-pm',
   'Backlog clearance and recovery plan for Pasteuriser 1 preventive maintenance tasks that fell overdue during the Line 2 emergency. Closed out by Day 3.',
   1, 3),

  ('reliability_engineering',
   'compressor-2-maint',
   'Investigation and repair of the Compressor 2 oil leak, escalating from monitoring to controlled shutdown and shaft seal replacement across Days 1–3.',
   1, 3),

  -- ── Financial Analysis ────────────────────────────────────────
  ('financial_analysis',
   'q4-close',
   'Q4 actuals consolidation, board pack preparation, variance and EBITDA bridge analysis, audit response, and Q1 reforecast. Primary workstream for Days 1–5.',
   1, 5),

  ('financial_analysis',
   'product-launch-fa',
   'Three-scenario financial model for a new product launch. Board presentation, sensitivity analysis, and FX downside refresh drive Days 1–4.',
   1, 4),

  -- ── Product Management ────────────────────────────────────────
  ('product_management',
   'nexus-platform-q1',
   'Q1 product development programme covering sprint planning, user stories, OKRs, build-vs-buy decisions, and go-to-market planning for the analytics module.',
   1, 5),

  ('product_management',
   'vantage-integration',
   'Feature delivery programme for Vantage Corp enterprise client. Over-promises, escalations, and scope negotiations run across Days 1–3.',
   1, 3),

  -- ── Project Management ────────────────────────────────────────
  ('project_management',
   'nexus-crm-rollout',
   'Full CRM system rollout from Amber RAG recovery through scope change control, go-live readiness, hypercare, and benefits realisation. Single project across all five days.',
   1, 5),

  -- ── Digital Marketing ─────────────────────────────────────────
  ('digital_marketing',
   'q1-growth-campaign',
   'Paid social and email performance campaign. Mid-campaign budget cut, competitor response, lead quality complaint from Sales, and attribution model issues run across Days 1–5.',
   1, 5),

  ('digital_marketing',
   'nexus-product-launch',
   'Content strategy, email launch sequences, landing page copy, and brand positioning for the Nexus new product launch. Introduced in Day 2.',
   2, 5)

ON CONFLICT DO NOTHING;
