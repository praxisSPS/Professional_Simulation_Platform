/**
 * Praxis Simulation Scripts — Days 2–5
 * All 6 career paths, 4 tasks per day, full decision trees with rubrics
 * Day consequences are linked — Day 2 references Day 1 outcomes
 */

export type TaskDay = 2 | 3 | 4 | 5

export interface SimOption {
  id: string
  text: string
  quality: 'good' | 'medium' | 'bad'
  kpiImpact: Partial<Record<'reliability'|'decision_quality'|'responsiveness'|'communication'|'scope_control', number>>
  xp: number
  feedback: string
}

export interface SimTask {
  id: string
  day: TaskDay
  type: string
  urgency: 'urgent' | 'high' | 'normal'
  title: string
  description: string
  options?: SimOption[]
  rubric?: { criteria: string[]; scoring_notes: string }
  xp_reward: number
  due_offset_mins: number
}

// ══════════════════════════════════════════════════════════════
// RELIABILITY & MAINTENANCE ENGINEERING — Days 2–5
// ══════════════════════════════════════════════════════════════
export const RE_DAYS: Record<TaskDay, SimTask[]> = {
  2: [
    {
      id: 're_d2_001', day: 2, type: 'decision', urgency: 'urgent',
      title: 'Root cause analysis — yesterday\'s bearing failure',
      description: `Mike (your manager) has asked you to present a root cause analysis of yesterday's Conveyor 3 bearing failure at the 09:00 engineering meeting. The bearing was replaced and the line is running. You have 30 minutes to prepare.\n\nYour investigation so far shows: (1) The bearing had been running for 8,400 hours — the PM schedule calls for inspection at 6,000 hours. (2) The PM was overdue by 6 weeks. (3) The last lubrication record is 4 months ago. (4) The bearing manufacturer recommends lubrication every 6 weeks under current operating conditions.\n\nWhat is your root cause conclusion and recommendation?`,
      options: [
        { id: 'a', text: 'Root cause: PM overdue and lubrication interval not followed. Immediate actions: (1) Audit all bearings on Line 2 for similar risk, (2) Update PM schedule to reflect manufacturer\'s 6-week lube interval, (3) Add bearing condition monitoring to weekly checks. Present this with the data.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, communication: 8 }, xp: 45, feedback: 'Excellent RCA. You identified the true root cause (system failure — PM and lubrication schedule), not the symptom (bearing failure), and proposed systemic fixes. This prevents recurrence. This is what good reliability engineering looks like.' },
        { id: 'b', text: 'Root cause: bearing wear and tear — it had a long service life. Recommend replacing all bearings on the line as a precaution.', quality: 'medium', kpiImpact: { reliability: 3, decision_quality: -3 }, xp: 15, feedback: '"Wear and tear" is not a root cause — it is a description of what happened. The root cause is why the PM and lubrication were not performed on schedule. Blanket replacement without addressing the underlying system failure will result in the same problem again.' },
        { id: 'c', text: 'Root cause: the bearing was faulty. Raise a warranty claim with the supplier.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -12 }, xp: 0, feedback: 'The data does not support a faulty bearing conclusion. 8,400 hours without lubrication will fail any bearing. Raising a warranty claim without evidence would damage the supplier relationship and distract from the real fix. Always follow the data.' },
        { id: 'd', text: 'You do not have enough information yet. Ask Mike to defer the presentation until you have completed a full investigation.', quality: 'medium', kpiImpact: { reliability: 0, decision_quality: 2, communication: 5 }, xp: 20, feedback: 'Professionally reasonable — you should not present conclusions you cannot support. However, you do have enough data from your investigation to present an initial finding with caveats. Deferring entirely when you have clear leading indicators is a missed opportunity.' },
      ],
      xp_reward: 45, due_offset_mins: 30,
    },
    {
      id: 're_d2_002', day: 2, type: 'decision', urgency: 'high',
      title: 'PM schedule audit — 3 more at-risk assets identified',
      description: `Following your RCA, you audited Line 2's bearing records. You found 3 more assets with overdue PMs:\n\n• Conveyor 7 motor: 2 weeks overdue, medium criticality\n• Pasteuriser 2 pump seal: 4 weeks overdue, HIGH criticality — failure would cause product contamination\n• Packaging line gearbox: 1 week overdue, low criticality\n\nYou have 4 hours of available maintenance time today and each job takes approximately 2 hours. Production has offered 6 hours of access tomorrow. What do you prioritise?`,
      options: [
        { id: 'a', text: 'Prioritise Pasteuriser 2 pump seal today — highest criticality, food safety risk. Use tomorrow\'s 6 hours for Conveyor 7 motor and Packaging gearbox. Document the prioritisation rationale.', quality: 'good', kpiImpact: { reliability: 12, decision_quality: 12, scope_control: 8 }, xp: 40, feedback: 'Correct prioritisation using criticality-based reasoning. Food safety (Pasteuriser 2) is always the highest priority in FMCG — regulatory, brand, and human health consequences dwarf production losses. The documentation shows mature thinking.' },
        { id: 'b', text: 'Do all three today by splitting each job into 80 minutes — slightly rush each one to fit them in.', quality: 'bad', kpiImpact: { reliability: -8, decision_quality: -10 }, xp: 0, feedback: 'Rushed PM is worse than deferred PM. An 80-minute seal inspection that should take 2 hours on a food-safety-critical asset is a regulatory and safety risk. Never compromise quality on critical assets for schedule convenience.' },
        { id: 'c', text: 'Complete jobs in order of how overdue they are: Pasteuriser 2 (4 weeks), then Conveyor 7 (2 weeks), defer Packaging (1 week).', quality: 'medium', kpiImpact: { reliability: 8, decision_quality: 6 }, xp: 25, feedback: 'Reasonable but not optimal. "Most overdue" is not the same as "highest risk." In this case it happens to produce the right outcome (Pasteuriser 2 first) but for the wrong reason. Criticality should drive prioritisation, not elapsed time.' },
        { id: 'd', text: 'Complete all three tomorrow using the 6-hour production window — do not disturb today\'s production schedule.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -8 }, xp: 5, feedback: 'Deferring a food-safety-critical PM on Pasteuriser 2 by 24 hours without escalation is not acceptable. Mike needs to know this risk exists today. You have the maintenance time available — use it on the highest criticality item.' },
      ],
      xp_reward: 40, due_offset_mins: 120,
    },
    {
      id: 're_d2_003', day: 2, type: 'email_reply', urgency: 'normal',
      title: 'Quality manager asking about Pasteuriser 2 PM status',
      description: `From: Sandra Mensah (Quality & Food Safety Manager)\nTo: You\nSubject: Pasteuriser 2 PM — what is the status?\n\nHi,\n\nI understand from the morning meeting that there are some overdue PMs on Line 2. I need to know specifically about Pasteuriser 2 as this is a CCP (Critical Control Point) in our HACCP plan. If the pump seal PM is overdue I need to assess whether we have a food safety risk and potentially halt production.\n\nPlease update me urgently.\n\nSandra`,
      rubric: {
        criteria: [
          'Responds urgently — Sandra has food safety authority and this is a CCP',
          'Gives the factual status: 4 weeks overdue, HIGH criticality',
          'States what action is being taken and by when',
          'Does not minimise or downplay the risk to Sandra',
          'Professional and transparent — she is an ally, not a threat',
        ],
        scoring_notes: 'Sandra has the authority to halt production. Withholding information or downplaying the risk would be a serious professional and regulatory failure.',
      },
      xp_reward: 35, due_offset_mins: 60,
    },
    {
      id: 're_d2_004', day: 2, type: 'document', urgency: 'normal',
      title: 'Write a criticality-based PM prioritisation framework — 1-page',
      description: `Mike has asked you to write a one-page framework for how the team should prioritise PM tasks when there is more work than available time. This will become the team standard.\n\nYour framework should cover: (1) how to classify asset criticality, (2) the decision logic for prioritisation, (3) what to do when a high-criticality PM is overdue, and (4) escalation triggers. Keep it practical — this is for technicians, not engineers.`,
      rubric: {
        criteria: [
          'Clear criticality classification (High/Medium/Low with examples)',
          'Simple decision logic a technician can follow without a manager',
          'Specific escalation trigger for food safety / regulatory assets',
          'Practical language — not overly technical or academic',
          'Covers what to do when production denies access to an overdue critical PM',
        ],
        scoring_notes: 'A good framework is one a technician on their first week can follow without asking questions. If it requires interpretation, it will not be used.',
      },
      xp_reward: 30, due_offset_mins: 240,
    },
  ],
  3: [
    {
      id: 're_d3_001', day: 3, type: 'decision', urgency: 'urgent',
      title: 'Site Director wants to know why OEE dropped 8% this week',
      description: `You receive a message from Mike: "James Clarke (Site Director) has seen the weekly OEE report. Line 2 dragged site OEE from 78% to 70%. He wants a 5-minute briefing at 14:00. I need you to prepare the numbers and come with me."\n\nYou have 2 hours. The OEE breakdown for Line 2 this week:\n• Availability: 71% (target 90%) — 6.5 hours unplanned downtime inc. Conveyor 3\n• Performance: 94% (target 95%) — minor speed losses\n• Quality: 99.2% (target 99%) — good\n\nThe root cause of availability loss: Conveyor 3 bearing (2.5hrs) + 2 other minor stoppages (4hrs) that were pre-existing issues you have now identified.\n\nHow do you prepare?`,
      options: [
        { id: 'a', text: 'Prepare a clear 1-page brief: OEE breakdown with actual vs target, root cause of each downtime event, what has already been fixed (Conveyor 3), and a 30-day recovery plan with specific actions and expected OEE improvement. Attend with Mike and present your section clearly.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, communication: 12 }, xp: 50, feedback: 'This is how you handle board-level scrutiny. You own the data, explain the cause, show what has been fixed, and present a credible recovery plan. James Clarke is not looking for excuses — he is looking for competence and a plan. You gave him both.' },
        { id: 'b', text: 'Let Mike do most of the talking. You provide numbers if asked but stay in the background.', quality: 'medium', kpiImpact: { reliability: 0, decision_quality: -2, communication: -5 }, xp: 15, feedback: 'Understandable instinct under pressure, but a missed development opportunity. Mike brought you specifically because you did the RCA and know the detail. Staying silent when you are the subject matter expert leaves Mike exposed. Own your section.' },
        { id: 'c', text: 'Focus on explaining the Conveyor 3 bearing failure in detail — this was the main cause.', quality: 'medium', kpiImpact: { reliability: 3, decision_quality: 3, communication: 3 }, xp: 20, feedback: 'Partly right but incomplete. Conveyor 3 was only 2.5 of 6.5 hours downtime. A Site Director will notice if you explain one event and ignore the other 4 hours. Full transparency with a recovery plan is always stronger than partial explanation.' },
        { id: 'd', text: 'Recommend to Mike that the meeting is postponed until you have 2 weeks of data to show the improvement trend.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -10, communication: -8 }, xp: 0, feedback: 'You cannot ask a Site Director to reschedule because you want more time. James has seen the OEE report — the meeting is happening. Arrive with the best data you have, be honest about what you know and do not know, and present a credible plan.' },
      ],
      xp_reward: 50, due_offset_mins: 45,
    },
    {
      id: 're_d3_002', day: 3, type: 'decision', urgency: 'high',
      title: 'Technician refuses to complete overdue PM — says "it\'s not my job"',
      description: `You ask Dave, one of your shift technicians, to complete the Conveyor 7 motor PM this afternoon. He says: "That's not my job. I'm electrical. That motor needs a mechanical. Get someone else."\n\nYou check Dave's training records. He IS multi-skilled certified for this motor type — he completed the training 8 months ago. He knows this.\n\nHow do you handle this?`,
      options: [
        { id: 'a', text: 'Speak to Dave privately. Acknowledge his concern, confirm his certification covers this task, and ask what is actually driving his reluctance. Listen first — then address it. If he still refuses without a valid safety reason, escalate to Mike with the training records.', quality: 'good', kpiImpact: { reliability: 8, decision_quality: 10, communication: 12 }, xp: 40, feedback: 'Excellent people management. Listening before concluding shows maturity. There may be a real concern (unfamiliarity, safety worry) behind the pushback. Addressing it directly and privately is more effective than a confrontation. Escalating with evidence if needed is the right backstop.' },
        { id: 'b', text: 'Tell Dave firmly that his training records show he is certified and he needs to complete the task.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 5, communication: -3 }, xp: 20, feedback: 'Technically correct but missing an opportunity. Dave may have a legitimate concern you have not heard yet. Leading with "your records say you can" without listening first can create resentment. The right outcome is the same — but the approach matters for the longer-term relationship.' },
        { id: 'c', text: 'Find another technician and say nothing to Dave.', quality: 'bad', kpiImpact: { reliability: -3, decision_quality: -8, communication: -8 }, xp: 0, feedback: 'Avoiding the issue creates a precedent — Dave now knows he can refuse tasks without consequence. This will happen again. As a maintenance lead, you need to address refusals directly and proportionately, not work around them.' },
        { id: 'd', text: 'Escalate immediately to Mike and let him deal with Dave.', quality: 'medium', kpiImpact: { reliability: 2, decision_quality: -2, communication: 3 }, xp: 15, feedback: 'Premature escalation. This is a routine people management situation that you should handle at your level first. Escalating every team disagreement to your manager signals a lack of confidence and puts unnecessary load on Mike. Try to resolve it yourself first.' },
      ],
      xp_reward: 40, due_offset_mins: 120,
    },
    {
      id: 're_d3_003', day: 3, type: 'decision', urgency: 'urgent',
      title: 'Compressor 2 oil leak has worsened — production line at risk',
      description: `The Compressor 2 oil leak you flagged on Monday has significantly worsened. The maintenance technician monitoring it reports the leak rate has tripled in 24 hours. Compressor 2 supplies air to the entire packaging line. If it fails, the packaging line stops — 1,200 units/hour, £5,800/hour loss.\n\nA compressor specialist is available but needs 4 hours to diagnose and repair. Current shift has 5 hours remaining. Stopping production now costs £5,800. Running on costs approximately £500 in risk per hour based on current leak rate.\n\nWhat do you recommend?`,
      options: [
        { id: 'a', text: 'Stop the packaging line now, bring in the specialist immediately. The risk profile has changed — a tripling leak rate is not linear, it signals accelerating degradation. The cost of a controlled stop (£5,800) is far less than an uncontrolled failure mid-run (£5,800 downtime + potential product loss + emergency repair premium).', quality: 'good', kpiImpact: { reliability: 12, decision_quality: 15, scope_control: 8 }, xp: 50, feedback: 'Correct risk assessment. "Tripling in 24 hours" is a classic exponential degradation signal — not a linear progression. The expected value calculation strongly favours a controlled stop now. This is the decision an experienced reliability engineer makes. Well done.' },
        { id: 'b', text: 'Continue running but increase monitoring frequency to every 30 minutes. Call the specialist but tell him to be on standby rather than come in immediately.', quality: 'medium', kpiImpact: { reliability: 3, decision_quality: -3 }, xp: 20, feedback: 'The monitoring instinct is right but the conclusion is wrong at this leak rate. Tripling in 24 hours means you could be at 9× the original rate tomorrow. Standby is not sufficient — you need the specialist on site and assessing now, not after another failure event.' },
        { id: 'c', text: 'Run until end of shift and do a full repair overnight when production is not running.', quality: 'bad', kpiImpact: { reliability: -10, decision_quality: -15 }, xp: 0, feedback: 'With a tripling leak rate, running 5 more hours is accepting a significant probability of catastrophic failure during production. An uncontrolled compressor failure mid-run causes maximum damage — to the equipment, the product on the line, and the production schedule. The risk does not justify it.' },
        { id: 'd', text: 'Inform Mike and let him make the call — this is above your authority level.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 5, communication: 8 }, xp: 25, feedback: 'Escalating to Mike is appropriate given the financial impact. But you should go to him with a recommendation, not just the problem. "Mike, here is the situation, here is my risk assessment, here is my recommendation — do you agree?" is far stronger than "what should I do?"' },
      ],
      xp_reward: 50, due_offset_mins: 30,
    },
    {
      id: 're_d3_004', day: 3, type: 'document', urgency: 'normal',
      title: 'Write a 30-day OEE recovery plan for Line 2',
      description: `Following the Site Director briefing, Mike has asked you to write a formal 30-day OEE recovery plan for Line 2. Target: return to 78% OEE by end of Month 1, 83% by end of Month 2.\n\nThe plan should include: specific actions, responsible parties, completion dates, and expected OEE impact of each action. The Site Director will review it.`,
      rubric: {
        criteria: [
          'Clear actions with specific owners and dates — not vague commitments',
          'Each action linked to a measurable OEE impact (availability, performance, or quality)',
          'Addresses the root causes identified this week, not just symptoms',
          'Realistic — the 78% target is achievable in 30 days',
          'Written for a Site Director — professional, data-led, no jargon',
        ],
        scoring_notes: 'A recovery plan that says "improve PM compliance" without specifying how, by whom, and by when will not be taken seriously at board level.',
      },
      xp_reward: 40, due_offset_mins: 300,
    },
  ],
  4: [
    {
      id: 're_d4_001', day: 4, type: 'decision', urgency: 'urgent',
      title: 'CRISIS: Ammonia leak detected in refrigeration plant',
      description: `At 10:15, the refrigeration plant alarm triggers. Your technician reports an ammonia smell near the compressor room. Ammonia is toxic — IDLH (Immediately Dangerous to Life and Health) is 300ppm. Current reading on the fixed detector: 45ppm and rising.\n\nThe refrigeration plant cools the entire production facility. Loss of cooling will halt all production lines within 2 hours and risk £180,000 of finished product in cold store.\n\nWhat is your immediate action?`,
      options: [
        { id: 'a', text: 'Immediately evacuate all personnel from the refrigeration plant area. Activate the site emergency response plan. Inform Mike and the site HSE manager immediately. Do not attempt to investigate or repair until the area is declared safe by a competent person with appropriate PPE. Production loss is secondary to life safety.', quality: 'good', kpiImpact: { reliability: 15, decision_quality: 20, communication: 10 }, xp: 60, feedback: 'This is the only correct answer. Ammonia at 45ppm and rising is an active safety emergency. No production consideration, however large, overrides the duty to protect people. Evacuate, escalate, contain. This response would be correct in any FMCG or industrial environment and demonstrates the judgement expected of a senior engineer.' },
        { id: 'b', text: 'Send in a technician with a gas monitor to locate the leak before deciding whether to evacuate.', quality: 'bad', kpiImpact: { reliability: -15, decision_quality: -20, communication: -10 }, xp: 0, feedback: 'Sending an unprotected person into a rising ammonia atmosphere is a serious safety violation. At 45ppm and rising you have no time to investigate before evacuating. This decision could result in fatalities and criminal prosecution under RIDDOR and PUWER. Evacuate first — always.' },
        { id: 'c', text: 'Isolate the refrigeration plant remotely if possible, ventilate the area, and continue monitoring. Evacuate only if the reading exceeds 150ppm.', quality: 'bad', kpiImpact: { reliability: -10, decision_quality: -15 }, xp: 0, feedback: 'The 150ppm threshold is dangerously wrong — STEL (Short Term Exposure Limit) for ammonia is 35ppm over 15 minutes. At 45ppm and rising, the area is already above safe exposure limits. Remote isolation is appropriate as one action, but evacuation must happen immediately — not as a contingency at a higher reading.' },
        { id: 'd', text: 'Evacuate the immediate area, isolate the refrigeration plant, and call Mike. Ask him whether to activate the full emergency response plan given the production implications.', quality: 'medium', kpiImpact: { reliability: 8, decision_quality: 5, communication: 5 }, xp: 25, feedback: 'Partial credit — evacuating is right. But waiting for Mike\'s permission to activate the emergency response plan is wrong. You have the authority and the duty to activate a safety emergency response without waiting for management approval. Act, then inform.' },
      ],
      xp_reward: 60, due_offset_mins: 5,
    },
    {
      id: 're_d4_002', day: 4, type: 'decision', urgency: 'high',
      title: 'Post-incident: manage production pressure while plant is safe',
      description: `The ammonia leak has been contained. The refrigeration specialist has isolated the faulty valve and the area has been ventilated to safe levels (below 25ppm). The plant has been down for 1.5 hours.\n\nDavid Okafor (Production Manager) calls you: "When can I have the refrigeration back? I have 30 minutes before the cold store temperature starts rising above product spec. I need an answer now."\n\nThe specialist tells you she needs another 45 minutes minimum to complete the repair and verify it is safe to recommission. What do you tell David?`,
      options: [
        { id: 'a', text: 'Tell David honestly: minimum 45 minutes, possibly longer. Give him the facts so he can make decisions about the cold store product. Offer to call him the moment you have a confirmed restart time. Do not give him a false 30-minute answer to reduce the pressure.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, communication: 12 }, xp: 40, feedback: 'This is professional integrity under pressure. David needs accurate information to protect the product — giving him a false "30 minutes" answer so he stops asking would cause him to miss the window to take protective action on the cold store. The truth, delivered clearly, is always the right answer.' },
        { id: 'b', text: 'Tell David "30 minutes" to stop the pressure, then update him when you know more.', quality: 'bad', kpiImpact: { reliability: -8, decision_quality: -12, communication: -10 }, xp: 0, feedback: 'This is a lie that could cause product loss. If David believes he has 30 minutes, he will not take protective action on the cold store during the window where he still can. When you then tell him it is actually 45+ minutes, he has lost decision time he cannot recover. Never give false ETAs under pressure.' },
        { id: 'c', text: 'Tell David you will update him in 15 minutes once you have a better picture from the specialist.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 5, communication: 5 }, xp: 20, feedback: 'Reasonable but not quite right. David has told you he has 30 minutes before product risk — he needs your best current estimate now, not in 15 minutes. "Minimum 45 minutes, I will update you if it changes" gives him the information he needs to act.' },
        { id: 'd', text: 'Tell David the safety repair takes as long as it takes and production pressure cannot influence safety decisions.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 8, communication: -5 }, xp: 20, feedback: 'The principle is right but the delivery is wrong. David is not asking you to rush a safety repair — he is asking for an ETA so he can protect his product. Being unnecessarily defensive damages the relationship. Give him the honest timeline and acknowledge his product concern.' },
      ],
      xp_reward: 40, due_offset_mins: 90,
    },
    {
      id: 're_d4_003', day: 4, type: 'report', urgency: 'high',
      title: 'Write the incident report — ammonia leak, Refrigeration Plant',
      description: `Mike has asked you to write the formal incident report for the ammonia leak. This will go to the Site Director and the HSE manager, and may be reportable under RIDDOR depending on exposure levels.\n\nThe report must cover: (1) incident description and timeline, (2) immediate response actions taken, (3) root cause, (4) injuries or exposures (none in this case), (5) corrective actions and preventive measures, (6) RIDDOR assessment.\n\nWrite professionally — this is a legal document.`,
      rubric: {
        criteria: [
          'Clear chronological timeline from detection to resolution',
          'Accurate description of the response — who did what and when',
          'Root cause identified (faulty valve — was it on the PM schedule?)',
          'Corrective actions are specific, owned, and time-bound',
          'RIDDOR assessment included — incident involved hazardous substance, assess whether reportable',
          'Professional legal-document language — factual, no speculation',
        ],
        scoring_notes: 'An incident report is a legal document. Vague language, missing timelines, or unsubstantiated root causes will not withstand regulatory scrutiny.',
      },
      xp_reward: 45, due_offset_mins: 180,
    },
    {
      id: 're_d4_004', day: 4, type: 'decision', urgency: 'normal',
      title: 'Capital expenditure request — condition monitoring system',
      description: `Following this week\'s events, Mike asks you to put together a case for investing in a wireless condition monitoring system for critical rotating equipment. The system costs £28,000 installed. It would monitor bearing temperature, vibration, and oil pressure in real time and alert the team before failures occur.\n\nEstimated benefit: prevent 2–3 unplanned failures per year at average cost of £12,000 each (downtime + parts + overtime). Payback period would be approximately 12–18 months.\n\nHow do you structure the business case?`,
      options: [
        { id: 'a', text: 'Structure it around this week\'s events as the concrete example, then build the financial case: £28k cost, 2–3 failures prevented per year at £12k each = £24–36k annual benefit, payback 9–14 months. Include OEE improvement (availability increase of ~1.5%), risk reduction on food safety assets, and reduced reactive maintenance labour. Present the numbers cleanly and let them make the decision.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, communication: 10 }, xp: 45, feedback: 'This is how capital investment cases are won. You anchored on a real, recent, quantified example, built a credible financial model, and included non-financial benefits (OEE, food safety, labour). The Site Director just lived through this week — he will be receptive. The numbers are credible and conservative.' },
        { id: 'b', text: 'Describe the technology and its features in detail, then mention the cost at the end.', quality: 'medium', kpiImpact: { reliability: 2, decision_quality: -3, communication: 3 }, xp: 15, feedback: 'Features do not win capital cases — financial return does. Lead with the problem, the cost of the problem, and how much the solution saves. The technology description is secondary. Finance and operations directors approve business cases, not technical spec sheets.' },
        { id: 'c', text: 'Request the full £28,000 as an emergency safety spend following the ammonia incident — do not build a financial case.', quality: 'medium', kpiImpact: { reliability: 3, decision_quality: 0, communication: -3 }, xp: 18, feedback: 'The ammonia incident and condition monitoring are different systems — conflating them undermines the credibility of both. A strong financial case with safety benefits built in is more compelling than an emergency spend request that does not stand up to scrutiny.' },
        { id: 'd', text: 'Ask Mike to make the business case — you do not have enough financial experience to do it.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -8, communication: -5 }, xp: 0, feedback: 'Mike asked you to prepare the case specifically because you have the operational knowledge and the week\'s data to make it credible. Declining develops neither you nor the case. You do not need financial expertise to quantify downtime costs and calculate a payback period — you need the operational data, which you have.' },
      ],
      xp_reward: 45, due_offset_mins: 300,
    },
  ],
  5: [
    {
      id: 're_d5_001', day: 5, type: 'document', urgency: 'high',
      title: 'Weekly performance report — present to Mike and David',
      description: `It is Friday. Mike has asked you to present a weekly performance summary at the 09:00 joint maintenance/production meeting. Attendees: Mike (Maintenance Manager), David Okafor (Production Manager), Sandra Mensah (QFS Manager).\n\nThis week's data:\n• OEE: 70% (target 78%)\n• Unplanned downtime: 8 hours across 4 events\n• PM compliance: 68% (target 95%)\n• MTBF: 142 hours (target 200 hours)\n• MTTR: 2.8 hours average (target 2.0 hours)\n\nWrite your presentation narrative — what happened, why, and what you are doing about it.`,
      rubric: {
        criteria: [
          'Opens with the key numbers honestly — no sugar-coating',
          'Explains each metric shortfall with its specific root cause',
          'Links this week\'s events to the metrics clearly',
          'Presents the recovery actions already underway (from earlier this week)',
          'Sets realistic expectations for next week\'s metrics',
          'Appropriate tone for a mixed maintenance/production/QFS audience',
        ],
        scoring_notes: 'A good weekly performance narrative owns the numbers, explains them, and shows a credible path to improvement. Defensiveness or vagueness in front of production and QFS will damage cross-functional relationships.',
      },
      xp_reward: 40, due_offset_mins: 60,
    },
    {
      id: 're_d5_002', day: 5, type: 'decision', urgency: 'normal',
      title: 'Technician performance conversation — Dave\'s refusal to do PM',
      description: `Following Wednesday\'s incident where Dave refused to complete the Conveyor 7 PM, Mike has asked you to have a formal performance conversation with Dave and document it.\n\nDave is a good technician overall — 6 years on site, reliable attendance, technically strong. Wednesday\'s refusal was out of character. In your subsequent conversation he admitted he has not used his mechanical certification for 8 months and felt unconfident, but did not want to admit it.\n\nHow do you conduct this conversation?`,
      options: [
        { id: 'a', text: 'Acknowledge Dave\'s honesty in explaining the real reason. Address the refusal behaviour (which was wrong regardless of the reason) while also addressing the confidence gap constructively. Agree a development plan: supervised practice on the motor type, refresher training, and a review in 4 weeks. Document the conversation formally but frame it as a development record, not a disciplinary.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, communication: 15 }, xp: 50, feedback: 'This is mature people management. You are holding Dave accountable for the behaviour (the refusal) while addressing the underlying cause (confidence gap) constructively. A good technician who felt unable to admit a skill gap is recoverable — a punitive response would lose him. The development plan is specific and time-bound.' },
        { id: 'b', text: 'Issue a formal written warning for refusing a reasonable management instruction. This cannot be repeated.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -10, communication: -8 }, xp: 0, feedback: 'A formal warning without first understanding the cause is disproportionate and would likely fail an employment tribunal. Dave had a genuine safety concern (working beyond his current confidence on a task), even if he expressed it wrongly. Proportionate response, development plan, documented conversation — not a warning at this stage.' },
        { id: 'c', text: 'Accept Dave\'s explanation and move on — he was right to flag a competence concern, even if the way he did it was wrong.', quality: 'medium', kpiImpact: { reliability: 2, decision_quality: -3, communication: 2 }, xp: 15, feedback: 'Too lenient. The way Dave raised the concern — a flat refusal — was not acceptable even if the underlying concern had merit. Not addressing the behaviour creates a precedent. You can acknowledge his real concern while also being clear that the way to raise it is not a refusal.' },
        { id: 'd', text: 'Move Dave to a purely electrical role to avoid this situation arising again.', quality: 'bad', kpiImpact: { reliability: -3, decision_quality: -8, communication: -5 }, xp: 5, feedback: 'This is the most expensive option — you lose a multi-skilled resource, Dave loses development, and the team loses flexibility. And it does not address the behaviour. A targeted development plan to rebuild Dave\'s confidence on the specific task type is far more effective.' },
      ],
      xp_reward: 50, due_offset_mins: 120,
    },
    {
      id: 're_d5_003', day: 5, type: 'decision', urgency: 'normal',
      title: 'Plan next week — prioritise from a list of 12 demands',
      description: `It is Friday afternoon. You need to plan next week. You have the following demands on your team\'s time:\n\n1. Complete remaining PM backlog (estimated 16 hours)\n2. Compressor 2 full overhaul following this week\'s leak (8 hours, booked specialist)\n3. Condition monitoring system installation survey (2 hours)\n4. Line 3 efficiency project kickoff meeting (3 hours)\n5. Dave\'s supervised mechanical practice session (2 hours)\n6. HSE audit preparation (4 hours — audit is in 3 weeks)\n7. Weekly PMs that are due next week (10 hours)\n8. 3 reactive jobs from today\'s shift (6 hours)\n\nYou have 48 team hours available next week. Total demand: 51 hours. You are 3 hours short. What do you deprioritise and why?`,
      options: [
        { id: 'a', text: 'Protect: safety-critical items (Compressor 2 overhaul, weekly PMs, HSE prep), PM backlog (food safety risk), Dave\'s development session. Defer: Line 3 efficiency project meeting (reschedule to week after), condition monitoring survey (not time-critical). Use reactive capacity to absorb the 3 reactive jobs. Document the rationale for deferring Line 3.', quality: 'good', kpiImpact: { reliability: 12, decision_quality: 12, scope_control: 12 }, xp: 50, feedback: 'Excellent prioritisation. Safety and compliance come first. PM backlog remains urgent given this week\'s events. Dave\'s development session protects the team\'s capability. Line 3 efficiency is important but not urgent and can be rescheduled. You documented the deferral — which protects you if questioned.' },
        { id: 'b', text: 'Ask for 3 more hours of overtime to cover everything — no deferral needed.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: -2, scope_control: -5 }, xp: 20, feedback: 'Overtime to cover a 3-hour gap is not unreasonable, but doing this regularly without addressing underlying capacity signals a planning or resource problem. The better skill is to prioritise clearly and defer explicitly, then make a case for additional resource if the shortfall is structural.' },
        { id: 'c', text: 'Defer the PM backlog to week after next — the immediate risk has been addressed this week.', quality: 'bad', kpiImpact: { reliability: -10, decision_quality: -12, scope_control: -5 }, xp: 0, feedback: 'After this week\'s PM-related failures, deferring the PM backlog further is not defensible — particularly with Sandra (QFS) now watching PM compliance on CCPs. The PM backlog must remain a priority.' },
        { id: 'd', text: 'Complete the weekly PMs and reactive jobs only — defer everything else until capacity improves.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -8 }, xp: 0, feedback: 'Deferring the Compressor 2 overhaul and PM backlog after this week would be a serious misjudgement. "Wait until capacity improves" is not a plan — it is the absence of one. Prioritise explicitly with rationale.' },
      ],
      xp_reward: 50, due_offset_mins: 240,
    },
    {
      id: 're_d5_004', day: 5, type: 'document', urgency: 'normal',
      title: 'Write your personal learning reflection — Week 1',
      description: `This is the final task of Level 1. Praxis asks every user to complete a personal learning reflection at the end of their first simulation week.\n\nReflect on:\n1. The most significant decision you made this week and what you learned from it\n2. One thing you would do differently if you could repeat the week\n3. The skill or behaviour you want to develop most in Level 2\n4. How your performance this week compares to where you want to be in your career\n\nBe honest. This reflection is for you — it becomes part of your Praxis performance portfolio.`,
      rubric: {
        criteria: [
          'Specific — references actual decisions and events from the week, not generic statements',
          'Honest — identifies genuine areas for development, not just strengths',
          'Forward-looking — the Level 2 development goal is concrete and specific',
          'Shows self-awareness — the gap between current performance and career ambition is acknowledged',
          'Authentic — this should read like a person thinking, not a performance review template',
        ],
        scoring_notes: 'The quality of this reflection is a strong predictor of professional development velocity. Generic, positive, self-congratulatory reflections score low. Specific, honest, growth-oriented reflections score high.',
      },
      xp_reward: 35, due_offset_mins: 480,
    },
  ],
}

// ══════════════════════════════════════════════════════════════
// DATA ENGINEERING — Days 2–5
// ══════════════════════════════════════════════════════════════
export const DE_DAYS: Record<TaskDay, SimTask[]> = {
  2: [
    {
      id: 'de_d2_001', day: 2, type: 'decision', urgency: 'urgent',
      title: 'Pipeline failure root cause — present to James',
      description: `James (your manager) wants a root cause analysis of yesterday\'s pipeline failure before the 09:30 standup. Your investigation shows: (1) The schema change was made by the DevOps team at 11pm without following the change control process. (2) The pipeline has no schema validation checks. (3) The monitoring alert fired 47 minutes after the failure — too slow. (4) The data team has no alerting SLA. What is your root cause and recommendation?`,
      options: [
        { id: 'a', text: 'Root cause: absence of schema validation in the pipeline and no enforced change control process for schema modifications. Recommend: (1) Add schema validation checks to all critical pipelines, (2) Require data team sign-off on any schema changes to monitored tables, (3) Reduce alert response time to under 10 minutes. Present with the data.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, communication: 8 }, xp: 45, feedback: 'Strong RCA. You identified systemic failures (no validation, no process) rather than blaming the DevOps team. The recommendations are specific and preventive. This is the quality of analysis that builds credibility with engineering managers.' },
        { id: 'b', text: 'Root cause: the DevOps team did not follow process. Recommend they are required to notify data engineering before any schema changes.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: -2, communication: 3 }, xp: 20, feedback: 'Partly right but single-causal. The DevOps process failure is a contributing cause, but the pipeline\'s lack of schema validation means any schema change would have caused the same failure. Fixing only the process leaves the technical vulnerability in place.' },
        { id: 'c', text: 'Root cause: monitoring was too slow. Focus on reducing alert response time.', quality: 'medium', kpiImpact: { reliability: 3, decision_quality: -3 }, xp: 15, feedback: 'Monitoring improvement is valuable but this treats the symptom, not the cause. Faster alerts would have caught the failure sooner but would not have prevented it. The root cause is the unvalidated schema change hitting an unprotected pipeline.' },
        { id: 'd', text: 'You need more time to investigate — ask James to defer the presentation.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -8 }, xp: 0, feedback: 'You have sufficient data to present an initial RCA with appropriate caveats. Deferring when James has specifically asked for a morning update signals a lack of confidence. Present what you know, be clear about what is still being investigated.' },
      ],
      xp_reward: 45, due_offset_mins: 30,
    },
    {
      id: 'de_d2_002', day: 2, type: 'decision', urgency: 'high',
      title: 'Marcus wants to add 2 new data sources to the pipeline — this sprint',
      description: `Marcus emails: "Hey! Priya loved the sales dashboard. She\'s asking if we can add two new data sources — Salesforce CRM and the new marketing platform. She wants to see them in next week\'s report. Can we do it? I told her probably yes!"\n\nYou check: adding two new data sources requires schema design, extraction logic, transformation, testing, and monitoring — minimum 3 days of engineering work. You have 1.5 days of sprint capacity remaining. Sarah (Lead Dev) has flagged the pipeline still has outstanding tech debt from last week\'s failure.\n\nHow do you respond?`,
      options: [
        { id: 'a', text: 'Reply to Marcus directly: "Marcus, I appreciate Priya\'s enthusiasm and we want to deliver this. Adding two new data sources properly takes 3 days minimum — we have 1.5 days of sprint capacity. I can commit to one source (Salesforce, higher priority) for next week\'s report, and deliver the marketing platform the week after. Can you let Priya know and confirm which source to prioritise?" Copy James.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, scope_control: 15, communication: 10 }, xp: 45, feedback: 'Excellent scope management. You acknowledged the request, gave a specific capacity-based reason, proposed a realistic alternative, asked Marcus to confirm priority, and kept James informed. This is professional engineering communication — not a flat refusal, not a dangerous "yes".' },
        { id: 'b', text: 'Tell Marcus yes, you will do both — work overtime to fit them in.', quality: 'bad', kpiImpact: { reliability: -10, decision_quality: -12, scope_control: -15 }, xp: 0, feedback: 'Committing to rush two data integrations while carrying tech debt from last week\'s failure is exactly how pipeline failures recur. Overtime does not create good engineering — it creates tired engineers making mistakes on complex work.' },
        { id: 'c', text: 'Forward to James and let him decide.', quality: 'medium', kpiImpact: { reliability: 2, decision_quality: -2, communication: 3 }, xp: 15, feedback: 'Escalating to James is appropriate as an FYI, but you should have a recommendation ready. This is within your scope to manage — you know the capacity, the tech debt risk, and what is deliverable. Give James your assessment and proposed response.' },
        { id: 'd', text: 'Tell Marcus both data sources will be ready next week and figure out how to deliver it internally.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -10, scope_control: -12, communication: -5 }, xp: 0, feedback: 'Promising Priya a delivery you do not have capacity to make properly — especially while carrying pipeline tech debt — is setting up a quality failure. When the integration breaks in production next week, the trust damage is far greater than the disappointment of a realistic timeline now.' },
      ],
      xp_reward: 45, due_offset_mins: 60,
    },
    {
      id: 'de_d2_003', day: 2, type: 'email_reply', urgency: 'urgent',
      title: 'Priya Shah wants to know when her data will be reliable',
      description: `From: Priya Shah (Client — Vantage Corp)\nTo: You (cc: James, Marcus)\nSubject: Data reliability — when can I trust the reports?\n\nFollowing yesterday\'s missing report and the issues last week, I need to understand: can I rely on your data for our board presentation next Thursday? I am presenting revenue analysis to our board and if the numbers are wrong the consequences are serious.\n\nI need a straight answer — is the data reliable and what are you doing to ensure it stays that way?\n\nPriya`,
      rubric: {
        criteria: [
          'Gives Priya a straight answer — yes or qualified yes, with specific conditions',
          'Explains what caused the issue and what has been fixed (without technical jargon)',
          'States specifically what checks are in place for next Thursday\'s report',
          'Does not overpromise — if there is residual risk, acknowledge it honestly',
          'Professional and confident in tone — Priya needs to trust you, not worry more',
        ],
        scoring_notes: 'Priya is a client presenting to her board. Vague reassurance ("we\'re working on it") is worse than honest qualification. She needs to make a real decision about whether to use your data.',
      },
      xp_reward: 35, due_offset_mins: 45,
    },
    {
      id: 'de_d2_004', day: 2, type: 'document', urgency: 'normal',
      title: 'Write a data pipeline monitoring SLA',
      description: `Following this week\'s incidents, James has asked you to draft a monitoring SLA for the team\'s critical data pipelines. This will set the standard for how quickly pipeline failures must be detected and resolved.\n\nThe SLA should cover: (1) pipeline criticality tiers and how to classify them, (2) maximum acceptable alert response time per tier, (3) escalation paths if SLA is breached, (4) how SLA performance will be measured and reported.\n\nThis becomes a team standard document.`,
      rubric: {
        criteria: [
          'Clear criticality tiers with examples (e.g. board-facing vs internal reporting)',
          'Specific response times — not vague ("promptly") but measurable ("within 15 minutes")',
          'Escalation path is clear: who gets notified at what tier and after what time',
          'Measurement methodology — how will compliance be tracked?',
          'Realistic — the SLA must be achievable by the current team',
        ],
        scoring_notes: 'An SLA with unmeasurable commitments or unrealistic response times will not be followed. Specificity and realism are the two markers of a good SLA.',
      },
      xp_reward: 30, due_offset_mins: 240,
    },
  ],
  3: [
    {
      id: 'de_d3_001', day: 3, type: 'decision', urgency: 'urgent',
      title: 'Data quality issue — Q3 revenue figures are wrong',
      description: `Sarah flags an issue at 08:45: the Q3 revenue figures in the Priya dashboard are overstated by 12% due to a duplicate transaction issue in the Salesforce extraction logic. Priya is presenting these numbers to her board next Thursday — 8 days away.\n\nThe fix takes approximately 4 hours of engineering work plus reprocessing. The corrected figures will show Q3 revenue 12% lower than currently displayed. James is in back-to-back meetings until 11:00.\n\nWhat do you do right now?`,
      options: [
        { id: 'a', text: 'Start the fix immediately — 4 hours means you can have correct data by end of day. Send Priya and Marcus a brief, factual email now: "We have identified a data quality issue in Q3 revenue — figures are currently overstated by ~12%. We are fixing this today. Corrected numbers will be available by 17:00. I will confirm when the fix is deployed." Leave James a message flagging the issue and your action.', quality: 'good', kpiImpact: { reliability: 12, decision_quality: 15, communication: 12 }, xp: 50, feedback: 'This is the right call. Act immediately on the fix (you have the authority and the urgency). Inform Priya immediately so she can factor this into her board prep — she has 8 days, which is enough time if she knows now but not enough if she finds out on Wednesday. Leaving James a message keeps him informed without requiring his input to proceed.' },
        { id: 'b', text: 'Wait for James to finish his meetings at 11:00 before doing anything — this is a client-facing issue and needs his sign-off.', quality: 'bad', kpiImpact: { reliability: -8, decision_quality: -10, communication: -5 }, xp: 0, feedback: 'Waiting 2+ hours when Priya has a board presentation in 8 days and her data is wrong is not acceptable. The fix is clear, within your capability, and time-sensitive. Inform James via message and proceed. Waiting for sign-off when the right action is obvious costs Priya decision time she cannot recover.' },
        { id: 'c', text: 'Fix the data quietly and update the dashboard without telling Priya about the error.', quality: 'bad', kpiImpact: { reliability: 5, decision_quality: -15, communication: -15 }, xp: 0, feedback: 'This is a serious professional ethics failure. Priya may have already shared draft numbers with her board. If she presents corrected numbers without context, her board will be confused. She deserves to know what happened so she can manage her own narrative. Hiding data errors from clients destroys trust when discovered — and they are always discovered.' },
        { id: 'd', text: 'Tell Priya and Marcus about the issue but wait for James before starting the fix.', quality: 'medium', kpiImpact: { reliability: 3, decision_quality: -2, communication: 8 }, xp: 20, feedback: 'Telling Priya immediately is right. But waiting for James before starting a fix you clearly have the competence and authority to make is unnecessarily slow. Start the fix, inform James via message. You do not need permission to do your job when the action is clear and urgent.' },
      ],
      xp_reward: 50, due_offset_mins: 20,
    },
    {
      id: 'de_d3_002', day: 3, type: 'decision', urgency: 'high',
      title: 'James wants you to cut corners on testing to meet Friday deadline',
      description: `James pulls you aside at 11:30: "Look, Priya's board presentation is Thursday. We need the Salesforce integration live by Wednesday so she can review. I know it\'s only 1.5 days of capacity but I need you to get it done. Skip the full test cycle if you need to — just do smoke tests and push it to production."\n\nYou know from experience that the Salesforce API has edge cases that only appear in full integration testing. Skipping full tests risks pushing bad data to Priya\'s board report.`,
      options: [
        { id: 'a', text: 'Push back professionally: "James, I understand the deadline pressure. The risk I\'m concerned about is that Salesforce has API edge cases we\'ve seen before — if those hit production untested, Priya gets bad data for her board. I can do accelerated testing covering the highest-risk scenarios in half the normal time, and deliver Wednesday morning. That gives Priya Wednesday afternoon to review. Is that workable?" Then document the risk in writing.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, scope_control: 12, communication: 10 }, xp: 50, feedback: 'This is professional integrity. You pushed back with a specific, technical reason (not "that\'s not how we do it"), proposed a concrete compromise (accelerated testing), preserved the client\'s review window, and documented the risk. If James overrides you after this, you are protected. If he accepts, you delivered the best outcome.' },
        { id: 'b', text: 'Agree to James\'s request — he is your manager and he understands the business risk.', quality: 'bad', kpiImpact: { reliability: -8, decision_quality: -12, scope_control: -10 }, xp: 0, feedback: 'Manager authority does not override professional judgement on technical risk. If Priya\'s board presentation contains wrong Salesforce data because you skipped testing, the reputational damage falls on you as well as James. You have a professional obligation to raise the risk clearly before complying.' },
        { id: 'c', text: 'Do smoke tests only as James asked, but add extra monitoring in production to catch issues quickly.', quality: 'medium', kpiImpact: { reliability: 3, decision_quality: -3, scope_control: -5 }, xp: 20, feedback: 'The monitoring instinct is good, but production monitoring catches failures after they happen — when Priya may already have wrong data. The issue is preventing bad data from reaching a board presentation, not detecting it afterwards. Push back on the test scope before complying.' },
        { id: 'd', text: 'Agree to James but go to his manager if he insists — this is a quality issue that needs escalation.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 5, communication: -5 }, xp: 20, feedback: 'Going over James\'s head before exhausting the direct conversation is too aggressive for this situation. Have the full conversation with James first — propose the accelerated testing compromise and document the risk. Escalate only if he explicitly overrides your professional concern after hearing it.' },
      ],
      xp_reward: 50, due_offset_mins: 120,
    },
    {
      id: 'de_d3_003', day: 3, type: 'email_reply', urgency: 'normal',
      title: 'Sarah escalates — she found a second data quality issue',
      description: `From: Sarah Edwards (Lead Developer)\nTo: You\nSubject: FYI — found another one\n\nWas reviewing the Q3 fix and noticed the marketing spend data also has a currency conversion issue — UK spends are being converted at last month\'s rate, not current. Impact is small (~2%) but it\'s wrong.\n\nDo you want me to fix it now or queue it for next sprint? Also, should we tell Priya?\n\nSarah`,
      rubric: {
        criteria: [
          'Gives Sarah a clear decision — fix now or queue — with a reason',
          'Addresses the Priya question directly — yes, tell her, with the framing',
          'Considers whether the 2% error is material for a board presentation (it is — state why)',
          'Pragmatic and decisive — Sarah does not want a long deliberation, she wants a call',
          'Acknowledges Sarah\'s good catch and the pattern it reveals',
        ],
        scoring_notes: 'A 2% currency error on a board presentation is material. The instinct to queue it because it is "small" is wrong. Sarah needs a decision, not a committee.',
      },
      xp_reward: 30, due_offset_mins: 90,
    },
    {
      id: 'de_d3_004', day: 3, type: 'document', urgency: 'normal',
      title: 'Write a data quality incident log template',
      description: `Following this week\'s data quality issues, James has asked you to create a standard incident log template that the team uses every time a data quality issue is identified. This creates an audit trail and enables pattern analysis.\n\nThe template should capture: what was wrong, when it was identified, who identified it, root cause, impact on downstream consumers, fix applied, and preventive measures taken. It should be quick to complete — not a bureaucratic burden.`,
      rubric: {
        criteria: [
          'Covers all required fields without being burdensome',
          'Includes a severity rating with clear criteria',
          'Has a "downstream impact" section — who might have used the bad data?',
          'Simple enough to complete in 10–15 minutes',
          'Includes a "lessons learned / preventive action" field',
        ],
        scoring_notes: 'The best incident log templates are used consistently. Complexity is the enemy of compliance.',
      },
      xp_reward: 28, due_offset_mins: 240,
    },
  ],
  4: [
    {
      id: 'de_d4_001', day: 4, type: 'decision', urgency: 'urgent',
      title: 'CRISIS: Production database accidentally deleted — partial data loss',
      description: `At 14:00 Sarah messages in a panic: "I accidentally ran a DELETE query on the production database without a WHERE clause. Approximately 30% of the transactions table from the last 6 months is gone. I have a backup from 3 days ago. James is presenting a revenue analysis to the board in 90 minutes that uses this table."\n\nYou have: a 3-day-old backup (missing 3 days of transactions), query logs that may allow partial reconstruction, and 90 minutes.\n\nWhat is your immediate response?`,
      options: [
        { id: 'a', text: 'Immediately: (1) Tell Sarah to stop all writes to the affected table NOW to prevent further data loss. (2) Tell James immediately — he cannot present revenue analysis from a corrupted table, he needs to know now not in 88 minutes. (3) Start assessing what can be reconstructed from query logs while Sarah prepares the backup restore. (4) Do not try to hide or fix before telling James — 90 minutes is not enough to guarantee a full fix and he needs to make an informed decision about his presentation.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 15, communication: 15 }, xp: 60, feedback: 'This is crisis management done correctly. Stop the bleeding first (halt writes). Inform the person who will be most impacted immediately — James presenting wrong revenue to a board is a reputational catastrophe you have 90 minutes to prevent. Assess recovery options in parallel. Transparency under pressure is the mark of a senior engineer.' },
        { id: 'b', text: 'Spend 90 minutes attempting to restore from backup and reconstruct missing data. Tell James only if you cannot fix it in time.', quality: 'bad', kpiImpact: { reliability: -10, decision_quality: -15, communication: -15 }, xp: 0, feedback: 'This is the worst possible approach. You are gambling James\'s board presentation on a recovery you are not certain you can complete in 90 minutes. If you fail at 89 minutes, James has no time to adapt. Tell him immediately so he can decide whether to delay, use caveated data, or present without the revenue analysis. Information is his to act on — not yours to withhold.' },
        { id: 'c', text: 'Tell James immediately and recommend he postpones his presentation. Start the restore in parallel.', quality: 'medium', kpiImpact: { reliability: 8, decision_quality: 8, communication: 10 }, xp: 35, feedback: 'Good on informing James immediately. Recommending postponement is reasonable but the decision is his — present him with the options (postpone, present with caveated data, present without the revenue section) and the likely recovery timeline. Give him options, not just a recommendation to delay.' },
        { id: 'd', text: 'Restore from the 3-day backup immediately and do not mention the data loss — the difference will be minimal.', quality: 'bad', kpiImpact: { reliability: -15, decision_quality: -20, communication: -15 }, xp: 0, feedback: 'Presenting board-level revenue analysis from data you know is 3 days stale after a deletion event — without disclosure — is a serious professional ethics failure. "The difference will be minimal" is an assumption you cannot verify in 90 minutes. This is not a recoverable situation if discovered.' },
      ],
      xp_reward: 60, due_offset_mins: 10,
    },
    {
      id: 'de_d4_002', day: 4, type: 'decision', urgency: 'high',
      title: 'Post-incident: Sarah is distraught — how do you support her?',
      description: `The data recovery went well — you reconstructed 95% of the missing data from query logs and James was able to present with appropriate caveats. Crisis averted.\n\nSarah sends you a message: "I\'m so sorry. I can\'t believe I did that. I\'ve been doing this for 7 years and I ran a DELETE without a WHERE. I feel sick. James is going to fire me."\n\nHow do you respond to Sarah?`,
      options: [
        { id: 'a', text: 'Respond warmly but honestly: "Sarah, you caught it, you told me immediately, and we fixed it together. That\'s what a good engineer does. The real issue is that production databases should require a transaction confirmation before DELETE queries — that\'s a system design gap, not a personal failure. I\'m going to recommend we add that control. You\'re not getting fired." Then follow through on the system recommendation.', quality: 'good', kpiImpact: { reliability: 5, decision_quality: 10, communication: 15 }, xp: 40, feedback: 'Outstanding response. You acknowledged Sarah\'s feelings, reframed the event accurately (she caught it and escalated — that\'s the right behaviour), identified the real systemic gap (no production safeguards), and committed to act on it. And you followed through by actually recommending the safeguard. This is how good technical leaders build trust.' },
        { id: 'b', text: 'Tell Sarah that mistakes happen and she should not worry about it. James will not fire her.', quality: 'medium', kpiImpact: { reliability: 2, decision_quality: -2, communication: 5 }, xp: 18, feedback: 'Reassuring but incomplete. The best response addresses both the emotional reality and the systemic root cause. "Mistakes happen" without identifying the design gap that allowed the mistake to have this impact misses the learning opportunity and the preventive action.' },
        { id: 'c', text: 'Tell Sarah this cannot happen again and she needs to be more careful in future.', quality: 'bad', kpiImpact: { reliability: 0, decision_quality: -8, communication: -10 }, xp: 0, feedback: '"Be more careful" is not a preventive measure — it is a blame statement. Sarah was not careless; she made a human error in a system that had no safeguards against it. The right response is to fix the system. Blaming individuals for system design failures creates a culture where people hide mistakes rather than reporting them.' },
        { id: 'd', text: 'Forward Sarah\'s message to James with context — he should know what happened directly from the team.', quality: 'bad', kpiImpact: { reliability: 0, decision_quality: -10, communication: -15 }, xp: 0, feedback: 'Forwarding a private distress message from a colleague to their manager without consent is a serious breach of trust. James already knows what happened — you told him. Sarah\'s emotional message to you was not intended for her manager. This would permanently damage your relationship with Sarah.' },
      ],
      xp_reward: 40, due_offset_mins: 120,
    },
    {
      id: 'de_d4_003', day: 4, type: 'document', urgency: 'high',
      title: 'Write a database access control policy',
      description: `Following today\'s deletion incident, James has asked you to draft a database access control policy that prevents this class of incident recurring. He wants it reviewed by the end of the week.\n\nThe policy should cover: (1) access levels for different roles (read-only, read-write, admin), (2) safeguards for destructive operations on production (DELETE, DROP, TRUNCATE), (3) the review and approval process for production access, (4) audit logging requirements.`,
      rubric: {
        criteria: [
          'Clear access tier definitions with examples of who has each level',
          'Specific technical safeguards for destructive operations (e.g. require transaction + manual confirmation, separate production credentials)',
          'Approval process is realistic — not so bureaucratic it gets circumvented',
          'Audit logging is specific about what is logged and how long retained',
          'Written for both technical and non-technical readers',
        ],
        scoring_notes: 'A good access control policy is one that is actually followed. If the safeguards are so cumbersome that engineers work around them, the policy has failed before it is implemented.',
      },
      xp_reward: 40, due_offset_mins: 300,
    },
    {
      id: 'de_d4_004', day: 4, type: 'decision', urgency: 'normal',
      title: 'Priya wants real-time data — is it the right solution?',
      description: `Marcus emails: "Great news! Priya loved the dashboard and she wants to take it further. She wants real-time data updates every 15 minutes instead of daily. She says her competitors have real-time dashboards and she needs to keep up. Can we do it?"\n\nReal-time (15-minute) refresh would require: streaming architecture, significant infrastructure cost increase (~£3,200/month), 6–8 weeks of engineering. Current daily refresh meets all of Priya\'s stated reporting needs. You suspect the real-time request is driven by perception, not actual use case.`,
      options: [
        { id: 'a', text: 'Before committing to the technical scope, have a discovery conversation with Marcus and Priya: "Before we scope the engineering, I want to make sure we\'re solving the right problem. Can you walk me through a specific scenario where 15-minute refresh changes a decision you\'d make? Daily refresh works well for strategic reporting — real-time is better for operational decisions." If they have a genuine real-time use case, build it. If not, propose a 4-hour refresh as a low-cost compromise.', quality: 'good', kpiImpact: { reliability: 8, decision_quality: 15, scope_control: 12, communication: 10 }, xp: 50, feedback: 'Excellent. You applied the most important engineering principle: understand the real problem before designing the solution. "Competitors have real-time" is not a use case. If Priya cannot name a specific decision that requires 15-minute data, the £3,200/month infrastructure investment is waste. The 4-hour compromise is clever — it may satisfy the perception gap at a fraction of the cost.' },
        { id: 'b', text: 'Scope and build the real-time solution — the client is asking for it and that is the business requirement.', quality: 'bad', kpiImpact: { reliability: 3, decision_quality: -8, scope_control: -10 }, xp: 5, feedback: 'Building a £3,200/month real-time infrastructure for a reporting dashboard where the client cannot articulate a real-time use case is engineering waste. Good data engineers question requirements before building — not after. "The client asked for it" is not sufficient justification for significant infrastructure investment.' },
        { id: 'c', text: 'Tell Marcus the current daily refresh is sufficient and decline the real-time request.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 3, scope_control: 8, communication: -3 }, xp: 20, feedback: 'Declining without understanding the use case is as premature as saying yes without understanding it. There might be a genuine real-time need. The right first step is a discovery conversation.' },
        { id: 'd', text: 'Build a 4-hour refresh as a compromise without consulting Priya — it is technically simpler and probably good enough.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 5, scope_control: 5, communication: -5 }, xp: 22, feedback: 'The 4-hour compromise might be the right technical answer, but implementing it without a conversation means Priya does not feel heard and may push for the real-time version anyway. Have the conversation first — then propose the compromise with the reasoning.' },
      ],
      xp_reward: 50, due_offset_mins: 180,
    },
  ],
  5: [
    {
      id: 'de_d5_001', day: 5, type: 'report', urgency: 'high',
      title: 'Weekly engineering summary — present to James',
      description: `Friday morning. James wants a weekly engineering summary covering: pipeline reliability metrics, data quality incidents, capacity vs demand, and next week\'s priorities. This goes into the engineering team\'s weekly report to the CTO.\n\nThis week\'s data: Pipeline uptime 94% (target 99%). 3 data quality incidents (2 resolved, 1 in progress). Sprint capacity utilised 110% (ran over). 2 client escalations (both resolved). Next week: Salesforce integration delivery, database access policy implementation, monitoring SLA rollout.`,
      rubric: {
        criteria: [
          'Honest on the metrics — 94% uptime and 110% capacity utilisation are both misses',
          'Explains the incidents without excessive detail — CTO-level summary',
          'Next week priorities are specific and sequenced',
          'Professional tone — this is a leadership-facing document',
          'Ends with a clear picture of team health and any resource concerns',
        ],
        scoring_notes: 'CTO-level summaries should be readable in 3 minutes. Every sentence should earn its place.',
      },
      xp_reward: 40, due_offset_mins: 90,
    },
    {
      id: 'de_d5_002', day: 5, type: 'decision', urgency: 'normal',
      title: 'James offers you a lead data engineer role — do you take it?',
      description: `James pulls you aside: "You\'ve had a hell of a week — handled it well. I\'ve been talking to the CTO and we want to offer you the Lead Data Engineer role. It means owning the team\'s technical direction, line managing Sarah and two others, and being the point of escalation for all data quality issues. 20% pay increase. What do you think?"\n\nYou value deep technical work. The lead role means more management and less coding. You are not sure you are ready for the people management responsibility — this week showed you that.`,
      options: [
        { id: 'a', text: 'Ask for a week to consider seriously, then accept with a specific development conversation: "James, I want to take this — I\'m genuinely interested. I\'d like a week to think through the people management side because that\'s the area I want to develop intentionally. Can we agree on what support looks like in the first 90 days? I want to get this right, not just say yes."', quality: 'good', kpiImpact: { reliability: 8, decision_quality: 12, communication: 10 }, xp: 45, feedback: 'This shows maturity. You are interested but self-aware enough to ask for time and support rather than either reflexively accepting or declining. Naming the specific development area (people management) and asking for structured support in the first 90 days shows exactly the kind of intentional leadership James is offering this role to.' },
        { id: 'b', text: 'Accept immediately — this is a great opportunity and you should not turn it down.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 3, communication: 5 }, xp: 25, feedback: 'Enthusiasm is good but an immediate yes without reflection on the role change and your development needs is not the strongest response. James will be more confident in you if you demonstrate self-awareness about what the role requires and what you need to succeed in it.' },
        { id: 'c', text: 'Decline — you are not ready for people management and prefer to stay in a technical individual contributor role.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 5, communication: 5 }, xp: 25, feedback: 'A legitimate choice, but one worth sitting with. "I\'m not ready" is different from "I don\'t want this career direction." If it is the former, the right conversation is about what support would make you ready, not a flat decline.' },
        { id: 'd', text: 'Accept and tell James you are fully ready — showing confidence is important at this moment.', quality: 'bad', kpiImpact: { reliability: 3, decision_quality: -5, communication: -3 }, xp: 10, feedback: 'Performing confidence you do not feel is not the same as having it — and experienced managers can usually tell the difference. James has watched you all week. An honest answer ("I want this and I want to do it properly — can we talk about the first 90 days?") is more impressive than a confident bluff.' },
      ],
      xp_reward: 45, due_offset_mins: 180,
    },
    {
      id: 'de_d5_003', day: 5, type: 'email_reply', urgency: 'normal',
      title: 'Priya sends a positive review — respond professionally',
      description: `From: Priya Shah (Client — Vantage Corp)\nTo: You, James\nSubject: Thank you — board presentation went well\n\nI wanted to let you know that the board presentation went really well yesterday. The revenue analysis was clear and credible. Despite the issues earlier in the week, your team handled the data quality problems quickly and transparently, which I appreciate. The board approved the budget proposal based on the analysis.\n\nI would like to discuss expanding the dashboard scope when you have time.\n\nWith thanks,\nPriya`,
      rubric: {
        criteria: [
          'Responds warmly but professionally — this is a client relationship',
          'Acknowledges the team, not just yourself',
          'Picks up the thread about expanding scope appropriately — expresses interest without over-committing',
          'Proposes a specific next step for the scoping conversation',
          'Concise — Priya is a senior executive, not a long email reader',
        ],
        scoring_notes: 'Client relationship emails after a successful outcome set the tone for the next conversation. Warm, professional, and forward-looking.',
      },
      xp_reward: 30, due_offset_mins: 120,
    },
    {
      id: 'de_d5_004', day: 5, type: 'document', urgency: 'normal',
      title: 'Personal learning reflection — Week 1',
      description: `Final task of Level 1. Write your personal learning reflection:\n\n1. The most significant decision you made this week and what you learned from it\n2. One thing you would do differently if you could repeat the week\n3. The skill or behaviour you want to develop most in Level 2\n4. How your performance this week compares to where you want to be in your career\n\nBe specific and honest. This becomes part of your verified Praxis portfolio.`,
      rubric: {
        criteria: [
          'References specific events from the week — not generic statements',
          'Honest about both strengths and development areas',
          'Level 2 development goal is concrete and specific',
          'Shows awareness of the gap between current performance and career ambition',
          'Authentic — reads like genuine reflection, not a performance review',
        ],
        scoring_notes: 'Specificity and honesty are the two markers of a high-quality reflection. Generic positive statements score low.',
      },
      xp_reward: 35, due_offset_mins: 480,
    },
  ],
}

// ══════════════════════════════════════════════════════════════
// HELPER: get tasks for a given career path and day
// ══════════════════════════════════════════════════════════════
export function getDayTasks(careerPath: string, day: TaskDay): SimTask[] {
  switch (careerPath) {
    case 'reliability_engineering': return RE_DAYS[day] ?? []
    case 'data_engineering':        return DE_DAYS[day] ?? []
    default: return []
  }
}

// Morning briefings for Days 2–5
export const DAILY_BRIEFINGS: Record<string, Record<TaskDay, { subject: string; body: string }>> = {
  reliability_engineering: {
    2: {
      subject: 'Day 2 — RCA presentation at 09:00, PM backlog is critical',
      body: `Morning,\n\nBig day. James Clarke (Site Director) is going to see the OEE drop — we need to be ready.\n\n1. RCA for Conveyor 3 at 09:00 — I need you to present your findings. Have the data ready. Root cause, what was missed, what we are doing about it.\n\n2. The PM audit you ran yesterday flagged Pasteuriser 2 as 4 weeks overdue. That is a CCP. Sandra knows. Deal with it today — it is not optional.\n\n3. Sandra will contact you directly about Pasteuriser 2. Be transparent with her — she has the authority to halt production and she will use it if she has to.\n\nGood shift.\n\nMK`,
    },
    3: {
      subject: 'Day 3 — OEE briefing with James at 14:00, Compressor 2 needs watching',
      body: `Morning,\n\nJames Clarke has seen the weekly OEE numbers. He wants a briefing at 14:00 and I need you with me.\n\nPrepare: OEE breakdown, root cause of each downtime event this week, what we have fixed, and a 30-day recovery plan. James is reasonable but he needs to see a credible plan, not excuses.\n\nCompressor 2 — the oil leak is being monitored. If the rate changes, you have my authority to stop the line. Do not wait for my sign-off if it becomes a safety call.\n\nDave situation — handle it today. Have a conversation with him. I trust you to manage it professionally.\n\nMK`,
    },
    4: {
      subject: 'Day 4 — Safety emergency protocols in effect, no production pressure overrides safety',
      body: `Morning,\n\nAll routine priorities are secondary today after yesterday's events.\n\n1. Ammonia incident report is due to me and Sandra by end of day. This may be RIDDOR reportable — treat it as such until confirmed otherwise.\n\n2. The refrigeration specialist is on site at 08:00 for the full compressor overhaul. Give her full access and cooperation.\n\n3. David will be chasing on production timelines. Be honest with him about ETAs. Do not give him a number you cannot stand behind.\n\n4. Capex case for condition monitoring — get me a draft by end of week. This week has made the case for us.\n\nMK`,
    },
    5: {
      subject: 'Day 5 — End of week, OEE review at 09:00, close out the week',
      body: `Morning,\n\nEnd of your first simulation week. A lot happened.\n\nWeekly performance review is at 09:00 with David and Sandra. Own the numbers — good and bad.\n\nDave performance conversation today. Document it properly.\n\nNext week plan — I need your prioritised task list by end of today. We are still in recovery mode on OEE. Do not overload the plan.\n\nWell done this week. Some difficult calls — mostly made well.\n\nMK`,
    },
  },
  data_engineering: {
    2: {
      subject: 'Day 2 — RCA at 09:30, scope creep from Marcus, Priya is watching',
      body: `Morning,\n\nYesterday's pipeline failure is now a visibility issue — Priya noticed the missing report and she's not happy.\n\n1. RCA at 09:30 standup. Have your findings ready. I want root cause and recommendations, not just a timeline of what happened.\n\n2. Marcus has apparently promised Priya more data sources. He has copied me in. Deal with it directly with him — I do not need to be in the middle of every scope conversation.\n\n3. Priya is going to contact you directly. She has a board presentation next Thursday. She needs confidence from you, not from me.\n\nJH`,
    },
    3: {
      subject: 'Day 3 — Data quality issue is critical, Salesforce deadline pressure',
      body: `Morning,\n\nTwo things need your attention before anything else:\n\n1. The revenue figures — Sarah flagged an issue last night. If this is what I think it is, Priya needs to know immediately. Do not sit on it.\n\n2. Salesforce integration — I need a realistic delivery date. I will be talking to Marcus this morning and I need a number I can stand behind. Not a number that gets you through the meeting.\n\nThe testing conversation we need to have — I will not pretend the deadline pressure is not real. But I need your professional view on what is safe to deliver by Wednesday. Come to me with a proposal.\n\nJH`,
    },
    4: {
      subject: 'Day 4 — Database incident: priority one is James\'s presentation, then the fix',
      body: `Team,\n\nI am aware of the database deletion. We are handling it.\n\nFor anyone who has not been told yet: we had a deletion event on the transactions table this afternoon. Recovery is underway. My presentation has been adjusted.\n\nSarah: I know. We will talk properly once the immediate situation is stable. This is not a firing offence — it is a system design problem that we are now going to fix.\n\nPriorities today: recovery first, then the access control policy. I need a draft by end of week.\n\nJH`,
    },
    5: {
      subject: 'Day 5 — Good week overall. Weekly summary for CTO, then a conversation.',
      body: `Morning,\n\nDespite everything, Priya's board presentation went well. That matters.\n\nWeekly summary for the CTO is due today — I need it from you by 14:00.\n\nI want to have a conversation with you this afternoon. Nothing bad — I have been talking to the CTO about the team structure and I want your view on where you want to take your career here.\n\nJH`,
    },
  },
}
