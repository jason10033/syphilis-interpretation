import { describe, it, expect } from 'vitest'
import { dilutionSteps, monthsBetween, interpret, TITER_VALUES, TITER_LABELS } from './titer'

describe('dilutionSteps', () => {
  it('returns 0 for an unchanged titer', () => {
    expect(dilutionSteps(8, 8)).toBe(0)
  })
  it('counts a single doubling as 1 step up', () => {
    expect(dilutionSteps(8, 16)).toBe(1)
  })
  it('counts a fourfold rise as 2 steps up', () => {
    expect(dilutionSteps(8, 32)).toBe(2)
  })
  it('counts a fourfold decline as 2 steps down', () => {
    expect(dilutionSteps(32, 8)).toBe(-2)
  })
  it('spans the full series correctly', () => {
    expect(dilutionSteps(1, 256)).toBe(8)
    expect(dilutionSteps(256, 1)).toBe(-8)
  })
  it('treats nonreactive (0) as the bottom of the series', () => {
    expect(dilutionSteps(0, 4)).toBe(3) // 0 -> 1 -> 2 -> 4
  })
})

describe('monthsBetween', () => {
  it('computes whole months across the same year', () => {
    expect(monthsBetween('2024-01-15', '2024-07-15')).toBe(6)
  })
  it('computes months across a year boundary', () => {
    expect(monthsBetween('2023-11-01', '2024-02-01')).toBe(3)
  })
  it('returns 0 for the same month', () => {
    expect(monthsBetween('2024-03-02', '2024-03-28')).toBe(0)
  })
})

// Helper to build interpret() input with sane defaults.
function input(over = {}) {
  return {
    treponemal: 'reactive',
    currentTiter: 8,
    priorTiterType: null,
    priorTiter: null,
    priorDate: null,
    currentDate: null,
    treated: null,
    ...over,
  }
}

describe('interpret - treponemal nonreactive', () => {
  it('nonreactive trep + nonreactive RPR = no syphilis', () => {
    const r = interpret(input({ treponemal: 'nonreactive', currentTiter: 0 }))
    expect(r.type).toBe('negative')
    expect(r.title).toBe('No syphilis detected')
  })
  it('nonreactive trep + reactive RPR = false-positive RPR', () => {
    const r = interpret(input({ treponemal: 'nonreactive', currentTiter: 8 }))
    expect(r.type).toBe('negative')
    expect(r.title).toBe('False-positive RPR')
  })
})

describe('interpret - discordant (trep reactive, RPR nonreactive)', () => {
  it('flags discordant and recommends treatment without deferring', () => {
    const r = interpret(input({ treponemal: 'reactive', currentTiter: 0 }))
    expect(r.type).toBe('indeterminate')
    expect(r.title).toMatch(/discordant/i)
    expect(r.next).toMatch(/late latent/i)
  })
})

describe('interpret - reactive serology, no prior', () => {
  it('uses a bulleted next-steps list and defaults to late latent', () => {
    const r = interpret(input({ currentTiter: 8, priorTiterType: 'none' }))
    expect(r.type).toBe('reactive')
    expect(Array.isArray(r.nextItems)).toBe(true)
    expect(r.nextItems.join(' ')).toMatch(/late latent \/ latent of unknown duration/i)
  })
  it('does not call a low titer "moderate" and stays conservative', () => {
    const r = interpret(input({ currentTiter: 8, priorTiterType: 'none' }))
    expect(r.body).not.toMatch(/moderate/i)
    expect(r.body).toMatch(/new infection or previously treated/i)
  })
  it('notes high titer for 1:32 or greater', () => {
    const r = interpret(input({ currentTiter: 64, priorTiterType: 'none' }))
    expect(r.body).toMatch(/high titer/i)
  })
})

describe('interpret - new seroconversion (prior nonreactive)', () => {
  it('treats as new infection', () => {
    const r = interpret(input({ currentTiter: 8, priorTiterType: 'nonreactive' }))
    expect(r.type).toBe('reactive')
    expect(r.title).toMatch(/seroconversion/i)
  })
})

describe('interpret - fourfold rise', () => {
  it('1:8 -> 1:32 is a fourfold rise (reinfection/failure)', () => {
    const r = interpret(input({ currentTiter: 32, priorTiterType: 'reactive', priorTiter: 8, treated: 'yes' }))
    expect(r.flag).toBe('rise')
    expect(r.title).toMatch(/rise/i)
    expect(r.body).toMatch(/4-fold increase/)
  })
  it('treated patient: framed as reinfection more likely than failure', () => {
    const r = interpret(input({ currentTiter: 32, priorTiterType: 'reactive', priorTiter: 8, treated: 'yes' }))
    expect(r.body).toMatch(/reinfection is far more common/i)
  })
  it('exactly 2 steps counts as fourfold (boundary)', () => {
    const r = interpret(input({ currentTiter: 16, priorTiterType: 'reactive', priorTiter: 4, treated: 'unknown' }))
    expect(r.flag).toBe('rise')
  })
})

describe('interpret - fourfold decline', () => {
  it('1:32 -> 1:8 is a fourfold decline (adequate response)', () => {
    const r = interpret(input({ currentTiter: 8, priorTiterType: 'reactive', priorTiter: 32, treated: 'yes' }))
    expect(r.flag).toBe('decline')
    expect(r.type).toBe('negative')
    expect(r.body).toMatch(/4-fold decrease/)
  })
  it('decline to nonreactive gives lifelong-treponemal guidance', () => {
    const r = interpret(input({ currentTiter: 0, priorTiterType: 'reactive', priorTiter: 16, treated: 'yes' }))
    expect(r.flag).toBe('decline')
    expect(r.next).toMatch(/reactive for life/i)
  })
  it('excellent response when fourfold within 12 months and titer <= 1:4', () => {
    const r = interpret(input({
      currentTiter: 4, priorTiterType: 'reactive', priorTiter: 16, treated: 'yes',
      priorDate: '2024-01-01', currentDate: '2024-09-01',
    }))
    expect(r.body).toMatch(/excellent treatment response/i)
  })
})

describe('interpret - less than fourfold (stable)', () => {
  it('unchanged titer is flagged stable', () => {
    const r = interpret(input({ currentTiter: 8, priorTiterType: 'reactive', priorTiter: 8, treated: 'yes' }))
    expect(r.flag).toBe('stable')
    expect(r.title).toMatch(/stable/i)
  })
  it('treated + low stable titer beyond 12 months reads as serofast', () => {
    const r = interpret(input({
      currentTiter: 2, priorTiterType: 'reactive', priorTiter: 4, treated: 'yes',
      priorDate: '2023-01-01', currentDate: '2024-06-01',
    }))
    expect(r.body).toMatch(/serofast/i)
  })
  it('treated + persistent titer beyond 12 months flags possible failure', () => {
    const r = interpret(input({
      currentTiter: 16, priorTiterType: 'reactive', priorTiter: 8, treated: 'yes',
      priorDate: '2023-01-01', currentDate: '2024-06-01',
    }))
    // 8 -> 16 is +1 step = less than fourfold, but >12mo and titer >4
    expect(r.body).toMatch(/likely treatment failure or reinfection/i)
  })
  it('untreated stable titer prompts treatment without delay', () => {
    const r = interpret(input({ currentTiter: 8, priorTiterType: 'reactive', priorTiter: 8, treated: 'no' }))
    expect(r.next).toMatch(/treat without delay/i)
  })
  it('unknown treatment history defaults to late latent', () => {
    const r = interpret(input({ currentTiter: 8, priorTiterType: 'reactive', priorTiter: 8, treated: 'unknown' }))
    expect(r.next).toMatch(/late latent/i)
  })
})

describe('content hygiene', () => {
  it('produces no em dashes in any interpretation output', () => {
    const cases = [
      input({ treponemal: 'nonreactive', currentTiter: 0 }),
      input({ treponemal: 'nonreactive', currentTiter: 8 }),
      input({ treponemal: 'reactive', currentTiter: 0 }),
      input({ currentTiter: 8, priorTiterType: 'none' }),
      input({ currentTiter: 64, priorTiterType: 'none' }),
      input({ currentTiter: 8, priorTiterType: 'nonreactive' }),
      input({ currentTiter: 32, priorTiterType: 'reactive', priorTiter: 8, treated: 'yes' }),
      input({ currentTiter: 8, priorTiterType: 'reactive', priorTiter: 32, treated: 'yes' }),
      input({ currentTiter: 8, priorTiterType: 'reactive', priorTiter: 8, treated: 'no' }),
    ]
    for (const c of cases) {
      const r = interpret(c)
      const text = [r.title, r.body, r.next, ...(r.nextItems || [])].join(' ')
      expect(text).not.toContain('—') // em dash
      expect(text).not.toContain('–') // en dash
    }
  })

  it('every result carries a title, type, and flag field', () => {
    const r = interpret(input({ currentTiter: 8, priorTiterType: 'none' }))
    expect(r.title).toBeTruthy()
    expect(r.type).toBeTruthy()
    expect('flag' in r).toBe(true)
  })
})

describe('extended high-titer series', () => {
  it('series runs through 1:2048 and a >1:2048 cap', () => {
    expect(TITER_LABELS[512]).toBe('1:512')
    expect(TITER_LABELS[1024]).toBe('1:1024')
    expect(TITER_LABELS[2048]).toBe('1:2048')
    expect(TITER_LABELS[4096]).toBe('>1:2048')
  })
  it('each high value is one doubling step above the previous', () => {
    expect(dilutionSteps(256, 512)).toBe(1)
    expect(dilutionSteps(512, 1024)).toBe(1)
    expect(dilutionSteps(1024, 2048)).toBe(1)
    expect(dilutionSteps(2048, 4096)).toBe(1)
  })
  it('1:512 -> 1:2048 is a fourfold (2-step) rise', () => {
    const r = interpret(input({ currentTiter: 2048, priorTiterType: 'reactive', priorTiter: 512, treated: 'yes' }))
    expect(r.flag).toBe('rise')
    expect(r.body).toMatch(/4-fold increase/)
  })
  it('1:2048 -> 1:128 is a fourfold-plus decline (adequate response)', () => {
    const r = interpret(input({ currentTiter: 128, priorTiterType: 'reactive', priorTiter: 2048, treated: 'yes' }))
    expect(r.flag).toBe('decline')
    expect(r.type).toBe('negative')
  })
  it('high titer with no prior reads as high titer', () => {
    const r = interpret(input({ currentTiter: 4096, priorTiterType: 'none' }))
    expect(r.body).toMatch(/high titer/i)
  })
  it('renders a label (not undefined) for every value in the series', () => {
    for (const v of TITER_VALUES) {
      const r = interpret(input({ currentTiter: v === 0 ? 8 : v, priorTiterType: 'reactive', priorTiter: v === 0 ? 8 : v, treated: 'yes' }))
      expect(r.body).not.toMatch(/undefined/)
    }
  })
})

// Property-style matrix: exercise interpret() across the full cartesian product of
// reachable inputs and assert invariants that must hold for every result.
describe('interpretation matrix invariants', () => {
  const reactiveTiters = TITER_VALUES.filter(v => v > 0)
  const allTiters = TITER_VALUES
  const priorTypes = ['none', 'nonreactive', 'reactive']
  const treatedStates = ['yes', 'no', 'unknown', null]
  const dates = [
    [null, null],
    ['2023-01-01', '2023-04-01'],   // 3 months
    ['2023-01-01', '2024-01-01'],   // 12 months
    ['2021-01-01', '2024-01-01'],   // 36 months
  ]

  function buildCases() {
    const cases = []
    // Treponemal nonreactive branch
    for (const t of allTiters) cases.push(input({ treponemal: 'nonreactive', currentTiter: t }))
    // Treponemal reactive, every current titer (incl. 0), prior type, prior titer, treated, dates
    for (const cur of allTiters) {
      for (const pt of priorTypes) {
        for (const tr of treatedStates) {
          for (const [pd, cd] of dates) {
            if (pt === 'reactive') {
              for (const prior of reactiveTiters) {
                cases.push(input({ currentTiter: cur, priorTiterType: pt, priorTiter: prior, treated: tr, priorDate: pd, currentDate: cd }))
              }
            } else {
              cases.push(input({ currentTiter: cur, priorTiterType: pt, treated: tr, priorDate: pd, currentDate: cd }))
            }
          }
        }
      }
    }
    return cases
  }

  const cases = buildCases()

  it('covers a large input space', () => {
    expect(cases.length).toBeGreaterThan(2000)
  })

  it('never throws and always returns a well-formed result', () => {
    for (const c of cases) {
      const r = interpret(c)
      expect(r).toBeTruthy()
      expect(typeof r.title).toBe('string')
      expect(r.title.length).toBeGreaterThan(0)
      expect(['reactive', 'negative', 'indeterminate']).toContain(r.type)
      expect('flag' in r).toBe(true)
      // exactly one of next / nextItems carries the guidance
      const hasNext = typeof r.next === 'string' && r.next.length > 0
      const hasItems = Array.isArray(r.nextItems) && r.nextItems.length > 0
      expect(hasNext || hasItems).toBe(true)
    }
  })

  it('never references an undefined titer label', () => {
    for (const c of cases) {
      const r = interpret(c)
      const text = [r.title, r.body, r.next, ...(r.nextItems || [])].join(' ')
      expect(text).not.toMatch(/undefined|NaN/)
    }
  })

  it('produces no em or en dashes anywhere', () => {
    for (const c of cases) {
      const r = interpret(c)
      const text = [r.title, r.body, r.next, ...(r.nextItems || [])].join(' ')
      expect(text.includes('—')).toBe(false)
      expect(text.includes('–')).toBe(false)
    }
  })

  it('fourfold rule: with a documented prior reactive titer, the flag matches the dilution-step count', () => {
    for (const cur of reactiveTiters) {
      for (const prior of reactiveTiters) {
        const r = interpret(input({ currentTiter: cur, priorTiterType: 'reactive', priorTiter: prior, treated: 'yes' }))
        const steps = dilutionSteps(prior, cur)
        if (steps >= 2) expect(r.flag).toBe('rise')
        else if (steps <= -2) expect(r.flag).toBe('decline')
        else expect(r.flag).toBe('stable')
      }
    }
  })

  it('a fourfold rise is always typed reactive; a fourfold decline always negative', () => {
    for (const cur of reactiveTiters) {
      for (const prior of reactiveTiters) {
        const r = interpret(input({ currentTiter: cur, priorTiterType: 'reactive', priorTiter: prior, treated: 'unknown' }))
        const steps = dilutionSteps(prior, cur)
        if (steps >= 2) expect(r.type).toBe('reactive')
        if (steps <= -2) expect(r.type).toBe('negative')
      }
    }
  })
})
