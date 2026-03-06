import { useState } from 'react';
import { Folder, FileText, FilePlus, FolderOpen, Clock, Star, Pencil, Trash2, ChevronRight, ChevronDown, GripVertical } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  parentId?: string;
}

interface RecentFile {
  id: string;
  name: string;
  content: string;
  lastOpened: number;
}

interface SidebarProps {
  files: FileItem[];
  activeFile: string | null;
  onFileSelect: (fileId: string) => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onOpenFile: () => void;
  onRenameFile: (fileId: string, newName: string) => void;
  onCloseFile: (fileId: string) => void;
  onDeleteFile: (fileId: string) => void;
  onMoveToFolder?: (fileId: string, folderId: string | undefined) => void;
  recentFiles?: RecentFile[];
  onRecentFileSelect?: (file: RecentFile) => void;
  favoriteFiles?: string[];
  onToggleFavorite?: (fileId: string) => void;
}

export function Sidebar({
  files,
  activeFile,
  onFileSelect,
  onNewFile,
  onNewFolder,
  onOpenFile,
  onRenameFile,
  onCloseFile,
  onDeleteFile,
  onMoveToFolder,
  recentFiles = [],
  onRecentFileSelect,
  favoriteFiles = [],
  onToggleFavorite
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      toggleFolder(file.id);
    } else {
      setEditingId(file.id);
      setEditingName(file.name);
    }
  };

  const startEditing = (file: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
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

  // Renderizar arquivo ou pasta recursivamente
  const renderFileItem = (file: FileItem, depth: number = 0) => {
    const isFolder = file.type === 'folder';
    const isExpanded = expandedFolders.includes(file.id);
    const children = files.filter(f => f.parentId === file.id);
    const hasChildren = children.length > 0;

    // Drag handlers
    const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData('fileId', file.id);
      e.dataTransfer.setData('source', 'sidebar');
      e.dataTransfer.effectAllowed = 'move';
      e.stopPropagation(); // Stop propagation to prevent main-layout overlay
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation(); // Stop propagation to prevent main-layout overlay
      const source = e.dataTransfer.getData('source');
      // Only allow drop if dragging from sidebar
      if (source === 'sidebar') {
        if (isFolder) {
          e.dataTransfer.dropEffect = 'move';
        }
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const source = e.dataTransfer.getData('source');
      const fileId = e.dataTransfer.getData('fileId');
      
      if (source === 'sidebar' && fileId && fileId !== file.id) {
        if (isFolder) {
          // Move file to this folder
          onMoveToFolder?.(fileId, file.id);
        }
      }
    };

    return (
      <div key={file.id}>
        <div
          className={`file-item ${activeFile === file.id ? 'active' : ''} ${isFolder ? 'folder-item' : ''}`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
          onClick={() => {
            if (isFolder) {
              toggleFolder(file.id);
            } else {
              onFileSelect(file.id);
            }
          }}
          onDoubleClick={() => handleDoubleClick(file)}
          draggable
          onDragStart={(e) => {
            handleDragStart(e);
            e.stopPropagation();
          }}
          onDragOver={handleDragOver}
          onDragLeave={(e) => {
            e.stopPropagation();
          }}
          onDrop={isFolder ? handleDrop : undefined}
        >
          {isFolder ? (
            <>
              <span className="folder-arrow">
                {hasChildren ? (isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : '•'}
              </span>
              <Folder size={14} className="folder-icon" />
            </>
          ) : (
            <>
              <GripVertical size={12} className="drag-handle" />
              <FileText size={14} />
            </>
          )}
          {editingId === file.id ? (
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={() => handleRenameSubmit(file.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRenameSubmit(file.id);
                } else if (e.key === 'Escape') {
                  setEditingId(null);
                  setEditingName('');
                }
              }}
              className="file-input"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="file-name">{file.name}</span>
          )}
          <div className="file-actions">
            {!isFolder && (
              <>
                <button
                  className="favorite-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite?.(file.id);
                  }}
                  title={favoriteFiles.includes(file.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Star size={12} className={favoriteFiles.includes(file.id) ? 'star-filled' : ''} />
                </button>
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
              </>
            )}
            <button
              className="file-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                startEditing(file, e);
              }}
              title="Renomear"
            >
              <Pencil size={12} />
            </button>
            <button
              className="file-action-btn delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFile(file.id);
              }}
              title="Excluir"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
        {/* Renderizar filhos se pasta expandida */}
        {isFolder && isExpanded && children.map(child => renderFileItem(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>Explorador</span>
        <div className="sidebar-actions">
          <button className="sidebar-action-btn" onClick={onNewFile} title="Novo Arquivo">
            <FilePlus size={16} />
          </button>
          <button className="sidebar-action-btn" onClick={onNewFolder} title="Nova Pasta">
            <Folder size={16} />
          </button>
          <button className="sidebar-action-btn" onClick={onOpenFile} title="Abrir Arquivo">
            <FolderOpen size={16} />
          </button>
        </div>
      </div>
      <div 
        className="file-explorer"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const source = e.dataTransfer.getData('source');
          if (source === 'sidebar') {
            e.dataTransfer.dropEffect = 'move';
          }
        }}
        onDragLeave={(e) => {
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const source = e.dataTransfer.getData('source');
          const fileId = e.dataTransfer.getData('fileId');
          if (source === 'sidebar' && fileId) {
            // Move file to root (no parent)
            onMoveToFolder?.(fileId, undefined);
          }
        }}
      >
        {/* Favoritos */}
        {favoriteFiles.length > 0 && (
          <div className="favorite-files-section">
            <div className="section-header">
              <Star size={12} className="star-filled" />
              <span>Favoritos</span>
            </div>
            {files.filter(f => favoriteFiles.includes(f.id)).map(file => (
              <div
                key={file.id}
                className={`file-item favorite-file ${activeFile === file.id ? 'active' : ''}`}
                onClick={() => onFileSelect(file.id)}
              >
                <div className="file-item-content">
                  <FileText size={14} />
                  <span className="file-name">{file.name}</span>
                </div>
                <button
                  className="favorite-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite?.(file.id);
                  }}
                  title="Remover dos favoritos"
                >
                  <Star size={12} className="star-filled" />
                </button>
              </div>
            ))}
            <div className="section-divider" />
          </div>
        )}

        {/* Arquivos Recentes */}
        {recentFiles.length > 0 && (
          <div className="recent-files-section">
            <div className="section-header">
              <Clock size={12} />
              <span>Recentes</span>
            </div>
            {recentFiles.map(file => (
              <div
                key={file.id}
                className="file-item recent-file"
                onClick={() => onRecentFileSelect?.(file)}
              >
                <FileText size={14} />
                <span className="file-name">{file.name}</span>
                <span className="file-time">{formatTimeAgo(file.lastOpened)}</span>
              </div>
            ))}
            <div className="section-divider" />
          </div>
        )}

        {/* Arquivos e Pastas */}
        <div className="files-tree">
          {/* Renderizar apenas itens de nível superior (sem pai) */}
          {files.filter(f => !f.parentId).map(file => renderFileItem(file))}
        </div>
        {files.length === 0 && (
          <div style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '13px' }}>
            Nenhum arquivo aberto
          </div>
        )}
      </div>
    </div>
  );
}

// Função para formatar tempo atrás
function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `${minutes}min atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days < 7) return `${days}d atrás`;
  return new Date(timestamp).toLocaleDateString('pt-BR');
}
