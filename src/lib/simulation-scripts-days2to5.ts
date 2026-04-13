/**
 * Praxis Simulation Scripts - Days 2-5
 * All 6 career paths, 4 tasks per day, full decision trees with rubrics
 * Day consequences are linked - Day 2 references Day 1 outcomes
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
// RELIABILITY & MAINTENANCE ENGINEERING - Days 2-5
// ══════════════════════════════════════════════════════════════
export const RE_DAYS: Record<TaskDay, SimTask[]> = {
  2: [
    {
      id: 're_d2_001', day: 2, type: 'decision', urgency: 'urgent',
      title: 'Root cause analysis - yesterday\'s bearing failure',
      description: `Mike (your manager) has asked you to present a root cause analysis of yesterday's Conveyor 3 bearing failure at the 09:00 engineering meeting. The bearing was replaced and the line is running. You have 30 minutes to prepare.\n\nYour investigation so far shows: (1) The bearing had been running for 8,400 hours - the PM schedule calls for inspection at 6,000 hours. (2) The PM was overdue by 6 weeks. (3) The last lubrication record is 4 months ago. (4) The bearing manufacturer recommends lubrication every 6 weeks under current operating conditions.\n\nWhat is your root cause conclusion and recommendation?`,
      options: [
        { id: 'a', text: 'Root cause: PM overdue and lubrication interval not followed. Immediate actions: (1) Audit all bearings on Line 2 for similar risk, (2) Update PM schedule to reflect manufacturer\'s 6-week lube interval, (3) Add bearing condition monitoring to weekly checks. Present this with the data.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, communication: 8 }, xp: 45, feedback: 'Excellent RCA. You identified the true root cause (system failure - PM and lubrication schedule), not the symptom (bearing failure), and proposed systemic fixes. This prevents recurrence. This is what good reliability engineering looks like.' },
        { id: 'b', text: 'Root cause: bearing wear and tear - it had a long service life. Recommend replacing all bearings on the line as a precaution.', quality: 'medium', kpiImpact: { reliability: 3, decision_quality: -3 }, xp: 15, feedback: '"Wear and tear" is not a root cause - it is a description of what happened. The root cause is why the PM and lubrication were not performed on schedule. Blanket replacement without addressing the underlying system failure will result in the same problem again.' },
        { id: 'c', text: 'Root cause: the bearing was faulty. Raise a warranty claim with the supplier.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -12 }, xp: 0, feedback: 'The data does not support a faulty bearing conclusion. 8,400 hours without lubrication will fail any bearing. Raising a warranty claim without evidence would damage the supplier relationship and distract from the real fix. Always follow the data.' },
        { id: 'd', text: 'You do not have enough information yet. Ask Mike to defer the presentation until you have completed a full investigation.', quality: 'medium', kpiImpact: { reliability: 0, decision_quality: 2, communication: 5 }, xp: 20, feedback: 'Professionally reasonable - you should not present conclusions you cannot support. However, you do have enough data from your investigation to present an initial finding with caveats. Deferring entirely when you have clear leading indicators is a missed opportunity.' },
      ],
      xp_reward: 45, due_offset_mins: 30,
    },
    {
      id: 're_d2_002', day: 2, type: 'decision', urgency: 'high',
      title: 'PM schedule audit - 3 more at-risk assets identified',
      description: `Following your RCA, you audited Line 2's bearing records. You found 3 more assets with overdue PMs:\n\n• Conveyor 7 motor: 2 weeks overdue, medium criticality\n• Pasteuriser 2 pump seal: 4 weeks overdue, HIGH criticality - failure would cause product contamination\n• Packaging line gearbox: 1 week overdue, low criticality\n\nYou have 4 hours of available maintenance time today and each job takes approximately 2 hours. Production has offered 6 hours of access tomorrow. What do you prioritise?`,
      options: [
        { id: 'a', text: 'Prioritise Pasteuriser 2 pump seal today - highest criticality, food safety risk. Use tomorrow\'s 6 hours for Conveyor 7 motor and Packaging gearbox. Document the prioritisation rationale.', quality: 'good', kpiImpact: { reliability: 12, decision_quality: 12, scope_control: 8 }, xp: 40, feedback: 'Correct prioritisation using criticality-based reasoning. Food safety (Pasteuriser 2) is always the highest priority in FMCG - regulatory, brand, and human health consequences dwarf production losses. The documentation shows mature thinking.' },
        { id: 'b', text: 'Do all three today by splitting each job into 80 minutes - slightly rush each one to fit them in.', quality: 'bad', kpiImpact: { reliability: -8, decision_quality: -10 }, xp: 0, feedback: 'Rushed PM is worse than deferred PM. An 80-minute seal inspection that should take 2 hours on a food-safety-critical asset is a regulatory and safety risk. Never compromise quality on critical assets for schedule convenience.' },
        { id: 'c', text: 'Complete jobs in order of how overdue they are: Pasteuriser 2 (4 weeks), then Conveyor 7 (2 weeks), defer Packaging (1 week).', quality: 'medium', kpiImpact: { reliability: 8, decision_quality: 6 }, xp: 25, feedback: 'Reasonable but not optimal. "Most overdue" is not the same as "highest risk." In this case it happens to produce the right outcome (Pasteuriser 2 first) but for the wrong reason. Criticality should drive prioritisation, not elapsed time.' },
        { id: 'd', text: 'Complete all three tomorrow using the 6-hour production window - do not disturb today\'s production schedule.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -8 }, xp: 5, feedback: 'Deferring a food-safety-critical PM on Pasteuriser 2 by 24 hours without escalation is not acceptable. Mike needs to know this risk exists today. You have the maintenance time available - use it on the highest criticality item.' },
      ],
      xp_reward: 40, due_offset_mins: 120,
    },
    {
      id: 're_d2_003', day: 2, type: 'email_reply', urgency: 'normal',
      title: 'Quality manager asking about Pasteuriser 2 PM status',
      description: `From: Sandra Mensah (Quality & Food Safety Manager)\nTo: You\nSubject: Pasteuriser 2 PM - what is the status?\n\nHi,\n\nI understand from the morning meeting that there are some overdue PMs on Line 2. I need to know specifically about Pasteuriser 2 as this is a CCP (Critical Control Point) in our HACCP plan. If the pump seal PM is overdue I need to assess whether we have a food safety risk and potentially halt production.\n\nPlease update me urgently.\n\nSandra`,
      rubric: {
        criteria: [
          'Responds urgently - Sandra has food safety authority and this is a CCP',
          'Gives the factual status: 4 weeks overdue, HIGH criticality',
          'States what action is being taken and by when',
          'Does not minimise or downplay the risk to Sandra',
          'Professional and transparent - she is an ally, not a threat',
        ],
        scoring_notes: 'Sandra has the authority to halt production. Withholding information or downplaying the risk would be a serious professional and regulatory failure.',
      },
      xp_reward: 35, due_offset_mins: 60,
    },
    {
      id: 're_d2_004', day: 2, type: 'document', urgency: 'normal',
      title: 'Write a criticality-based PM prioritisation framework - 1-page',
      description: `Mike has asked you to write a one-page framework for how the team should prioritise PM tasks when there is more work than available time. This will become the team standard.\n\nYour framework should cover: (1) how to classify asset criticality, (2) the decision logic for prioritisation, (3) what to do when a high-criticality PM is overdue, and (4) escalation triggers. Keep it practical - this is for technicians, not engineers.`,
      rubric: {
        criteria: [
          'Clear criticality classification (High/Medium/Low with examples)',
          'Simple decision logic a technician can follow without a manager',
          'Specific escalation trigger for food safety / regulatory assets',
          'Practical language - not overly technical or academic',
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
      description: `You receive a message from Mike: "James Clarke (Site Director) has seen the weekly OEE report. Line 2 dragged site OEE from 78% to 70%. He wants a 5-minute briefing at 14:00. I need you to prepare the numbers and come with me."\n\nYou have 2 hours. The OEE breakdown for Line 2 this week:\n• Availability: 71% (target 90%) - 6.5 hours unplanned downtime inc. Conveyor 3\n• Performance: 94% (target 95%) - minor speed losses\n• Quality: 99.2% (target 99%) - good\n\nThe root cause of availability loss: Conveyor 3 bearing (2.5hrs) + 2 other minor stoppages (4hrs) that were pre-existing issues you have now identified.\n\nHow do you prepare?`,
      options: [
        { id: 'a', text: 'Prepare a clear 1-page brief: OEE breakdown with actual vs target, root cause of each downtime event, what has already been fixed (Conveyor 3), and a 30-day recovery plan with specific actions and expected OEE improvement. Attend with Mike and present your section clearly.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, communication: 12 }, xp: 50, feedback: 'This is how you handle board-level scrutiny. You own the data, explain the cause, show what has been fixed, and present a credible recovery plan. James Clarke is not looking for excuses - he is looking for competence and a plan. You gave him both.' },
        { id: 'b', text: 'Let Mike do most of the talking. You provide numbers if asked but stay in the background.', quality: 'medium', kpiImpact: { reliability: 0, decision_quality: -2, communication: -5 }, xp: 15, feedback: 'Understandable instinct under pressure, but a missed development opportunity. Mike brought you specifically because you did the RCA and know the detail. Staying silent when you are the subject matter expert leaves Mike exposed. Own your section.' },
        { id: 'c', text: 'Focus on explaining the Conveyor 3 bearing failure in detail - this was the main cause.', quality: 'medium', kpiImpact: { reliability: 3, decision_quality: 3, communication: 3 }, xp: 20, feedback: 'Partly right but incomplete. Conveyor 3 was only 2.5 of 6.5 hours downtime. A Site Director will notice if you explain one event and ignore the other 4 hours. Full transparency with a recovery plan is always stronger than partial explanation.' },
        { id: 'd', text: 'Recommend to Mike that the meeting is postponed until you have 2 weeks of data to show the improvement trend.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -10, communication: -8 }, xp: 0, feedback: 'You cannot ask a Site Director to reschedule because you want more time. James has seen the OEE report - the meeting is happening. Arrive with the best data you have, be honest about what you know and do not know, and present a credible plan.' },
      ],
      xp_reward: 50, due_offset_mins: 45,
    },
    {
      id: 're_d3_002', day: 3, type: 'decision', urgency: 'high',
      title: 'Technician refuses to complete overdue PM - says "it\'s not my job"',
      description: `You ask Dave, one of your shift technicians, to complete the Conveyor 7 motor PM this afternoon. He says: "That's not my job. I'm electrical. That motor needs a mechanical. Get someone else."\n\nYou check Dave's training records. He IS multi-skilled certified for this motor type - he completed the training 8 months ago. He knows this.\n\nHow do you handle this?`,
      options: [
        { id: 'a', text: 'Speak to Dave privately. Acknowledge his concern, confirm his certification covers this task, and ask what is actually driving his reluctance. Listen first - then address it. If he still refuses without a valid safety reason, escalate to Mike with the training records.', quality: 'good', kpiImpact: { reliability: 8, decision_quality: 10, communication: 12 }, xp: 40, feedback: 'Excellent people management. Listening before concluding shows maturity. There may be a real concern (unfamiliarity, safety worry) behind the pushback. Addressing it directly and privately is more effective than a confrontation. Escalating with evidence if needed is the right backstop.' },
        { id: 'b', text: 'Tell Dave firmly that his training records show he is certified and he needs to complete the task.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 5, communication: -3 }, xp: 20, feedback: 'Technically correct but missing an opportunity. Dave may have a legitimate concern you have not heard yet. Leading with "your records say you can" without listening first can create resentment. The right outcome is the same - but the approach matters for the longer-term relationship.' },
        { id: 'c', text: 'Find another technician and say nothing to Dave.', quality: 'bad', kpiImpact: { reliability: -3, decision_quality: -8, communication: -8 }, xp: 0, feedback: 'Avoiding the issue creates a precedent - Dave now knows he can refuse tasks without consequence. This will happen again. As a maintenance lead, you need to address refusals directly and proportionately, not work around them.' },
        { id: 'd', text: 'Escalate immediately to Mike and let him deal with Dave.', quality: 'medium', kpiImpact: { reliability: 2, decision_quality: -2, communication: 3 }, xp: 15, feedback: 'Premature escalation. This is a routine people management situation that you should handle at your level first. Escalating every team disagreement to your manager signals a lack of confidence and puts unnecessary load on Mike. Try to resolve it yourself first.' },
      ],
      xp_reward: 40, due_offset_mins: 120,
    },
    {
      id: 're_d3_003', day: 3, type: 'decision', urgency: 'urgent',
      title: 'Compressor 2 oil leak has worsened - production line at risk',
      description: `The Compressor 2 oil leak you flagged on Monday has significantly worsened. The maintenance technician monitoring it reports the leak rate has tripled in 24 hours. Compressor 2 supplies air to the entire packaging line. If it fails, the packaging line stops - 1,200 units/hour, GBP5,800/hour loss.\n\nA compressor specialist is available but needs 4 hours to diagnose and repair. Current shift has 5 hours remaining. Stopping production now costs GBP5,800. Running on costs approximately GBP500 in risk per hour based on current leak rate.\n\nWhat do you recommend?`,
      options: [
        { id: 'a', text: 'Stop the packaging line now, bring in the specialist immediately. The risk profile has changed - a tripling leak rate is not linear, it signals accelerating degradation. The cost of a controlled stop (GBP5,800) is far less than an uncontrolled failure mid-run (GBP5,800 downtime + potential product loss + emergency repair premium).', quality: 'good', kpiImpact: { reliability: 12, decision_quality: 15, scope_control: 8 }, xp: 50, feedback: 'Correct risk assessment. "Tripling in 24 hours" is a classic exponential degradation signal - not a linear progression. The expected value calculation strongly favours a controlled stop now. This is the decision an experienced reliability engineer makes. Well done.' },
        { id: 'b', text: 'Continue running but increase monitoring frequency to every 30 minutes. Call the specialist but tell him to be on standby rather than come in immediately.', quality: 'medium', kpiImpact: { reliability: 3, decision_quality: -3 }, xp: 20, feedback: 'The monitoring instinct is right but the conclusion is wrong at this leak rate. Tripling in 24 hours means you could be at 9x the original rate tomorrow. Standby is not sufficient - you need the specialist on site and assessing now, not after another failure event.' },
        { id: 'c', text: 'Run until end of shift and do a full repair overnight when production is not running.', quality: 'bad', kpiImpact: { reliability: -10, decision_quality: -15 }, xp: 0, feedback: 'With a tripling leak rate, running 5 more hours is accepting a significant probability of catastrophic failure during production. An uncontrolled compressor failure mid-run causes maximum damage - to the equipment, the product on the line, and the production schedule. The risk does not justify it.' },
        { id: 'd', text: 'Inform Mike and let him make the call - this is above your authority level.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 5, communication: 8 }, xp: 25, feedback: 'Escalating to Mike is appropriate given the financial impact. But you should go to him with a recommendation, not just the problem. "Mike, here is the situation, here is my risk assessment, here is my recommendation - do you agree?" is far stronger than "what should I do?"' },
      ],
      xp_reward: 50, due_offset_mins: 30,
    },
    {
      id: 're_d3_004', day: 3, type: 'document', urgency: 'normal',
      title: 'Write a 30-day OEE recovery plan for Line 2',
      description: `Following the Site Director briefing, Mike has asked you to write a formal 30-day OEE recovery plan for Line 2. Target: return to 78% OEE by end of Month 1, 83% by end of Month 2.\n\nThe plan should include: specific actions, responsible parties, completion dates, and expected OEE impact of each action. The Site Director will review it.`,
      rubric: {
        criteria: [
          'Clear actions with specific owners and dates - not vague commitments',
          'Each action linked to a measurable OEE impact (availability, performance, or quality)',
          'Addresses the root causes identified this week, not just symptoms',
          'Realistic - the 78% target is achievable in 30 days',
          'Written for a Site Director - professional, data-led, no jargon',
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
      description: `At 10:15, the refrigeration plant alarm triggers. Your technician reports an ammonia smell near the compressor room. Ammonia is toxic - IDLH (Immediately Dangerous to Life and Health) is 300ppm. Current reading on the fixed detector: 45ppm and rising.\n\nThe refrigeration plant cools the entire production facility. Loss of cooling will halt all production lines within 2 hours and risk GBP180,000 of finished product in cold store.\n\nWhat is your immediate action?`,
      options: [
        { id: 'a', text: 'Immediately evacuate all personnel from the refrigeration plant area. Activate the site emergency response plan. Inform Mike and the site HSE manager immediately. Do not attempt to investigate or repair until the area is declared safe by a competent person with appropriate PPE. Production loss is secondary to life safety.', quality: 'good', kpiImpact: { reliability: 15, decision_quality: 20, communication: 10 }, xp: 60, feedback: 'This is the only correct answer. Ammonia at 45ppm and rising is an active safety emergency. No production consideration, however large, overrides the duty to protect people. Evacuate, escalate, contain. This response would be correct in any FMCG or industrial environment and demonstrates the judgement expected of a senior engineer.' },
        { id: 'b', text: 'Send in a technician with a gas monitor to locate the leak before deciding whether to evacuate.', quality: 'bad', kpiImpact: { reliability: -15, decision_quality: -20, communication: -10 }, xp: 0, feedback: 'Sending an unprotected person into a rising ammonia atmosphere is a serious safety violation. At 45ppm and rising you have no time to investigate before evacuating. This decision could result in fatalities and criminal prosecution under RIDDOR and PUWER. Evacuate first - always.' },
        { id: 'c', text: 'Isolate the refrigeration plant remotely if possible, ventilate the area, and continue monitoring. Evacuate only if the reading exceeds 150ppm.', quality: 'bad', kpiImpact: { reliability: -10, decision_quality: -15 }, xp: 0, feedback: 'The 150ppm threshold is dangerously wrong - STEL (Short Term Exposure Limit) for ammonia is 35ppm over 15 minutes. At 45ppm and rising, the area is already above safe exposure limits. Remote isolation is appropriate as one action, but evacuation must happen immediately - not as a contingency at a higher reading.' },
        { id: 'd', text: 'Evacuate the immediate area, isolate the refrigeration plant, and call Mike. Ask him whether to activate the full emergency response plan given the production implications.', quality: 'medium', kpiImpact: { reliability: 8, decision_quality: 5, communication: 5 }, xp: 25, feedback: 'Partial credit - evacuating is right. But waiting for Mike\'s permission to activate the emergency response plan is wrong. You have the authority and the duty to activate a safety emergency response without waiting for management approval. Act, then inform.' },
      ],
      xp_reward: 60, due_offset_mins: 5,
    },
    {
      id: 're_d4_002', day: 4, type: 'decision', urgency: 'high',
      title: 'Post-incident: manage production pressure while plant is safe',
      description: `The ammonia leak has been contained. The refrigeration specialist has isolated the faulty valve and the area has been ventilated to safe levels (below 25ppm). The plant has been down for 1.5 hours.\n\nDavid Okafor (Production Manager) calls you: "When can I have the refrigeration back? I have 30 minutes before the cold store temperature starts rising above product spec. I need an answer now."\n\nThe specialist tells you she needs another 45 minutes minimum to complete the repair and verify it is safe to recommission. What do you tell David?`,
      options: [
        { id: 'a', text: 'Tell David honestly: minimum 45 minutes, possibly longer. Give him the facts so he can make decisions about the cold store product. Offer to call him the moment you have a confirmed restart time. Do not give him a false 30-minute answer to reduce the pressure.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, communication: 12 }, xp: 40, feedback: 'This is professional integrity under pressure. David needs accurate information to protect the product - giving him a false "30 minutes" answer so he stops asking would cause him to miss the window to take protective action on the cold store. The truth, delivered clearly, is always the right answer.' },
        { id: 'b', text: 'Tell David "30 minutes" to stop the pressure, then update him when you know more.', quality: 'bad', kpiImpact: { reliability: -8, decision_quality: -12, communication: -10 }, xp: 0, feedback: 'This is a lie that could cause product loss. If David believes he has 30 minutes, he will not take protective action on the cold store during the window where he still can. When you then tell him it is actually 45+ minutes, he has lost decision time he cannot recover. Never give false ETAs under pressure.' },
        { id: 'c', text: 'Tell David you will update him in 15 minutes once you have a better picture from the specialist.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 5, communication: 5 }, xp: 20, feedback: 'Reasonable but not quite right. David has told you he has 30 minutes before product risk - he needs your best current estimate now, not in 15 minutes. "Minimum 45 minutes, I will update you if it changes" gives him the information he needs to act.' },
        { id: 'd', text: 'Tell David the safety repair takes as long as it takes and production pressure cannot influence safety decisions.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 8, communication: -5 }, xp: 20, feedback: 'The principle is right but the delivery is wrong. David is not asking you to rush a safety repair - he is asking for an ETA so he can protect his product. Being unnecessarily defensive damages the relationship. Give him the honest timeline and acknowledge his product concern.' },
      ],
      xp_reward: 40, due_offset_mins: 90,
    },
    {
      id: 're_d4_003', day: 4, type: 'report', urgency: 'high',
      title: 'Write the incident report - ammonia leak, Refrigeration Plant',
      description: `Mike has asked you to write the formal incident report for the ammonia leak. This will go to the Site Director and the HSE manager, and may be reportable under RIDDOR depending on exposure levels.\n\nThe report must cover: (1) incident description and timeline, (2) immediate response actions taken, (3) root cause, (4) injuries or exposures (none in this case), (5) corrective actions and preventive measures, (6) RIDDOR assessment.\n\nWrite professionally - this is a legal document.`,
      rubric: {
        criteria: [
          'Clear chronological timeline from detection to resolution',
          'Accurate description of the response - who did what and when',
          'Root cause identified (faulty valve - was it on the PM schedule?)',
          'Corrective actions are specific, owned, and time-bound',
          'RIDDOR assessment included - incident involved hazardous substance, assess whether reportable',
          'Professional legal-document language - factual, no speculation',
        ],
        scoring_notes: 'An incident report is a legal document. Vague language, missing timelines, or unsubstantiated root causes will not withstand regulatory scrutiny.',
      },
      xp_reward: 45, due_offset_mins: 180,
    },
    {
      id: 're_d4_004', day: 4, type: 'decision', urgency: 'normal',
      title: 'Capital expenditure request - condition monitoring system',
      description: `Following this week\'s events, Mike asks you to put together a case for investing in a wireless condition monitoring system for critical rotating equipment. The system costs GBP28,000 installed. It would monitor bearing temperature, vibration, and oil pressure in real time and alert the team before failures occur.\n\nEstimated benefit: prevent 2-3 unplanned failures per year at average cost of GBP12,000 each (downtime + parts + overtime). Payback period would be approximately 12-18 months.\n\nHow do you structure the business case?`,
      options: [
        { id: 'a', text: 'Structure it around this week\'s events as the concrete example, then build the financial case: GBP28k cost, 2-3 failures prevented per year at GBP12k each = GBP24-36k annual benefit, payback 9-14 months. Include OEE improvement (availability increase of ~1.5%), risk reduction on food safety assets, and reduced reactive maintenance labour. Present the numbers cleanly and let them make the decision.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, communication: 10 }, xp: 45, feedback: 'This is how capital investment cases are won. You anchored on a real, recent, quantified example, built a credible financial model, and included non-financial benefits (OEE, food safety, labour). The Site Director just lived through this week - he will be receptive. The numbers are credible and conservative.' },
        { id: 'b', text: 'Describe the technology and its features in detail, then mention the cost at the end.', quality: 'medium', kpiImpact: { reliability: 2, decision_quality: -3, communication: 3 }, xp: 15, feedback: 'Features do not win capital cases - financial return does. Lead with the problem, the cost of the problem, and how much the solution saves. The technology description is secondary. Finance and operations directors approve business cases, not technical spec sheets.' },
        { id: 'c', text: 'Request the full GBP28,000 as an emergency safety spend following the ammonia incident - do not build a financial case.', quality: 'medium', kpiImpact: { reliability: 3, decision_quality: 0, communication: -3 }, xp: 18, feedback: 'The ammonia incident and condition monitoring are different systems - conflating them undermines the credibility of both. A strong financial case with safety benefits built in is more compelling than an emergency spend request that does not stand up to scrutiny.' },
        { id: 'd', text: 'Ask Mike to make the business case - you do not have enough financial experience to do it.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -8, communication: -5 }, xp: 0, feedback: 'Mike asked you to prepare the case specifically because you have the operational knowledge and the week\'s data to make it credible. Declining develops neither you nor the case. You do not need financial expertise to quantify downtime costs and calculate a payback period - you need the operational data, which you have.' },
      ],
      xp_reward: 45, due_offset_mins: 300,
    },
  ],
  5: [
    {
      id: 're_d5_001', day: 5, type: 'document', urgency: 'high',
      title: 'Weekly performance report - present to Mike and David',
      description: `It is Friday. Mike has asked you to present a weekly performance summary at the 09:00 joint maintenance/production meeting. Attendees: Mike (Maintenance Manager), David Okafor (Production Manager), Sandra Mensah (QFS Manager).\n\nThis week's data:\n• OEE: 70% (target 78%)\n• Unplanned downtime: 8 hours across 4 events\n• PM compliance: 68% (target 95%)\n• MTBF: 142 hours (target 200 hours)\n• MTTR: 2.8 hours average (target 2.0 hours)\n\nWrite your presentation narrative - what happened, why, and what you are doing about it.`,
      rubric: {
        criteria: [
          'Opens with the key numbers honestly - no sugar-coating',
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
      title: 'Technician performance conversation - Dave\'s refusal to do PM',
      description: `Following Wednesday\'s incident where Dave refused to complete the Conveyor 7 PM, Mike has asked you to have a formal performance conversation with Dave and document it.\n\nDave is a good technician overall - 6 years on site, reliable attendance, technically strong. Wednesday\'s refusal was out of character. In your subsequent conversation he admitted he has not used his mechanical certification for 8 months and felt unconfident, but did not want to admit it.\n\nHow do you conduct this conversation?`,
      options: [
        { id: 'a', text: 'Acknowledge Dave\'s honesty in explaining the real reason. Address the refusal behaviour (which was wrong regardless of the reason) while also addressing the confidence gap constructively. Agree a development plan: supervised practice on the motor type, refresher training, and a review in 4 weeks. Document the conversation formally but frame it as a development record, not a disciplinary.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, communication: 15 }, xp: 50, feedback: 'This is mature people management. You are holding Dave accountable for the behaviour (the refusal) while addressing the underlying cause (confidence gap) constructively. A good technician who felt unable to admit a skill gap is recoverable - a punitive response would lose him. The development plan is specific and time-bound.' },
        { id: 'b', text: 'Issue a formal written warning for refusing a reasonable management instruction. This cannot be repeated.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -10, communication: -8 }, xp: 0, feedback: 'A formal warning without first understanding the cause is disproportionate and would likely fail an employment tribunal. Dave had a genuine safety concern (working beyond his current confidence on a task), even if he expressed it wrongly. Proportionate response, development plan, documented conversation - not a warning at this stage.' },
        { id: 'c', text: 'Accept Dave\'s explanation and move on - he was right to flag a competence concern, even if the way he did it was wrong.', quality: 'medium', kpiImpact: { reliability: 2, decision_quality: -3, communication: 2 }, xp: 15, feedback: 'Too lenient. The way Dave raised the concern - a flat refusal - was not acceptable even if the underlying concern had merit. Not addressing the behaviour creates a precedent. You can acknowledge his real concern while also being clear that the way to raise it is not a refusal.' },
        { id: 'd', text: 'Move Dave to a purely electrical role to avoid this situation arising again.', quality: 'bad', kpiImpact: { reliability: -3, decision_quality: -8, communication: -5 }, xp: 5, feedback: 'This is the most expensive option - you lose a multi-skilled resource, Dave loses development, and the team loses flexibility. And it does not address the behaviour. A targeted development plan to rebuild Dave\'s confidence on the specific task type is far more effective.' },
      ],
      xp_reward: 50, due_offset_mins: 120,
    },
    {
      id: 're_d5_003', day: 5, type: 'decision', urgency: 'normal',
      title: 'Plan next week - prioritise from a list of 12 demands',
      description: `It is Friday afternoon. You need to plan next week. You have the following demands on your team\'s time:\n\n1. Complete remaining PM backlog (estimated 16 hours)\n2. Compressor 2 full overhaul following this week\'s leak (8 hours, booked specialist)\n3. Condition monitoring system installation survey (2 hours)\n4. Line 3 efficiency project kickoff meeting (3 hours)\n5. Dave\'s supervised mechanical practice session (2 hours)\n6. HSE audit preparation (4 hours - audit is in 3 weeks)\n7. Weekly PMs that are due next week (10 hours)\n8. 3 reactive jobs from today\'s shift (6 hours)\n\nYou have 48 team hours available next week. Total demand: 51 hours. You are 3 hours short. What do you deprioritise and why?`,
      options: [
        { id: 'a', text: 'Protect: safety-critical items (Compressor 2 overhaul, weekly PMs, HSE prep), PM backlog (food safety risk), Dave\'s development session. Defer: Line 3 efficiency project meeting (reschedule to week after), condition monitoring survey (not time-critical). Use reactive capacity to absorb the 3 reactive jobs. Document the rationale for deferring Line 3.', quality: 'good', kpiImpact: { reliability: 12, decision_quality: 12, scope_control: 12 }, xp: 50, feedback: 'Excellent prioritisation. Safety and compliance come first. PM backlog remains urgent given this week\'s events. Dave\'s development session protects the team\'s capability. Line 3 efficiency is important but not urgent and can be rescheduled. You documented the deferral - which protects you if questioned.' },
        { id: 'b', text: 'Ask for 3 more hours of overtime to cover everything - no deferral needed.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: -2, scope_control: -5 }, xp: 20, feedback: 'Overtime to cover a 3-hour gap is not unreasonable, but doing this regularly without addressing underlying capacity signals a planning or resource problem. The better skill is to prioritise clearly and defer explicitly, then make a case for additional resource if the shortfall is structural.' },
        { id: 'c', text: 'Defer the PM backlog to week after next - the immediate risk has been addressed this week.', quality: 'bad', kpiImpact: { reliability: -10, decision_quality: -12, scope_control: -5 }, xp: 0, feedback: 'After this week\'s PM-related failures, deferring the PM backlog further is not defensible - particularly with Sandra (QFS) now watching PM compliance on CCPs. The PM backlog must remain a priority.' },
        { id: 'd', text: 'Complete the weekly PMs and reactive jobs only - defer everything else until capacity improves.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -8 }, xp: 0, feedback: 'Deferring the Compressor 2 overhaul and PM backlog after this week would be a serious misjudgement. "Wait until capacity improves" is not a plan - it is the absence of one. Prioritise explicitly with rationale.' },
      ],
      xp_reward: 50, due_offset_mins: 240,
    },
    {
      id: 're_d5_004', day: 5, type: 'document', urgency: 'normal',
      title: 'Write your personal learning reflection - Week 1',
      description: `This is the final task of Level 1. Praxis asks every user to complete a personal learning reflection at the end of their first simulation week.\n\nReflect on:\n1. The most significant decision you made this week and what you learned from it\n2. One thing you would do differently if you could repeat the week\n3. The skill or behaviour you want to develop most in Level 2\n4. How your performance this week compares to where you want to be in your career\n\nBe honest. This reflection is for you - it becomes part of your Praxis performance portfolio.`,
      rubric: {
        criteria: [
          'Specific - references actual decisions and events from the week, not generic statements',
          'Honest - identifies genuine areas for development, not just strengths',
          'Forward-looking - the Level 2 development goal is concrete and specific',
          'Shows self-awareness - the gap between current performance and career ambition is acknowledged',
          'Authentic - this should read like a person thinking, not a performance review template',
        ],
        scoring_notes: 'The quality of this reflection is a strong predictor of professional development velocity. Generic, positive, self-congratulatory reflections score low. Specific, honest, growth-oriented reflections score high.',
      },
      xp_reward: 35, due_offset_mins: 480,
    },
  ],
}

// ══════════════════════════════════════════════════════════════
// DATA ENGINEERING - Days 2-5
// ══════════════════════════════════════════════════════════════
export const DE_DAYS: Record<TaskDay, SimTask[]> = {
  2: [
    {
      id: 'de_d2_001', day: 2, type: 'decision', urgency: 'urgent',
      title: 'Pipeline failure root cause - present to James',
      description: `James (your manager) wants a root cause analysis of yesterday\'s pipeline failure before the 09:30 standup. Your investigation shows: (1) The schema change was made by the DevOps team at 11pm without following the change control process. (2) The pipeline has no schema validation checks. (3) The monitoring alert fired 47 minutes after the failure - too slow. (4) The data team has no alerting SLA. What is your root cause and recommendation?`,
      options: [
        { id: 'a', text: 'Root cause: absence of schema validation in the pipeline and no enforced change control process for schema modifications. Recommend: (1) Add schema validation checks to all critical pipelines, (2) Require data team sign-off on any schema changes to monitored tables, (3) Reduce alert response time to under 10 minutes. Present with the data.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, communication: 8 }, xp: 45, feedback: 'Strong RCA. You identified systemic failures (no validation, no process) rather than blaming the DevOps team. The recommendations are specific and preventive. This is the quality of analysis that builds credibility with engineering managers.' },
        { id: 'b', text: 'Root cause: the DevOps team did not follow process. Recommend they are required to notify data engineering before any schema changes.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: -2, communication: 3 }, xp: 20, feedback: 'Partly right but single-causal. The DevOps process failure is a contributing cause, but the pipeline\'s lack of schema validation means any schema change would have caused the same failure. Fixing only the process leaves the technical vulnerability in place.' },
        { id: 'c', text: 'Root cause: monitoring was too slow. Focus on reducing alert response time.', quality: 'medium', kpiImpact: { reliability: 3, decision_quality: -3 }, xp: 15, feedback: 'Monitoring improvement is valuable but this treats the symptom, not the cause. Faster alerts would have caught the failure sooner but would not have prevented it. The root cause is the unvalidated schema change hitting an unprotected pipeline.' },
        { id: 'd', text: 'You need more time to investigate - ask James to defer the presentation.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -8 }, xp: 0, feedback: 'You have sufficient data to present an initial RCA with appropriate caveats. Deferring when James has specifically asked for a morning update signals a lack of confidence. Present what you know, be clear about what is still being investigated.' },
      ],
      xp_reward: 45, due_offset_mins: 30,
    },
    {
      id: 'de_d2_002', day: 2, type: 'decision', urgency: 'high',
      title: 'Marcus wants to add 2 new data sources to the pipeline - this sprint',
      description: `Marcus emails: "Hey! Priya loved the sales dashboard. She\'s asking if we can add two new data sources - Salesforce CRM and the new marketing platform. She wants to see them in next week\'s report. Can we do it? I told her probably yes!"\n\nYou check: adding two new data sources requires schema design, extraction logic, transformation, testing, and monitoring - minimum 3 days of engineering work. You have 1.5 days of sprint capacity remaining. Sarah (Lead Dev) has flagged the pipeline still has outstanding tech debt from last week\'s failure.\n\nHow do you respond?`,
      options: [
        { id: 'a', text: 'Reply to Marcus directly: "Marcus, I appreciate Priya\'s enthusiasm and we want to deliver this. Adding two new data sources properly takes 3 days minimum - we have 1.5 days of sprint capacity. I can commit to one source (Salesforce, higher priority) for next week\'s report, and deliver the marketing platform the week after. Can you let Priya know and confirm which source to prioritise?" Copy James.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, scope_control: 15, communication: 10 }, xp: 45, feedback: 'Excellent scope management. You acknowledged the request, gave a specific capacity-based reason, proposed a realistic alternative, asked Marcus to confirm priority, and kept James informed. This is professional engineering communication - not a flat refusal, not a dangerous "yes".' },
        { id: 'b', text: 'Tell Marcus yes, you will do both - work overtime to fit them in.', quality: 'bad', kpiImpact: { reliability: -10, decision_quality: -12, scope_control: -15 }, xp: 0, feedback: 'Committing to rush two data integrations while carrying tech debt from last week\'s failure is exactly how pipeline failures recur. Overtime does not create good engineering - it creates tired engineers making mistakes on complex work.' },
        { id: 'c', text: 'Forward to James and let him decide.', quality: 'medium', kpiImpact: { reliability: 2, decision_quality: -2, communication: 3 }, xp: 15, feedback: 'Escalating to James is appropriate as an FYI, but you should have a recommendation ready. This is within your scope to manage - you know the capacity, the tech debt risk, and what is deliverable. Give James your assessment and proposed response.' },
        { id: 'd', text: 'Tell Marcus both data sources will be ready next week and figure out how to deliver it internally.', quality: 'bad', kpiImpact: { reliability: -5, decision_quality: -10, scope_control: -12, communication: -5 }, xp: 0, feedback: 'Promising Priya a delivery you do not have capacity to make properly - especially while carrying pipeline tech debt - is setting up a quality failure. When the integration breaks in production next week, the trust damage is far greater than the disappointment of a realistic timeline now.' },
      ],
      xp_reward: 45, due_offset_mins: 60,
    },
    {
      id: 'de_d2_003', day: 2, type: 'email_reply', urgency: 'urgent',
      title: 'Priya Shah wants to know when her data will be reliable',
      description: `From: Priya Shah (Client - Vantage Corp)\nTo: You (cc: James, Marcus)\nSubject: Data reliability - when can I trust the reports?\n\nFollowing yesterday\'s missing report and the issues last week, I need to understand: can I rely on your data for our board presentation next Thursday? I am presenting revenue analysis to our board and if the numbers are wrong the consequences are serious.\n\nI need a straight answer - is the data reliable and what are you doing to ensure it stays that way?\n\nPriya`,
      rubric: {
        criteria: [
          'Gives Priya a straight answer - yes or qualified yes, with specific conditions',
          'Explains what caused the issue and what has been fixed (without technical jargon)',
          'States specifically what checks are in place for next Thursday\'s report',
          'Does not overpromise - if there is residual risk, acknowledge it honestly',
          'Professional and confident in tone - Priya needs to trust you, not worry more',
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
          'Specific response times - not vague ("promptly") but measurable ("within 15 minutes")',
          'Escalation path is clear: who gets notified at what tier and after what time',
          'Measurement methodology - how will compliance be tracked?',
          'Realistic - the SLA must be achievable by the current team',
        ],
        scoring_notes: 'An SLA with unmeasurable commitments or unrealistic response times will not be followed. Specificity and realism are the two markers of a good SLA.',
      },
      xp_reward: 30, due_offset_mins: 240,
    },
  ],
  3: [
    {
      id: 'de_d3_001', day: 3, type: 'decision', urgency: 'urgent',
      title: 'Data quality issue - Q3 revenue figures are wrong',
      description: `Sarah flags an issue at 08:45: the Q3 revenue figures in the Priya dashboard are overstated by 12% due to a duplicate transaction issue in the Salesforce extraction logic. Priya is presenting these numbers to her board next Thursday - 8 days away.\n\nThe fix takes approximately 4 hours of engineering work plus reprocessing. The corrected figures will show Q3 revenue 12% lower than currently displayed. James is in back-to-back meetings until 11:00.\n\nWhat do you do right now?`,
      options: [
        { id: 'a', text: 'Start the fix immediately - 4 hours means you can have correct data by end of day. Send Priya and Marcus a brief, factual email now: "We have identified a data quality issue in Q3 revenue - figures are currently overstated by ~12%. We are fixing this today. Corrected numbers will be available by 17:00. I will confirm when the fix is deployed." Leave James a message flagging the issue and your action.', quality: 'good', kpiImpact: { reliability: 12, decision_quality: 15, communication: 12 }, xp: 50, feedback: 'This is the right call. Act immediately on the fix (you have the authority and the urgency). Inform Priya immediately so she can factor this into her board prep - she has 8 days, which is enough time if she knows now but not enough if she finds out on Wednesday. Leaving James a message keeps him informed without requiring his input to proceed.' },
        { id: 'b', text: 'Wait for James to finish his meetings at 11:00 before doing anything - this is a client-facing issue and needs his sign-off.', quality: 'bad', kpiImpact: { reliability: -8, decision_quality: -10, communication: -5 }, xp: 0, feedback: 'Waiting 2+ hours when Priya has a board presentation in 8 days and her data is wrong is not acceptable. The fix is clear, within your capability, and time-sensitive. Inform James via message and proceed. Waiting for sign-off when the right action is obvious costs Priya decision time she cannot recover.' },
        { id: 'c', text: 'Fix the data quietly and update the dashboard without telling Priya about the error.', quality: 'bad', kpiImpact: { reliability: 5, decision_quality: -15, communication: -15 }, xp: 0, feedback: 'This is a serious professional ethics failure. Priya may have already shared draft numbers with her board. If she presents corrected numbers without context, her board will be confused. She deserves to know what happened so she can manage her own narrative. Hiding data errors from clients destroys trust when discovered - and they are always discovered.' },
        { id: 'd', text: 'Tell Priya and Marcus about the issue but wait for James before starting the fix.', quality: 'medium', kpiImpact: { reliability: 3, decision_quality: -2, communication: 8 }, xp: 20, feedback: 'Telling Priya immediately is right. But waiting for James before starting a fix you clearly have the competence and authority to make is unnecessarily slow. Start the fix, inform James via message. You do not need permission to do your job when the action is clear and urgent.' },
      ],
      xp_reward: 50, due_offset_mins: 20,
    },
    {
      id: 'de_d3_002', day: 3, type: 'decision', urgency: 'high',
      title: 'James wants you to cut corners on testing to meet Friday deadline',
      description: `James pulls you aside at 11:30: "Look, Priya's board presentation is Thursday. We need the Salesforce integration live by Wednesday so she can review. I know it\'s only 1.5 days of capacity but I need you to get it done. Skip the full test cycle if you need to - just do smoke tests and push it to production."\n\nYou know from experience that the Salesforce API has edge cases that only appear in full integration testing. Skipping full tests risks pushing bad data to Priya\'s board report.`,
      options: [
        { id: 'a', text: 'Push back professionally: "James, I understand the deadline pressure. The risk I\'m concerned about is that Salesforce has API edge cases we\'ve seen before - if those hit production untested, Priya gets bad data for her board. I can do accelerated testing covering the highest-risk scenarios in half the normal time, and deliver Wednesday morning. That gives Priya Wednesday afternoon to review. Is that workable?" Then document the risk in writing.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 12, scope_control: 12, communication: 10 }, xp: 50, feedback: 'This is professional integrity. You pushed back with a specific, technical reason (not "that\'s not how we do it"), proposed a concrete compromise (accelerated testing), preserved the client\'s review window, and documented the risk. If James overrides you after this, you are protected. If he accepts, you delivered the best outcome.' },
        { id: 'b', text: 'Agree to James\'s request - he is your manager and he understands the business risk.', quality: 'bad', kpiImpact: { reliability: -8, decision_quality: -12, scope_control: -10 }, xp: 0, feedback: 'Manager authority does not override professional judgement on technical risk. If Priya\'s board presentation contains wrong Salesforce data because you skipped testing, the reputational damage falls on you as well as James. You have a professional obligation to raise the risk clearly before complying.' },
        { id: 'c', text: 'Do smoke tests only as James asked, but add extra monitoring in production to catch issues quickly.', quality: 'medium', kpiImpact: { reliability: 3, decision_quality: -3, scope_control: -5 }, xp: 20, feedback: 'The monitoring instinct is good, but production monitoring catches failures after they happen - when Priya may already have wrong data. The issue is preventing bad data from reaching a board presentation, not detecting it afterwards. Push back on the test scope before complying.' },
        { id: 'd', text: 'Agree to James but go to his manager if he insists - this is a quality issue that needs escalation.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 5, communication: -5 }, xp: 20, feedback: 'Going over James\'s head before exhausting the direct conversation is too aggressive for this situation. Have the full conversation with James first - propose the accelerated testing compromise and document the risk. Escalate only if he explicitly overrides your professional concern after hearing it.' },
      ],
      xp_reward: 50, due_offset_mins: 120,
    },
    {
      id: 'de_d3_003', day: 3, type: 'email_reply', urgency: 'normal',
      title: 'Sarah escalates - she found a second data quality issue',
      description: `From: Sarah Edwards (Lead Developer)\nTo: You\nSubject: FYI - found another one\n\nWas reviewing the Q3 fix and noticed the marketing spend data also has a currency conversion issue - UK spends are being converted at last month\'s rate, not current. Impact is small (~2%) but it\'s wrong.\n\nDo you want me to fix it now or queue it for next sprint? Also, should we tell Priya?\n\nSarah`,
      rubric: {
        criteria: [
          'Gives Sarah a clear decision - fix now or queue - with a reason',
          'Addresses the Priya question directly - yes, tell her, with the framing',
          'Considers whether the 2% error is material for a board presentation (it is - state why)',
          'Pragmatic and decisive - Sarah does not want a long deliberation, she wants a call',
          'Acknowledges Sarah\'s good catch and the pattern it reveals',
        ],
        scoring_notes: 'A 2% currency error on a board presentation is material. The instinct to queue it because it is "small" is wrong. Sarah needs a decision, not a committee.',
      },
      xp_reward: 30, due_offset_mins: 90,
    },
    {
      id: 'de_d3_004', day: 3, type: 'document', urgency: 'normal',
      title: 'Write a data quality incident log template',
      description: `Following this week\'s data quality issues, James has asked you to create a standard incident log template that the team uses every time a data quality issue is identified. This creates an audit trail and enables pattern analysis.\n\nThe template should capture: what was wrong, when it was identified, who identified it, root cause, impact on downstream consumers, fix applied, and preventive measures taken. It should be quick to complete - not a bureaucratic burden.`,
      rubric: {
        criteria: [
          'Covers all required fields without being burdensome',
          'Includes a severity rating with clear criteria',
          'Has a "downstream impact" section - who might have used the bad data?',
          'Simple enough to complete in 10-15 minutes',
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
      title: 'CRISIS: Production database accidentally deleted - partial data loss',
      description: `At 14:00 Sarah messages in a panic: "I accidentally ran a DELETE query on the production database without a WHERE clause. Approximately 30% of the transactions table from the last 6 months is gone. I have a backup from 3 days ago. James is presenting a revenue analysis to the board in 90 minutes that uses this table."\n\nYou have: a 3-day-old backup (missing 3 days of transactions), query logs that may allow partial reconstruction, and 90 minutes.\n\nWhat is your immediate response?`,
      options: [
        { id: 'a', text: 'Immediately: (1) Tell Sarah to stop all writes to the affected table NOW to prevent further data loss. (2) Tell James immediately - he cannot present revenue analysis from a corrupted table, he needs to know now not in 88 minutes. (3) Start assessing what can be reconstructed from query logs while Sarah prepares the backup restore. (4) Do not try to hide or fix before telling James - 90 minutes is not enough to guarantee a full fix and he needs to make an informed decision about his presentation.', quality: 'good', kpiImpact: { reliability: 10, decision_quality: 15, communication: 15 }, xp: 60, feedback: 'This is crisis management done correctly. Stop the bleeding first (halt writes). Inform the person who will be most impacted immediately - James presenting wrong revenue to a board is a reputational catastrophe you have 90 minutes to prevent. Assess recovery options in parallel. Transparency under pressure is the mark of a senior engineer.' },
        { id: 'b', text: 'Spend 90 minutes attempting to restore from backup and reconstruct missing data. Tell James only if you cannot fix it in time.', quality: 'bad', kpiImpact: { reliability: -10, decision_quality: -15, communication: -15 }, xp: 0, feedback: 'This is the worst possible approach. You are gambling James\'s board presentation on a recovery you are not certain you can complete in 90 minutes. If you fail at 89 minutes, James has no time to adapt. Tell him immediately so he can decide whether to delay, use caveated data, or present without the revenue analysis. Information is his to act on - not yours to withhold.' },
        { id: 'c', text: 'Tell James immediately and recommend he postpones his presentation. Start the restore in parallel.', quality: 'medium', kpiImpact: { reliability: 8, decision_quality: 8, communication: 10 }, xp: 35, feedback: 'Good on informing James immediately. Recommending postponement is reasonable but the decision is his - present him with the options (postpone, present with caveated data, present without the revenue section) and the likely recovery timeline. Give him options, not just a recommendation to delay.' },
        { id: 'd', text: 'Restore from the 3-day backup immediately and do not mention the data loss - the difference will be minimal.', quality: 'bad', kpiImpact: { reliability: -15, decision_quality: -20, communication: -15 }, xp: 0, feedback: 'Presenting board-level revenue analysis from data you know is 3 days stale after a deletion event - without disclosure - is a serious professional ethics failure. "The difference will be minimal" is an assumption you cannot verify in 90 minutes. This is not a recoverable situation if discovered.' },
      ],
      xp_reward: 60, due_offset_mins: 10,
    },
    {
      id: 'de_d4_002', day: 4, type: 'decision', urgency: 'high',
      title: 'Post-incident: Sarah is distraught - how do you support her?',
      description: `The data recovery went well - you reconstructed 95% of the missing data from query logs and James was able to present with appropriate caveats. Crisis averted.\n\nSarah sends you a message: "I\'m so sorry. I can\'t believe I did that. I\'ve been doing this for 7 years and I ran a DELETE without a WHERE. I feel sick. James is going to fire me."\n\nHow do you respond to Sarah?`,
      options: [
        { id: 'a', text: 'Respond warmly but honestly: "Sarah, you caught it, you told me immediately, and we fixed it together. That\'s what a good engineer does. The real issue is that production databases should require a transaction confirmation before DELETE queries - that\'s a system design gap, not a personal failure. I\'m going to recommend we add that control. You\'re not getting fired." Then follow through on the system recommendation.', quality: 'good', kpiImpact: { reliability: 5, decision_quality: 10, communication: 15 }, xp: 40, feedback: 'Outstanding response. You acknowledged Sarah\'s feelings, reframed the event accurately (she caught it and escalated - that\'s the right behaviour), identified the real systemic gap (no production safeguards), and committed to act on it. And you followed through by actually recommending the safeguard. This is how good technical leaders build trust.' },
        { id: 'b', text: 'Tell Sarah that mistakes happen and she should not worry about it. James will not fire her.', quality: 'medium', kpiImpact: { reliability: 2, decision_quality: -2, communication: 5 }, xp: 18, feedback: 'Reassuring but incomplete. The best response addresses both the emotional reality and the systemic root cause. "Mistakes happen" without identifying the design gap that allowed the mistake to have this impact misses the learning opportunity and the preventive action.' },
        { id: 'c', text: 'Tell Sarah this cannot happen again and she needs to be more careful in future.', quality: 'bad', kpiImpact: { reliability: 0, decision_quality: -8, communication: -10 }, xp: 0, feedback: '"Be more careful" is not a preventive measure - it is a blame statement. Sarah was not careless; she made a human error in a system that had no safeguards against it. The right response is to fix the system. Blaming individuals for system design failures creates a culture where people hide mistakes rather than reporting them.' },
        { id: 'd', text: 'Forward Sarah\'s message to James with context - he should know what happened directly from the team.', quality: 'bad', kpiImpact: { reliability: 0, decision_quality: -10, communication: -15 }, xp: 0, feedback: 'Forwarding a private distress message from a colleague to their manager without consent is a serious breach of trust. James already knows what happened - you told him. Sarah\'s emotional message to you was not intended for her manager. This would permanently damage your relationship with Sarah.' },
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
          'Approval process is realistic - not so bureaucratic it gets circumvented',
          'Audit logging is specific about what is logged and how long retained',
          'Written for both technical and non-technical readers',
        ],
        scoring_notes: 'A good access control policy is one that is actually followed. If the safeguards are so cumbersome that engineers work around them, the policy has failed before it is implemented.',
      },
      xp_reward: 40, due_offset_mins: 300,
    },
    {
      id: 'de_d4_004', day: 4, type: 'decision', urgency: 'normal',
      title: 'Priya wants real-time data - is it the right solution?',
      description: `Marcus emails: "Great news! Priya loved the dashboard and she wants to take it further. She wants real-time data updates every 15 minutes instead of daily. She says her competitors have real-time dashboards and she needs to keep up. Can we do it?"\n\nReal-time (15-minute) refresh would require: streaming architecture, significant infrastructure cost increase (~GBP3,200/month), 6-8 weeks of engineering. Current daily refresh meets all of Priya\'s stated reporting needs. You suspect the real-time request is driven by perception, not actual use case.`,
      options: [
        { id: 'a', text: 'Before committing to the technical scope, have a discovery conversation with Marcus and Priya: "Before we scope the engineering, I want to make sure we\'re solving the right problem. Can you walk me through a specific scenario where 15-minute refresh changes a decision you\'d make? Daily refresh works well for strategic reporting - real-time is better for operational decisions." If they have a genuine real-time use case, build it. If not, propose a 4-hour refresh as a low-cost compromise.', quality: 'good', kpiImpact: { reliability: 8, decision_quality: 15, scope_control: 12, communication: 10 }, xp: 50, feedback: 'Excellent. You applied the most important engineering principle: understand the real problem before designing the solution. "Competitors have real-time" is not a use case. If Priya cannot name a specific decision that requires 15-minute data, the GBP3,200/month infrastructure investment is waste. The 4-hour compromise is clever - it may satisfy the perception gap at a fraction of the cost.' },
        { id: 'b', text: 'Scope and build the real-time solution - the client is asking for it and that is the business requirement.', quality: 'bad', kpiImpact: { reliability: 3, decision_quality: -8, scope_control: -10 }, xp: 5, feedback: 'Building a GBP3,200/month real-time infrastructure for a reporting dashboard where the client cannot articulate a real-time use case is engineering waste. Good data engineers question requirements before building - not after. "The client asked for it" is not sufficient justification for significant infrastructure investment.' },
        { id: 'c', text: 'Tell Marcus the current daily refresh is sufficient and decline the real-time request.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 3, scope_control: 8, communication: -3 }, xp: 20, feedback: 'Declining without understanding the use case is as premature as saying yes without understanding it. There might be a genuine real-time need. The right first step is a discovery conversation.' },
        { id: 'd', text: 'Build a 4-hour refresh as a compromise without consulting Priya - it is technically simpler and probably good enough.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 5, scope_control: 5, communication: -5 }, xp: 22, feedback: 'The 4-hour compromise might be the right technical answer, but implementing it without a conversation means Priya does not feel heard and may push for the real-time version anyway. Have the conversation first - then propose the compromise with the reasoning.' },
      ],
      xp_reward: 50, due_offset_mins: 180,
    },
  ],
  5: [
    {
      id: 'de_d5_001', day: 5, type: 'report', urgency: 'high',
      title: 'Weekly engineering summary - present to James',
      description: `Friday morning. James wants a weekly engineering summary covering: pipeline reliability metrics, data quality incidents, capacity vs demand, and next week\'s priorities. This goes into the engineering team\'s weekly report to the CTO.\n\nThis week\'s data: Pipeline uptime 94% (target 99%). 3 data quality incidents (2 resolved, 1 in progress). Sprint capacity utilised 110% (ran over). 2 client escalations (both resolved). Next week: Salesforce integration delivery, database access policy implementation, monitoring SLA rollout.`,
      rubric: {
        criteria: [
          'Honest on the metrics - 94% uptime and 110% capacity utilisation are both misses',
          'Explains the incidents without excessive detail - CTO-level summary',
          'Next week priorities are specific and sequenced',
          'Professional tone - this is a leadership-facing document',
          'Ends with a clear picture of team health and any resource concerns',
        ],
        scoring_notes: 'CTO-level summaries should be readable in 3 minutes. Every sentence should earn its place.',
      },
      xp_reward: 40, due_offset_mins: 90,
    },
    {
      id: 'de_d5_002', day: 5, type: 'decision', urgency: 'normal',
      title: 'James offers you a lead data engineer role - do you take it?',
      description: `James pulls you aside: "You\'ve had a hell of a week - handled it well. I\'ve been talking to the CTO and we want to offer you the Lead Data Engineer role. It means owning the team\'s technical direction, line managing Sarah and two others, and being the point of escalation for all data quality issues. 20% pay increase. What do you think?"\n\nYou value deep technical work. The lead role means more management and less coding. You are not sure you are ready for the people management responsibility - this week showed you that.`,
      options: [
        { id: 'a', text: 'Ask for a week to consider seriously, then accept with a specific development conversation: "James, I want to take this - I\'m genuinely interested. I\'d like a week to think through the people management side because that\'s the area I want to develop intentionally. Can we agree on what support looks like in the first 90 days? I want to get this right, not just say yes."', quality: 'good', kpiImpact: { reliability: 8, decision_quality: 12, communication: 10 }, xp: 45, feedback: 'This shows maturity. You are interested but self-aware enough to ask for time and support rather than either reflexively accepting or declining. Naming the specific development area (people management) and asking for structured support in the first 90 days shows exactly the kind of intentional leadership James is offering this role to.' },
        { id: 'b', text: 'Accept immediately - this is a great opportunity and you should not turn it down.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 3, communication: 5 }, xp: 25, feedback: 'Enthusiasm is good but an immediate yes without reflection on the role change and your development needs is not the strongest response. James will be more confident in you if you demonstrate self-awareness about what the role requires and what you need to succeed in it.' },
        { id: 'c', text: 'Decline - you are not ready for people management and prefer to stay in a technical individual contributor role.', quality: 'medium', kpiImpact: { reliability: 5, decision_quality: 5, communication: 5 }, xp: 25, feedback: 'A legitimate choice, but one worth sitting with. "I\'m not ready" is different from "I don\'t want this career direction." If it is the former, the right conversation is about what support would make you ready, not a flat decline.' },
        { id: 'd', text: 'Accept and tell James you are fully ready - showing confidence is important at this moment.', quality: 'bad', kpiImpact: { reliability: 3, decision_quality: -5, communication: -3 }, xp: 10, feedback: 'Performing confidence you do not feel is not the same as having it - and experienced managers can usually tell the difference. James has watched you all week. An honest answer ("I want this and I want to do it properly - can we talk about the first 90 days?") is more impressive than a confident bluff.' },
      ],
      xp_reward: 45, due_offset_mins: 180,
    },
    {
      id: 'de_d5_003', day: 5, type: 'email_reply', urgency: 'normal',
      title: 'Priya sends a positive review - respond professionally',
      description: `From: Priya Shah (Client - Vantage Corp)\nTo: You, James\nSubject: Thank you - board presentation went well\n\nI wanted to let you know that the board presentation went really well yesterday. The revenue analysis was clear and credible. Despite the issues earlier in the week, your team handled the data quality problems quickly and transparently, which I appreciate. The board approved the budget proposal based on the analysis.\n\nI would like to discuss expanding the dashboard scope when you have time.\n\nWith thanks,\nPriya`,
      rubric: {
        criteria: [
          'Responds warmly but professionally - this is a client relationship',
          'Acknowledges the team, not just yourself',
          'Picks up the thread about expanding scope appropriately - expresses interest without over-committing',
          'Proposes a specific next step for the scoping conversation',
          'Concise - Priya is a senior executive, not a long email reader',
        ],
        scoring_notes: 'Client relationship emails after a successful outcome set the tone for the next conversation. Warm, professional, and forward-looking.',
      },
      xp_reward: 30, due_offset_mins: 120,
    },
    {
      id: 'de_d5_004', day: 5, type: 'document', urgency: 'normal',
      title: 'Personal learning reflection - Week 1',
      description: `Final task of Level 1. Write your personal learning reflection:\n\n1. The most significant decision you made this week and what you learned from it\n2. One thing you would do differently if you could repeat the week\n3. The skill or behaviour you want to develop most in Level 2\n4. How your performance this week compares to where you want to be in your career\n\nBe specific and honest. This becomes part of your verified Praxis portfolio.`,
      rubric: {
        criteria: [
          'References specific events from the week - not generic statements',
          'Honest about both strengths and development areas',
          'Level 2 development goal is concrete and specific',
          'Shows awareness of the gap between current performance and career ambition',
          'Authentic - reads like genuine reflection, not a performance review',
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
    case 'project_management':      return PJ_DAYS[day] ?? []
    case 'product_management':      return PM_DAYS[day] ?? []
    case 'digital_marketing':       return DM_DAYS[day] ?? []
    case 'financial_analysis':      return FA_DAYS[day] ?? []
    default: return []
  }
}

// Morning briefings for Days 2-5
export const DAILY_BRIEFINGS: Record<string, Record<TaskDay, { subject: string; body: string }>> = {
  reliability_engineering: {
    2: {
      subject: 'Day 2 - RCA presentation at 09:00, PM backlog is critical',
      body: `Morning,\n\nBig day. James Clarke (Site Director) is going to see the OEE drop - we need to be ready.\n\n1. RCA for Conveyor 3 at 09:00 - I need you to present your findings. Have the data ready. Root cause, what was missed, what we are doing about it.\n\n2. The PM audit you ran yesterday flagged Pasteuriser 2 as 4 weeks overdue. That is a CCP. Sandra knows. Deal with it today - it is not optional.\n\n3. Sandra will contact you directly about Pasteuriser 2. Be transparent with her - she has the authority to halt production and she will use it if she has to.\n\nGood shift.\n\nMK`,
    },
    3: {
      subject: 'Day 3 - OEE briefing with James at 14:00, Compressor 2 needs watching',
      body: `Morning,\n\nJames Clarke has seen the weekly OEE numbers. He wants a briefing at 14:00 and I need you with me.\n\nPrepare: OEE breakdown, root cause of each downtime event this week, what we have fixed, and a 30-day recovery plan. James is reasonable but he needs to see a credible plan, not excuses.\n\nCompressor 2 - the oil leak is being monitored. If the rate changes, you have my authority to stop the line. Do not wait for my sign-off if it becomes a safety call.\n\nDave situation - handle it today. Have a conversation with him. I trust you to manage it professionally.\n\nMK`,
    },
    4: {
      subject: 'Day 4 - Safety emergency protocols in effect, no production pressure overrides safety',
      body: `Morning,\n\nAll routine priorities are secondary today after yesterday's events.\n\n1. Ammonia incident report is due to me and Sandra by end of day. This may be RIDDOR reportable - treat it as such until confirmed otherwise.\n\n2. The refrigeration specialist is on site at 08:00 for the full compressor overhaul. Give her full access and cooperation.\n\n3. David will be chasing on production timelines. Be honest with him about ETAs. Do not give him a number you cannot stand behind.\n\n4. Capex case for condition monitoring - get me a draft by end of week. This week has made the case for us.\n\nMK`,
    },
    5: {
      subject: 'Day 5 - End of week, OEE review at 09:00, close out the week',
      body: `Morning,\n\nEnd of your first simulation week. A lot happened.\n\nWeekly performance review is at 09:00 with David and Sandra. Own the numbers - good and bad.\n\nDave performance conversation today. Document it properly.\n\nNext week plan - I need your prioritised task list by end of today. We are still in recovery mode on OEE. Do not overload the plan.\n\nWell done this week. Some difficult calls - mostly made well.\n\nMK`,
    },
  },
  data_engineering: {
    2: {
      subject: 'Day 2 - RCA at 09:30, scope creep from Marcus, Priya is watching',
      body: `Morning,\n\nYesterday's pipeline failure is now a visibility issue - Priya noticed the missing report and she's not happy.\n\n1. RCA at 09:30 standup. Have your findings ready. I want root cause and recommendations, not just a timeline of what happened.\n\n2. Marcus has apparently promised Priya more data sources. He has copied me in. Deal with it directly with him - I do not need to be in the middle of every scope conversation.\n\n3. Priya is going to contact you directly. She has a board presentation next Thursday. She needs confidence from you, not from me.\n\nJH`,
    },
    3: {
      subject: 'Day 3 - Data quality issue is critical, Salesforce deadline pressure',
      body: `Morning,\n\nTwo things need your attention before anything else:\n\n1. The revenue figures - Sarah flagged an issue last night. If this is what I think it is, Priya needs to know immediately. Do not sit on it.\n\n2. Salesforce integration - I need a realistic delivery date. I will be talking to Marcus this morning and I need a number I can stand behind. Not a number that gets you through the meeting.\n\nThe testing conversation we need to have - I will not pretend the deadline pressure is not real. But I need your professional view on what is safe to deliver by Wednesday. Come to me with a proposal.\n\nJH`,
    },
    4: {
      subject: 'Day 4 - Database incident: priority one is James\'s presentation, then the fix',
      body: `Team,\n\nI am aware of the database deletion. We are handling it.\n\nFor anyone who has not been told yet: we had a deletion event on the transactions table this afternoon. Recovery is underway. My presentation has been adjusted.\n\nSarah: I know. We will talk properly once the immediate situation is stable. This is not a firing offence - it is a system design problem that we are now going to fix.\n\nPriorities today: recovery first, then the access control policy. I need a draft by end of week.\n\nJH`,
    },
    5: {
      subject: 'Day 5 - Good week overall. Weekly summary for CTO, then a conversation.',
      body: `Morning,\n\nDespite everything, Priya's board presentation went well. That matters.\n\nWeekly summary for the CTO is due today - I need it from you by 14:00.\n\nI want to have a conversation with you this afternoon. Nothing bad - I have been talking to the CTO about the team structure and I want your view on where you want to take your career here.\n\nJH`,
    },
  },
  project_management: {
    2: {
      subject: 'Day 2 - Scope change decision needed, Tom is back tomorrow',
      body: `Morning,\n\nTwo things need resolving today:\n\n1. The change control document for the client scope request needs to go out this morning. They are expecting a response.\n\n2. Sponsor update - Helen needs a status update before her board tomorrow. She should not be surprised by anything in that meeting.\n\nTom is back tomorrow. Use today to get the critical decisions made.\n\nJH`,
    },
    3: {
      subject: 'Day 3 - Budget overrun, methodology request, steering committee Thursday',
      body: `Morning,\n\nSignificant day.\n\nThe budget position needs to go to Helen today - not Thursday. I know that is a difficult conversation but she needs advance notice before the steering committee.\n\nThe methodology change request from the client's new Head of Technology - I've seen the email. Handle it professionally. There is a pragmatic path here.\n\nAisha raised a quality concern yesterday. Take it seriously.\n\nJH`,
    },
    4: {
      subject: 'Day 4 - Client termination threat: escalate to me immediately',
      body: `I have seen the CEO email. Call me now.\n\nDo not respond to the client until we have spoken. This needs senior leadership involvement.\n\nClear your diary for 14:00. I am coming with you.\n\nJH`,
    },
    5: {
      subject: 'Day 5 - End of a difficult week. Close it out properly.',
      body: `Morning,\n\nDespite everything, the project is continuing. That is a result.\n\nStatus report for Helen by 14:00.\n\nAisha situation - handle it today. She is a good developer and worth retaining if the issues are fixable.\n\nLessons learned document - I want this for internal use only. Be honest.\n\nJH`,
    },
  },
  digital_marketing: {
    2: { subject: 'Day 2 - Campaign crisis, client needs answers', body: `Morning,\n\nThe ROAS drop is the priority. Client has emailed. Respond before 10:00 with what you know - not when you have all the answers.\n\nLanding page fix is critical - get to the bottom of the conversion drop today.\n\nJH` },
    3: { subject: 'Day 3 - Viral post is trending, CEO wants a call', body: `Morning,\n\nI have seen the viral post. CEO is aware. Crisis response protocol applies.\n\nDo not respond to the journalist without running it past me first.\n\nInfluencer budget conversation with the client - present the data before agreeing to anything.\n\nJH` },
    4: { subject: 'Day 4 - Account suspension: launch is tomorrow', body: `Morning,\n\nAccount suspension is the only priority. Platform support is escalated.\n\nLaunch is tomorrow. Have a contingency plan on my desk by 11:00.\n\nJH` },
    5: { subject: 'Day 5 - End of week. Client report and capacity conversation.', body: `Morning,\n\nClient report due by 14:00. Be honest about the week.\n\nNew client opportunity - I need your honest view on capacity. Do not just say yes.\n\nJH` },
  },
  financial_analysis: {
    2: { subject: 'Day 2 - Board presentation went well. Product line analysis is the priority.', body: `Morning,\n\nBoard accepted the analysis. Now they want a recommendation on the three product lines by Friday.\n\nMark Davies has pushed back - take his point seriously. The strategic value argument may have merit.\n\nJH` },
    3: { subject: 'Day 3 - Acquisition preliminary view due to CEO by end of day', body: `Morning,\n\nCEO needs your preliminary view on the acquisition. He is not asking for due diligence - just go/no-go on whether to proceed to that stage.\n\nThe EBITDA multiple should be your first calculation.\n\nJH` },
    4: { subject: 'Day 4 - Administration crisis. Brief me immediately.', body: `I have seen the news alert. Call me as soon as you have the exposure figure.\n\nRegister as creditor immediately. Stop all supply.\n\nProfit warning decision is today - I need your recommendation by 12:00.\n\nJH` },
    5: { subject: 'Day 5 - Difficult week. Board summary due. Acquisition decision.', body: `Morning,\n\nBoard summary by 12:00.\n\nI want your view on the acquisition - given this week, should we proceed or pause? I have my own view but I want yours first.\n\nJH` },
  },
  product_management: {
    2: {
      subject: 'Day 2 - Sprint overcommitment, CEO is aware of roadmap change',
      body: `Morning,\n\nDavid Chen has seen the roadmap change. I am copied in on his email to you. Handle it directly with him - own the communication failure and fix the process.\n\nSprint capacity issue with Sarah - make the call on what gets cut and communicate it today. Do not let this drift to Friday.\n\nUser research findings - important signal. Do not ignore it because you are close to launch.\n\nJH`,
    },
    3: {
      subject: 'Day 3 - Competitor has launched. Ship decision is yours.',
      body: `Morning,\n\nCompetitor launch is out. I have seen it.\n\nThe ship vs wait decision is yours to make - that is your job. Come to me with your recommendation and reasoning. I will not make this call for you.\n\nCEO communication plan - David needs to trust that he hears roadmap changes from you, not from Marcus.\n\nJH`,
    },
    4: {
      subject: 'Day 4 - A/B test results are in. Big decisions.',
      body: `Morning,\n\nA/B test results landed overnight. The data is significant - read it carefully before the 10:00 meeting.\n\nLaunch readiness is the call today. I need your recommendation by end of day.\n\nJH`,
    },
    5: {
      subject: 'Day 5 - Launch week. Retrospective and next sprint.',
      body: `Morning,\n\nLaunch day is tomorrow. Everything should be in place.\n\nSprint retrospective at 15:00 - I want honest input from the team.\n\nProduct strategy document for next quarter - start the outline today. We need to be planning ahead, not just reacting.\n\nJH`,
    },
  },
}

// ══════════════════════════════════════════════════════════════
// DIGITAL MARKETING - Days 2-5
// ══════════════════════════════════════════════════════════════
export const DM_DAYS: Record<TaskDay, SimTask[]> = {
  2: [
    {
      id:'dm_d2_001', day:2, type:'decision', urgency:'urgent',
      title:'Campaign ROAS has dropped 35% overnight - client wants answers',
      description:`Your paid social campaign for the client showed a 35% drop in ROAS overnight. The client has emailed asking why. Your analysis shows:\n\n- iOS privacy update rolled out yesterday affecting tracking (industry-wide issue)\n- One ad set targeting is too narrow (audience fatigue)\n- Landing page conversion rate dropped from 4.2% to 2.8% (unknown cause)\n- Budget is currently being spent at full rate\n\nThe client\'s monthly budget is GBP 18,000. At current ROAS they are losing money on ad spend.`,
      options:[
        {id:'a',text:'Pause the underperforming ad sets immediately to stop the budget burn. Investigate the landing page conversion drop urgently - this is the highest impact issue. Email the client within the hour with: what happened, what you have already done, and what you are investigating. Do not wait until you have all the answers.',quality:'good',kpiImpact:{reliability:12,decision_quality:12,responsiveness:15,communication:10},xp:50,feedback:'Correct crisis response. Stopping the budget burn while you investigate is the right first action. The client needs to hear from you within the hour - not at end of day. Partial information delivered quickly is better than complete information delivered too late.'},
        {id:'b',text:'Increase the budget on the best-performing ad set to compensate for the ROAS drop.',quality:'bad',kpiImpact:{reliability:-8,decision_quality:-12,scope_control:-5},xp:0,feedback:'Increasing budget on a campaign with a structural ROAS problem compounds the loss. You are spending more money less efficiently. Pause first, investigate second, optimise third.'},
        {id:'c',text:'Wait until you have a full analysis before contacting the client - probably end of day.',quality:'bad',kpiImpact:{reliability:-5,decision_quality:-8,responsiveness:-12},xp:0,feedback:'The client\'s budget is burning at a loss right now. Waiting until end of day to contact them means hours of wasted spend. Contact them within the hour with what you know and what you are doing about it.'},
        {id:'d',text:'Pause the entire campaign and tell the client you need 48 hours to rebuild the strategy.',quality:'medium',kpiImpact:{reliability:3,decision_quality:-3,communication:3},xp:15,feedback:'Pausing is right but 48 hours to rebuild is too slow and too dramatic. The iOS issue is industry-wide and fixable. The landing page conversion drop is the real problem to solve. A targeted pause while investigating is better than a full campaign stop.'},
      ],
      xp_reward:50, due_offset_mins:30,
    },
    {
      id:'dm_d2_002', day:2, type:'email_reply', urgency:'urgent',
      title:'Client asks why ROAS dropped and whether to pause the campaign',
      description:`From: Rachel Thompson (Marketing Director, client)\nTo: You\nSubject: Campaign performance - very concerned\n\nI have just seen the campaign dashboard and the numbers are alarming. ROAS has dropped significantly overnight. We are spending GBP 600 a day and I am not confident we are getting value.\n\nShould I pause the campaign? What is causing this and what are you doing about it?\n\nRachel`,
      rubric:{
        criteria:['Responds within the hour - this is urgent','Explains the three causes clearly without technical jargon','States what has already been done (ad set pauses, investigation started)','Gives a realistic timeline for the landing page investigation','Makes a specific recommendation on whether to pause - Rachel asked directly'],
        scoring_notes:'Rachel asked a direct question: should I pause? Give her a direct answer with your professional recommendation. Vague non-answers damage client trust.',
      },
      xp_reward:35, due_offset_mins:45,
    },
    {
      id:'dm_d2_003', day:2, type:'decision', urgency:'high',
      title:'Landing page conversion rate investigation - what is causing the drop?',
      description:`You have investigated the landing page conversion drop (4.2% to 2.8%). Findings:\n\n- A developer deployed a new page version yesterday at 14:00 (same time ROAS dropped)\n- The new page has a longer form (6 fields vs 3 fields previously)\n- Page load speed increased from 2.1s to 4.8s on mobile\n- The CTA button colour changed from orange to grey\n\nYou cannot immediately reverse all changes - the developer is in a different team. What do you prioritise?`,
      options:[
        {id:'a',text:'Prioritise page load speed fix first (4.8s is critically slow on mobile - Google recommends under 3s), then request the form be reverted to 3 fields. Both changes have the highest evidence-based impact on conversion rates. Document the findings and share with the client.',quality:'good',kpiImpact:{reliability:10,decision_quality:12,communication:8},xp:40,feedback:'Correct prioritisation. Page speed has the most evidence-based impact on conversion - 1 second delay reduces conversions by 7% on average. The form length reduction is also well-evidenced. CTA colour change is worth testing but lower priority than structural UX issues.'},
        {id:'b',text:'Change the CTA button back to orange - colour psychology shows orange converts better.',quality:'medium',kpiImpact:{reliability:3,decision_quality:-3,communication:3},xp:15,feedback:'The CTA colour might be a factor but it is the lowest evidence-based priority. A 4.8s load time and a doubled form length have much stronger documented impact on conversion. Fix the structural issues first, test the CTA colour later.'},
        {id:'c',text:'Roll back the entire page to the previous version immediately.',quality:'medium',kpiImpact:{reliability:8,decision_quality:5,scope_control:3},xp:25,feedback:'A full rollback is clean and fast if you can get developer cooperation. The risk is that the new page may have had improvements that were working. A targeted fix (speed + form) is more surgical, but a rollback is defensible if you cannot isolate the changes quickly.'},
        {id:'d',text:'Run an A/B test between the old and new page to confirm which is causing the drop.',quality:'bad',kpiImpact:{reliability:-5,decision_quality:-8},xp:0,feedback:'An A/B test takes days to reach statistical significance. The client is losing money on ad spend right now. This is a diagnostic situation requiring immediate action, not a test-and-learn situation. Act on the evidence you already have.'},
      ],
      xp_reward:40, due_offset_mins:120,
    },
    {
      id:'dm_d2_004', day:2, type:'document', urgency:'normal',
      title:'Write a campaign performance report with recovery plan',
      description:`Write a client-facing campaign performance report covering this week\'s performance and your recovery plan. The report should be honest about what happened but focus on the path forward.\n\nCover: performance summary (ROAS, CTR, conversion rate), what caused the issues, what has been fixed, the 2-week recovery plan, and revised ROAS projections.`,
      rubric:{
        criteria:['Honest about performance - no sugar coating','Explains causes in plain English - no jargon','Fixes already made are clearly stated','Recovery plan has specific actions and dates','Revised projections are realistic, not optimistic'],
        scoring_notes:'A client report that hides bad news with marketing language destroys trust when the client looks at the raw data themselves. Own the numbers, explain them, show the plan.',
      },
      xp_reward:30, due_offset_mins:300,
    },
  ],
  3:[
    {
      id:'dm_d3_001', day:3, type:'decision', urgency:'urgent',
      title:'Viral social post - brand is trending for wrong reasons',
      description:`At 08:15 your colleague flags that a tweet about your client is trending. A customer had a poor experience and posted about it. The post has 2,300 retweets in 3 hours. The client\'s social channels have 47 unread comments, mostly negative. Several journalists have tagged the brand asking for comment.\n\nThe client\'s CEO is calling you in 30 minutes. You have no approved response yet.`,
      options:[
        {id:'a',text:'Before the CEO call: draft a holding response ("We are aware and investigating - will update shortly") for the social team to post immediately. This stops the silence that is amplifying the story. On the CEO call: brief her on the situation, recommend a genuine response acknowledging the customer\'s experience, and agree the response process. Speed and authenticity are the only tools that work in a social crisis.',quality:'good',kpiImpact:{reliability:12,decision_quality:15,responsiveness:15,communication:12},xp:55,feedback:'Correct crisis PR response. A holding statement stops the narrative vacuum - silence is interpreted as guilt. The genuine response must come from the brand acknowledging the experience, not defending against it. You prepared before the CEO call rather than arriving empty-handed.'},
        {id:'b',text:'Wait for the CEO call before doing anything - you need client approval before posting anything.',quality:'bad',kpiImpact:{reliability:-5,decision_quality:-8,responsiveness:-12},xp:0,feedback:'In a social media crisis, 30 minutes of silence while a story is trending is a long time. A holding statement does not require full approval - it buys time. Arriving at the CEO call with nothing prepared signals poor crisis readiness.'},
        {id:'c',text:'Post a detailed defence of the brand explaining why the customer complaint is inaccurate.',quality:'bad',kpiImpact:{reliability:-3,decision_quality:-15,communication:-15},xp:0,feedback:'Publicly arguing with a customer during a viral moment is one of the fastest ways to make a PR crisis significantly worse. The internet will side with the individual, not the brand. Acknowledge, do not defend.'},
        {id:'d',text:'Contact the original poster privately and offer compensation to delete the tweet.',quality:'bad',kpiImpact:{reliability:-5,decision_quality:-12,communication:-10},xp:0,feedback:'Attempting to pay someone to delete a tweet that is already viral will almost certainly become the next story. "Brand tries to silence customer" is a worse headline than the original complaint.'},
      ],
      xp_reward:55, due_offset_mins:20,
    },
    {
      id:'dm_d3_002', day:3, type:'email_reply', urgency:'high',
      title:'Journalist asks for brand comment on the viral post',
      description:`From: James Winters (Marketing Week journalist)\nTo: Brand contact email (forwarded to you)\nSubject: Request for comment - [Brand] customer complaint\n\nHi,\n\nI am writing a piece on brand social media crisis management and would like to include [Brand]\'s response to the viral post from earlier today. Could you provide a comment on: (1) the original customer complaint, (2) what action the brand is taking, and (3) the brand\'s approach to customer service?\n\nDeadline: 17:00 today.\n\nJames Winters, Marketing Week`,
      rubric:{
        criteria:['Responds before 17:00 - a "no comment" is still a response and better than silence','Acknowledges the customer experience without detail (investigation ongoing)','States the action being taken','Does not over-promise or under-deliver','Professional tone - this will be published'],
        scoring_notes:'Journalist responses are published. Every word is on the record. Short, genuine, and action-oriented is better than long and defensive.',
      },
      xp_reward:35, due_offset_mins:90,
    },
    {
      id:'dm_d3_003', day:3, type:'decision', urgency:'normal',
      title:'Client wants to increase influencer budget after competitor campaign',
      description:`The client has seen a competitor\'s influencer campaign go viral and wants to allocate GBP 15,000 of the remaining quarterly budget to influencer marketing immediately. Current plan had this budget allocated to retargeting campaigns which have historically delivered 4.2x ROAS.\n\nInfluencer campaigns for this brand have not been tested. Industry average ROAS for influencer marketing in this sector is 1.8x. Retargeting ROAS is historically 4.2x for this client.`,
      options:[
        {id:'a',text:'Present the data honestly: retargeting historically delivers 4.2x ROAS vs industry influencer average of 1.8x. Recommend a test approach - allocate GBP 3,000 to 2-3 micro-influencers to test the channel before committing the full GBP 15,000. The client can make an informed decision between the proven channel and the test.',quality:'good',kpiImpact:{reliability:10,decision_quality:12,scope_control:10,communication:10},xp:45,feedback:'This is data-driven client advisory. You are not saying no - you are giving the client the information to make a good decision. The test-before-commit approach is the right recommendation when a proven channel has higher ROAS than the unproven alternative.'},
        {id:'b',text:'Agree to the influencer budget immediately - the client has made a decision and you should support it.',quality:'bad',kpiImpact:{reliability:3,decision_quality:-10,scope_control:-8},xp:5,feedback:'Supporting a client decision that your data suggests will underperform without presenting the evidence is not good account management - it is deference. Your job is to make the client\'s budget work. Present the data, make the recommendation, then respect their decision.'},
        {id:'c',text:'Tell the client the influencer idea will not work and they should stick to the retargeting plan.',quality:'medium',kpiImpact:{reliability:5,decision_quality:5,scope_control:8,communication:-5},xp:20,feedback:'The principle is right but the delivery is too blunt. "Will not work" is an overstatement - you have no tested data for this client. "Historically underperforms retargeting" with a test recommendation is more persuasive and more honest.'},
        {id:'d',text:'Split the budget 50/50 between influencers and retargeting as a compromise.',quality:'medium',kpiImpact:{reliability:5,decision_quality:3,scope_control:5},xp:20,feedback:'A compromise without data rationale is arbitrary. If the test recommendation (GBP 3,000 to test influencers) is accepted, you protect the proven channel while testing the new one. A 50/50 split risks both channels underperforming without learning anything.'},
      ],
      xp_reward:45, due_offset_mins:180,
    },
    {
      id:'dm_d3_004', day:3, type:'document', urgency:'normal',
      title:'Write a social media crisis response playbook',
      description:`Following today\'s viral post situation, the client has asked you to write a social media crisis response playbook for their team. This will be the standard process for any future brand crisis on social.\n\nCover: crisis severity tiers, immediate response protocol (first 30 minutes), escalation paths, holding statement templates, and response approval process.`,
      rubric:{
        criteria:['Clear severity tiers (minor complaint vs viral crisis vs media inquiry)','First 30 minutes protocol is specific and actionable','Escalation path names roles not just job titles','Holding statement templates are genuine, not corporate','Approval process is fast enough to be useful in a crisis'],
        scoring_notes:'A crisis playbook that takes 4 approval steps will never be used in real time. Speed of authentic response is the only thing that matters in a social crisis.',
      },
      xp_reward:32, due_offset_mins:300,
    },
  ],
  4:[
    {
      id:'dm_d4_001', day:4, type:'decision', urgency:'urgent',
      title:'CRISIS: Ad account suspended - all campaigns offline',
      description:`At 09:00 you discover all of the client\'s paid social campaigns are offline. The ad account has been suspended by the platform. Reason given: "Unusual activity detected".\n\nThe client spends GBP 18,000/month on paid social. All campaigns are offline. Platform support response time is typically 24-72 hours. The client has an important product launch campaign scheduled to start tomorrow.\n\nWhat is your immediate response?`,
      options:[
        {id:'a',text:'Contact the platform\'s business support line immediately (not the standard support portal - use the priority business line if available). Simultaneously: tell the client within 30 minutes, assess whether any campaigns can be moved to a backup account, and identify alternative channels for the launch campaign (Google, email, organic) as contingency. Do not promise a 24-hour resolution you cannot guarantee.',quality:'good',kpiImpact:{reliability:12,decision_quality:12,responsiveness:15,communication:12},xp:55,feedback:'Complete crisis response. Priority business line over standard support (faster). Client informed immediately (not when you have answers). Contingency planning started immediately (do not assume the suspension lifts in time for tomorrow). Honest on timelines (no false promises).'},
        {id:'b',text:'Submit a support ticket and wait for the platform to respond before telling the client.',quality:'bad',kpiImpact:{reliability:-8,decision_quality:-10,responsiveness:-15},xp:0,feedback:'Waiting up to 72 hours for a support ticket response while the client\'s launch campaign deadline passes tomorrow is not acceptable. Tell the client immediately and pursue every escalation path simultaneously.'},
        {id:'c',text:'Tell the client there is a "technical issue" and you are resolving it - do not mention the suspension.',quality:'bad',kpiImpact:{reliability:-10,decision_quality:-12,communication:-15},xp:0,feedback:'Hiding an account suspension from your client is a serious trust violation. When they find out (and they will), the deception will be worse than the suspension itself. Transparency is non-negotiable.'},
        {id:'d',text:'Create a new ad account immediately and relaunch all campaigns from scratch.',quality:'medium',kpiImpact:{reliability:5,decision_quality:3,responsiveness:5},xp:20,feedback:'A backup account is worth exploring as a contingency, but creating a new account may trigger the same "unusual activity" flags. Get the suspension reason confirmed first. New account as contingency for the launch campaign is sensible, but do not abandon the primary account investigation.'},
      ],
      xp_reward:55, due_offset_mins:15,
    },
    {
      id:'dm_d4_002', day:4, type:'decision', urgency:'high',
      title:'Launch campaign contingency - 24 hours to go',
      description:`The platform suspension is still unresolved - estimated 48 more hours. The product launch campaign is tomorrow. Budget: GBP 5,000 for launch week.\n\nContingency options:\n- Google paid search: can be live in 4 hours, expected ROAS 2.8x\n- Email campaign to existing database (42,000 subscribers): free, can send tonight\n- PR outreach to 3 industry publications: free, coverage not guaranteed\n- Delay the launch by 1 week: loses competitive window\n\nThe client wants your recommendation.`,
      options:[
        {id:'a',text:'Recommend: launch the email campaign tonight (free, guaranteed reach, existing customers most likely to buy). Set up Google paid search tomorrow morning (4 hours to live, GBP 5,000 budget). Run PR outreach alongside. Do not delay the launch - competitive window matters. Present this as a multi-channel approach that may actually reach more people than social alone.',quality:'good',kpiImpact:{reliability:12,decision_quality:12,communication:12},xp:50,feedback:'Excellent crisis creative thinking. Email to existing customers is free and high-converting. Google can be live within 4 hours. The multi-channel launch may genuinely outperform a single-channel social launch. You turned a crisis into a better launch strategy.'},
        {id:'b',text:'Delay the launch by 1 week until the social account is restored.',quality:'bad',kpiImpact:{reliability:-5,decision_quality:-8},xp:0,feedback:'Delaying a product launch because one ad channel is unavailable when alternatives exist is an over-reaction. You have GBP 5,000 in budget, email reach, and PR options. Use them.'},
        {id:'c',text:'Spend the full GBP 5,000 on Google paid search only - it is the closest to the original social campaign.',quality:'medium',kpiImpact:{reliability:8,decision_quality:5,communication:5},xp:25,feedback:'Google is a good pivot but spending all the budget on one channel without the email (free) and PR (free) options is leaving reach on the table. A multi-channel approach for the same budget is stronger.'},
        {id:'d',text:'Tell the client there is nothing you can do without social - the launch cannot go ahead.',quality:'bad',kpiImpact:{reliability:-10,decision_quality:-12,communication:-10},xp:0,feedback:'"Nothing we can do" when you have Google ads, email, and PR available is simply wrong. A digital marketer\'s value is knowing how to reach audiences across channels, not being dependent on a single platform.'},
      ],
      xp_reward:50, due_offset_mins:90,
    },
    {
      id:'dm_d4_003', day:4, type:'report', urgency:'normal',
      title:'Monthly channel performance report - honest version',
      description:`Write the monthly channel performance report for the client. This has been a difficult month: ROAS dropped, account was suspended, viral crisis managed.\n\nBut there were positives: landing page was fixed (now converting at 3.8%, better than the original 4.2% target), email campaign for the launch outperformed expectations (3.1% conversion), PR coverage was secured in 2 publications.\n\nWrite an honest performance report that owns the difficulties and highlights the genuine wins.`,
      rubric:{
        criteria:['Opens with the key metrics - good and bad','Explains the difficult events without excuses','Quantifies the genuine wins specifically','Recovery actions taken are clearly stated','Next month plan is specific and data-driven'],
        scoring_notes:'Monthly reports that only show green metrics and bury the red ones are why clients lose trust in agencies. Own the full picture.',
      },
      xp_reward:38, due_offset_mins:240,
    },
    {
      id:'dm_d4_004', day:4, type:'decision', urgency:'normal',
      title:'Client asks to measure brand sentiment - is it worth it?',
      description:`The client asks: "After the viral post this week I want to understand our brand sentiment online. Can we set up brand monitoring and report on it monthly? I have seen tools that do this for about GBP 500/month."\n\nBrand sentiment monitoring tools track mentions, sentiment scores, and share of voice. The data can be interesting but is often noisy. For a brand this size (mid-market, B2C, regional), the actionable insights from sentiment monitoring are limited unless there is active PR activity.`,
      options:[
        {id:'a',text:'Be honest: sentiment monitoring is most valuable for brands with high media volume or active PR programmes. For a regional mid-market brand, free tools (Google Alerts, native social monitoring) may give 80% of the value for free. Recommend a 3-month trial of a paid tool (GBP 500/month) with a clear success criteria: what decisions will this data change? If it does not change decisions, it is not worth the cost.',quality:'good',kpiImpact:{reliability:8,decision_quality:12,communication:10,scope_control:8},xp:40,feedback:'This is excellent client advisory. You are not just answering the question - you are helping the client think about ROI. The "what decisions will this change?" test is the right framework for any analytics tool investment. Recommending free alternatives first shows you prioritise their budget over your commission.'},
        {id:'b',text:'Set up the GBP 500/month tool immediately - the client has asked for it.',quality:'medium',kpiImpact:{reliability:5,decision_quality:-3,scope_control:3},xp:18,feedback:'The client asked for it, but a good advisor tests whether the client needs it. GBP 6,000/year is not trivial. A brief advisory conversation about expected value before committing is better account management.'},
        {id:'c',text:'Tell the client sentiment monitoring is not worth it for a brand their size.',quality:'medium',kpiImpact:{reliability:5,decision_quality:5,communication:-3},xp:20,feedback:'The conclusion may be right but the delivery is too blunt. Explain why (media volume, actionability) and offer the free alternative as a starting point. A flat "not worth it" does not give the client the information to make their own decision.'},
        {id:'d',text:'Set up free Google Alerts and tell the client you are monitoring brand sentiment.',quality:'bad',kpiImpact:{reliability:3,decision_quality:-8,communication:-8},xp:0,feedback:'Misrepresenting Google Alerts as brand sentiment monitoring is dishonest. Google Alerts is a keyword notification tool, not a sentiment analysis platform. Be transparent about what you are using and what it can and cannot do.'},
      ],
      xp_reward:40, due_offset_mins:300,
    },
  ],
  5:[
    {
      id:'dm_d5_001', day:5, type:'report', urgency:'high',
      title:'End of week report - present to client',
      description:`Friday. Write the end-of-week client report. This week: ROAS crisis, landing page fix, viral social post managed, ad account suspension, successful multi-channel launch, PR coverage secured.\n\nThe week was difficult but the outcomes were better than they could have been. The report should reflect that honestly.`,
      rubric:{criteria:['Week summary is honest and specific','Negative events are owned, not hidden','Positive outcomes are quantified','Next week priorities are clear','Executive-level length - one page maximum'],scoring_notes:'After a crisis week, the report tone matters. Confident and factual rebuilds trust. Defensive undermines it.',},
      xp_reward:35, due_offset_mins:90,
    },
    {
      id:'dm_d5_002', day:5, type:'decision', urgency:'normal',
      title:'Client wants to cut the retargeting budget to fund more creative',
      description:`The client says: "The creative is what made our launch successful - the PR coverage, the email copy. I want to put more budget into creative production and less into retargeting. Can we cut the retargeting budget by 30%?"\n\nRetargeting delivers 4.2x ROAS historically. Creative production has no direct ROAS measurement. The instinct to invest in creative is understandable after a strong launch - but the data does not support cutting the highest-performing channel.`,
      options:[
        {id:'a',text:'Present the ROAS data clearly: retargeting at 4.2x is your highest-performing channel. Propose an alternative: increase the total budget by the creative investment amount rather than cutting retargeting. If total budget increase is not possible, test a 10% retargeting reduction over one month and measure the impact before committing to 30%.',quality:'good',kpiImpact:{reliability:8,decision_quality:12,scope_control:10,communication:10},xp:45,feedback:'Data-driven advisory done correctly. You acknowledged the client\'s instinct (creative is important), protected the high-performing channel with evidence, and proposed a test approach rather than a binary choice. The budget increase suggestion is creative problem-solving.'},
        {id:'b',text:'Agree to the 30% retargeting cut - the client knows their business better than you do.',quality:'bad',kpiImpact:{reliability:3,decision_quality:-10,scope_control:-8},xp:0,feedback:'The client may know their business but you know the data. A 30% cut to a 4.2x ROAS channel to fund unmeasured creative is a significant risk. Your job is to present the evidence and recommendation. Deferring without doing so is not good account management.'},
        {id:'c',text:'Refuse to cut retargeting - it is your best-performing channel and you cannot recommend it.',quality:'medium',kpiImpact:{reliability:5,decision_quality:5,scope_control:8,communication:-3},xp:22,feedback:'The principle is right but the delivery is inflexible. The client has the right to make this decision. Present the evidence, make the recommendation, offer the test approach, and then respect their choice if they still want to proceed.'},
        {id:'d',text:'Cut retargeting by 30% and use the budget to test three different creative approaches as an experiment.',quality:'medium',kpiImpact:{reliability:5,decision_quality:5,scope_control:5},xp:22,feedback:'The test framing is good but you are still cutting the highest-ROAS channel without presenting the risk to the client first. Agree the test with full client awareness of what you are trading off.'},
      ],
      xp_reward:45, due_offset_mins:180,
    },
    {
      id:'dm_d5_003', day:5, type:'decision', urgency:'normal',
      title:'New client enquiry - do you have capacity?',
      description:`Your manager tells you there is a new client enquiry - a GBP 8,000/month paid social account. They want to know if you can take it on alongside your current client.\n\nYour current client takes approximately 60% of your weekly capacity. The new client would add approximately 40-50%. Your manager is keen to win the business.\n\nYou are honest with yourself: you are at the limit of what you can manage well. Adding this client risks quality on both accounts.`,
      options:[
        {id:'a',text:'Tell your manager honestly: "I want to take this on but I am currently at about 60% capacity and this would take me to 100-110%. I can do it well with support - can we discuss what that looks like? Options: a junior account manager to handle reporting and admin, or pushing back the new client start by 4 weeks to allow me to build efficient processes on the current account first."',quality:'good',kpiImpact:{reliability:10,decision_quality:12,communication:12,scope_control:12},xp:45,feedback:'Professional self-awareness and honest escalation. You are not saying no - you are saying what you need to say yes properly. This is the behaviour that builds long-term trust with managers. Accepting and then delivering poor quality on both accounts would be far more damaging.'},
        {id:'b',text:'Say yes immediately - you will make it work.',quality:'bad',kpiImpact:{reliability:-5,decision_quality:-8,scope_control:-10},xp:0,feedback:'Overcommitting and then delivering poor quality on two accounts damages your professional reputation more than declining one. Be honest about capacity.'},
        {id:'c',text:'Say no - you do not have capacity.',quality:'medium',kpiImpact:{reliability:5,decision_quality:5,scope_control:8,communication:-3},xp:22,feedback:'Honest but a missed opportunity. A flat no without proposing solutions (support, delayed start) leaves your manager with no options. Come with solutions, not just a refusal.'},
        {id:'d',text:'Take the new client and quietly reduce the time you spend on the current client.',quality:'bad',kpiImpact:{reliability:-10,decision_quality:-12,communication:-10,scope_control:-8},xp:0,feedback:'Silently reducing service quality on an existing client to accommodate a new one without either client knowing is a serious professional failure. When quality drops (and it will), you lose both clients and your reputation.'},
      ],
      xp_reward:45, due_offset_mins:240,
    },
    {
      id:'dm_d5_004', day:5, type:'document', urgency:'normal',
      title:'Personal learning reflection - Week 1',
      description:`Final task of Level 1. Write your personal learning reflection:\n\n1. The most significant decision you made this week and what you learned from it\n2. One thing you would do differently if you could repeat the week\n3. The skill or behaviour you want to develop most in Level 2\n4. How your performance this week compares to where you want to be in your career`,
      rubric:{criteria:['References specific events from the week','Honest about development areas','Level 2 goal is specific','Shows self-awareness about career gap','Authentic - not template language'],scoring_notes:'Specific and honest scores highest. Generic positive statements score lowest.',},
      xp_reward:35, due_offset_mins:480,
    },
  ],
}

// ══════════════════════════════════════════════════════════════
// FINANCIAL ANALYSIS - Days 2-5
// ══════════════════════════════════════════════════════════════
export const FA_DAYS: Record<TaskDay, SimTask[]> = {
  2:[
    {
      id:'fa_d2_001', day:2, type:'decision', urgency:'urgent',
      title:'Board wants to understand the profit decline - present at 10:00',
      description:`The CFO has asked you to present the Q4 variance analysis to the board at 10:00. You have 90 minutes to prepare.\n\nYour analysis shows revenue up 15% but net profit down 8%. Root causes:\n- COGS increased 22% (raw material inflation + logistics costs)\n- Three product lines are now loss-making at current price points\n- Overhead allocation increased due to new warehouse\n- One-off costs: restructuring charge of GBP 340,000\n\nThe board will ask: is this structural or temporary?`,
      options:[
        {id:'a',text:'Structure the presentation as: (1) The headline numbers - honest and clear. (2) What is temporary (one-off restructuring charge, some logistics inflation). (3) What is structural (three loss-making product lines, overhead increase from warehouse). (4) Your recommendation: the board needs to make a decision on the three loss-making lines - price increase, cost reduction, or discontinuation. Present options, not just the problem.',quality:'good',kpiImpact:{reliability:12,decision_quality:15,communication:12},xp:55,feedback:'Excellent board presentation structure. You separated temporary from structural (the key question), and you came with a decision framework not just a diagnosis. Boards need to make decisions - giving them the analysis and the options is what a good financial analyst does.'},
        {id:'b',text:'Focus on the positive revenue growth story and contextualise the profit decline as temporary.',quality:'bad',kpiImpact:{reliability:-5,decision_quality:-12,communication:-8},xp:0,feedback:'A board that receives a sanitised analysis will make worse decisions. Three loss-making product lines is a structural problem that requires a board decision. Presenting it as temporary when the evidence suggests otherwise is a professional failure.'},
        {id:'c',text:'Present all the numbers in full detail - let the board draw their own conclusions.',quality:'medium',kpiImpact:{reliability:5,decision_quality:3,communication:3},xp:20,feedback:'Complete data is necessary but not sufficient. A board does not want raw data - they want analysis, context, and a recommended course of action. "Here are all the numbers" without a framework for understanding them is an analyst presenting data, not insights.'},
        {id:'d',text:'Ask the CFO to present instead - you do not have enough time to prepare properly.',quality:'bad',kpiImpact:{reliability:-8,decision_quality:-8,communication:-5},xp:0,feedback:'90 minutes is enough time to prepare a focused board presentation on analysis you already have. Declining to present when you are the subject matter expert is a professional development miss and an unfair burden on the CFO.'},
      ],
      xp_reward:55, due_offset_mins:30,
    },
    {
      id:'fa_d2_002', day:2, type:'decision', urgency:'high',
      title:'Three loss-making product lines - what do you recommend?',
      description:`The board has asked you to prepare a recommendation on the three loss-making product lines by end of week. Current data:\n\nProduct A: Revenue GBP 2.1M, Contribution margin -8%. Customer base: 340 accounts, 12% are also buying premium products.\nProduct B: Revenue GBP 890k, Contribution margin -22%. No cross-sell relationship with other products.\nProduct C: Revenue GBP 1.4M, Contribution margin -4%. New product (8 months old), growing at 18% per month.\n\nWhat is your analysis framework?`,
      options:[
        {id:'a',text:'Analyse each line differently based on its characteristics: Product A - assess whether the 12% cross-sell customer base justifies the loss as a customer acquisition/retention cost. Product B - strong discontinuation case (no cross-sell, -22% margin). Product C - continue (growing fast, early-stage, margin will improve with scale). Present with sensitivity analysis on Product A.',quality:'good',kpiImpact:{reliability:10,decision_quality:15,communication:10},xp:50,feedback:'Sophisticated analysis. You recognised that "loss-making" is not a binary decision - context matters. Product A has a cross-sell argument. Product B has no redeeming strategic value. Product C is a scale story. This is the kind of nuanced thinking that distinguishes a good financial analyst from a spreadsheet operator.'},
        {id:'b',text:'Recommend discontinuing all three - loss-making products should not be in the portfolio.',quality:'bad',kpiImpact:{reliability:3,decision_quality:-10,communication:3},xp:5,feedback:'Blanket discontinuation without considering the strategic context of each line is a blunt instrument. Product C is growing at 18%/month and will likely be profitable within 6 months. Product A has a cross-sell argument worth quantifying. Analysis before recommendation.'},
        {id:'c',text:'Recommend a price increase across all three to restore margin.',quality:'medium',kpiImpact:{reliability:5,decision_quality:3,communication:5},xp:22,feedback:'Price increases may work for some lines but not all. The feasibility depends on market elasticity, competitive position, and customer relationships. Recommending price increases without elasticity analysis is incomplete.'},
        {id:'d',text:'Ask for more time - 3 days is not enough to analyse three product lines properly.',quality:'medium',kpiImpact:{reliability:3,decision_quality:5,communication:3},xp:18,feedback:'You have the data. Three days is enough for an initial analysis framework and recommendation. An analyst who always needs more time before committing to a view adds less value than one who can make a data-supported recommendation under time pressure.'},
      ],
      xp_reward:50, due_offset_mins:180,
    },
    {
      id:'fa_d2_003', day:2, type:'email_reply', urgency:'normal',
      title:'Sales director pushes back on your analysis',
      description:`From: Mark Davies (Sales Director)\nTo: You (cc: CFO)\nSubject: Product line analysis - I disagree\n\nI have seen the preliminary analysis on the three product lines. I strongly disagree with the framing. Product A has strategic importance that is not captured in the contribution margin calculation - it gets us into accounts we would not otherwise win. The analysis is too simplistic.\n\nMark`,
      rubric:{
        criteria:['Acknowledges Mark\'s point professionally - he may be right about strategic value','Does not become defensive about the analysis','Asks for the specific data that would capture the strategic value he is describing','Proposes a joint discussion to incorporate his perspective','Copies the CFO as appropriate'],
        scoring_notes:'A pushback from a sales director is an opportunity to improve the analysis. The right response is curiosity, not defensiveness.',
      },
      xp_reward:30, due_offset_mins:120,
    },
    {
      id:'fa_d2_004', day:2, type:'document', urgency:'normal',
      title:'Build a product profitability model with strategic overlay',
      description:`Following Mark\'s pushback, build a product profitability model that captures both financial contribution margin and strategic value for each product line.\n\nThe model should include: contribution margin per product, cross-sell revenue attributable to each product (using Mark\'s data), customer lifetime value impact, and a strategic score that captures non-financial value. Present as a decision matrix.`,
      rubric:{
        criteria:['Contribution margin is calculated correctly','Cross-sell attribution methodology is clearly stated','Strategic score criteria are explicit and consistent','Decision matrix is readable by a non-finance board member','Model is transparent - assumptions are stated'],
        scoring_notes:'A model with hidden assumptions is a model that cannot be challenged or improved. State every assumption explicitly.',
      },
      xp_reward:40, due_offset_mins:360,
    },
  ],
  3:[
    {
      id:'fa_d3_001', day:3, type:'decision', urgency:'urgent',
      title:'Acquisition target identified - 48 hours to assess',
      description:`The CEO calls you at 09:00: "We have an opportunity to acquire a competitor. They approached us yesterday. Asking price is GBP 4.2M. They have revenue of GBP 1.8M and EBITDA of GBP 180,000. I need a preliminary view on whether this is worth pursuing in 48 hours. What do you need?"\n\nYou have 48 hours before the CEO needs a go/no-go on proceeding to due diligence.`,
      options:[
        {id:'a',text:'Request immediately: 3 years of P&L, balance sheet, customer concentration data, and any existing contracts/liabilities. In parallel, calculate the implied multiple (GBP 4.2M / GBP 180k EBITDA = 23x - high for this sector where 8-12x is typical). Flag the valuation as the primary risk in your preliminary view. Agree a 48-hour structure: Day 1 data review, Day 2 preliminary recommendation with key risks.',quality:'good',kpiImpact:{reliability:12,decision_quality:15,communication:12},xp:55,feedback:'Excellent M&A instinct. The EBITDA multiple calculation should be your first move - 23x is significantly above sector norms and that gap needs explanation before anything else. Structuring the 48 hours proactively shows commercial maturity.'},
        {id:'b',text:'Tell the CEO you cannot give a preliminary view in 48 hours - M&A analysis requires weeks.',quality:'bad',kpiImpact:{reliability:-5,decision_quality:-8,communication:-5},xp:0,feedback:'A preliminary go/no-go in 48 hours is a reasonable commercial request. You are not being asked for a full due diligence - you are being asked whether the headline numbers warrant proceeding to due diligence. That is achievable in 48 hours with the right data.'},
        {id:'c',text:'Calculate the EBITDA multiple and send the CEO a one-line view: "At 23x EBITDA this is expensive. Sector norm is 8-12x. We need to understand why they are asking this multiple before proceeding."',quality:'medium',kpiImpact:{reliability:8,decision_quality:10,communication:8},xp:35,feedback:'The multiple calculation and sector context is exactly right. But a one-line view without requesting the data to validate the financials is incomplete. You need 3 years of P&L to know whether the GBP 180k EBITDA is real and sustainable.'},
        {id:'d',text:'Agree to a preliminary view and ask the CFO to lead it - M&A is above your current level.',quality:'medium',kpiImpact:{reliability:3,decision_quality:5,communication:5},xp:18,feedback:'Involving the CFO is appropriate for an acquisition of this size, but framing it as "above your level" undersells your capability. A better approach: proactively start the analysis, brief the CFO on your findings, and present jointly. Show initiative.'},
      ],
      xp_reward:55, due_offset_mins:30,
    },
    {
      id:'fa_d3_002', day:3, type:'decision', urgency:'high',
      title:'Acquisition data arrives - red flags in the financials',
      description:`The acquisition target has sent their financials. Key findings:\n- Revenue: GBP 1.8M (Year 3), GBP 1.6M (Year 2), GBP 2.1M (Year 1) - declining trend\n- EBITDA: GBP 180k - but includes GBP 240k of owner salary that would be replaced at market rate by GBP 120k. Adjusted EBITDA: GBP 300k\n- Top 3 customers = 68% of revenue. One customer (38%) is month-to-month with no contract\n- GBP 180k of deferred revenue that may be recognised over 24 months\n\nThe asking price is GBP 4.2M. Adjusted EBITDA multiple: 14x. Sector norm: 8-12x.`,
      options:[
        {id:'a',text:'Recommend proceeding to due diligence with a revised offer range of GBP 2.8-3.2M. Rationale: (1) Adjusted EBITDA is GBP 300k not GBP 180k - seller is presenting it incorrectly. (2) Revenue is declining - this is a risk factor not a growth story. (3) Customer concentration (38% on month-to-month) is a major risk - needs mitigation in deal structure. (4) At GBP 3.0M that is 10x adjusted EBITDA - within sector norms.',quality:'good',kpiImpact:{reliability:10,decision_quality:15,communication:12},xp:55,feedback:'Sophisticated M&A analysis. You corrected the EBITDA calculation, identified the revenue trend, quantified the customer concentration risk, and derived a defensible valuation range. This is the quality of financial analysis that earns trust from boards.'},
        {id:'b',text:'Recommend not proceeding - the revenue is declining and the customer concentration is too high.',quality:'medium',kpiImpact:{reliability:5,decision_quality:8,communication:5},xp:28,feedback:'The risks are real but your analysis does not include what the business is worth at a risk-adjusted valuation. "Do not proceed" without a price at which you would proceed is an incomplete recommendation. What is the right price given these risks?'},
        {id:'c',text:'Recommend proceeding at the asking price of GBP 4.2M - the adjusted EBITDA multiple is within range.',quality:'bad',kpiImpact:{reliability:3,decision_quality:-10,communication:3},xp:5,feedback:'Proceeding at asking price without addressing the declining revenue trend and the 38% customer concentration on a month-to-month contract is commercially negligent. These are material risks that must be reflected in either a lower price or deal structure protections.'},
        {id:'d',text:'Present the data to the CEO without a recommendation - the risks are too complex for a clear view.',quality:'bad',kpiImpact:{reliability:3,decision_quality:-8,communication:-3},xp:5,feedback:'An analyst who presents risks without a recommendation leaves the CEO with the same information they had before the analysis. Your job is to synthesise the complexity into a view. "Proceed at GBP 2.8-3.2M with these protections" is a better output than "here are some risks".'},
      ],
      xp_reward:55, due_offset_mins:120,
    },
    {
      id:'fa_d3_003', day:3, type:'email_reply', urgency:'normal',
      title:'Target company CFO queries your valuation methodology',
      description:`From: Sophie Clarke (CFO, acquisition target)\nTo: You (cc: your CEO, their CEO)\nSubject: Valuation methodology - request for clarification\n\nThank you for your preliminary offer range. We note the significant discount to our asking price. Could you clarify the methodology you have used, specifically regarding the EBITDA adjustment and the revenue trend weighting?\n\nSophie Clarke`,
      rubric:{
        criteria:['Professional and transparent - this is a negotiation, not an argument','Explains the EBITDA adjustment clearly (owner salary above market rate)','Explains the revenue trend weighting with specific data points','Does not apologise for the valuation - it is defensible','Keeps the door open for continued discussion'],
        scoring_notes:'M&A negotiations require professional transparency. Your methodology should be explainable and defensible. If it is not, the valuation is wrong.',
      },
      xp_reward:32, due_offset_mins:180,
    },
    {
      id:'fa_d3_004', day:3, type:'document', urgency:'normal',
      title:'Write a deal structure recommendation',
      description:`The CEO has asked you to recommend how to structure the deal if the acquisition proceeds at GBP 3.0M. Given the customer concentration risk (38% of revenue on month-to-month contract), you need to protect against the risk of losing that customer post-acquisition.\n\nWrite a deal structure recommendation covering: payment structure (upfront vs earnout), customer concentration protections, conditions precedent, and integration risk mitigation.`,
      rubric:{
        criteria:['Earnout structure is specific - what is the earnout based on and over what period','Customer concentration protection is specific - what happens if the 38% customer leaves','Conditions precedent are realistic and protect the buyer','Integration risk is acknowledged and mitigated','Written for a CEO who is not a finance specialist'],
        scoring_notes:'Deal structure exists to protect against risks you have already identified. Every protection should map directly to a risk you have named.',
      },
      xp_reward:42, due_offset_mins:360,
    },
  ],
  4:[
    {
      id:'fa_d4_001', day:4, type:'decision', urgency:'urgent',
      title:'CRISIS: Major customer has entered administration',
      description:`At 08:30 you see a news alert: [Customer name], your largest customer (GBP 840k revenue, 18% of total), has entered administration. Your company has:\n- GBP 220k outstanding invoices (60-90 days overdue)\n- GBP 180k of stock being processed for them in the warehouse\n- A long-term supply contract with 6 months remaining\n\nThe CFO and CEO are in a board meeting until 10:00. You need to take immediate action.`,
      options:[
        {id:'a',text:'Immediately: (1) Contact the administrator to register as a creditor - this must be done quickly to protect the GBP 220k debt position. (2) Stop all further supply and processing of the GBP 180k warehouse stock - do not ship more goods into an administration. (3) Brief the CFO by message now - do not wait until 10:00. (4) Calculate the maximum loss exposure (GBP 400k) and the impact on this year\'s P&L.',quality:'good',kpiImpact:{reliability:12,decision_quality:15,responsiveness:15,communication:12},xp:60,feedback:'Correct crisis financial response. Registering as a creditor immediately is time-critical in an administration. Stopping further supply prevents adding to the exposure. Briefing the CFO by message before the board meeting ends gives leadership the ability to address the board if needed. Quantifying the exposure immediately gives management the information to respond.'},
        {id:'b',text:'Wait for the CFO to come out of the board meeting at 10:00 before taking any action.',quality:'bad',kpiImpact:{reliability:-10,decision_quality:-12,responsiveness:-15},xp:0,feedback:'Waiting 90 minutes in an administration situation is not acceptable. Creditor registration priority is determined by timing. Every minute of further supply adds to the loss exposure. Brief the CFO by message now and take the protective actions immediately.'},
        {id:'c',text:'Continue processing the warehouse stock - the administration may be resolved quickly.',quality:'bad',kpiImpact:{reliability:-8,decision_quality:-12},xp:0,feedback:'Continuing to process stock for a company in administration adds to your unsecured creditor exposure. Stop all supply immediately and hold the stock while the administration process clarifies your position. Hope is not a financial strategy.'},
        {id:'d',text:'Contact your sales team and ask them to speak to the customer about the outstanding invoices.',quality:'bad',kpiImpact:{reliability:-5,decision_quality:-10,communication:-5},xp:0,feedback:'A company in administration cannot pay invoices - the administrator controls all cash. This is now a legal and financial matter, not a sales relationship matter. Contact the administrator directly.'},
      ],
      xp_reward:60, due_offset_mins:10,
    },
    {
      id:'fa_d4_002', day:4, type:'decision', urgency:'high',
      title:'Board wants to know the impact on this year\'s guidance',
      description:`The CFO asks you to prepare a revised full-year P&L forecast following the customer administration. The company had provided market guidance of GBP 2.2M EBITDA for the full year.\n\nYour calculation shows:\n- Revenue loss: GBP 840k (remaining customer revenue)\n- Bad debt provision: GBP 220k (full outstanding balance)\n- Warehouse stock write-off: GBP 180k (if unrecoverable)\n- Maximum EBITDA impact: GBP 1.24M\n- Revised EBITDA guidance: GBP 960k (best case) to GBP 1.1M (if some debt recovered)\n\nThe original guidance was GBP 2.2M. The company may need to issue a profit warning.`,
      options:[
        {id:'a',text:'Recommend issuing a profit warning immediately. The impact is material (GBP 1.1-1.24M below guidance). Delaying the profit warning while hoping for partial debt recovery creates legal exposure if shares are publicly traded or if investors/lenders rely on the guidance. Calculate the revised guidance range (GBP 960k-1.1M EBITDA) and recommend it be communicated today.',quality:'good',kpiImpact:{reliability:12,decision_quality:15,communication:12},xp:55,feedback:'Correct. A material variance from guidance must be disclosed promptly. The GBP 1.1M+ gap is approximately 50% of the original guidance - this is unambiguously material. Recommending immediate disclosure protects the company from regulatory and legal risk. Good financial advisors tell leaders what they need to hear, not what they want to hear.'},
        {id:'b',text:'Wait 2 weeks to see how much debt is recovered from the administrator before revising guidance.',quality:'bad',kpiImpact:{reliability:-8,decision_quality:-12,communication:-8},xp:0,feedback:'If the company has external stakeholders relying on the GBP 2.2M guidance, waiting 2 weeks to disclose a known material variance creates serious regulatory and reputational risk. The administration is public information. Stakeholders will be asking questions.'},
        {id:'c',text:'Revise the guidance downward but present it optimistically - use the best case (GBP 1.1M) as the new guidance.',quality:'medium',kpiImpact:{reliability:5,decision_quality:-3,communication:3},xp:20,feedback:'Providing only the best-case figure as revised guidance without disclosing the range is misleading. Present the range (GBP 960k-1.1M) and explain what drives the variance. Stakeholders can assess the risk themselves.'},
        {id:'d',text:'Tell the CFO the impact is manageable and the original guidance should stand pending recovery.',quality:'bad',kpiImpact:{reliability:-10,decision_quality:-15,communication:-10},xp:0,feedback:'GBP 1.1M+ below guidance is not manageable within the original forecast. This recommendation would mislead stakeholders about the company\'s financial position. A financial analyst\'s credibility is built on honest assessment of difficult situations.'},
      ],
      xp_reward:55, due_offset_mins:90,
    },
    {
      id:'fa_d4_003', day:4, type:'document', urgency:'high',
      title:'Write a customer credit risk policy',
      description:`Following the administration crisis, the CFO has asked you to write a customer credit risk policy that prevents the company from having this level of concentration risk again.\n\nThe policy should cover: customer credit assessment process, concentration limits (no single customer above x% of revenue), credit terms by customer tier, bad debt provisioning methodology, and escalation triggers.`,
      rubric:{
        criteria:['Concentration limit is specific (e.g. no single customer above 15% of revenue)','Credit assessment process is practical - not so bureaucratic it slows sales','Bad debt provisioning methodology follows accounting standards','Escalation triggers are specific (e.g. customer overdue 60+ days escalated to CFO)','Existing customers are grandfathered with a transition period'],
        scoring_notes:'A credit risk policy written after a crisis is too late for this situation but essential for the next one. Make it practical enough to actually be followed.',
      },
      xp_reward:42, due_offset_mins:300,
    },
    {
      id:'fa_d4_004', day:4, type:'decision', urgency:'normal',
      title:'Sales director wants to pursue another large single customer',
      description:`Mark Davies (Sales Director) comes to you: "I have a great opportunity - a GBP 700k annual contract with a large retailer. This would replace most of the revenue we lost. Should I pursue it?"\n\nYou have just written a credit risk policy recommending no single customer above 15% of revenue. GBP 700k would represent 16% of the revised revenue base. The retailer has a strong credit rating.`,
      options:[
        {id:'a',text:'Support the opportunity with conditions: the retailer\'s strong credit rating mitigates the credit risk, but the concentration policy should still apply. Recommend structured growth - perhaps GBP 400k in year 1 growing to GBP 700k over 2 years, allowing the revenue base to grow in parallel. Flag to the CFO that you are recommending an exception to the new policy for a financially strong customer.',quality:'good',kpiImpact:{reliability:8,decision_quality:12,scope_control:10,communication:10},xp:45,feedback:'Nuanced judgment. You are not applying the policy rigidly when a strong-credit large customer represents a different risk profile than the customer that just went into administration. The structured growth approach protects concentration while capturing the opportunity. Flagging the exception to the CFO shows good governance.'},
        {id:'b',text:'Block the opportunity - it violates the credit risk policy you just wrote.',quality:'medium',kpiImpact:{reliability:5,decision_quality:5,scope_control:8,communication:-3},xp:22,feedback:'The policy exists to manage risk, not to block good business. A GBP 700k contract with a strong-credit retailer is a different risk profile than the same concentration with a financially weak customer. Apply the judgment the policy is designed to support, not the rule mechanically.'},
        {id:'c',text:'Approve the full GBP 700k immediately - the company needs the revenue after this week.',quality:'bad',kpiImpact:{reliability:3,decision_quality:-8,scope_control:-10},xp:0,feedback:'Abandoning a policy you wrote today because of short-term revenue pressure undermines the entire point of having a policy. The structured growth approach captures the revenue while managing concentration.'},
        {id:'d',text:'Tell Mark to pursue it and worry about the concentration policy later.',quality:'bad',kpiImpact:{reliability:-5,decision_quality:-10,scope_control:-12},xp:0,feedback:'Deferring risk management to "later" is how the current situation was created. Apply the framework you built, even when it creates short-term constraints.'},
      ],
      xp_reward:45, due_offset_mins:240,
    },
  ],
  5:[
    {
      id:'fa_d5_001', day:5, type:'report', urgency:'high',
      title:'Board financial summary - end of week',
      description:`Write the board financial summary for this week. Topics: Q4 variance analysis findings, product line recommendations, acquisition preliminary analysis, customer administration impact and profit warning, credit risk policy implemented.\n\nThis is a board document. It must be concise, honest, and action-oriented.`,
      rubric:{criteria:['Board-level conciseness - one page maximum','Each item has a clear status and recommended action','Financial figures are accurate and consistent throughout','No jargon - written for a non-finance board member','Actions are owned and time-bound'],scoring_notes:'Board documents that require financial expertise to read fail their audience. Plain language, clear numbers, clear actions.',},
      xp_reward:40, due_offset_mins:90,
    },
    {
      id:'fa_d5_002', day:5, type:'decision', urgency:'normal',
      title:'CFO asks for your view on the acquisition - proceed or not?',
      description:`The CFO asks: "Given everything that has happened this week - the profit warning, the cash position, the credit risk review - should we still pursue the acquisition? My instinct is to pause. What is your view?"\n\nThe acquisition at GBP 3.0M would require external financing. After the profit warning, the company\'s lending terms may be more expensive. The acquisition target has a different customer base (no overlap with the administration customer).`,
      options:[
        {id:'a',text:'"My recommendation is to pause the acquisition for 90 days. The profit warning changes our financing position and the board needs to stabilise before taking on GBP 3.0M of additional debt. The acquisition opportunity may still be available in 90 days - if not, a stronger alternative may emerge. The downside of pausing is low. The downside of proceeding with expensive financing in a weakened position is significant."',quality:'good',kpiImpact:{reliability:10,decision_quality:15,communication:12},xp:50,feedback:'Excellent judgment. The 90-day pause is a conservative but defensible recommendation given the changed financing environment. You gave a specific recommendation with specific reasoning, quantified the asymmetry (low downside of pausing vs high downside of proceeding), and left the door open. This is how senior financial advisors think.'},
        {id:'b',text:'Recommend proceeding immediately - the acquisition diversifies the customer base which reduces the risk profile that caused this week\'s problems.',quality:'medium',kpiImpact:{reliability:5,decision_quality:5,communication:5},xp:22,feedback:'The diversification argument is valid but incomplete. The financing cost impact of the profit warning on a GBP 3.0M acquisition is a near-term risk that outweighs the medium-term diversification benefit. Sequence matters - stabilise first, then grow.'},
        {id:'c',text:'Tell the CFO the decision is above your level - you can provide the financial analysis but the strategic call is not yours.',quality:'medium',kpiImpact:{reliability:5,decision_quality:3,communication:3},xp:18,feedback:'The CFO specifically asked for your view. Declining to give one when directly asked by a senior leader is not appropriate deference - it is an abdication. Give your view, qualify it appropriately, and let the CFO decide.'},
        {id:'d',text:'Recommend abandoning the acquisition permanently - too much risk.',quality:'medium',kpiImpact:{reliability:5,decision_quality:5,communication:3},xp:20,feedback:'"Pause for 90 days" is more sophisticated than "abandon permanently". The target may still be a good acquisition at the right time and price. A permanent abandonment recommendation without testing the financing environment after stabilisation is premature.'},
      ],
      xp_reward:50, due_offset_mins:180,
    },
    {
      id:'fa_d5_003', day:5, type:'decision', urgency:'normal',
      title:'Graduate analyst asks you to review their work - you find errors',
      description:`A junior analyst on your team has prepared the revised full-year forecast model for you to review before it goes to the CFO. You find two errors:\n\n1. A formula error that understates the bad debt provision by GBP 45k\n2. The revenue loss calculation uses monthly revenue (not annual) - understates the impact by a factor of 12\n\nThe graduate is presenting this to the CFO in 2 hours. They are anxious and have worked hard on it.`,
      options:[
        {id:'a',text:'Tell the analyst immediately and clearly: "There are two errors that need fixing before this goes to the CFO - here they are. You have 2 hours, which is enough time. I will sit with you for 30 minutes to make sure the corrections are right. Errors in board documents happen - what matters is catching them before they go out." Fix the errors and let them present.',quality:'good',kpiImpact:{reliability:12,decision_quality:10,communication:15},xp:45,feedback:'This is how good senior colleagues develop junior ones. You told them directly (they need to know), you made it constructive (errors happen, catching them is the job), you offered your time (30 minutes to verify the fix), and you let them present (appropriate for their development). The CFO gets accurate numbers.'},
        {id:'b',text:'Fix the errors yourself and present the corrected model to the CFO without mentioning them to the analyst.',quality:'bad',kpiImpact:{reliability:5,decision_quality:-5,communication:-8},xp:5,feedback:'Fixing the errors without telling the analyst means they do not learn. They will make the same errors again. And if they present a model they believe is correct but that you have silently changed, they cannot defend it if challenged. Tell them directly.'},
        {id:'c',text:'Tell the analyst and delay the CFO meeting by 1 day to give more time to fix and verify.',quality:'medium',kpiImpact:{reliability:5,decision_quality:5,communication:5},xp:22,feedback:'The delay is not necessary - 2 hours is enough to fix two calculation errors. Delaying the CFO meeting for fixable errors sends the wrong signal about the team\'s capability. Fix and present on schedule.'},
        {id:'d',text:'Let the analyst present the model with the errors - the CFO will catch them and it will be a learning experience.',quality:'bad',kpiImpact:{reliability:-8,decision_quality:-10,communication:-10},xp:0,feedback:'Allowing a model with a factor-of-12 error to go to a CFO is not a learning experience - it is a reputation-damaging event for the analyst and for you as the reviewer. Your job as the senior reviewer is to catch errors before they reach the CFO, not to use the CFO as a teaching tool.'},
      ],
      xp_reward:45, due_offset_mins:90,
    },
    {
      id:'fa_d5_004', day:5, type:'document', urgency:'normal',
      title:'Personal learning reflection - Week 1',
      description:`Final task of Level 1. Write your personal learning reflection:\n\n1. The most significant decision you made this week and what you learned from it\n2. One thing you would do differently if you could repeat the week\n3. The skill or behaviour you want to develop most in Level 2\n4. How your performance this week compares to where you want to be in your career`,
      rubric:{criteria:['References specific events from the week','Honest about development areas','Level 2 goal is specific','Shows self-awareness about career gap','Authentic - not template language'],scoring_notes:'Specific and honest scores highest. Generic positive statements score lowest.',},
      xp_reward:35, due_offset_mins:480,
    },
  ],
}
