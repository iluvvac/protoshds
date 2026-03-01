'use client'

import { useState } from 'react'
import { Camera, Wifi, Thermometer, Wind, Gauge, Radio, X, Maximize2, AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { TooltipHint } from '@/components/hsse/tooltip-hint'

const WORKER_DOTS = [
  { id: 'W01', name: 'Ahmad Razali', x: 22, y: 38, status: 'critical', zone: 'Zone A', issue: 'Heat Stress' },
  { id: 'W02', name: 'Priya Nair', x: 58, y: 55, status: 'warning', zone: 'Zone B', issue: 'High Heart Rate' },
  { id: 'W03', name: 'James Okafor', x: 74, y: 28, status: 'safe', zone: 'Zone C', issue: null },
  { id: 'W04', name: 'Siti Aminah', x: 42, y: 72, status: 'critical', zone: 'Zone D', issue: 'Gas Proximity' },
  { id: 'W05', name: 'Raj Patel', x: 30, y: 58, status: 'safe', zone: 'Zone A', issue: null },
]

const ZONE_AREAS = [
  { id: 'ZA', label: 'Zone A', x: 10, y: 20, w: 28, h: 55, color: 'rgba(226,27,34,0.06)', borderColor: 'rgba(226,27,34,0.25)' },
  { id: 'ZB', label: 'Zone B', x: 45, y: 38, w: 30, h: 35, color: 'rgba(217,119,6,0.05)', borderColor: 'rgba(217,119,6,0.35)' },
  { id: 'ZC', label: 'Zone C', x: 62, y: 10, w: 28, h: 32, color: 'rgba(5,150,105,0.05)', borderColor: 'rgba(5,150,105,0.3)' },
  { id: 'ZD', label: 'Zone D', x: 28, y: 62, w: 32, h: 28, color: 'rgba(226,27,34,0.06)', borderColor: 'rgba(226,27,34,0.25)' },
]

const ENV_METRICS = [
  { label: 'Ambient Temp', value: '38.4°C', icon: Thermometer, status: 'warning', tooltip: 'Above safe threshold of 35°C — heat stress protocol active in Zone A & D' },
  { label: 'Wind Speed', value: '12 km/h', icon: Wind, status: 'safe', tooltip: 'Normal wind conditions — no dispersion risk for hazardous gas' },
  { label: 'Air Quality', value: 'AQI 68', icon: Gauge, status: 'safe', tooltip: 'AQI 68 — Moderate. Sensitive workers should limit prolonged outdoor exposure' },
  { label: 'Signal', value: '96%', icon: Wifi, status: 'safe', tooltip: '96% IoT connectivity — 6 devices offline in Zone A northern quadrant' },
]

export function LiveMapView() {
  const [cctvOpen, setCctvOpen] = useState(false)
  const [selectedCam, setSelectedCam] = useState<string>('CAM-A1')
  const [hoveredWorker, setHoveredWorker] = useState<string | null>(null)

  const statusColor = (s: string) => {
    if (s === 'critical') return '#E21B22'
    if (s === 'warning') return '#D97706'
    return '#059669'
  }

  return (
    <div className="h-full flex flex-col gap-4 p-6 overflow-auto">
      {/* Top stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ENV_METRICS.map((m) => {
          const Icon = m.icon
          return (
            <TooltipHint key={m.label} content={m.tooltip} side="bottom">
              <div className="glass-card rounded-xl p-3 flex items-center gap-3 cursor-default">
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                  m.status === 'warning' ? 'bg-amber-500/15' : 'bg-primary/10'
                )}>
                  <Icon className="w-4 h-4" style={{ color: m.status === 'warning' ? '#D97706' : 'var(--primary)' }} />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium">{m.label}</p>
                  <p className="text-sm font-bold" style={{ color: m.status === 'warning' ? '#D97706' : 'var(--foreground)' }}>{m.value}</p>
                </div>
              </div>
            </TooltipHint>
          )
        })}
      </div>

      {/* Main map area */}
      <div className="flex-1 min-h-[420px] relative glass-card rounded-2xl overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Outer glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full bg-blue-50/60 blur-3xl pointer-events-none" />

        {/* Map header overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="glass-card px-3 py-1.5 rounded-lg">
              <p className="text-xs font-semibold text-foreground">Facility Twin — Block 4 North</p>
            </div>
            <div className="flex items-center gap-1.5 glass-card px-2 py-1.5 rounded-lg">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--safe)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--safe)]"></span>
              </span>
              <span className="text-[10px] text-muted-foreground">Live</span>
            </div>
          </div>

          {/* CCTV Button */}
          <button
            onClick={() => setCctvOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/25 hover:bg-primary/25 transition-all text-primary text-xs font-semibold"
          >
            <Camera className="w-3.5 h-3.5" />
            CCTV Feed
          </button>
        </div>

        {/* Zone areas */}
        {ZONE_AREAS.map((zone) => (
          <div
            key={zone.id}
            className="absolute rounded-xl border text-[10px] font-semibold flex items-start pt-2 pl-2"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.w}%`,
              height: `${zone.h}%`,
              background: zone.color,
              borderColor: zone.borderColor,
              color: zone.borderColor,
            }}
          >
            {zone.label}
          </div>
        ))}

        {/* Worker pulse dots */}
        {WORKER_DOTS.map((worker) => (
          <div
            key={worker.id}
            className="absolute z-10 cursor-pointer"
            style={{ left: `${worker.x}%`, top: `${worker.y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseEnter={() => setHoveredWorker(worker.id)}
            onMouseLeave={() => setHoveredWorker(null)}
          >
            <span className="relative flex h-5 w-5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ backgroundColor: statusColor(worker.status) }}
              />
              <span
                className="relative inline-flex rounded-full h-5 w-5 border-2 border-white/20"
                style={{ backgroundColor: statusColor(worker.status) }}
              />
            </span>

            {/* Hover tooltip */}
            {hoveredWorker === worker.id && (
              <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 w-44 glass-card rounded-xl p-2.5 shadow-2xl border pointer-events-none"
                style={{ borderColor: statusColor(worker.status) + '40' }}>
                <p className="text-xs font-bold text-foreground">{worker.name}</p>
                <p className="text-[10px] text-muted-foreground">{worker.zone} • {worker.id}</p>
                {worker.issue && (
                  <div className="mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" style={{ color: statusColor(worker.status) }} />
                    <span className="text-[10px] font-semibold" style={{ color: statusColor(worker.status) }}>{worker.issue}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 glass-card rounded-xl px-3 py-2 flex items-center gap-4 z-20">
          {[
            { label: 'Critical', color: '#E21B22' },
            { label: 'Warning', color: '#D97706' },
            { label: 'Safe', color: '#059669' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-[10px] text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Worker count badge */}
        <div className="absolute bottom-4 right-4 glass-card rounded-xl px-3 py-2 flex items-center gap-2 z-20">
          <Radio className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">{WORKER_DOTS.length} workers tracked</span>
        </div>
      </div>

      {/* CCTV Modal */}
      <Dialog open={cctvOpen} onOpenChange={setCctvOpen}>
        <DialogContent className="max-w-3xl bg-card border-[var(--nav-border)] p-0 overflow-hidden">
          <DialogHeader className="px-5 py-4 border-b border-[var(--nav-border)] flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Camera className="w-4 h-4 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold">Live CCTV Feed</DialogTitle>
                <p className="text-[10px] text-muted-foreground">Facility Block 4 North — Real-time stream</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E21B22] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E21B22]"></span>
              </span>
              <span className="text-[10px] text-[#E21B22] font-semibold">REC</span>
            </div>
          </DialogHeader>

          <div className="p-4 space-y-4">
            {/* Camera selector */}
            <div className="flex gap-2 flex-wrap">
              {['CAM-A1', 'CAM-B2', 'CAM-C3', 'CAM-D4'].map((cam) => (
          <button
            key={cam}
            onClick={() => setSelectedCam(cam)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
              selectedCam === cam
                ? 'bg-primary/15 text-primary border-primary/30'
                : 'text-muted-foreground border-[var(--nav-border)] hover:border-primary/20 hover:text-foreground'
            )}
          >
            {cam}
          </button>
              ))}
            </div>

            {/* Video feed */}
            <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video border border-[var(--nav-border)]">
              <video
          className="w-full h-full object-cover"
          src="../video_cctv.mp4"
          autoPlay
          loop
          muted
              />

              {/* Camera info overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge className="bg-[#E21B22] text-white text-[10px] font-bold px-2 py-0.5 border-0">LIVE</Badge>
          <span className="text-[10px] text-white/70 font-mono">{selectedCam} • 1080p</span>
              </div>

              {/* Corner brackets */}
              {[
          'top-4 left-4 border-t-2 border-l-2',
          'top-4 right-4 border-t-2 border-r-2',
          'bottom-4 left-4 border-b-2 border-l-2',
          'bottom-4 right-4 border-b-2 border-r-2',
              ].map((cls, i) => (
          <div key={i} className={`absolute w-6 h-6 border-primary/50 ${cls}`} />
              ))}

              {/* Center reticle */}
              <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border border-white/10 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-white/20" />
          </div>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="text-[10px] text-white/50 font-mono">
            {new Date().toLocaleTimeString('en-US', { hour12: false })}
          </span>
          <button className="w-6 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-colors">
            <Maximize2 className="w-3 h-3 text-white/60" />
          </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
