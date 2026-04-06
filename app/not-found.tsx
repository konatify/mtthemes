export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: '"Roboto Mono", monospace',
      background: '#313338',
      color: '#e2b714',
      gap: '8px'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>404</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>this page doesn't exist.</p>
      <a href="/" style={{ color: '#e2b714', fontSize: '0.85rem', marginTop: '12px' }}>go home</a>
    </div>
  )
}
