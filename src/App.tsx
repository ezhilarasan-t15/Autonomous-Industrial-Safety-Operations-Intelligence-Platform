import React, { useState } from 'react';
import { FactoryProvider, useFactory } from './context/FactoryContext';
import { TopHeader } from './components/layout/TopHeader';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { VoiceAnnouncer } from './components/layout/VoiceAnnouncer';
import { NotificationPanel } from './components/layout/NotificationPanel';
import { DashboardView } from './components/dashboard/DashboardView';
import { LiveFactoryMap } from './components/factory/LiveFactoryMap';
import { MachineHealthView } from './components/machines/MachineHealthView';
import { WorkerMonitoringView } from './components/workers/WorkerMonitoringView';
import { QualityControlView } from './components/quality/QualityControlView';
import { EmergencyCenterView } from './components/emergency/EmergencyCenterView';
import { PowerManagementView } from './components/power/PowerManagementView';
import { PredictiveMaintView } from './components/predictive/PredictiveMaintView';
import { ReportsView } from './components/reports/ReportsView';
import { AiAssistantView } from './components/ai/AiAssistantView';
import { SettingsView } from './components/settings/SettingsView';
import { LiveCameraModal } from './components/common/LiveCameraModal';
import { TaskAssignModal } from './components/common/TaskAssignModal';
import { AiAssistantModal } from './components/ai/AiAssistantModal';

const MainLayout: React.FC = () => {
  const { 
    activeNav, 
    selectedCameraMachine, 
    setSelectedCameraMachine,
    activeTaskModal,
    setActiveTaskModal
  } = useFactory();

  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);

  const renderActiveView = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DashboardView />;
      case 'live_factory':
        return <LiveFactoryMap />;
      case 'machine_health':
        return <MachineHealthView />;
      case 'workers':
        return <WorkerMonitoringView />;
      case 'quality_control':
        return <QualityControlView />;
      case 'emergency':
        return <EmergencyCenterView />;
      case 'power':
        return <PowerManagementView />;
      case 'predictive':
        return <PredictiveMaintView />;
      case 'reports':
        return <ReportsView />;
      case 'ai_assistant':
        return <AiAssistantView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#06090E] text-slate-100 bg-cyber-grid font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Header Navigation */}
      <TopHeader />

      {/* Voice Broadcast Announcement Bar */}
      <VoiceAnnouncer />

      {/* Workspace Area: Sidebar + Active Module */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Control Navigation Sidebar */}
        <LeftSidebar />

        {/* Main Telemetry & Dashboard Workspace */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-h-[calc(100vh-6rem)]">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals & Sliding Drawers */}
      <LiveCameraModal
        machine={selectedCameraMachine}
        onClose={() => setSelectedCameraMachine(null)}
      />

      <TaskAssignModal
        task={activeTaskModal}
        onClose={() => setActiveTaskModal(null)}
      />

      <NotificationPanel
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />

      {/* Floating Bottom Right AI Chatbot Widget */}
      <AiAssistantModal />
    </div>
  );
};

export function App() {
  return (
    <FactoryProvider>
      <MainLayout />
    </FactoryProvider>
  );
}

export default App;
