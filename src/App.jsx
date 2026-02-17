import { useState } from 'react'
import CandidateLookup from './components/CandidateLookup'
import JobsList from './components/JobsList'
import './App.css'

function App() {
  const [candidate, setCandidate] = useState(null)

  return (
    <div className="app">
      <CandidateLookup onCandidateFound={setCandidate} />
      <JobsList candidate={candidate} />
    </div>
  )
}

export default App
