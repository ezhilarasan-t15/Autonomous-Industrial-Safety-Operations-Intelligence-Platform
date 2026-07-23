import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Machine,
  Worker,
  PowerTelemetry,
  EmergencyState,
  QualityBatch,
  NotificationItem,
  TaskAssignment,
  NavModule,
  ChatMessage
} from '../types/factory';

interface FactoryContextType {
  activeNav: NavModule;
  setActiveNav: (nav: NavModule) => void;
  machines: Machine[];
  workers: Worker[];
  power: PowerTelemetry;
  emergency: EmergencyState;
  quality: QualityBatch;
  notifications: NotificationItem[];
  taskAssignments: TaskAssignment[];
  activeTaskModal: TaskAssignment | null;
  setActiveTaskModal: (task: TaskAssignment | null) => void;
  selectedMachineId: string | null;
  setSelectedMachineId: (id: string | null) => void;
  selectedCameraMachine: Machine | null;
  setSelectedCameraMachine: (m: Machine | null) => void;
  currentAnnouncement: string;
  isVoiceMuted: boolean;
  setIsVoiceMuted: (muted: boolean) => void;
  speakAnnouncement: (text: string) => void;
  triggerEmergency: (type: EmergencyState['type'], zone: string) => void;
  resolveEmergency: () => void;
  assignWorkerToMachine: (machineId: string, workerId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskAssignment['status']) => void;
  simulateLowFuelToggle: () => void;
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;
  dismissNotification: (id: string) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (msg: string) => void;
}

const initialMachines: Machine[] = [
  {
    id: "M01",
    name: "CNC Milling Robot Alpha",
    zone: "Assembly Line",
    health: 98,
    status: "Healthy",
    temperature: 42,
    oilLevel: 94,
    vibration: 1.2,
    bearingCondition: "Optimal",
    issues: [],
    lastMaintenance: "2026-07-15",
    xRatio: 0.18,
    yRatio: 0.28
  },
  {
    id: "M02",
    name: "Hydraulic Stamping Press",
    zone: "Assembly Line",
    health: 94,
    status: "Healthy",
    temperature: 48,
    oilLevel: 88,
    vibration: 2.1,
    bearingCondition: "Optimal",
    issues: [],
    lastMaintenance: "2026-07-10",
    xRatio: 0.32,
    yRatio: 0.28
  },
  {
    id: "M03",
    name: "Automated Laser Welder",
    zone: "Assembly Line",
    health: 91,
    status: "Healthy",
    temperature: 55,
    oilLevel: 85,
    vibration: 1.8,
    bearingCondition: "Optimal",
    issues: [],
    lastMaintenance: "2026-07-02",
    xRatio: 0.46,
    yRatio: 0.28
  },
  {
    id: "M04",
    name: "High Precision Lathe X",
    zone: "Assembly Line",
    health: 68,
    status: "Warning",
    temperature: 78,
    oilLevel: 45,
    vibration: 4.8,
    bearingCondition: "Worn",
    issues: ["High Bearing Temp", "Vibration Spike"],
    assignedWorkerId: "W102",
    assignedWorkerName: "Sarah Connor (W102)",
    estimatedRepairTime: "15 Mins",
    lastMaintenance: "2026-06-20",
    xRatio: 0.60,
    yRatio: 0.28
  },
  {
    id: "M05",
    name: "Chemical Reactor Vessel #1",
    zone: "Chemical Room",
    health: 89,
    status: "Healthy",
    temperature: 62,
    oilLevel: 90,
    vibration: 0.8,
    bearingCondition: "Optimal",
    issues: [],
    lastMaintenance: "2026-07-18",
    xRatio: 0.22,
    yRatio: 0.72
  },
  {
    id: "M06",
    name: "Solvent Extraction Unit",
    zone: "Chemical Room",
    health: 84,
    status: "Healthy",
    temperature: 58,
    oilLevel: 82,
    vibration: 1.5,
    bearingCondition: "Optimal",
    issues: [],
    lastMaintenance: "2026-07-12",
    xRatio: 0.38,
    yRatio: 0.72
  },
  {
    id: "M07",
    name: "High Speed Packaging Conveyor",
    zone: "Packing Area",
    health: 96,
    status: "Healthy",
    temperature: 38,
    oilLevel: 96,
    vibration: 1.1,
    bearingCondition: "Optimal",
    issues: [],
    lastMaintenance: "2026-07-19",
    xRatio: 0.75,
    yRatio: 0.30
  },
  {
    id: "M08",
    name: "Palletizing Robot Station",
    zone: "Packing Area",
    health: 93,
    status: "Healthy",
    temperature: 41,
    oilLevel: 92,
    vibration: 1.4,
    bearingCondition: "Optimal",
    issues: [],
    lastMaintenance: "2026-07-14",
    xRatio: 0.88,
    yRatio: 0.30
  },
  {
    id: "M09",
    name: "Autonomous Forklift Charger 1",
    zone: "Warehouse",
    health: 99,
    status: "Healthy",
    temperature: 32,
    oilLevel: 100,
    vibration: 0.2,
    bearingCondition: "Optimal",
    issues: [],
    lastMaintenance: "2026-07-21",
    xRatio: 0.72,
    yRatio: 0.75
  },
  {
    id: "M10",
    name: "Automated Storage Crane",
    zone: "Warehouse",
    health: 95,
    status: "Healthy",
    temperature: 44,
    oilLevel: 89,
    vibration: 1.6,
    bearingCondition: "Optimal",
    issues: [],
    lastMaintenance: "2026-07-08",
    xRatio: 0.88,
    yRatio: 0.75
  },
  {
    id: "M11",
    name: "Main Diesel Turbine Genset",
    zone: "Generator",
    health: 86,
    status: "Healthy",
    temperature: 71,
    oilLevel: 78,
    vibration: 2.8,
    bearingCondition: "Optimal",
    issues: [],
    lastMaintenance: "2026-07-01",
    xRatio: 0.08,
    yRatio: 0.88
  },
  {
    id: "M12",
    name: "Heavy Duty Turbine Injector M12",
    zone: "Assembly Line",
    health: 48,
    status: "Critical",
    temperature: 92,
    oilLevel: 14,
    vibration: 7.9,
    bearingCondition: "Critical",
    issues: ["Loose Screw Detected", "Oil Leakage", "Critical Temperature"],
    assignedWorkerId: "W104",
    assignedWorkerName: "Alex Mercer (W104)",
    estimatedRepairTime: "5 Mins",
    lastMaintenance: "2026-05-14",
    xRatio: 0.50,
    yRatio: 0.42
  }
];

const initialWorkers: Worker[] = [
  {
    id: "W101",
    name: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    department: "Plant Safety Specialist",
    currentRoom: "Control Room",
    currentTask: "Monitoring Safety Feed",
    status: "Available",
    supervisor: "Elena Rostova",
    ppe: { helmet: true, gloves: true, shoes: true, jacket: true, goggles: true },
    xRatio: 0.10,
    yRatio: 0.12
  },
  {
    id: "W102",
    name: "Sarah Connor",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    department: "Mechanical Maintenance",
    currentRoom: "Assembly Line",
    currentTask: "Inspecting Machine M04",
    status: "Busy",
    supervisor: "David Vance",
    ppe: { helmet: true, gloves: true, shoes: true, jacket: true, goggles: true },
    xRatio: 0.58,
    yRatio: 0.32
  },
  {
    id: "W103",
    name: "Chen Wei",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    department: "Chemical Operations",
    currentRoom: "Chemical Room",
    currentTask: "Batch Analysis",
    status: "Available",
    supervisor: "Dr. Aris Thorne",
    ppe: { helmet: true, gloves: true, shoes: true, jacket: true, goggles: false }, // missing goggles warning
    xRatio: 0.28,
    yRatio: 0.70
  },
  {
    id: "W104",
    name: "Alex Mercer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    department: "Senior Robotics Lead",
    currentRoom: "Assembly Line",
    currentTask: "Repairing Machine M12",
    status: "Busy",
    supervisor: "David Vance",
    ppe: { helmet: true, gloves: true, shoes: true, jacket: true, goggles: true },
    xRatio: 0.48,
    yRatio: 0.45
  },
  {
    id: "W105",
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    department: "Quality Assurance",
    currentRoom: "Packing Area",
    currentTask: "Conveyor Inspection",
    status: "Available",
    supervisor: "Elena Rostova",
    ppe: { helmet: true, gloves: true, shoes: true, jacket: true, goggles: true },
    xRatio: 0.78,
    yRatio: 0.35
  },
  {
    id: "W106",
    name: "Dimitri Volkov",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    department: "Power & Systems",
    currentRoom: "Generator",
    currentTask: "Turbine Inspection",
    status: "Available",
    supervisor: "David Vance",
    ppe: { helmet: false, gloves: true, shoes: true, jacket: true, goggles: true }, // missing helmet alert!
    xRatio: 0.12,
    yRatio: 0.85
  },
  {
    id: "W107",
    name: "Lucas Hayes",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    department: "Logistics Lead",
    currentRoom: "Warehouse",
    currentTask: "Stock Audit",
    status: "On Break",
    supervisor: "Elena Rostova",
    ppe: { helmet: true, gloves: true, shoes: true, jacket: true, goggles: true },
    xRatio: 0.82,
    yRatio: 0.78
  },
  {
    id: "W108",
    name: "Kaito Tanaka",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    department: "Safety & First Aid",
    currentRoom: "Control Room",
    currentTask: "Standby Response",
    status: "Available",
    supervisor: "Elena Rostova",
    ppe: { helmet: true, gloves: true, shoes: true, jacket: true, goggles: true },
    xRatio: 0.08,
    yRatio: 0.20
  }
];

const FactoryContext = createContext<FactoryContextType | undefined>(undefined);

export const FactoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeNav, setActiveNav] = useState<NavModule>('dashboard');
  const [machines, setMachines] = useState<Machine[]>(initialMachines);
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [selectedCameraMachine, setSelectedCameraMachine] = useState<Machine | null>(null);

  const [power, setPower] = useState<PowerTelemetry>({
    generatorFuel: 88,
    upsBattery: 96,
    powerConsumption: 1420, // kW
    estimatedBackupMinutes: 340,
    fuelPredictionDays: 14.2,
    batteryHealth: 98,
    isGridOnline: true,
    isGeneratorRunning: true
  });

  const [emergency, setEmergency] = useState<EmergencyState>({
    active: false,
    type: 'None',
    level: 'Normal',
    zone: 'None',
    blockedExits: [],
    totalWorkers: 42,
    evacuatedCount: 42,
    remainingCount: 0,
    rescueRequiredCount: 0,
    estimatedEvacuationMinutes: 0,
    evacuationRoutes: [
      { zone: 'Assembly Line', targetExit: 'Exit 1', safe: true },
      { zone: 'Warehouse', targetExit: 'Exit 3', safe: true },
      { zone: 'Chemical Room', targetExit: 'Exit 1', safe: true },
      { zone: 'Packing Area', targetExit: 'Exit 2', safe: true },
      { zone: 'Control Room', targetExit: 'Exit 1', safe: true }
    ]
  });

  const [quality, setQuality] = useState<QualityBatch>({
    id: "BATCH-8902",
    currentProduct: "Titanium Alloy Structural Housing - Spec A",
    expectedIngredients: [
      { name: "Titanium Gr5", percentage: 88.5 },
      { name: "Aluminum 6061", percentage: 6.5 },
      { name: "Vanadium Coating", percentage: 5.0 }
    ],
    detectedIngredients: [
      { name: "Titanium Gr5", percentage: 88.2 },
      { name: "Aluminum 6061", percentage: 6.8 },
      { name: "Vanadium Coating", percentage: 5.0 }
    ],
    batchNumber: "B-2026-0722-X4",
    totalInspected: 1240,
    rejectedProducts: 14,
    qualityScore: 98.8,
    aiRecommendation: "Laser weld frequency optimal. Defect rate within 0.01% boundary.",
    status: 'OPTIMAL'
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "N-1",
      title: "🔴 EMERGENCY ALERT",
      message: "Machine M12 Loose Screw & Oil Leak Detected on Assembly Line",
      type: "critical",
      timestamp: "Just now",
      machineId: "M12",
      read: false
    },
    {
      id: "N-2",
      title: "Worker Dispatched",
      message: "Worker Alex Mercer (W104) assigned to inspect Machine M12",
      type: "info",
      timestamp: "2 mins ago",
      workerId: "W104",
      read: false
    },
    {
      id: "N-3",
      title: "⚠️ PPE Warning",
      message: "Worker Dimitri Volkov (W106) helmet missing in Generator Room",
      type: "warning",
      timestamp: "5 mins ago",
      workerId: "W106",
      read: false
    },
    {
      id: "N-4",
      title: "Quality Inspection Complete",
      message: "Batch B-2026-0722-X4 passed 98.8% quality threshold",
      type: "success",
      timestamp: "10 mins ago",
      read: false
    }
  ]);

  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>([
    {
      id: "TASK-101",
      issue: "Loose Screw & Critical Vibration Spike",
      machineId: "M12",
      machineName: "Heavy Duty Turbine Injector M12",
      priority: "CRITICAL",
      workerId: "W104",
      workerName: "Alex Mercer",
      distanceMeters: 12,
      supervisorName: "David Vance",
      estimatedRepairTime: "5 Minutes",
      status: "In Progress"
    }
  ]);

  const [activeTaskModal, setActiveTaskModal] = useState<TaskAssignment | null>({
    id: "TASK-101",
    issue: "Loose Screw & Critical Oil Leakage",
    machineId: "M12",
    machineName: "Heavy Duty Turbine Injector M12",
    priority: "CRITICAL",
    workerId: "W104",
    workerName: "Alex Mercer",
    distanceMeters: 12,
    supervisorName: "David Vance",
    estimatedRepairTime: "5 Minutes",
    status: "In Progress"
  });

  const [currentAnnouncement, setCurrentAnnouncement] = useState<string>(
    "Attention Worker W104: Please inspect Machine M12 immediately. Loose screw detected."
  );
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "ai",
      text: "Hello Operational Commander. SafeVision AI Neural Monitor is online and scanning 12 machine arrays, 42 active personnel, and environmental sensors. How may I assist your shift?",
      timestamp: "22:58"
    }
  ]);

  const speakAnnouncement = useCallback((text: string) => {
    setCurrentAnnouncement(text);
    if (!isVoiceMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, [isVoiceMuted]);

  const addNotification = useCallback((title: string, message: string, type: NotificationItem['type']) => {
    const newItem: NotificationItem = {
      id: `N-${Date.now()}`,
      title,
      message,
      type,
      timestamp: "Just now",
      read: false
    };
    setNotifications(prev => [newItem, ...prev.slice(0, 19)]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const triggerEmergency = useCallback((type: EmergencyState['type'], zone: string) => {
    let blocked: string[] = [];
    if (zone === "Chemical Room" || zone === "Packing Area") {
      blocked = ["Exit 2"];
    } else if (zone === "Assembly Line") {
      blocked = ["Exit 1"];
    }

    const updatedRoutes = [
      { zone: 'Assembly Line', targetExit: blocked.includes('Exit 1') ? 'Exit 2' : 'Exit 1', safe: !blocked.includes('Exit 1') },
      { zone: 'Warehouse', targetExit: 'Exit 3', safe: true },
      { zone: 'Chemical Room', targetExit: blocked.includes('Exit 2') ? 'Exit 1' : 'Exit 2', safe: true },
      { zone: 'Packing Area', targetExit: 'Exit 3', safe: true },
      { zone: 'Control Room', targetExit: 'Exit 1', safe: true }
    ];

    setEmergency({
      active: true,
      type,
      level: 'Critical',
      zone,
      timestamp: new Date().toLocaleTimeString(),
      blockedExits: blocked,
      totalWorkers: 42,
      evacuatedCount: 28,
      remainingCount: 14,
      rescueRequiredCount: 2,
      estimatedEvacuationMinutes: 3.5,
      evacuationRoutes: updatedRoutes
    });

    const msg = `EMERGENCY ALERT: ${type} detected in ${zone}! Evacuate immediately via designated exit routes!`;
    addNotification("🔴 EMERGENCY ALARM", msg, "critical");
    speakAnnouncement(msg);
  }, [addNotification, speakAnnouncement]);

  const resolveEmergency = useCallback(() => {
    setEmergency({
      active: false,
      type: 'None',
      level: 'Normal',
      zone: 'None',
      blockedExits: [],
      totalWorkers: 42,
      evacuatedCount: 42,
      remainingCount: 0,
      rescueRequiredCount: 0,
      estimatedEvacuationMinutes: 0,
      evacuationRoutes: [
        { zone: 'Assembly Line', targetExit: 'Exit 1', safe: true },
        { zone: 'Warehouse', targetExit: 'Exit 3', safe: true },
        { zone: 'Chemical Room', targetExit: 'Exit 1', safe: true },
        { zone: 'Packing Area', targetExit: 'Exit 2', safe: true },
        { zone: 'Control Room', targetExit: 'Exit 1', safe: true }
      ]
    });
    addNotification("Emergency Resolved", "All zones cleared. Factory operations returning to normal.", "success");
    speakAnnouncement("Attention: Emergency hazard resolved. Safe to resume operations.");
  }, [addNotification, speakAnnouncement]);

  const assignWorkerToMachine = useCallback((machineId: string, workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    const machine = machines.find(m => m.id === machineId);
    if (!worker || !machine) return;

    setMachines(prev => prev.map(m => m.id === machineId ? {
      ...m,
      assignedWorkerId: worker.id,
      assignedWorkerName: `${worker.name} (${worker.id})`,
      estimatedRepairTime: "10 Mins"
    } : m));

    setWorkers(prev => prev.map(w => w.id === workerId ? {
      ...w,
      status: "Busy",
      currentTask: `Inspecting ${machine.name}`
    } : w));

    const newTask: TaskAssignment = {
      id: `TASK-${Date.now()}`,
      issue: machine.issues.join(", ") || "Routine Diagnostics",
      machineId: machine.id,
      machineName: machine.name,
      priority: machine.status === 'Critical' ? 'CRITICAL' : 'HIGH',
      workerId: worker.id,
      workerName: worker.name,
      distanceMeters: Math.floor(Math.random() * 20) + 5,
      supervisorName: worker.supervisor,
      estimatedRepairTime: "10 Minutes",
      status: "In Progress"
    };

    setTaskAssignments(prev => [newTask, ...prev]);
    setActiveTaskModal(newTask);

    const msg = `Task assigned to ${worker.name} for ${machine.id}`;
    addNotification("Worker Task Dispatched", msg, "info");
    speakAnnouncement(`Attention Worker ${worker.id} ${worker.name}: Please inspect Machine ${machine.id} immediately.`);
  }, [workers, machines, addNotification, speakAnnouncement]);

  const updateTaskStatus = useCallback((taskId: string, status: TaskAssignment['status']) => {
    setTaskAssignments(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    if (activeTaskModal && activeTaskModal.id === taskId) {
      setActiveTaskModal(prev => prev ? { ...prev, status } : null);
    }
    if (status === 'Resolved') {
      addNotification("Task Resolved", `Maintenance task ${taskId} successfully resolved by technician.`, "success");
    }
  }, [activeTaskModal, addNotification]);

  const simulateLowFuelToggle = useCallback(() => {
    setPower(prev => {
      const isLow = prev.generatorFuel < 20;
      const newFuel = isLow ? 88 : 12;
      const newBackup = isLow ? 340 : 28;
      if (!isLow) {
        addNotification("⚡ Fuel Warning", "Generator Fuel Level dropped to 12%! Estimated Backup: 28 Minutes.", "warning");
        speakAnnouncement("Warning: Generator fuel low at 12%. Refill recommended immediately.");
      }
      return {
        ...prev,
        generatorFuel: newFuel,
        estimatedBackupMinutes: newBackup
      };
    });
  }, [addNotification, speakAnnouncement]);

  const sendChatMessage = useCallback((msgText: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    // AI Response generation
    setTimeout(() => {
      let reply = "I have queried the central telemetry bus. ";
      const lower = msgText.toLowerCase();

      if (lower.includes("machines need maintenance") || lower.includes("maintenance")) {
        const warningOrCritical = machines.filter(m => m.status === 'Warning' || m.status === 'Critical');
        reply += `Currently, ${warningOrCritical.length} machines require attention: ` +
          warningOrCritical.map(m => `${m.id} (${m.name} - ${m.issues.join(', ')})`).join("; ") +
          ". Worker W104 is currently assigned to M12.";
      } else if (lower.includes("fuel") || lower.includes("power")) {
        reply += `Generator Fuel is currently at ${power.generatorFuel}%. UPS Battery Backup is at ${power.upsBattery}%. Total active power load: ${power.powerConsumption} kW.`;
      } else if (lower.includes("emergency")) {
        reply += emergency.active
          ? `CRITICAL EMERGENCY ACTIVE: ${emergency.type} in ${emergency.zone}. Blocked exits: ${emergency.blockedExits.join(', ') || 'None'}. Evacuated: ${emergency.evacuatedCount}/${emergency.totalWorkers}.`
          : `All zones are NORMAL. Emergency systems are in passive monitor state. Exits 1, 2, and 3 are clear.`;
      } else if (lower.includes("efficiency") || lower.includes("worker")) {
        const busyCount = workers.filter(w => w.status === 'Busy').length;
        reply += `${workers.length} registered personnel active. ${busyCount} on active maintenance tasks. PPE compliance is at 96.5%. Missing helmet flag on Worker W106.`;
      } else if (lower.includes("summarize") || lower.includes("factory status")) {
        reply += `Factory Health Score is 96%. Production rate is 1,240 units/hr. 11/12 Machines operating nominally, 1 critical alert on Machine M12. Emergency systems green.`;
      } else {
        reply += `SafeVision AI system is operating within standard baseline. All telemetry streaming online. Try asking about maintenance, fuel status, emergencies, or worker efficiency.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 600);
  }, [machines, power, emergency, workers]);

  // Telemetry Loop Simulation - updates temperatures, positions, and telemetry every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuating machine temps & vibration slightly
      setMachines(prev => prev.map(m => {
        const deltaTemp = (Math.random() - 0.5) * 1.2;
        const deltaVib = (Math.random() - 0.5) * 0.2;
        const newTemp = Math.max(30, Math.min(110, Math.round((m.temperature + deltaTemp) * 10) / 10));
        const newVib = Math.max(0.1, Math.min(12, Math.round((m.vibration + deltaVib) * 10) / 10));
        return {
          ...m,
          temperature: newTemp,
          vibration: newVib
        };
      }));

      // Move workers slightly on 2D map corridor
      setWorkers(prev => prev.map(w => {
        const dx = (Math.random() - 0.5) * 0.015;
        const dy = (Math.random() - 0.5) * 0.015;
        const newX = Math.max(0.05, Math.min(0.92, w.xRatio + dx));
        const newY = Math.max(0.08, Math.min(0.92, w.yRatio + dy));
        return {
          ...w,
          xRatio: newX,
          yRatio: newY
        };
      }));

      // Slight power load oscillation
      setPower(prev => ({
        ...prev,
        powerConsumption: Math.round(1400 + Math.random() * 50)
      }));
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <FactoryContext.Provider
      value={{
        activeNav,
        setActiveNav,
        machines,
        workers,
        power,
        emergency,
        quality,
        notifications,
        taskAssignments,
        activeTaskModal,
        setActiveTaskModal,
        selectedMachineId,
        setSelectedMachineId,
        selectedCameraMachine,
        setSelectedCameraMachine,
        currentAnnouncement,
        isVoiceMuted,
        setIsVoiceMuted,
        speakAnnouncement,
        triggerEmergency,
        resolveEmergency,
        assignWorkerToMachine,
        updateTaskStatus,
        simulateLowFuelToggle,
        addNotification,
        dismissNotification,
        chatMessages,
        sendChatMessage
      }}
    >
      {children}
    </FactoryContext.Provider>
  );
};

export const useFactory = () => {
  const context = useContext(FactoryContext);
  if (!context) {
    throw new Error('useFactory must be used within a FactoryProvider');
  }
  return context;
};
