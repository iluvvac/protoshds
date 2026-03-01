'use client'

import { Shield, Map, AlertTriangle, Brain, Users, Activity, Radio } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TooltipHint } from '@/components/hsse/tooltip-hint'

type ActiveTab = 'map' | 'triage' | 'ai-insights' | 'directory'

interface SidebarProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
}

const navItems = [
  { id: 'map' as ActiveTab, label: 'Live Map', icon: Map, description: 'Digital Twin', tooltip: 'Real-time digital twin of facility with worker tracking and zone overlays' },
  { id: 'triage' as ActiveTab, label: 'Incident Triage', icon: AlertTriangle, description: 'Escalations', tooltip: 'Live incident queue with SLA countdown timers and auto-escalation' },
  { id: 'ai-insights' as ActiveTab, label: 'AI Insights', icon: Brain, description: 'Generative Analysis', tooltip: 'AI-powered analytics — query heat stress, fatigue trends, risk zones, and SLA reports' },
  { id: 'directory' as ActiveTab, label: 'Directory', icon: Users, description: 'Workers & Assets', tooltip: 'Worker biometrics (HR, temp, fatigue) and IoT asset status monitoring' },
]

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen bg-[var(--nav-bg)] border-r border-[var(--nav-border)] relative z-10">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[var(--nav-border)]">
        <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground leading-tight tracking-tight">SMART HSSE </p>
          <p className="text-xs text-muted-foreground leading-tight">Dashboard System</p>
        </div>
      </div>

      {/* Live Status */}
      <div className="px-4 py-3 border-b border-[var(--nav-border)]">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--safe)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--safe)]"></span>
          </span>
          <span className="text-xs text-muted-foreground font-medium">System Operational</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2 mb-3">
          Operations
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <TooltipHint key={item.id} content={item.tooltip} side="right" align="center" delayDuration={600}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group',
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 transition-colors',
                  isActive ? 'bg-primary/20' : 'bg-accent group-hover:bg-primary/10'
                )}>
                  <Icon className={cn('w-4 h-4', isActive ? 'text-primary' : '')} />
                </div>
                <div>
                  <p className={cn('text-sm font-semibold leading-tight', isActive ? 'text-primary' : '')}>{item.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{item.description}</p>
                </div>
                {item.id === 'triage' && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold bg-[#E21B22] text-white">
                    2
                  </span>
                )}
              </button>
            </TooltipHint>
          )
        })}
      </nav>

      {/* Bottom Stats */}
      <div className="px-4 pb-5 space-y-2">
        <div className="rounded-lg bg-accent/40 border border-[var(--nav-border)] p-3 space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">System Metrics</p>
          <div className="flex items-center justify-between">
              <TooltipHint content="4 workers are currently offline or out of IoT range" side="right">
                <div className="flex items-center gap-1.5 cursor-default">
                  <Activity className="w-3 h-3 text-primary" />
                  <span className="text-xs text-muted-foreground">Workers Online</span>
                </div>
              </TooltipHint>
              <TooltipHint content="24 active, 4 offline (Zones B & D coverage gap)" side="right" align="end">
                <span className="text-xs font-bold text-foreground cursor-default">24 / 28</span>
              </TooltipHint>
            </div>
            <div className="flex items-center justify-between">
              <TooltipHint content="6 IoT sensors reporting connectivity issues in Zone A" side="right">
                <div className="flex items-center gap-1.5 cursor-default">
                  <Radio className="w-3 h-3 text-[var(--safe)]" />
                  <span className="text-xs text-muted-foreground">IoT Devices</span>
                </div>
              </TooltipHint>
              <TooltipHint content="142 active, 6 offline — last sync 00:34 ago" side="right" align="end">
                <span className="text-xs font-bold text-foreground cursor-default">142 / 148</span>
              </TooltipHint>
            </div>
        </div>
      </div>
    </aside>
  )
}
