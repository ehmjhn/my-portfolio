import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { SettingsProvider } from './context/SettingsContext'
import ErrorBoundary from './components/ErrorBoundary'

// CSS is split into several small files and imported here, so the
// browser downloads them in parallel instead of one giant file.
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/features.css'
import './styles/pages.css'
import './styles/responsive.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* If a component crashes, this catches it and shows a nice
        message instead of a blank white page. */}
    <ErrorBoundary>
      {/*
        BrowserRouter is what turns /projects into a real page.
        It listens to the browser's back and forward buttons and
        lets Link / useNavigate change the URL without reloading
        the whole site.
      */}
      <BrowserRouter>
        {/* SettingsProvider wraps everything so any component can
            read the theme, sound, cursor, and motion settings
            through useSettings(). */}
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
