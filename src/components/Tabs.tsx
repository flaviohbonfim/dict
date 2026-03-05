import { X } from 'lucide-react';

interface Tab {
  id: string;
  fileId: string;
  name: string;
  content: string;
  isDirty: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

export function Tabs({ tabs, activeTabId, onTabClick, onTabClose }: TabsProps) {
  const handleTabClick = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onTabClick(tabId);
  };

  const handleCloseClick = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onTabClose(tabId);
  };

  return (
    <div className="tabs-container">
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
          onClick={(e) => handleTabClick(e, tab.id)}
        >
          <span className="tab-name">
            {tab.isDirty && <span className="tab-dirty">●</span>}
            {tab.name}
          </span>
          <button
            className="tab-close"
            onClick={(e) => handleCloseClick(e, tab.id)}
            title="Fechar"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
