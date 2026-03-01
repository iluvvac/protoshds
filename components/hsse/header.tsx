'use client'

import { Bell, ChevronDown, AlertCircle, Clock, UserCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { TooltipHint } from '@/components/hsse/tooltip-hint'

type ActiveRole = 'operator' | 'manager'

interface HeaderProps {
  activeRole: ActiveRole
  setActiveRole: (role: ActiveRole) => void
}

export function Header({ activeRole, setActiveRole }: HeaderProps) {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-[var(--nav-border)] bg-[var(--nav-bg)] relative z-10">
      {/* Left: Title */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-bold text-foreground leading-tight tracking-tight">
            Smart HSSE Command Center
          </h1>
          <p className="text-xs text-muted-foreground">{dateStr}</p>
        </div>
        <Badge variant="outline" className="border-primary/30 text-primary text-[10px] font-semibold px-2 py-0.5 hidden md:flex">
          LIVE FEED
        </Badge>
      </div>

      {/* Center: Live Clock */}
      <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/30 border border-[var(--nav-border)]">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-mono font-semibold text-foreground tabular-nums">{timeStr}</span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium hidden sm:block">Role:</span>
          <Select value={activeRole} onValueChange={(v) => setActiveRole(v as ActiveRole)}>
            <SelectTrigger className="w-40 h-8 text-xs bg-accent border-[var(--nav-border)] text-foreground font-semibold">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${activeRole === 'manager' ? 'bg-[var(--warning)]' : 'bg-primary'}`} />
                <SelectValue />
              </div>
              {/* <ChevronDown className="w-3 h-3 ml-auto" /> */}
            </SelectTrigger>
            <SelectContent className="bg-popover border-[var(--nav-border)]">
              {/* <SelectItem value="operator" className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Operator (L1)
                </div>
              </SelectItem> */}
              <SelectItem value="manager" className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)]" />
                  Manager (L2)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notification Bell */}
        <TooltipHint content={<><p className="font-semibold">Notifications</p><p className="text-muted-foreground text-[10px]">2 unread alerts pending review</p></>} side="bottom">
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-accent border border-[var(--nav-border)] hover:border-primary/30 transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-[#E21B22] text-[9px] font-bold text-white">
              2
            </span>
          </button>
        </TooltipHint>

        {/* Alert indicator */}
        <TooltipHint content={<><p className="font-semibold text-[#E21B22]">Active Critical Alerts</p><p className="text-muted-foreground text-[10px]">2 incidents currently at critical severity</p></>} side="bottom">
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-[#E21B22]/10 border border-[#E21B22]/30 hover:bg-[#E21B22]/20 transition-colors">
            <AlertCircle className="w-4 h-4 text-[#E21B22]" />
          </button>
        </TooltipHint>

        {/* User */}
        <TooltipHint
          content={
            <div className="space-y-0.5">
              <p className="font-semibold">{activeRole === 'manager' ? 'Azman Ibrahim' : 'Faiz Rahman'}</p>
              <p className="text-muted-foreground text-[10px]">{activeRole === 'manager' ? 'HSE Manager — Level 2 Access' : 'L1 Operator — Level 1 Access'}</p>
              <p className="text-muted-foreground text-[10px]">Shift: 06:00 – 18:00</p>
            </div>
          }
          side="bottom"
          align="end"
        >
          <div className="flex items-center gap-2 pl-3 border-l border-[var(--nav-border)] cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-foreground leading-tight">
                {activeRole === 'manager' ? 'Azman Ibrahim' : 'Faiz Rahman'}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                {activeRole === 'manager' ? 'HSE Manager' : 'L1 Operator'}
              </p>
            </div>
          </div>
        </TooltipHint>
      </div>
    </header>
  )
}
