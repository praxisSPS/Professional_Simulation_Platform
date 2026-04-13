-- Praxis Job Board Seed Data
-- Run this in Supabase SQL Editor AFTER the main schema.sql
-- Creates 30 open positions across all 5 virtual organisations

-- Helper: get org IDs by name (used in inserts below)
-- Run: SELECT id, name FROM organisations; to get actual UUIDs
-- Then replace the org_id values below

-- For simplicity, we use a subquery to look up org IDs by name

INSERT INTO public.job_postings (organisation_id, career_path, level_required, title, description, min_pi_score, is_open)
VALUES

-- ── NEXUS DIGITAL (startup) ───────────────────────────────────
((SELECT id FROM organisations WHERE name = 'Nexus Digital'),
 'data_engineering', 1,
 'Junior Data Analyst',
 'Support the data team with pipeline monitoring, ad-hoc analysis, and dashboard maintenance. Fast-paced startup environment — you will own your work from day one.',
 65, true),

((SELECT id FROM organisations WHERE name = 'Nexus Digital'),
 'product_management', 2,
 'Associate Product Manager',
 'Work directly with the CPO on roadmap planning for our analytics suite. Requires strong stakeholder management and ability to push back constructively on scope.',
 75, true),

((SELECT id FROM organisations WHERE name = 'Nexus Digital'),
 'sales_bd', 1,
 'Sales Development Representative',
 'Outbound prospecting and inbound lead qualification for B2B SaaS. High-activity role — 60+ touchpoints per week. Commission-eligible from month one.',
 60, true),

((SELECT id FROM organisations WHERE name = 'Nexus Digital'),
 'digital_marketing', 2,
 'Growth Marketing Executive',
 'Own paid social and SEO channels. Report weekly to the CMO. Must be comfortable with ambiguous briefs and building from scratch.',
 72, true),

((SELECT id FROM organisations WHERE name = 'Nexus Digital'),
 'customer_success', 1,
 'Junior Customer Success Manager',
 'Manage a portfolio of 15 SMB accounts. Focus on onboarding, health scoring, and renewal conversations. No cold calling.',
 65, true),

-- ── GLOBALBANK ADVISORY (bank) ────────────────────────────────
((SELECT id FROM organisations WHERE name = 'GlobalBank Advisory'),
 'financial_analysis', 1,
 'Junior Financial Analyst',
 'Support the M&A advisory team with financial modelling, variance analysis, and client presentation preparation. High standards environment — accuracy is non-negotiable.',
 70, true),

((SELECT id FROM organisations WHERE name = 'GlobalBank Advisory'),
 'financial_analysis', 2,
 'Associate Financial Analyst',
 'Lead analysis for mid-market transactions. Present directly to VPs. Requires strong communication skills alongside modelling accuracy.',
 80, true),

((SELECT id FROM organisations WHERE name = 'GlobalBank Advisory'),
 'data_engineering', 2,
 'Data Analyst — Risk & Compliance',
 'Build and maintain risk dashboards. Work with regulatory reporting team. Structured environment with clear processes.',
 75, true),

((SELECT id FROM organisations WHERE name = 'GlobalBank Advisory'),
 'project_management', 2,
 'Project Coordinator — Systems Integration',
 'Coordinate a multi-workstream core banking system migration. Risk-heavy environment — strong documentation and stakeholder communication required.',
 78, true),

((SELECT id FROM organisations WHERE name = 'GlobalBank Advisory'),
 'hr_people', 1,
 'HR Coordinator — Graduate Programmes',
 'Support early careers recruitment, onboarding, and graduate scheme administration. Strong process discipline required.',
 65, true),

-- ── APEX CREATIVE AGENCY (agency) ────────────────────────────
((SELECT id FROM organisations WHERE name = 'Apex Creative Agency'),
 'ux_design', 1,
 'Junior UX Designer',
 'Support senior designers on client projects across e-commerce and B2B SaaS. Involves user research, wireframing, and presenting findings to clients.',
 65, true),

((SELECT id FROM organisations WHERE name = 'Apex Creative Agency'),
 'ux_design', 2,
 'UX Designer',
 'Own the design process for mid-size client accounts. Lead user research and present directly to client stakeholders. Portfolio required.',
 78, true),

((SELECT id FROM organisations WHERE name = 'Apex Creative Agency'),
 'digital_marketing', 1,
 'Digital Marketing Executive',
 'Run paid media campaigns across Meta and Google for 4-6 client accounts. Weekly reporting and client communication included.',
 62, true),

((SELECT id FROM organisations WHERE name = 'Apex Creative Agency'),
 'project_management', 1,
 'Junior Account/Project Manager',
 'Coordinate between clients and creative teams. Manage timelines, scopes, and budgets across 6-8 concurrent projects. Fast-paced — every day is different.',
 67, true),

((SELECT id FROM organisations WHERE name = 'Apex Creative Agency'),
 'customer_success', 2,
 'Senior Account Manager',
 'Own relationships with top 5 agency clients. Drive renewals and upsells. Requires strong commercial awareness and executive communication.',
 82, true),

-- ── MERIDIAN FMCG (corporate) ─────────────────────────────────
((SELECT id FROM organisations WHERE name = 'Meridian FMCG'),
 'project_management', 1,
 'Project Coordinator — NPD',
 'Coordinate new product development projects across packaging, production, and marketing workstreams. Structured FMCG environment with clear processes.',
 67, true),

((SELECT id FROM organisations WHERE name = 'Meridian FMCG'),
 'project_management', 2,
 'Project Manager — Supply Chain Integration',
 'Lead cross-functional projects involving suppliers, logistics, and manufacturing. High-stakes environment — delays have direct P&L impact.',
 80, true),

((SELECT id FROM organisations WHERE name = 'Meridian FMCG'),
 'operations', 1,
 'Operations Analyst',
 'Analyse production line performance, identify efficiency improvements, and report on KPIs to the Operations Director. Data-heavy role.',
 65, true),

((SELECT id FROM organisations WHERE name = 'Meridian FMCG'),
 'operations', 2,
 'Supply Chain Coordinator',
 'Manage supplier relationships, track delivery performance, and identify supply risks. Will interface with procurement, production, and logistics teams daily.',
 75, true),

((SELECT id FROM organisations WHERE name = 'Meridian FMCG'),
 'data_engineering', 2,
 'Supply Chain Data Analyst',
 'Build forecasting models and supply chain dashboards. Work with SAP and Power BI. Cross-functional stakeholders across 4 departments.',
 76, true),

((SELECT id FROM organisations WHERE name = 'Meridian FMCG'),
 'hr_people', 2,
 'HR Business Partner (Associate)',
 'Support the HRBP team for the manufacturing division. Advise line managers on performance management, ER cases, and policy application.',
 78, true),

((SELECT id FROM organisations WHERE name = 'Meridian FMCG'),
 'financial_analysis', 1,
 'Finance Analyst — Commercial',
 'Provide financial analysis to support commercial decisions — pricing, volume, and margin reporting. Monthly board pack contribution.',
 70, true),

-- ── CIVICWORKS TRUST (public sector) ─────────────────────────
((SELECT id FROM organisations WHERE name = 'CivicWorks Trust'),
 'project_management', 1,
 'Junior Programme Coordinator',
 'Support digital transformation programme delivery. Public sector pace — structured governance but high stakeholder complexity.',
 63, true),

((SELECT id FROM organisations WHERE name = 'CivicWorks Trust'),
 'data_engineering', 1,
 'Data Analyst — Public Services',
 'Analyse service delivery data and produce reports for senior leadership and government stakeholders. Clear documentation standards required.',
 65, true),

((SELECT id FROM organisations WHERE name = 'CivicWorks Trust'),
 'product_management', 2,
 'Digital Product Owner',
 'Own the product backlog for a citizen-facing digital service. Agile environment. Work directly with development teams and policy stakeholders.',
 77, true),

((SELECT id FROM organisations WHERE name = 'CivicWorks Trust'),
 'hr_people', 1,
 'People Operations Coordinator',
 'Support recruitment, onboarding, and HR administration for a 200-person organisation. Public sector employment law knowledge valued.',
 63, true),

((SELECT id FROM organisations WHERE name = 'CivicWorks Trust'),
 'customer_success', 1,
 'Stakeholder Engagement Coordinator',
 'Manage relationships with partner organisations and community stakeholders. Report writing, meeting facilitation, and follow-up coordination.',
 60, true),

((SELECT id FROM organisations WHERE name = 'CivicWorks Trust'),
 'digital_marketing', 2,
 'Digital Communications Executive',
 'Manage social media, email campaigns, and content strategy for public-facing communications. Approval processes are structured — creativity within constraints.',
 72, true),

((SELECT id FROM organisations WHERE name = 'CivicWorks Trust'),
 'operations', 2,
 'Service Improvement Analyst',
 'Analyse operational processes and propose efficiency improvements. Experience with process mapping and stakeholder consultation required.',
 74, true);

-- ── Add closing dates (all close in 4-8 weeks) ───────────────
UPDATE public.job_postings
SET closes_at = now() + (floor(random() * 28 + 28) || ' days')::interval
WHERE closes_at IS NULL;
