import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Landing from './pages/Landing'
import TraditionalAlgorithm from './pages/TraditionalAlgorithm'
import ReverseAlgorithm from './pages/ReverseAlgorithm'
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
          <Route path="/traditional" element={<TraditionalAlgorithm />} />
          <Route path="/reverse" element={<ReverseAlgorithm />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/stages" element={<Stages />} />
          <Route path="/reference" element={<QuickReference />} />
          <Route path="/titer" element={<TiterInterpreter />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}
