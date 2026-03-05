import { useState } from 'react';
import { Folder, FileText, FilePlus, FolderOpen } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
}

interface SidebarProps {
  files: FileItem[];
  activeFile: string | null;
  onFileSelect: (fileId: string) => void;
  onNewFile: () => void;
  onOpenFile: () => void;
  onRenameFile: (fileId: string, newName: string) => void;
  onCloseFile: (fileId: string) => void;
}

export function Sidebar({
  files,
  activeFile,
  onFileSelect,
  onNewFile,
  onOpenFile,
  onRenameFile,
  onCloseFile
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleDoubleClick = (file: FileItem) => {
    setEditingId(file.id);
    setEditingName(file.name);
  };

  const handleRenameSubmit = (fileId: string) => {
    if (editingName.trim()) {
      onRenameFile(fileId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, fileId: string) => {
    if (e.key === 'Enter') {
      handleRenameSubmit(fileId);
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditingName('');
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>Explorador</span>
        <div className="sidebar-actions">
          <button className="sidebar-action-btn" onClick={onNewFile} title="Novo Arquivo">
            <FilePlus size={16} />
          </button>
          <button className="sidebar-action-btn" onClick={onOpenFile} title="Abrir Arquivo">
            <FolderOpen size={16} />
          </button>
        </div>
      </div>
      <div className="file-explorer">
        {files.map(file => (
          <div
            key={file.id}
            className={`file-item ${activeFile === file.id ? 'active' : ''}`}
            onClick={() => onFileSelect(file.id)}
            onDoubleClick={() => handleDoubleClick(file)}
          >
            {file.type === 'folder' ? (
              <Folder size={14} />
            ) : (
              <FileText size={14} />
            )}
            {editingId === file.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleRenameSubmit(file.id)}
                onKeyDown={(e) => handleKeyDown(e, file.id)}
                className="file-input"
                autoFocus
              />
            ) : (
              <span className="file-name">{file.name}</span>
            )}
            {file.type === 'file' && (
              <button
                className="file-close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseFile(file.id);
                }}
                title="Fechar arquivo"
              >
                ×
              </button>
            )}
          </div>
        ))}
        {files.length === 0 && (
          <div style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '13px' }}>
            Nenhum arquivo aberto
          </div>
        )}
      </div>
    </div>
  );
}
