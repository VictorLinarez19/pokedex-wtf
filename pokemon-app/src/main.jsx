import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './components/Login.jsx'
import { loadSession, saveSession, clearSession } from './utils/localStorage.js'

function Root() {
  const [session, setSession] = useState(loadSession)

  if (!session) {
    return (
      <Login
        onLogin={(nextSession) => {
          saveSession(nextSession)
          setSession(nextSession)
        }}
      />
    )
  }

  return (
    <App
      user={session.username}
      onLogout={() => {
        clearSession()
        setSession(null)
      }}
    />
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
