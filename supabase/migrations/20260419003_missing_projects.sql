INSERT INTO projects (career_path, name, description, start_day, end_day) VALUES
  ('data_engineering',   'data-quality-beta',   'Data Quality Framework — automated validation and anomaly detection across all production tables', 1, 26),
  ('product_management', 'platform-v3',          'Nexus Platform v3 Launch — 12 new features across reporting, integrations and UX', 1, 26),
  ('product_management', 'enterprise-tier',       'Enterprise Subscription Tier — SSO, audit logs, custom reporting for enterprise clients', 1, 26),
  ('product_management', 'churn-fix',             'Churn Reduction Programme — identify and address top 5 product reasons for churn', 1, 26),
  ('project_management', 'crm-impl',              'CRM Implementation — replace legacy CRM with new platform, £1.2M budget, 6-month programme', 1, 26),
  ('project_management', 'eu-office',             'European Office Setup — establish first EU office covering legal, HR, IT and facilities', 1, 26),
  ('project_management', 'process-improvement',   'Process Improvement Initiative — reduce project overhead by 25% through standardised tooling', 1, 26),
  ('digital_marketing',  'demand-gen',            'Demand Generation Engine — build repeatable inbound pipeline to 400 MQLs per month', 1, 26),
  ('digital_marketing',  'brand-refresh',         'Brand Refresh — update visual identity and messaging for European market expansion', 1, 26)
ON CONFLICT DO NOTHING;
