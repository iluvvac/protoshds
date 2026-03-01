'use client'

import { useState } from 'react'
import { Toaster } from 'sonner'
import { Sidebar } from '@/components/hsse/sidebar'
import { Header } from '@/components/hsse/header'
import { LiveMapView } from '@/components/hsse/live-map-view'
import { TriageView } from '@/components/hsse/triage-view'
import { AIInsightsView } from '@/components/hsse/ai-insights-view'
import { DirectoryView } from '@/components/hsse/directory-view'
import { INITIAL_TICKETS } from '@/lib/hsse-data'
import type { IncidentTicket } from '@/lib/hsse-data'

type ActiveRole = 'manager' | 'operator'
type ActiveTab = 'map' | 'triage' | 'ai-insights' | 'directory'

export default function HSSEDashboard() {
  const [activeRole, setActiveRole] = useState<ActiveRole>('manager')
  const [activeTab, setActiveTab] = useState<ActiveTab>('map')
  const [tickets, setTickets] = useState<IncidentTicket[]>(INITIAL_TICKETS)

  // When role changes to manager, default to AI insights; operator defaults to map
  const handleRoleChange = (role: ActiveRole) => {
    setActiveRole(role)
    if (role === 'manager') {
      setActiveTab('ai-insights')
    } else {
      setActiveTab('map')
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background relative">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-[500px] h-[500px] rounded-full bg-blue-200/40 blur-3xl opacity-50" />
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full bg-blue-100/50 blur-3xl opacity-40" />
        <div className="absolute -bottom-24 left-1/3 w-[450px] h-[450px] rounded-full bg-indigo-100/40 blur-3xl opacity-30" />
      </div>

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <Header activeRole={activeRole} setActiveRole={handleRoleChange} />

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {activeTab === 'map' && <LiveMapView />}
          {activeTab === 'triage' && (
            <TriageView tickets={tickets} setTickets={setTickets} />
          )}
          {activeTab === 'ai-insights' && (
            <AIInsightsView tickets={tickets} />
          )}
          {activeTab === 'directory' && <DirectoryView />}
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--card)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
          },
        }}
      />
    </div>
  )
}
