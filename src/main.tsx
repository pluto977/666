import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import BaziPage from './pages/BaziPage'
import DivinationPage from './pages/DivinationPage'
import HuangLiPage from './pages/HuangLiPage'
import ScenePage from './pages/ScenePage'
import ProfilePage from './pages/ProfilePage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-amber-50/30 min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bazi" element={<BaziPage />} />
            <Route path="/divination" element={<DivinationPage />} />
            <Route path="/huangli" element={<HuangLiPage />} />
            <Route path="/scene" element={<ScenePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  </React.StrictMode>,
)
