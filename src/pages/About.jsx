import Disclaimer from '../components/Disclaimer'

const BRAND_CRIMSON = '#8B1A1A'
const BRAND_BLUE = '#5B9EC9'
const BRAND_DARK = '#162447'

const REFERENCES = [
  {
    id: 1,
    citation: 'Workowski KA, Bachmann LH, Chan PA, et al. Sexually Transmitted Infections Treatment Guidelines, 2021.',
    journal: 'MMWR Recomm Rep',
    year: '2021',
    detail: '2021;70(4):1–187.',
  },
  {
    id: 2,
    citation: 'Ghanem KG, Ram S, Rice PA. The Modern Epidemic of Syphilis.',
    journal: 'N Engl J Med',
    year: '2020',
    detail: '2020;382(9):845–854.',
  },
  {
    id: 3,
    citation: 'Hamill MM, Ghanem KG, Tuddenham S. State-of-the-Art Review: Neurosyphilis.',
    journal: 'Clin Infect Dis',
    year: '2024',
    detail: '2024;78(5):e57–68.',
  },
  {
    id: 4,
    citation: 'Flores JM, Rochat R, Stafford IA, Heiselman C, Nachman S, Zucker J. State-of-the-Art Review: Congenital Syphilis in the Modern Era: Current Strategies and Future Directions.',
    journal: 'Clin Infect Dis',
    year: '2025',
    detail: '2025;81(6):1023–1035.',
  },
]

export default function About() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '32px 16px 56px' }}>

      {/* PTC Logo block */}
      <div style={{
        background: BRAND_DARK,
        borderRadius: 'var(--radius)',
        padding: '24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-md)',
      }}>
        <img
          src="/ptc-logo.png"
          alt="NYC STI/HIV Prevention Training Center"
          style={{ height: 80, width: 'auto', display: 'block' }}
        />
      </div>

      {/* About this tool */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '20px',
        marginBottom: 16,
        boxShadow: 'var(--shadow)',
      }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
          About Syphilis Algorithm
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 12 }}>
          This syphilis test interpretation reference is brought to you by the <strong style={{ color: 'var(--text-primary)' }}>NYC STI/HIV Prevention Training Center (PTC)</strong>, a CDC-funded regional training center serving New York, New Jersey, Puerto Rico, the U.S. Virgin Islands, Michigan, Ohio, and Indiana.
        </p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 12 }}>
          A program of <strong style={{ color: 'var(--text-primary)' }}>Columbia University Mailman School of Public Health</strong> Department of Sociomedical Sciences, the PTC is dedicated to increasing the sexual health knowledge and skills of clinical health professionals in the prevention, diagnosis, and management of sexually transmitted infections (STIs). We work with clinical providers and are part of the <strong style={{ color: 'var(--text-primary)' }}>National Network of STD Clinical Prevention Training Centers (NNPTC)</strong>.
        </p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          This tool is designed to support clinicians at the point of care in interpreting syphilis serology results from both the traditional and reverse sequence testing algorithms, based on the CDC 2021 STI Treatment Guidelines.
        </p>
      </div>

      {/* What's included */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        marginBottom: 16,
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--background)' }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>What is included</h2>
        </div>
        {[
          { icon: '+', label: 'Traditional Algorithm', desc: 'Nontreponemal-first (RPR/VDRL) interactive flowchart with tap-to-expand test node details and treatment table by stage' },
          { icon: 'T', label: 'Reverse Algorithm', desc: 'Treponemal EIA/CIA-first interactive flowchart with discordant result explainer and step-by-step logic' },
          { icon: 'Rx', label: 'Clinical Case Library', desc: '6 canonical scenarios (primary, secondary, discordant, false-positive, neurosyphilis, pregnancy) with tap-to-reveal interpretations' },
          { icon: 'S', label: 'Stages and Serology Timeline', desc: 'All syphilis stages with clinical features, expected serology, and treatment implications. Includes serologic timeline and RPR monitoring guidance.' },
          { icon: '=', label: 'Quick Reference Card', desc: 'Every result pattern for both algorithms, full treatment table, and special situations. Built to bookmark.' },
        ].map(({ icon, label, desc }) => (
          <div key={label} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{
              fontSize: 12,
              fontWeight: 800,
              color: BRAND_BLUE,
              flexShrink: 0,
              marginTop: 1,
              width: 20,
              textAlign: 'center',
            }}>{icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Clinical disclaimer */}
      <Disclaimer source="Workowski KA et al. MMWR Recomm Rep 2021;70(4):1-187." />

      {/* NNPTC Clinical Consultation */}
      <a
        href="https://www.stdccn.org/render/Public"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: BRAND_CRIMSON,
          color: 'white',
          borderRadius: 'var(--radius)',
          padding: '16px 20px',
          textDecoration: 'none',
          boxShadow: 'var(--shadow-md)',
          marginTop: 16,
          marginBottom: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>Have a complicated clinical question?</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>NNPTC Clinical Consultation — free expert guidance for providers</div>
        </div>
        <span style={{ fontSize: 20, opacity: 0.8 }}>→</span>
      </a>

      {/* Link to PTC */}
      <a
        href="https://www.publichealth.columbia.edu/research/centers/new-york-city-sti-hiv-prevention-training-center"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: BRAND_DARK,
          color: 'white',
          borderRadius: 'var(--radius)',
          padding: '16px 20px',
          textDecoration: 'none',
          boxShadow: 'var(--shadow-md)',
          marginBottom: 24,
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>Visit the NYC STI/HIV PTC</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Training, resources, and consultation for clinicians</div>
        </div>
        <span style={{ fontSize: 20, opacity: 0.7 }}>→</span>
      </a>

      {/* References */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--background)' }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>References</h2>
        </div>
        {REFERENCES.map((ref, i) => (
          <div key={ref.id} style={{
            padding: '14px 20px',
            borderBottom: i < REFERENCES.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary-mid)', flexShrink: 0, marginTop: 1 }}>{ref.id}.</span>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 3 }}>{ref.citation}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  <em>{ref.journal}</em>{ref.year ? ` ${ref.year}.` : '.'} {ref.detail}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
