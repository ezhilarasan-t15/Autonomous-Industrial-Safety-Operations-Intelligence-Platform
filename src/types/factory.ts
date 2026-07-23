export type StatusColor = 'green' | 'yellow' | 'red' | 'blue' | 'cyan';

export type MachineStatus = 'Healthy' | 'Warning' | 'Critical' | 'Maintenance';

export interface Machine {
  id: string; // e.g. "M01", "M12"
  name: string;
  zone: string; // e.g. "Assembly Line", "Chemical Room"
  health: number; // 0 - 100%
  status: MachineStatus;
  temperature: number; // °C
  oilLevel: number; // %
  vibration: number; // Hz / mm/s
  bearingCondition: 'Optimal' | 'Fair' | 'Worn' | 'Critical';
  issues: string[];
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  estimatedRepairTime?: string;
  lastMaintenance: string;
  xRatio: number; // 0..1 location on map
  yRatio: number; // 0..1 location on map
}

export type WorkerStatus = 'Available' | 'Busy' | 'Emergency' | 'On Break';

export interface PPEChecklist {
  helmet: boolean;
  gloves: boolean;
  shoes: boolean;
  jacket: boolean;
  goggles: boolean;
}

export interface Worker {
  id: string; // e.g. "W101"
  name: string;
  avatar: string;
  department: string;
  currentRoom: string;
  currentTask: string;
  status: WorkerStatus;
  supervisor: string;
  ppe: PPEChecklist;
  xRatio: number; // 0..1 map coordinate
  yRatio: number; // 0..1 map coordinate
  targetX?: number;
  targetY?: number;
  assignedMachineId?: string;
}

export interface PowerTelemetry {
  generatorFuel: number; // 0..100%
  upsBattery: number; // 0..100%
  powerConsumption: number; // kW
  estimatedBackupMinutes: number;
  fuelPredictionDays: number;
  batteryHealth: number; // %
  isGridOnline: boolean;
  isGeneratorRunning: boolean;
}

export type EmergencyType = 'None' | 'Fire' | 'Smoke' | 'Gas Leak' | 'Explosion' | 'Medical Emergency' | 'Worker Injury';
export type EmergencyLevel = 'Normal' | 'Warning' | 'Critical';

export interface EmergencyState {
  active: boolean;
  type: EmergencyType;
  level: EmergencyLevel;
  zone: string;
  timestamp?: string;
  blockedExits: string[]; // e.g. ["Exit 2"]
  totalWorkers: number;
  evacuatedCount: number;
  remainingCount: number;
  rescueRequiredCount: number;
  estimatedEvacuationMinutes: number;
  evacuationRoutes: {
    zone: string;
    targetExit: string;
    safe: boolean;
  }[];
}

export interface QualityBatch {
  id: string;
  currentProduct: string;
  expectedIngredients: { name: string; percentage: number }[];
  detectedIngredients: { name: string; percentage: number }[];
  batchNumber: string;
  totalInspected: number;
  rejectedProducts: number;
  qualityScore: number; // %
  aiRecommendation: string;
  status: 'OPTIMAL' | 'INGREDIENT_MISMATCH' | 'HIGH_DEFECT';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
  machineId?: string;
  workerId?: string;
  read: boolean;
}

export interface TaskAssignment {
  id: string;
  issue: string;
  machineId: string;
  machineName: string;
  priority: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  workerId: string;
  workerName: string;
  distanceMeters: number;
  supervisorName: string;
  estimatedRepairTime: string;
  status: 'Pending' | 'Accepted' | 'In Progress' | 'Resolved';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}

export type NavModule = 
  | 'dashboard'
  | 'live_factory'
  | 'machine_health'
  | 'workers'
  | 'quality_control'
  | 'emergency'
  | 'power'
  | 'predictive'
  | 'reports'
  | 'ai_assistant'
  | 'settings';
