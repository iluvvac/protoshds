'use client'

import { useEffect, useCallback } from 'react'
import { AlertTriangle, CheckCircle, Clock, MapPin, User, Shield, ArrowUpRight, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { IncidentTicket } from '@/lib/hsse-data'
import { TooltipHint } from '@/components/hsse/tooltip-hint'

interface TriageViewProps {
  tickets: IncidentTicket[]
  setTickets: React.Dispatch<React.SetStateAction<IncidentTicket[]>>
}

const STATUS_CONFIG: Record<string, { label: string; className: string; dotClass: string }> = {
  Pending: {
    label: 'Pending',
    className: 'bg-amber-500/15 text-[#D97706] border-[#D97706]/35',
    dotClass: 'bg-[#D97706]',
  },
  Acknowledged: {
    label: 'Acknowledged',
    className: 'bg-blue-500/15 text-blue-700 border-blue-600/40',
    dotClass: 'bg-blue-600',
  },
  Escalated: {
    label: 'Escalated',
    className: 'bg-[#E21B22]/15 text-[#E21B22] border-[#E21B22]/30',
    dotClass: 'bg-[#E21B22]',
  },
  Resolved: {
    label: 'Resolved',
    className: 'bg-emerald-500/15 text-[#059669] border-[#059669]/35',
    dotClass: 'bg-[#059669]',
  },
}

function SlaTimer({ seconds, status }: { seconds: number; status: string }) {
  if (status !== 'Pending') return null
  const isUrgent = seconds <= 10
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return (
    <div className={cn(
      'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono font-bold transition-colors',
      isUrgent
        ? 'bg-[#E21B22]/15 text-[#E21B22] animate-pulse'
        : 'bg-amber-500/10 text-[#D97706]'
    )}>
      <Clock className="w-3 h-3" />
      {m > 0 ? `${m}m ` : ''}{String(s).padStart(2, '0')}s
    </div>
  )
}

export function TriageView({ tickets, setTickets }: TriageViewProps) {

  const handleAcknowledge = useCallback((id: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id && t.status === 'Pending' ? { ...t, status: 'Acknowledged' } : t
      )
    )
    toast.success('Ticket Acknowledged', {
      description: `Ticket ${id} has been acknowledged by operator.`,
    })
  }, [setTickets])

  const handleResolve = useCallback((id: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'Resolved', slaTimer: 0 } : t
      )
    )
    toast.success('Incident Resolved', {
      description: `Ticket ${id} has been marked as resolved.`,
    })
  }, [setTickets])

  // SLA countdown + auto-escalation
  useEffect(() => {
    const interval = setInterval(() => {
      setTickets((prev) =>
        prev.map((t) => {
          if (t.status === 'Pending' && t.slaTimer > 0) {
            const newTimer = t.slaTimer - 1
            if (newTimer === 0) {
              toast.error('CRITICAL: Ticket Auto-Escalated to Management!', {
                description: `${t.id} — ${t.workerName}: ${t.issue} at ${t.location}`,
                duration: 6000,
              })
              return { ...t, slaTimer: 0, status: 'Escalated' }
            }
            return { ...t, slaTimer: newTimer }
          }
          return t
        })
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [setTickets])

  const counts = {
    total: tickets.length,
    pending: tickets.filter((t) => t.status === 'Pending').length,
    escalated: tickets.filter((t) => t.status === 'Escalated').length,
    resolved: tickets.filter((t) => t.status === 'Resolved').length,
  }

  return (
    <div className="h-full flex flex-col gap-4 p-6 overflow-auto">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Tickets', value: counts.total, icon: Shield, accent: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Pending SLA', value: counts.pending, icon: Clock, accent: 'text-[#D97706]', bg: 'bg-amber-500/10' },
          { label: 'Escalated', value: counts.escalated, icon: ArrowUpRight, accent: 'text-[#E21B22]', bg: 'bg-[#E21B22]/10' },
          { label: 'Resolved', value: counts.resolved, icon: CheckCircle, accent: 'text-[#059669]', bg: 'bg-emerald-500/10' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', s.bg)}>
                <Icon className={cn('w-5 h-5', s.accent)} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-medium">{s.label}</p>
                <p className={cn('text-2xl font-bold', s.accent)}>{s.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div className="flex-1 glass-card rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="px-5 py-4 border-b border-[var(--nav-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E21B22]/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-[#E21B22]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Escalation & Incident Triage</h2>
              <p className="text-[10px] text-muted-foreground">Real-time SLA monitoring — auto-escalates on timer expiry</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E21B22] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E21B22]"></span>
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">Auto-monitoring active</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--nav-border)]">
                {['Ticket ID', 'Worker', 'Issue', 'Location', 'Status', 'SLA Timer', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                const isEscalated = ticket.status === 'Escalated'
                const statusCfg = STATUS_CONFIG[ticket.status]
                return (
                  <tr
                    key={ticket.id}
                    className={cn(
                      'border-b border-[var(--nav-border)]/50 transition-all duration-300',
                      isEscalated ? 'critical-row' : 'hover:bg-accent/20'
                    )}
                  >
                    {/* ID */}
                    <td className="px-4 py-3.5">
                      <TooltipHint
                        content={<><p className="font-semibold">{ticket.id}</p><p className="text-muted-foreground text-[10px]">Logged: {ticket.timestamp}</p><p className="text-muted-foreground text-[10px]">Priority: {isEscalated ? 'P1 — Escalated to Management' : 'P2 — Pending Operator'}</p></>}
                        side="right"
                      >
                        <div className="flex items-center gap-2 cursor-default">
                          {isEscalated && <Zap className="w-3 h-3 text-[#E21B22] flex-shrink-0" />}
                          <span className={cn('text-xs font-mono font-bold', isEscalated ? 'text-[#E21B22]' : 'text-foreground')}>
                            {ticket.id}
                          </span>
                        </div>
                      </TooltipHint>
                    </td>

                    {/* Worker */}
                    <td className="px-4 py-3.5">
                      <TooltipHint
                        content={<><p className="font-semibold">{ticket.workerName}</p><p className="text-muted-foreground text-[10px]">Worker ID: {ticket.id.replace('TKT-', 'W0')}</p><p className="text-muted-foreground text-[10px]">Reported at {ticket.timestamp}</p></>}
                        side="top"
                      >
                        <div className="flex items-center gap-2 cursor-default">
                          <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
                            <User className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">{ticket.workerName}</p>
                            <p className="text-[10px] text-muted-foreground">{ticket.timestamp}</p>
                          </div>
                        </div>
                      </TooltipHint>
                    </td>

                    {/* Issue */}
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] font-semibold',
                          isEscalated ? 'border-[#E21B22]/40 text-[#E21B22] bg-[#E21B22]/10' : 'border-[#D97706]/35 text-[#D97706] bg-amber-500/10'
                        )}
                      >
                        {ticket.issue}
                      </Badge>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{ticket.location}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <Badge variant="outline" className={cn('text-[10px] font-semibold border', statusCfg.className)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', statusCfg.dotClass)} />
                        {statusCfg.label}
                      </Badge>
                    </td>

                    {/* SLA Timer */}
                    <td className="px-4 py-3.5">
                      {ticket.status === 'Pending' ? (
                        <TooltipHint
                          content={<><p className="font-semibold text-[#D97706]">SLA Countdown</p><p className="text-muted-foreground text-[10px]">Ticket auto-escalates to management when timer reaches 0</p></>}
                          side="top"
                        >
                          <span>
                            <SlaTimer seconds={ticket.slaTimer} status={ticket.status} />
                          </span>
                        </TooltipHint>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {ticket.status === 'Pending' && (
                          <TooltipHint content="Mark this ticket as seen and assign to yourself for investigation" side="top">
                            <button
                              onClick={() => handleAcknowledge(ticket.id)}
                              className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-primary/15 text-primary border border-primary/25 hover:bg-primary/25 transition-colors"
                            >
                              Acknowledge
                            </button>
                          </TooltipHint>
                        )}
                        {(ticket.status === 'Pending' || ticket.status === 'Acknowledged' || ticket.status === 'Escalated') && (
                          <TooltipHint content="Close this incident — confirm the hazard has been mitigated" side="top">
                            <button
                              onClick={() => handleResolve(ticket.id)}
                              className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-emerald-500/15 text-[#059669] border border-[#059669]/30 hover:bg-emerald-500/25 transition-colors"
                            >
                              Resolve
                            </button>
                          </TooltipHint>
                        )}
                        {ticket.status === 'Resolved' && (
                          <span className="text-[10px] text-muted-foreground italic">Closed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
