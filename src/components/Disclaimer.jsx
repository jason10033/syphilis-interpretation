export default function Disclaimer({ source }) {
  return (
    <div style={{
      marginTop: 32,
      padding: '13px 16px',
      background: '#FFFBEB',
      border: '1px solid #F59E0B',
      borderRadius: 'var(--radius-sm)',
    }}>
      <span style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        color: '#92400E',
      }}>Clinical Disclaimer: </span>
      <span style={{ fontSize: 11, color: '#78350F', lineHeight: 1.5 }}>
        This tool is intended as an educational reference for licensed clinicians. It does not replace clinical judgment. Results should always be interpreted in the context of individual patient history and risk.
      </span>
    </div>
  )
}
