// Pure syphilis serology interpretation logic.
// Extracted from the Interpret page so it can be unit-tested in isolation.

// Dilution series. Index 0 = nonreactive. The top value (4096) is a sentinel for
// ">1:2048" so titers that do not fully titrate out still have a selectable cap;
// it sits one doubling step above 1:2048 so the dilution-step math stays correct.
export const TITER_VALUES = [0, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096]

export const TITER_LABELS = {
  0: 'Nonreactive',
  1: '1:1',
  2: '1:2',
  4: '1:4',
  8: '1:8',
  16: '1:16',
  32: '1:32',
  64: '1:64',
  128: '1:128',
  256: '1:256',
  512: '1:512',
  1024: '1:1024',
  2048: '1:2048',
  4096: '>1:2048',
}

// Signed number of dilution steps from `from` to `to` in the doubling series.
// Positive = rise, negative = decline. A fourfold change is 2 steps.
export function dilutionSteps(from, to) {
  const fromIdx = TITER_VALUES.indexOf(from)
  const toIdx = TITER_VALUES.indexOf(to)
  return toIdx - fromIdx
}

// Whole months between two ISO date strings (dateStr1 older, dateStr2 newer).
export function monthsBetween(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1)
  const d2 = new Date(dateStr2)
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth())
}

export function interpret({ treponemal, currentTiter, priorTiterType, priorTiter, priorDate, currentDate, treated }) {
  // Nonreactive treponemal
  if (treponemal === 'nonreactive') {
    if (currentTiter === 0) {
      return {
        type: 'negative',
        title: 'No syphilis detected',
        body: 'Nonreactive treponemal and nonreactive RPR. No serologic evidence of syphilis.',
        next: 'No treatment indicated. If primary syphilis is suspected clinically (painless ulcer, recent exposure within 90 days), serology may not yet be positive. Consider dark-field microscopy or PCR on ulcer exudate, and repeat serology in 4-6 weeks.',
        flag: null,
      }
    } else {
      return {
        type: 'negative',
        title: 'False-positive RPR',
        body: 'Reactive RPR with nonreactive treponemal test is a biologic false positive. This is not syphilis infection.',
        next: 'Do not treat for syphilis. Investigate cause of false-positive RPR (pregnancy, autoimmune disease, acute viral infection, older age, injection drug use). Document in the medical record to prevent inadvertent treatment in the future.',
        flag: null,
      }
    }
  }

  // Treponemal reactive, RPR nonreactive = discordant.
  // Exception: if a documented prior reactive titer exists, fall through to the
  // change calculation below so a decline-to-nonreactive after treatment is read
  // as an adequate response rather than an unresolved discordant result.
  if (currentTiter === 0 && !(priorTiterType === 'reactive' && priorTiter != null)) {
    return {
      type: 'indeterminate',
      title: 'Discordant result: treponemal reactive, RPR nonreactive',
      body: 'This pattern has three explanations: (1) past treated syphilis with RPR that has declined to nonreactive; (2) very early primary syphilis before the RPR has risen; (3) false-positive treponemal screen. Without documented prior treatment, this result should prompt treatment, not observation.',
      next: 'If prior adequate treatment is not clearly documented in the medical record: treat as late latent syphilis (benzathine penicillin G 2.4M units IM weekly x 3 doses). Do not defer treatment while awaiting TP-PA confirmation. Order TP-PA in parallel to confirm exposure. If prior treatment is well-documented and the patient has no new symptoms or exposures, repeat RPR in 6 months rather than retreating.',
      flag: null,
    }
  }

  // Treponemal reactive, RPR reactive, no prior for comparison
  if (priorTiterType === 'none') {
    const tierNote = currentTiter >= 32
      ? `RPR ${TITER_LABELS[currentTiter]}: high titer. This may represent new or active infection, but staging by history and prior testing is still required.`
      : `RPR ${TITER_LABELS[currentTiter]}: this result is consistent with either new infection or previously treated syphilis. Do not assume stage without clinical history and prior testing.`
    return {
      type: 'reactive',
      title: 'Reactive syphilis serology: staging required',
      body: `Both treponemal and RPR are reactive. No prior RPR is available for comparison. ${tierNote}`,
      nextItems: [
        'Ask about prior syphilis diagnosis and any documented treatment',
        'Assess recent sexual exposures and pre-test probability',
        'Obtain prior testing and treatment history from DOH if available',
        'Assess for symptoms: painless ulcer, diffuse rash (especially palms/soles), mucous patches, condyloma lata, lymphadenopathy',
        'Treatment: Most commonly default to late latent / latent of unknown duration and treat with benzathine penicillin G 2.4M units IM weekly x 3 doses.',
      ],
      flag: null,
    }
  }

  // Prior was nonreactive, now reactive = new seroconversion
  if (priorTiterType === 'nonreactive') {
    return {
      type: 'reactive',
      title: 'New seroconversion: RPR newly reactive',
      body: `RPR was previously nonreactive and is now reactive at ${TITER_LABELS[currentTiter]}. This represents new T. pallidum infection.`,
      next: 'Treat as early syphilis (benzathine penicillin G 2.4M units IM x 1 dose). Offer partner services and notify partners from the prior 3-12 months depending on stage. Screen for HIV and other STIs. Repeat RPR at 6 and 12 months to confirm fourfold decline.',
      flag: null,
    }
  }

  // Both prior and current titers: calculate change
  const steps = dilutionSteps(priorTiter, currentTiter)
  const months = priorDate && currentDate ? monthsBetween(priorDate, currentDate) : null

  if (steps >= 2) {
    const timeNote = months !== null ? ` The prior titer was ${months} month${months === 1 ? '' : 's'} ago.` : ''
    const context = treated === 'yes'
      ? 'Given prior treatment, a fourfold rise most likely represents reinfection. Reinfection is far more common than true treatment failure.'
      : treated === 'no'
        ? 'The patient was not previously treated. This rise may reflect disease progression or worsening latent infection.'
        : 'Treatment history is unknown. Approach as reinfection or treatment failure until clarified.'
    return {
      type: 'reactive',
      title: 'Fourfold or greater rise: reinfection or treatment failure',
      body: `RPR rose from ${TITER_LABELS[priorTiter]} to ${TITER_LABELS[currentTiter]} (${steps} dilution step${steps === 1 ? '' : 's'} up, a ${Math.pow(2, steps)}-fold increase).${timeNote} ${context}`,
      next: 'Retreat as early syphilis: benzathine penicillin G 2.4M units IM x 1 dose if reinfection is likely. Perform lumbar puncture if any neurologic or ophthalmic symptoms are present, if the patient is HIV-positive, or if stage is uncertain. Do not wait for LP before treating if LP cannot be done promptly. Offer partner services. Screen for HIV. Repeat RPR in 6 months to confirm decline.',
      flag: 'rise',
    }
  }

  if (steps <= -2) {
    const timeNote = months !== null ? ` (${months} month${months === 1 ? '' : 's'} since prior titer)` : ''
    let adequacy = 'This is consistent with an adequate treatment response.'
    if (months !== null) {
      if (months <= 12 && currentTiter <= 4) adequacy = 'Fourfold decline achieved within 12 months: excellent treatment response.'
      else if (months > 24 && currentTiter > 4) adequacy = 'Decline is adequate but titer remains above 1:4 after more than 2 years. Lumbar puncture should be strongly considered to exclude neurosyphilis if not previously done.'
    }
    return {
      type: 'negative',
      title: 'Fourfold or greater decline: adequate treatment response',
      body: `RPR declined from ${TITER_LABELS[priorTiter]} to ${TITER_LABELS[currentTiter]}${timeNote} (${Math.abs(steps)} dilution step${Math.abs(steps) === 1 ? '' : 's'} down, a ${Math.pow(2, Math.abs(steps))}-fold decrease). ${adequacy}`,
      next: currentTiter === 0
        ? 'RPR is now nonreactive. Continue monitoring at scheduled intervals. For primary/secondary: recheck at 12 months. For late latent: recheck at 24 months. Treponemal tests remain reactive for life and should not be used to assess treatment response.'
        : `RPR is still reactive at ${TITER_LABELS[currentTiter]}. Continue monitoring. For primary/secondary syphilis, the target is nonreactive or 1:1-1:4 within 12-24 months. For late latent, a stable low titer (serofast) is acceptable if fourfold decline has been achieved. If RPR rises fourfold at any future visit, evaluate for reinfection.`,
      flag: 'decline',
    }
  }

  // Less than fourfold change in either direction
  const direction = steps > 0 ? 'risen' : steps < 0 ? 'fallen' : 'unchanged'
  const changeNote = steps === 0
    ? `RPR is unchanged at ${TITER_LABELS[currentTiter]}.`
    : `RPR has ${direction} by ${Math.abs(steps)} dilution step from ${TITER_LABELS[priorTiter]} to ${TITER_LABELS[currentTiter]}: less than a fourfold change.`
  const timeNote = months !== null ? ` (${months} month${months === 1 ? '' : 's'} since prior titer)` : ''

  let interpretation = ''
  let next = ''

  if (treated === 'yes') {
    if (months !== null && months >= 12 && currentTiter <= 4) {
      interpretation = `${changeNote}${timeNote} Low stable titer after treatment: consistent with serofast reaction.`
      next = 'A serofast RPR (low stable titer persisting after adequate treatment) does not indicate treatment failure. No retreatment is needed in the absence of new symptoms, new exposures, or a rising titer. Document the serofast baseline clearly to prevent unnecessary retreatment at future visits. Continue annual monitoring.'
    } else if (months !== null && months < 6) {
      interpretation = `${changeNote}${timeNote} It is too early to determine adequacy of treatment response.`
      next = 'Fourfold decline is expected within 6-12 months for primary/secondary syphilis, and 12-24 months for late latent. Recheck at the appropriate interval. If titer rises fourfold or fails to decline fourfold within 12 months, evaluate urgently for reinfection or treatment failure. Do not continue routine monitoring without action.'
    } else if (months !== null && months >= 12 && currentTiter > 4) {
      interpretation = `${changeNote}${timeNote} Titer has not declined fourfold after more than 12 months: likely treatment failure or reinfection. Action is required.`
      next = 'Do not continue monitoring without intervention. Evaluate for reinfection (new exposure history, new partner). Perform lumbar puncture to exclude neurosyphilis. If no new exposure and no neurosyphilis: retreat with benzathine penicillin G 2.4M units IM weekly x 3 doses. If reinfection is likely: treat as early syphilis (single dose). Repeat RPR 6 months after retreatment.'
    } else {
      interpretation = `${changeNote}${timeNote} Titer is stable. Treatment response cannot yet be fully assessed.`
      next = 'Continue monitoring RPR at scheduled intervals. If titer does not achieve fourfold decline within 12 months of treatment for primary/secondary syphilis (or 24 months for late latent), evaluate for failure or reinfection. Do not simply continue observation. If titer rises fourfold at any point, treat promptly.'
    }
  } else if (treated === 'no') {
    interpretation = `${changeNote}${timeNote} Stable titer in an untreated patient.`
    next = 'Stable serology in untreated syphilis does not mean the infection is clinically inactive. This likely represents latent infection. Treat without delay. Stage by clinical history. If stage is unclear, treat as late latent or unknown duration (benzathine penicillin G 2.4M units IM weekly x 3 doses). Perform LP if any neurologic or ophthalmic symptoms are present.'
  } else {
    interpretation = `${changeNote}${timeNote} Stable titer with unknown treatment history.`
    next = 'Do not defer treatment pending further history. Treat as late latent syphilis (benzathine penicillin G 2.4M units IM weekly x 3 doses) unless early syphilis can be confirmed by history. Monitor RPR at 6, 12, and 24 months after treatment.'
  }

  return {
    type: 'indeterminate',
    title: 'Stable titer: less than fourfold change',
    body: interpretation,
    next,
    flag: 'stable',
  }
}
