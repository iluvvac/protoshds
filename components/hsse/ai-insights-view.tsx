'use client'

import { useState } from 'react'
import {
  Brain, Send, Sparkles, TrendingUp, AlertCircle, ArrowUpRight,
  Zap, FileText, MapPin, Activity, ShieldCheck, Clock
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ComposedChart, Area
} from 'recharts'
import { cn } from '@/lib/utils'
import {
  AI_CHART_DATA, FATIGUE_TREND_DATA, RISK_ZONE_DATA, SLA_COMPLIANCE_DATA
} from '@/lib/hsse-data'
import type { IncidentTicket } from '@/lib/hsse-data'
import { Skeleton } from '@/components/ui/skeleton'

interface AIInsightsViewProps {
  tickets: IncidentTicket[]
}

const PRESET_QUERIES = [
  'Show heat stress incidents by area',
  'Analyze worker fatigue trends',
  'Critical zone risk assessment',
  'SLA compliance report',
]

type QueryType = 'heat' | 'fatigue' | 'critical' | 'sla' | null

const AI_SUMMARIES: Record<string, { title: string; icon: React.ElementType; body: string; accent: string }> = {
  heat: {
    title: 'Heat Stress Analysis',
    icon: Activity,
    accent: '#E21B22',
    body: 'Significant concentration of heat stress incidents in the Pipeline zone (15 incidents), followed by Boiler Room (12). Workers in high-temperature areas experience 340% more incidents during 10:00–14:00 hours. Recommendation: increase cooling station frequency in Zone D and enforce mandatory 15-minute rest cycles every 90 minutes for workers in Zones A and D.',
  },
  fatigue: {
    title: 'Fatigue Trend Report',
    icon: TrendingUp,
    accent: '#D97706',
    body: 'Fatigue scoring indicates 2 workers (Ahmad Razali, Priya Nair) have crossed the 65-point clinical threshold for elevated accident risk. Ahmad Razali (score: 82) is recommended for immediate rotation off active duty. Workforce fatigue is trending upward by 14% vs. last week, attributed to back-to-back extended shifts in Zone A.',
  },
  critical: {
    title: 'Zone Risk Index',
    icon: ShieldCheck,
    accent: '#E21B22',
    body: 'Zone A and Zone D have the highest composite risk scores (88 and 91 respectively). Zone D risk has risen 28% in 6 hours due to elevated gas proximity readings. Immediate action: deploy safety officer inspection to Zone D and isolate non-essential machinery until sensor readings normalize below threshold.',
  },
  sla: {
    title: 'SLA Compliance Metrics',
    icon: Clock,
    accent: '#059669',
    body: 'SLA compliance this shift: 62% of tickets acknowledged within the 30-second threshold. 2 tickets auto-escalated due to timer expiry at 08:00–09:00 peak window. Recommend assigning a dedicated triage operator during peak hours. Response improvement of 24% is achievable by enabling automated Acknowledge for low-severity L1 alerts.',
  },
}

function ChartTooltip({ active, payload, label, unit }: {
  active?: boolean; payload?: Array<{ value: number; name?: string; color?: string }>; label?: string; unit?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl px-3 py-2 border border-[var(--nav-border)] shadow-xl">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs font-bold" style={{ color: p.color || 'var(--foreground)' }}>
            {p.name ? `${p.name}: ` : ''}{p.value}{unit || ''}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function HeatChart() {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-[#E21B22]" />
        <h3 className="text-sm font-bold text-foreground">Heat Stress Incidents by Area</h3>
        <span className="ml-auto text-[10px] text-muted-foreground">Last 30 days</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={AI_CHART_DATA} barSize={28} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="area" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip unit=" incidents" />} cursor={{ fill: 'rgba(226,27,34,0.04)' }} />
          <Bar dataKey="incidents" radius={[6, 6, 0, 0]}>
            {AI_CHART_DATA.map((entry, i) => (
              <Cell key={i} fill={entry.incidents > 10 ? '#E21B22' : '#3B82F6'} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}

function FatigueChart() {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-[#D97706]" />
        <h3 className="text-sm font-bold text-foreground">Worker Fatigue Score — 12h Trend</h3>
        <span className="ml-auto text-[10px] text-muted-foreground">Today 00:00–10:00</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={FATIGUE_TREND_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip unit=" pts" />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: 'var(--muted-foreground)' }} />
          {/* Threshold line reference */}
          <Line type="monotone" dataKey="team_avg" name="Team Avg" stroke="#3B82F6" strokeWidth={2} dot={false} strokeDasharray="4 3" />
          <Line type="monotone" dataKey="priya" name="Priya Nair" stroke="#D97706" strokeWidth={2.5} dot={{ r: 3, fill: '#D97706' }} />
          <Line type="monotone" dataKey="ahmad" name="Ahmad Razali" stroke="#E21B22" strokeWidth={2.5} dot={{ r: 3, fill: '#E21B22' }} />
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}

function CriticalChart() {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-4 h-4 text-[#E21B22]" />
        <h3 className="text-sm font-bold text-foreground">Zone Composite Risk Index</h3>
        <span className="ml-auto text-[10px] text-muted-foreground">Live assessment</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart cx="50%" cy="50%" outerRadius={80} data={RISK_ZONE_DATA}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis dataKey="zone" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
          <Radar name="Risk Score" dataKey="risk" stroke="#E21B22" fill="#E21B22" fillOpacity={0.15} strokeWidth={2} />
          <Radar name="Fatigue" dataKey="fatigue" stroke="#D97706" fill="#D97706" fillOpacity={0.1} strokeWidth={2} />
          <Radar name="Env" dataKey="env" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={2} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: 'var(--muted-foreground)' }} />
          <Tooltip content={<ChartTooltip unit="/100" />} />
        </RadarChart>
      </ResponsiveContainer>
    </>
  )
}

function SlaChart() {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-[#059669]" />
        <h3 className="text-sm font-bold text-foreground">SLA Compliance — Acknowledged vs Missed</h3>
        <span className="ml-auto text-[10px] text-muted-foreground">Today by hour</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={SLA_COMPLIANCE_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="hour" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: 'var(--muted-foreground)' }} />
          <Bar yAxisId="left" dataKey="acknowledged" name="Acknowledged" fill="#059669" fillOpacity={0.8} radius={[4, 4, 0, 0]} barSize={16} />
          <Bar yAxisId="left" dataKey="missed" name="Missed" fill="#E21B22" fillOpacity={0.8} radius={[4, 4, 0, 0]} barSize={16} />
          <Area yAxisId="right" type="monotone" dataKey="rate" name="Rate %" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.08} strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  )
}

export function AIInsightsView({ tickets }: AIInsightsViewProps) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [queryType, setQueryType] = useState<QueryType>(null)

  const escalatedTickets = tickets.filter((t) => t.status === 'Escalated')

  const detectQueryType = (q: string): QueryType => {
    const lower = q.toLowerCase()
    if (lower.includes('fatigue')) return 'fatigue'
    if (lower.includes('critical') || lower.includes('risk')) return 'critical'
    if (lower.includes('sla') || lower.includes('compliance')) return 'sla'
    return 'heat'
  }

  const handleSubmit = (q?: string) => {
    const finalQuery = q || query
    if (!finalQuery.trim()) return
    setIsLoading(true)
    setHasResult(false)
    setTimeout(() => {
      setQueryType(detectQueryType(finalQuery))
      setIsLoading(false)
      setHasResult(true)
    }, 1200)
  }

  const summary = queryType ? AI_SUMMARIES[queryType] : null
  const SummaryIcon = summary?.icon ?? FileText

  return (
    <div className="h-full flex flex-col gap-4 p-6 overflow-auto">
      {/* AI Prompt Bar */}
      <div className="glass-card rounded-2xl p-4 border border-primary/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Generative AI Analytics</h2>
            <p className="text-[10px] text-muted-foreground">Powered by HSSE Intelligence Engine v3.1</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-primary font-semibold">AI Ready</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
            <input
              type="text"
              placeholder="Ask anything about HSSE data... e.g. 'Show heat stress incidents by area'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full h-10 bg-accent/50 border border-[var(--nav-border)] focus:border-primary/40 rounded-xl pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => handleSubmit()}
            disabled={isLoading || !query.trim()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/20 border border-primary/30 hover:bg-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
          >
            <Send className="w-4 h-4 text-primary" />
          </button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {PRESET_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => { setQuery(q); handleSubmit(q) }}
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-muted-foreground border border-[var(--nav-border)] hover:border-primary/30 hover:text-primary bg-accent/30 hover:bg-primary/10 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Results canvas */}
      {(isLoading || hasResult) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-5">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-48 bg-accent" />
                <Skeleton className="h-[220px] w-full bg-accent/50" />
              </div>
            ) : (
              <>
                {queryType === 'heat' && <HeatChart />}
                {queryType === 'fatigue' && <FatigueChart />}
                {queryType === 'critical' && <CriticalChart />}
                {queryType === 'sla' && <SlaChart />}
              </>
            )}
          </div>

          {/* AI Summary */}
          <div className="glass-card rounded-2xl p-5">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-36 bg-accent" />
                <Skeleton className="h-4 w-full bg-accent/50" />
                <Skeleton className="h-4 w-4/5 bg-accent/50" />
                <Skeleton className="h-4 w-full bg-accent/50" />
                <Skeleton className="h-4 w-3/4 bg-accent/50" />
                <Skeleton className="h-4 w-full bg-accent/50" />
              </div>
            ) : summary ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: summary.accent + '18' }}
                  >
                    <SummaryIcon className="w-3.5 h-3.5" style={{ color: summary.accent }} />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{summary.title}</h3>
                </div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  {summary.body}
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--nav-border)] flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-[10px] text-muted-foreground">
                    Generated by AI Engine • {new Date().toLocaleTimeString('en-US', { hour12: false })}
                  </span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Executive Escalation Board */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--nav-border)] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E21B22]/10 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-[#E21B22]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Executive Escalation Board</h2>
            <p className="text-[10px] text-muted-foreground">Tickets requiring management attention</p>
          </div>
          <div className="ml-auto">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E21B22]/15 text-[#E21B22] border border-[#E21B22]/30">
              {escalatedTickets.length} escalated
            </span>
          </div>
        </div>

        {escalatedTickets.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-3 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-[#059669]" />
            </div>
            <p className="text-sm font-semibold text-foreground">No Escalated Incidents</p>
            <p className="text-xs text-muted-foreground max-w-xs">All current incidents are within SLA thresholds. No management escalation required at this time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--nav-border)]">
                  {['ID', 'Worker', 'Issue', 'Location', 'Escalation Time'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {escalatedTickets.map((t) => (
                  <tr key={t.id} className="critical-row border-b border-[var(--nav-border)]/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-[#E21B22]" />
                        <span className="text-xs font-mono font-bold text-[#E21B22]">{t.id}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground">{t.workerName}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E21B22]/15 text-[#E21B22] border border-[#E21B22]/30">{t.issue}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{t.location}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono text-[#E21B22] font-semibold">{t.timestamp}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
