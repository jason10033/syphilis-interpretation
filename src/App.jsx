import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Landing from './pages/Landing'
import Algorithms from './pages/Algorithms'
import Scenarios from './pages/Scenarios'
import Stages from './pages/Stages'
import QuickReference from './pages/QuickReference'
import TiterInterpreter from './pages/TiterInterpreter'
import About from './pages/About'

export default function App() {
  return (
    <div style={{ paddingTop: 'var(--header-h)' }}>
      <Header />
      <main style={{ minHeight: 'calc(100dvh - var(--header-h))' }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/titer" element={<TiterInterpreter />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/stages" element={<Stages />} />
          <Route path="/reference" element={<QuickReference />} />
          <Route path="/about" element={<About />} />
          {/* Legacy paths now folded into Algorithms */}
          <Route path="/traditional" element={<Navigate to="/algorithms?seq=traditional" replace />} />
          <Route path="/reverse" element={<Navigate to="/algorithms?seq=reverse" replace />} />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
