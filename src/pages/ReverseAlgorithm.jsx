import { useState } from 'react'
import Disclaimer from '../components/Disclaimer'

const NODE_INFO = {
  step1: {
    title: 'Treponemal Screen (EIA or CIA)',
    detects: 'Antibodies to T. pallidum antigens using enzyme immunoassay (EIA) or chemiluminescence immunoassay (CIA). Automated and high-throughput; well-suited to high-volume labs.',
    reactive: 'A reactive result indicates prior exposure to T. pallidum. It does not confirm active infection. All reactive screens require reflex to quantitative nontreponemal testing.',
    falsePositive: 'False-positive rate is low (~0.2-0.5%) but occurs with Lyme disease, autoimmune conditions, and other spirochetal infections. Discordant results require a second treponemal test to resolve.',
    source: 'Workowski KA et al. MMWR Recomm Rep 2021;70(4):1-187',
  },
  step2: {
    title: 'Quantitative Nontreponemal Test (RPR)',
    detects: 'Cardiolipin-lecithin-cholesterol antibodies. The quantitative titer (e.g., 1:8, 1:32) reflects disease activity and is essential for monitoring treatment response.',
    reactive: 'A reactive RPR after a reactive EIA/CIA confirms syphilis infection. The titer guides staging and follow-up. A fourfold titer decline (2 dilution drop) after treatment indicates adequate response.',
    falsePositive: 'A nonreactive RPR after a reactive treponemal screen is a discordant result. This is not automatically a false positive; it may represent past treated syphilis, very early infection, or a true false-positive EIA.',
    source: 'Workowski KA et al. MMWR Recomm Rep 2021;70(4):1-187',
  },
  step3: {
    title: 'Second Treponemal Test (TP-PA)',
    detects: 'Antibodies to T. pallidum using a passive particle agglutination method. Used as a tie-breaker when the initial treponemal EIA/CIA is reactive but the RPR is nonreactive.',
    reactive: 'TP-PA reactive after discordant EIA+/RPR- result: confirms T. pallidum exposure. This pattern most often represents past treated syphilis, late latent syphilis, or very early primary syphilis (before RPR rises). Evaluate history and treat if no documented prior treatment.',
    falsePositive: 'TP-PA nonreactive after discordant EIA+/RPR- result: the initial treponemal screen was likely a false positive. No treatment needed unless clinical suspicion is very high.',
    source: 'Workowski KA et al. MMWR Recomm Rep 2021;70(4):1-187; Tong ML et al. J Clin Microbiol 2014',
  },
}

function InfoPanel({ nodeKey, onClose }) {
  const info = NODE_INFO[nodeKey]
  if (!info) return null
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '20px',
      marginTop: 8,
      boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{info.title}</h3>
        <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: 18, flexShrink: 0, padding: '0 4px', cursor: 'pointer' }}>x</button>
      </div>
      {[
        { label: 'Detects', text: info.detects },
        { label: 'Reactive result means', text: info.reactive },
        { label: 'False positives / discordance', text: info.falsePositive },
      ].map(({ label, text }) => (
        <div key={label} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 3 }}>{label}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</div>
        </div>
      ))}
      <div style={{ fontSize: 11, color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4 }}>
        Source: {info.source}
      </div>
    </div>
  )
}

function TestNode({ nodeKey, step, label, sublabel, activeNode, onToggle }) {
  const isOpen = activeNode === nodeKey
  return (
    <div>
      <button
        onClick={() => onToggle(isOpen ? null : nodeKey)}
        style={{
          width: '100%',
          background: isOpen ? 'var(--primary-bg)' : 'var(--surface)',
          border: `1.5px solid ${isOpen ? 'var(--primary-mid)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          cursor: 'pointer',
          textAlign: 'left',
          boxShadow: 'var(--shadow)',
          transition: 'all 0.15s',
        }}
      >
        <div style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: isOpen ? 'var(--primary-mid)' : 'var(--surface)',
          border: `2px solid ${isOpen ? 'var(--primary-mid)' : 'var(--border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 700,
          color: isOpen ? 'white' : 'var(--text-muted)',
          flexShrink: 0,
        }}>{step}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 2 }}>
            Step {step}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{label}</div>
          {sublabel && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sublabel}</div>
          )}
        </div>
        <span style={{ marginLeft: 'auto', color: isOpen ? 'var(--primary-mid)' : 'var(--text-muted)', fontSize: 12, flexShrink: 0 }}>
          {isOpen ? 'close' : 'info'}
        </span>
      </button>
      {isOpen && <InfoPanel nodeKey={nodeKey} onClose={() => onToggle(null)} />}
    </div>
  )
}

function ResultBadge({ label, type }) {
  const styles = {
    negative: { bg: 'var(--negative-bg)', border: 'var(--negative-border)', color: 'var(--negative)', dot: 'var(--negative-dot)' },
    reactive: { bg: 'var(--reactive-bg)', border: 'var(--reactive-border)', color: 'var(--reactive)', dot: 'var(--reactive-dot)' },
    indeterminate: { bg: 'var(--indeterminate-bg)', border: 'var(--indeterminate-border)', color: 'var(--indeterminate)', dot: 'var(--indeterminate-dot)' },
    info: { bg: 'var(--primary-bg)', border: 'var(--primary-border)', color: 'var(--primary-mid)', dot: 'var(--primary-mid)' },
  }
  const s = styles[type] || styles.indeterminate
  return (
    <div style={{
      background: s.bg,
      border: `1.5px solid ${s.border}`,
      borderRadius: 'var(--radius-sm)',
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: s.color, lineHeight: 1.3 }}>{label}</span>
    </div>
  )
}

function CascadePipe({ label, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4px 0' }}>
      <div style={{ width: 3, height: 14, background: color }} />
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color,
        padding: '2px 10px',
        background: 'white',
        border: `1.5px solid ${color}`,
        borderRadius: 20,
        margin: '2px 0',
      }}>{label}</div>
      <div style={{ width: 3, height: 14, background: color }} />
    </div>
  )
}

export default function ReverseAlgorithm() {
  const [activeNode, setActiveNode] = useState(null)

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 16px 56px' }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Reverse Sequence</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Treponemal-First Algorithm</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Start with EIA or CIA treponemal screen. Tap any test node to learn what it detects and why it exists in the sequence.</p>
      </div>

      <div style={{
        padding: '10px 14px',
        background: 'var(--crimson-bg)',
        border: '1px solid var(--crimson-border)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 16,
        fontSize: 12,
        color: 'var(--crimson)',
        fontWeight: 600,
      }}>
        Entry point: you have a reactive treponemal EIA or CIA screen result
      </div>

      {/* STEP 1 */}
      <TestNode
        nodeKey="step1"
        step={1}
        label="Treponemal Screen"
        sublabel="EIA or CIA (automated)"
        activeNode={activeNode}
        onToggle={setActiveNode}
      />

      {/* Branch after step 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '6px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CascadePipe label="Reactive" color="var(--reactive-border)" />
          <div style={{
            width: '100%',
            padding: '8px 10px',
            background: 'var(--reactive-bg)',
            border: '1.5px solid var(--reactive-border)',
            borderRadius: 8,
            textAlign: 'center',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--reactive)' }}>Reflex to Step 2</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CascadePipe label="Nonreactive" color="var(--negative-border)" />
          <ResultBadge label="Syphilis Negative" type="negative" />
          <div style={{ marginTop: 6, padding: '6px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}>
            <p style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              No syphilis antibodies detected. Report negative. No further testing needed unless clinical suspicion is high.
            </p>
          </div>
        </div>
      </div>

      {/* STEP 2 */}
      <TestNode
        nodeKey="step2"
        step={2}
        label="Quantitative Nontreponemal Test"
        sublabel="RPR with titer"
        activeNode={activeNode}
        onToggle={setActiveNode}
      />

      {/* Branch after step 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '6px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <CascadePipe label="Reactive" color="var(--reactive-border)" />
          <ResultBadge label="Syphilis Confirmed" type="reactive" />
          <div style={{ padding: '8px 10px', background: 'var(--reactive-bg)', border: '1px solid var(--reactive-border)', borderRadius: 8, marginTop: 2 }}>
            <p style={{ fontSize: 10, color: 'var(--reactive)', lineHeight: 1.4 }}>
              EIA+ RPR+ = active or prior syphilis confirmed. Quantify titer. Determine stage by clinical history and titer. Treat by stage.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <CascadePipe label="Nonreactive" color="var(--indeterminate-border)" />
          <ResultBadge label="Discordant: Step 3" type="indeterminate" />
          <div style={{ padding: '8px 10px', background: 'var(--indeterminate-bg)', border: '1px solid var(--indeterminate-border)', borderRadius: 8, marginTop: 2 }}>
            <p style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              EIA reactive but RPR nonreactive. Cannot interpret without a second treponemal test. Proceed to Step 3.
            </p>
          </div>
        </div>
      </div>

      {/* STEP 3 */}
      <TestNode
        nodeKey="step3"
        step={3}
        label="Second Treponemal Test"
        sublabel="TP-PA (T. pallidum particle agglutination)"
        activeNode={activeNode}
        onToggle={setActiveNode}
      />

      {/* Branch after step 3 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <CascadePipe label="Reactive" color="var(--reactive-border)" />
          <ResultBadge label="Past or Latent Syphilis" type="reactive" />
          <div style={{ padding: '8px 10px', background: 'var(--reactive-bg)', border: '1px solid var(--reactive-border)', borderRadius: 8, marginTop: 2 }}>
            <p style={{ fontSize: 10, color: 'var(--reactive)', lineHeight: 1.4 }}>
              Two treponemal tests reactive with nonreactive RPR: past treated syphilis, late latent, or very early primary. Review treatment history. Treat if no documented prior treatment.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <CascadePipe label="Nonreactive" color="var(--negative-border)" />
          <ResultBadge label="False-Positive Screen" type="negative" />
          <div style={{ padding: '8px 10px', background: 'var(--negative-bg)', border: '1px solid var(--negative-border)', borderRadius: 8, marginTop: 2 }}>
            <p style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Initial EIA/CIA was likely a false positive. No treatment needed. Document and reassure unless clinical suspicion remains high.
            </p>
          </div>
        </div>
      </div>

      {/* Discordant result explainer */}
      <div style={{
        marginTop: 24,
        padding: '16px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Understanding Discordant Results</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
          A discordant result (EIA reactive, RPR nonreactive) does not indicate a lab error. It arises in three distinct clinical situations:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Past treated syphilis', desc: 'Treponemal antibodies persist for life. After successful treatment, the RPR may decline to nonreactive while the treponemal test remains reactive. This is the most common cause of discordance.' },
            { label: 'Very early primary syphilis', desc: 'The treponemal EIA may become reactive slightly before the RPR does. A patient seen early in the primary stage may have a reactive EIA and nonreactive RPR that will turn positive in 1-2 weeks.' },
            { label: 'False-positive EIA', desc: 'The initial treponemal screen was falsely reactive. Confirmed when the TP-PA (second treponemal) is also nonreactive.' },
          ].map(({ label, desc }, i, arr) => (
            <div key={label} style={{ paddingBottom: 8, borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{label}</div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Disclaimer source="Workowski KA et al. MMWR Recomm Rep 2021;70(4):1-187." />
    </div>
  )
}
