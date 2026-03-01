export type TicketStatus = 'Pending' | 'Resolved' | 'Escalated' | 'Acknowledged'

export interface IncidentTicket {
  id: string
  workerName: string
  issue: string
  location: string
  status: TicketStatus
  slaTimer: number
  severity: 'high' | 'medium' | 'low'
  timestamp: string
}

export const INITIAL_TICKETS: IncidentTicket[] = [
  {
    id: 'TKT-001',
    workerName: 'Ahmad Razali',
    issue: 'Heat Stress',
    location: 'Zone A - Boiler Room',
    status: 'Pending',
    slaTimer: 18,
    severity: 'high',
    timestamp: '08:42:11',
  },
  {
    id: 'TKT-002',
    workerName: 'Priya Nair',
    issue: 'High Heart Rate',
    location: 'Zone B - Compressor Bay',
    status: 'Pending',
    slaTimer: 30,
    severity: 'high',
    timestamp: '08:51:34',
  },
  {
    id: 'TKT-003',
    workerName: 'James Okafor',
    issue: 'Fall Detection',
    location: 'Zone C - Storage Level 3',
    status: 'Resolved',
    slaTimer: 0,
    severity: 'medium',
    timestamp: '07:15:20',
  },
  {
    id: 'TKT-004',
    workerName: 'Siti Aminah',
    issue: 'Gas Leak Proximity',
    location: 'Zone D - Pipeline',
    status: 'Pending',
    slaTimer: 8,
    severity: 'high',
    timestamp: '09:03:55',
  },
]

export const AI_CHART_DATA = [
  { area: 'Boiler Room', incidents: 12 },
  { area: 'Compressor Bay', incidents: 8 },
  { area: 'Pipeline', incidents: 15 },
  { area: 'Storage L3', incidents: 4 },
  { area: 'Control Room', incidents: 2 },
  { area: 'Loading Bay', incidents: 7 },
]

export const FATIGUE_TREND_DATA = [
  { time: '00:00', ahmad: 28, priya: 31, team_avg: 24 },
  { time: '02:00', ahmad: 35, priya: 38, team_avg: 28 },
  { time: '04:00', ahmad: 44, priya: 46, team_avg: 33 },
  { time: '06:00', ahmad: 58, priya: 52, team_avg: 38 },
  { time: '08:00', ahmad: 70, priya: 61, team_avg: 44 },
  { time: '10:00', ahmad: 82, priya: 67, team_avg: 51 },
]

export const RISK_ZONE_DATA = [
  { zone: 'Zone A', risk: 88, incidents: 72, fatigue: 80, env: 76 },
  { zone: 'Zone B', risk: 65, incidents: 55, fatigue: 67, env: 58 },
  { zone: 'Zone C', risk: 42, incidents: 35, fatigue: 34, env: 40 },
  { zone: 'Zone D', risk: 91, incidents: 85, fatigue: 60, env: 95 },
  { zone: 'Control', risk: 18, incidents: 12, fatigue: 19, env: 15 },
]

export const SLA_COMPLIANCE_DATA = [
  { hour: '06:00', acknowledged: 4, missed: 0, rate: 100 },
  { hour: '07:00', acknowledged: 6, missed: 1, rate: 86 },
  { hour: '08:00', acknowledged: 5, missed: 2, rate: 71 },
  { hour: '09:00', acknowledged: 3, missed: 2, rate: 60 },
  { hour: '10:00', acknowledged: 7, missed: 1, rate: 88 },
  { hour: '11:00', acknowledged: 4, missed: 0, rate: 100 },
]

export const WORKER_PROFILES = [
  {
    id: 'W01',
    name: 'Ahmad Razali',
    role: 'Senior Operator',
    zone: 'Zone A',
    fatigue: 82,
    heartRate: 112,
    temp: 38.2,
    status: 'critical',
  },
  {
    id: 'W02',
    name: 'Priya Nair',
    role: 'Technician',
    zone: 'Zone B',
    fatigue: 67,
    heartRate: 98,
    temp: 37.5,
    status: 'warning',
  },
  {
    id: 'W03',
    name: 'James Okafor',
    role: 'Field Engineer',
    zone: 'Zone C',
    fatigue: 34,
    heartRate: 74,
    temp: 36.8,
    status: 'safe',
  },
  {
    id: 'W04',
    name: 'Siti Aminah',
    role: 'Safety Officer',
    zone: 'Zone D',
    fatigue: 51,
    heartRate: 85,
    temp: 37.1,
    status: 'warning',
  },
  {
    id: 'W05',
    name: 'Raj Patel',
    role: 'Maintenance Lead',
    zone: 'Zone A',
    fatigue: 28,
    heartRate: 68,
    temp: 36.6,
    status: 'safe',
  },
  {
    id: 'W06',
    name: 'Li Wei Chen',
    role: 'Control Operator',
    zone: 'Control Room',
    fatigue: 19,
    heartRate: 71,
    temp: 36.4,
    status: 'safe',
  },
]

export const ASSET_STATUS = [
  { id: 'A01', name: 'Pump A', zone: 'Zone A', status: 'Normal', metric: '2,340 RPM', type: 'Pump' },
  { id: 'A02', name: 'Compressor B', zone: 'Zone B', status: 'Overheating', metric: '91°C', type: 'Compressor' },
  { id: 'A03', name: 'Gas Sensor D4', zone: 'Zone D', status: 'Alert', metric: '23 ppm', type: 'Sensor' },
  { id: 'A04', name: 'Fire Suppressor C', zone: 'Zone C', status: 'Normal', metric: 'Armed', type: 'Safety' },
  { id: 'A05', name: 'Boiler Unit 1', zone: 'Zone A', status: 'Normal', metric: '78°C', type: 'Boiler' },
  { id: 'A06', name: 'Conveyor Belt', zone: 'Zone C', status: 'Maintenance', metric: 'Offline', type: 'Mechanical' },
]
