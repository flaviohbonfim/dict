import {
  FilePlus,
  FolderOpen,
  Pencil,
  Copy,
  X,
  Bold,
  Italic,
  Heading,
  Code2,
  Link,
  List,
  GitGraph,
  Type,
  ClipboardCheck,
  AlignLeft,
  Smile,
  Trash2
} from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  target: 'explorer' | 'editor' | 'preview' | null;
  fileId?: string;
  onRename: (fileId: string) => void;
  onDuplicate: (fileId: string) => void;
  onClose: (fileId: string) => void;
  onNewFile: () => void;
  onOpenFile: () => void;
  onClearRecentFiles: () => void;
  editorActions: {
    bold: () => void;
    italic: () => void;
    heading: () => void;
    code: () => void;
    link: () => void;
    list: () => void;
    mermaid: () => void;
    format: () => void;
    emoji: () => void;
  };
  previewActions?: {
    selectAll: () => void;
    copy: () => void;
  };
}

export function ContextMenu({
  x,
  y,
  target,
  fileId,
  onRename,
  onDuplicate,
  onClose,
  onNewFile,
  onOpenFile,
  onClearRecentFiles,
  editorActions,
  previewActions
}: ContextMenuProps) {
  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    left: x,
    top: y,
    zIndex: 10000
  };

  if (target === 'explorer') {
    return (
      <div className="context-menu" style={menuStyle}>
        <div className="context-menu-item" onClick={onNewFile}>
          <FilePlus size={14} />
          <span>Novo Arquivo</span>
        </div>
        <div className="context-menu-item" onClick={onOpenFile}>
          <FolderOpen size={14} />
          <span>Abrir Arquivo...</span>
        </div>
        <div className="context-menu-divider" />
        <div className="context-menu-item" onClick={onClearRecentFiles}>
          <Trash2 size={14} />
          <span>Limpar Arquivos Recentes</span>
        </div>
        {fileId && (
          <>
            <div className="context-menu-divider" />
            <div className="context-menu-item" onClick={() => onRename(fileId)}>
              <Pencil size={14} />
              <span>Renomear</span>
            </div>
            <div className="context-menu-item" onClick={() => onDuplicate(fileId)}>
              <Copy size={14} />
              <span>Duplicar</span>
            </div>
            <div className="context-menu-divider" />
            <div className="context-menu-item" onClick={() => onClose(fileId)}>
              <X size={14} />
              <span>Fechar</span>
            </div>
          </>
        )}
      </div>
    );
  }

  if (target === 'editor') {
    return (
      <div className="context-menu" style={menuStyle}>
        <div className="context-menu-item" onClick={editorActions.bold}>
          <Bold size={14} />
          <span>Negrito</span>
        </div>
        <div className="context-menu-item" onClick={editorActions.italic}>
          <Italic size={14} />
          <span>Itálico</span>
        </div>
        <div className="context-menu-item" onClick={editorActions.heading}>
          <Heading size={14} />
          <span>Título</span>
        </div>
        <div className="context-menu-divider" />
        <div className="context-menu-item" onClick={editorActions.code}>
          <Code2 size={14} />
          <span>Código</span>
        </div>
        <div className="context-menu-item" onClick={editorActions.link}>
          <Link size={14} />
          <span>Link</span>
        </div>
        <div className="context-menu-item" onClick={editorActions.list}>
          <List size={14} />
          <span>Lista</span>
        </div>
        <div className="context-menu-divider" />
        <div className="context-menu-item" onClick={editorActions.mermaid}>
          <GitGraph size={14} />
          <span>Inserir Mermaid</span>
        </div>
        <div className="context-menu-divider" />
        <div className="context-menu-item" onClick={editorActions.emoji}>
          <Smile size={14} />
          <span>Inserir Emoji</span>
        </div>
        <div className="context-menu-divider" />
        <div className="context-menu-item" onClick={editorActions.format}>
          <AlignLeft size={14} />
          <span>Formatar Documento</span>
        </div>
      </div>
    );
  }

  if (target === 'preview') {
    return (
      <div className="context-menu" style={menuStyle}>
        <div className="context-menu-item" onClick={previewActions?.selectAll}>
          <Type size={14} />
          <span>Selecionar Tudo</span>
        </div>
        <div className="context-menu-item" onClick={previewActions?.copy}>
          <ClipboardCheck size={14} />
          <span>Copiar</span>
        </div>
      </div>
    );
  }

  return null;
}
