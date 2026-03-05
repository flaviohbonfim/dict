import { Files, Settings } from 'lucide-react';

interface ActivityBarProps {
  activeView: 'explorer' | '';
  onViewChange: (view: 'explorer' | '') => void;
  onOpenSettings: () => void;
  isSettingsOpen: boolean;
}

export function ActivityBar({ activeView, onViewChange, onOpenSettings, isSettingsOpen }: ActivityBarProps) {
  return (
    <div className="activity-bar">
      <div
        className={`activity-bar-item ${activeView === 'explorer' ? 'active' : ''}`}
        onClick={() => onViewChange(activeView === 'explorer' ? '' : 'explorer')}
        title="Explorador (Ctrl+Shift+E)"
      >
        <Files size={24} />
      </div>
      <div style={{ flex: 1 }} />
      <div
        className={`activity-bar-item ${isSettingsOpen ? 'active' : ''}`}
        onClick={onOpenSettings}
        title="Configurações (Ctrl+,)"
      >
        <Settings size={24} />
      </div>
    </div>
  );
}
