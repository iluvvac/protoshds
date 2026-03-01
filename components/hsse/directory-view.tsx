'use client'

import { User, Cpu, Activity, Thermometer, Heart, MapPin, Wifi, WifiOff, AlertTriangle, Wrench } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { WORKER_PROFILES, ASSET_STATUS } from '@/lib/hsse-data'
import { TooltipHint } from '@/components/hsse/tooltip-hint'

function FatigueBar({ score }: { score: number }) {
  const color = score >= 75 ? '#E21B22' : score >= 50 ? '#D97706' : '#059669'
  const label = score >= 75 ? 'High — immediate rest required' : score >= 50 ? 'Moderate — monitor closely' : 'Low — within safe range'
  return (
    <TooltipHint
      content={<><p className="font-semibold">Fatigue Score: {score}/100</p><p className="text-muted-foreground text-[10px]">{label}</p><p className="text-muted-foreground text-[10px]">Threshold: 65 (clinical alert), 80 (off-duty)</p></>}
      side="top"
    >
      <div className="space-y-1 cursor-default">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Fatigue Score</span>
          <span className="text-[10px] font-bold" style={{ color }}>{score}</span>
        </div>
        <div className="h-1.5 bg-accent rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${score}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </TooltipHint>
  )
}

const ASSET_STATUS_CONFIG: Record<string, { className: string; icon: React.ElementType; dotClass: string }> = {
  Normal: { className: 'bg-emerald-500/15 text-[#059669] border-[#059669]/35', icon: Wifi, dotClass: 'bg-[#059669]' },
  Overheating: { className: 'bg-[#E21B22]/15 text-[#E21B22] border-[#E21B22]/30', icon: Thermometer, dotClass: 'bg-[#E21B22]' },
  Alert: { className: 'bg-[#E21B22]/15 text-[#E21B22] border-[#E21B22]/30', icon: AlertTriangle, dotClass: 'bg-[#E21B22]' },
  Maintenance: { className: 'bg-amber-500/15 text-[#D97706] border-[#D97706]/35', icon: Wrench, dotClass: 'bg-[#D97706]' },
  Offline: { className: 'bg-muted text-muted-foreground border-border', icon: WifiOff, dotClass: 'bg-muted-foreground' },
}

export function DirectoryView() {
  return (
    <div className="h-full flex flex-col gap-4 p-6 overflow-auto">
      <Tabs defaultValue="workers" className="flex-1 flex flex-col">
        <div className="glass-card rounded-2xl overflow-hidden flex-1 flex flex-col">
          {/* Tab header */}
          <div className="px-5 py-4 border-b border-[var(--nav-border)] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-foreground">Workforce Directory</h2>
              <p className="text-[10px] text-muted-foreground">Worker biometrics and IoT asset status</p>
            </div>
            <TabsList className="bg-accent border border-[var(--nav-border)] h-8">
              <TabsTrigger value="workers" className="text-xs h-6 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <User className="w-3 h-3 mr-1.5" />
                Worker Profiles
              </TabsTrigger>
              <TabsTrigger value="assets" className="text-xs h-6 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Cpu className="w-3 h-3 mr-1.5" />
                Asset Status
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Workers grid */}
          <TabsContent value="workers" className="flex-1 p-5 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {WORKER_PROFILES.map((worker) => {
                const statusColor = worker.status === 'critical'
                  ? '#E21B22'
                  : worker.status === 'warning' ? '#D97706' : '#059669'
                const statusLabel = worker.status === 'critical' ? 'Critical' : worker.status === 'warning' ? 'Warning' : 'Safe'

                return (
                  <div
                    key={worker.id}
                    className={cn(
                      'rounded-xl p-4 border transition-all hover:scale-[1.01] space-y-3',
                      worker.status === 'critical'
                        ? 'border-[#E21B22]/30 bg-[#E21B22]/5'
                        : worker.status === 'warning'
                        ? 'border-yellow-500/20 bg-yellow-500/5'
                        : 'border-[var(--nav-border)] bg-accent/20'
                    )}
                  >
                    {/* Worker header */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: statusColor + '50', backgroundColor: statusColor + '15' }}
                      >
                        <User className="w-5 h-5" style={{ color: statusColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{worker.name}</p>
                        <p className="text-[10px] text-muted-foreground">{worker.role}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold border flex-shrink-0"
                        style={{
                          borderColor: statusColor + '40',
                          color: statusColor,
                          backgroundColor: statusColor + '15',
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: statusColor }} />
                        {statusLabel}
                      </Badge>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{worker.zone} • {worker.id}</span>
                    </div>

                    {/* Biometrics */}
                    <div className="grid grid-cols-2 gap-2">
                      <TooltipHint
                        content={<><p className="font-semibold">Heart Rate</p><p className="text-muted-foreground text-[10px]">{worker.heartRate > 100 ? 'Above threshold — elevated cardiac stress' : 'Within normal resting range'}</p><p className="text-muted-foreground text-[10px]">Normal: 60–100 bpm</p></>}
                        side="top"
                      >
                        <div className="rounded-lg bg-accent/50 border border-[var(--nav-border)] p-2 cursor-default">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Heart className="w-3 h-3 text-[#E21B22]" />
                            <span className="text-[10px] text-muted-foreground">Heart Rate</span>
                          </div>
                          <p className={cn('text-sm font-bold', worker.heartRate > 100 ? 'text-[#E21B22]' : 'text-foreground')}>
                            {worker.heartRate} <span className="text-[10px] font-normal text-muted-foreground">bpm</span>
                          </p>
                        </div>
                      </TooltipHint>
                      <TooltipHint
                        content={<><p className="font-semibold">Body Temperature</p><p className="text-muted-foreground text-[10px]">{worker.temp > 38 ? 'Elevated — possible heat stress or fever' : 'Normal temperature range'}</p><p className="text-muted-foreground text-[10px]">Alert threshold: 38.0°C</p></>}
                        side="top"
                      >
                        <div className="rounded-lg bg-accent/50 border border-[var(--nav-border)] p-2 cursor-default">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Thermometer className="w-3 h-3 text-[#D97706]" />
                            <span className="text-[10px] text-muted-foreground">Body Temp</span>
                          </div>
                          <p className={cn('text-sm font-bold', worker.temp > 38 ? 'text-[#D97706]' : 'text-foreground')}>
                            {worker.temp}°<span className="text-[10px] font-normal text-muted-foreground">C</span>
                          </p>
                        </div>
                      </TooltipHint>
                    </div>

                    {/* Fatigue bar */}
                    <FatigueBar score={worker.fatigue} />
                  </div>
                )
              })}
            </div>
          </TabsContent>

          {/* Assets grid */}
          <TabsContent value="assets" className="flex-1 p-5 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {ASSET_STATUS.map((asset) => {
                const cfg = ASSET_STATUS_CONFIG[asset.status] || ASSET_STATUS_CONFIG.Offline
                const StatusIcon = cfg.icon
                return (
                  <div
                    key={asset.id}
                    className={cn(
                      'rounded-xl p-4 border transition-all hover:scale-[1.01] space-y-3',
                      ['Overheating', 'Alert'].includes(asset.status)
                        ? 'border-[#E21B22]/30 bg-[#E21B22]/5'
                        : asset.status === 'Maintenance'
                        ? 'border-yellow-500/20 bg-yellow-500/5'
                        : 'border-[var(--nav-border)] bg-accent/20'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', cfg.className.split(' ')[0])}>
                          <Cpu className={cn('w-5 h-5', cfg.className.split(' ')[1])} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{asset.name}</p>
                          <p className="text-[10px] text-muted-foreground">{asset.type} • {asset.id}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn('text-[10px] font-semibold border', cfg.className)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5', cfg.dotClass)} />
                        {asset.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <TooltipHint content={`Location: ${asset.zone}`} side="top">
                        <div className="flex items-center gap-1.5 cursor-default">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">{asset.zone}</span>
                        </div>
                      </TooltipHint>
                      <TooltipHint
                        content={<><p className="font-semibold">Live Reading</p><p className="text-muted-foreground text-[10px]">{asset.metric} — {asset.status === 'Normal' ? 'Within operational limits' : asset.status === 'Overheating' ? 'Exceeds safe operating temp' : asset.status === 'Maintenance' ? 'Scheduled maintenance window' : 'Alert condition active'}</p></>}
                        side="top"
                        align="end"
                      >
                        <div className="flex items-center gap-1.5 cursor-default">
                          <Activity className="w-3 h-3 text-muted-foreground" />
                          <span className={cn('text-xs font-bold', cfg.className.split(' ')[1])}>{asset.metric}</span>
                        </div>
                      </TooltipHint>
                    </div>

                    {['Overheating', 'Alert'].includes(asset.status) && (
                      <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-[#E21B22]/10 border border-[#E21B22]/20">
                        <AlertTriangle className="w-3 h-3 text-[#E21B22] flex-shrink-0" />
                        <p className="text-[10px] text-[#E21B22] font-semibold">Immediate inspection required</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
