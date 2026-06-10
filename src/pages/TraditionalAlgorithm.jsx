import { useState } from 'react'

const NODE_INFO = {
  step1: {
    title: 'Nontreponemal Test (RPR or VDRL)',
    detects: 'Antibodies to cardiolipin-lecithin-cholesterol antigen released by cells damaged by T. pallidum. Not specific to syphilis.',
    reactive: 'A reactive result triggers reflex treponemal confirmation. Report with quantitative titer (e.g., RPR 1:8). Titer tracks disease activity and treatment response.',
    falsePositive: 'Biologic false positives occur in pregnancy, autoimmune disease (lupus), IV drug use, acute viral infections, and older age. Rate is roughly 1-2% in low-risk populations.',
    source: 'Workowski KA et al. MMWR Recomm Rep 2021;70(4):1-187',
  },
  step2: {
    title: 'Treponemal Confirmatory Test (TP-PA, FTA-ABS, EIA, or CIA)',
    detects: 'Antibodies directed specifically against T. pallidum antigens. Once reactive, usually remains reactive for life regardless of treatment.',
    reactive: 'Confirms treponemal infection. Combined with a reactive nontreponemal test, this pattern establishes a diagnosis of syphilis. Treponemal tests do not distinguish active from past treated infection.',
    falsePositive: 'False positives are rare (<1%) but can occur with Lyme disease, leptospirosis, malaria, and other spirochetal infections.',
    source: 'Workowski KA et al. MMWR Recomm Rep 2021;70(4):1-187',
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
        { label: 'False positives', text: info.falsePositive },
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

export default function TraditionalAlgorithm() {
  const [activeNode, setActiveNode] = useState(null)

  return (
    <>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Start with RPR or VDRL. Tap any test node to learn what it detects and why it exists in the sequence.</p>

      <div style={{
        padding: '10px 14px',
        background: 'var(--reactive-bg)',
        border: '1px solid var(--reactive-border)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 16,
        fontSize: 12,
        color: 'var(--reactive)',
        fontWeight: 600,
      }}>
        Entry point: you have a reactive RPR, VDRL, or nontreponemal result
      </div>

      {/* STEP 1 */}
      <TestNode
        nodeKey="step1"
        step={1}
        label="Nontreponemal Test"
        sublabel="RPR or VDRL"
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
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--reactive)' }}>Proceed to Step 2</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CascadePipe label="Nonreactive" color="var(--negative-border)" />
          <ResultBadge label="Syphilis Unlikely" type="negative" />
          <div style={{ marginTop: 6, padding: '6px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}>
            <p style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              No further syphilis testing required unless primary lesion present. Consider dark-field or PCR if active chancre.
            </p>
          </div>
        </div>
      </div>

      {/* STEP 2 */}
      <TestNode
        nodeKey="step2"
        step={2}
        label="Treponemal Confirmatory Test"
        sublabel="TP-PA, FTA-ABS, EIA, or CIA"
        activeNode={activeNode}
        onToggle={setActiveNode}
      />

      {/* Branch after step 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <CascadePipe label="Reactive" color="var(--reactive-border)" />
          <ResultBadge label="Syphilis Confirmed" type="reactive" />
          <div style={{ padding: '8px 10px', background: 'var(--reactive-bg)', border: '1px solid var(--reactive-border)', borderRadius: 8, marginTop: 2 }}>
            <p style={{ fontSize: 10, color: 'var(--reactive)', lineHeight: 1.4 }}>
              Both tests reactive = active or past syphilis. Determine stage by clinical history and RPR titer. Treat by stage.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <CascadePipe label="Nonreactive" color="var(--negative-border)" />
          <ResultBadge label="False-Positive RPR" type="negative" />
          <div style={{ padding: '8px 10px', background: 'var(--negative-bg)', border: '1px solid var(--negative-border)', borderRadius: 8, marginTop: 2 }}>
            <p style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Reactive nontreponemal with nonreactive treponemal = biologic false positive. Investigate cause. No syphilis treatment.
            </p>
          </div>
        </div>
      </div>

      {/* Staging guidance */}
      <div style={{ marginTop: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--background)' }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Treatment by Stage (CDC 2021)</h2>
        </div>
        {[
          {
            stage: 'Primary, Secondary, or Early Latent (under 1 year)',
            tx: 'Benzathine penicillin G 2.4 million units IM, single dose',
            note: 'Penicillin allergy (non-pregnant): doxycycline 100 mg PO BID x 14 days',
          },
          {
            stage: 'Late Latent, Unknown Duration, or Tertiary (without neurosyphilis)',
            tx: 'Benzathine penicillin G 2.4 million units IM weekly x 3 doses',
            note: 'Penicillin allergy (non-pregnant): doxycycline 100 mg PO BID x 28 days',
          },
          {
            stage: 'Neurosyphilis, Ocular, or Otosyphilis',
            tx: 'Aqueous crystalline penicillin G 18-24 million units/day IV x 10-14 days',
            note: 'Alternative: procaine PCN G 2.4M units IM daily + probenecid 500 mg PO QID x 10-14 days. May follow with BPG 2.4M IM weekly x 3.',
          },
          {
            stage: 'Pregnancy (any stage)',
            tx: 'Penicillin G regimen appropriate to stage (same doses as above)',
            note: 'No acceptable alternative to penicillin in pregnancy. Penicillin-allergic patients must be desensitized.',
          },
        ].map(({ stage, tx, note }, i, arr) => (
          <div key={stage} style={{ padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{stage}</div>
            <div style={{ fontSize: 12, color: 'var(--reactive)', fontWeight: 600, marginBottom: 4 }}>{tx}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{note}</div>
          </div>
        ))}
      </div>

    </>
  )
}
