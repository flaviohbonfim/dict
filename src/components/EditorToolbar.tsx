import { Code, Link, List, GitGraph, Edit, Columns, Eye, Bold, Italic, Heading, Smile, ChevronDown, PanelLeft, AlignLeft, Underline, WrapText, Image, FileCode, FileText, Copy, Presentation, Share2 } from 'lucide-react';

interface EditorToolbarProps {
  viewMode: 'split' | 'editor' | 'preview';
  onViewModeChange: (mode: 'split' | 'editor' | 'preview') => void;
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onHeading: (e: React.MouseEvent) => void;
  onHeadingSelect: (level: number) => void;
  headingMenuOpen: boolean;
  headingMenuPosition: { x: number; y: number };
  onCode: () => void;
  onLink: () => void;
  onList: () => void;
  onInsertImage: () => void;
  onExportHtml: () => void;
  onExportPdf: () => void;
  onCopyAsHtml: () => void;
  onTogglePresentation: () => void;
  onShare: () => void;
  onMermaid: (e: React.MouseEvent) => void;
  onMermaidSelect: (type: string) => void;
  mermaidMenuOpen: boolean;
  mermaidMenuPosition: { x: number; y: number };
  onEmoji: () => void;
  showMinimap: boolean;
  onToggleMinimap: () => void;
  onFormatDocument: () => void;
  wordWrap: boolean;
  onToggleWordWrap: () => void;
}

export function EditorToolbar({
  viewMode,
  onViewModeChange,
  onBold,
  onItalic,
  onUnderline,
  onHeading,
  onHeadingSelect,
  headingMenuOpen,
  headingMenuPosition,
  onCode,
  onLink,
  onList,
  onInsertImage,
  onExportHtml,
  onExportPdf,
  onCopyAsHtml,
  onTogglePresentation,
  onShare,
  onMermaid,
  onMermaidSelect,
  mermaidMenuOpen,
  mermaidMenuPosition,
  onEmoji,
  showMinimap,
  onToggleMinimap,
  onFormatDocument,
  wordWrap,
  onToggleWordWrap,
}: EditorToolbarProps) {
  return (
    <div className="editor-toolbar">
      <button className="toolbar-btn" onClick={onBold} title="Negrito (Ctrl+B)">
        <Bold size={14} />
      </button>
      <button className="toolbar-btn" onClick={onItalic} title="Itálico (Ctrl+I)">
        <Italic size={14} />
      </button>
      <button className="toolbar-btn" onClick={onUnderline} title="Sublinhado (Ctrl+U)">
        <Underline size={14} />
      </button>
      <div style={{ position: 'relative' }}>
        <button className="toolbar-btn" onClick={(e) => { e.stopPropagation(); onHeading(e); }} title="Título (Ctrl+H)">
          <Heading size={14} />
          <ChevronDown size={12} />
        </button>
        {headingMenuOpen && (
          <div className="toolbar-submenu" style={{ left: headingMenuPosition.x, top: headingMenuPosition.y }} onClick={(e) => e.stopPropagation()}>
            <button className="submenu-item" onClick={() => onHeadingSelect(1)}>H1 - Título Principal</button>
            <button className="submenu-item" onClick={() => onHeadingSelect(2)}>H2 - Subtítulo</button>
            <button className="submenu-item" onClick={() => onHeadingSelect(3)}>H3 - Seção</button>
          </div>
        )}
      </div>
      <button className="toolbar-btn" onClick={onCode} title="Código (Ctrl+K)">
        <Code size={14} />
      </button>
      <button className="toolbar-btn" onClick={onLink} title="Link (Ctrl+L)">
        <Link size={14} />
      </button>
      <button className="toolbar-btn" onClick={onInsertImage} title="Inserir Imagem">
        <Image size={14} />
      </button>
      <button className="toolbar-btn" onClick={onList} title="Lista (Ctrl+U)">
        <List size={14} />
      </button>
      <div style={{ position: 'relative' }}>
        <button className="toolbar-btn" onClick={(e) => { e.stopPropagation(); onMermaid(e); }} title="Diagrama Mermaid">
          <GitGraph size={14} />
          <span>Mermaid</span>
          <ChevronDown size={12} />
        </button>
        {mermaidMenuOpen && (
          <div className="toolbar-submenu" style={{ left: mermaidMenuPosition.x, top: mermaidMenuPosition.y }} onClick={(e) => e.stopPropagation()}>
            <button className="submenu-item" onClick={() => onMermaidSelect('flowchart')}>Flowchart - Fluxograma</button>
            <button className="submenu-item" onClick={() => onMermaidSelect('sequence')}>Sequence - Sequência</button>
            <button className="submenu-item" onClick={() => onMermaidSelect('class')}>Class - Classes</button>
            <button className="submenu-item" onClick={() => onMermaidSelect('pie')}>Pie - Pizza</button>
            <button className="submenu-item" onClick={() => onMermaidSelect('gantt')}>Gantt - Timeline</button>
            <button className="submenu-item" onClick={() => onMermaidSelect('er')}>ER - Entidade Relacionamento</button>
            <button className="submenu-item" onClick={() => onMermaidSelect('journey')}>Journey - Jornada</button>
          </div>
        )}
      </div>
      <button className="toolbar-btn" onClick={onEmoji} title="Inserir Emoji">
        <Smile size={14} />
        <span>Emoji</span>
      </button>
      
      <button className="toolbar-btn" onClick={onFormatDocument} title="Formatar Documento (Shift+Alt+F)">
        <AlignLeft size={14} />
        <span>Formatar</span>
      </button>

      <button className="toolbar-btn" onClick={onToggleMinimap} title={showMinimap ? 'Ocultar Minimapa' : 'Mostrar Minimapa'}>
        <PanelLeft size={14} />
        <span>Minimap</span>
      </button>

      <button className={`toolbar-btn ${wordWrap ? 'active' : ''}`} onClick={onToggleWordWrap} title="Quebra de Linha Automática">
        <WrapText size={14} />
        <span>Wrap</span>
      </button>

      <div className="toolbar-divider"></div>

      <button className="toolbar-btn" onClick={onExportHtml} title="Exportar HTML">
        <FileCode size={14} />
        <span>HTML</span>
      </button>
      <button className="toolbar-btn" onClick={onExportPdf} title="Exportar PDF">
        <FileText size={14} />
        <span>PDF</span>
      </button>
      <button className="toolbar-btn" onClick={onCopyAsHtml} title="Copiar como HTML">
        <Copy size={14} />
        <span>Copy</span>
      </button>
      <button className="toolbar-btn" onClick={onTogglePresentation} title="Modo Apresentação (Fullscreen)">
        <Presentation size={14} />
        <span>Slide</span>
      </button>
      <button className="toolbar-btn" onClick={onShare} title="Compartilhar (GitHub Gist)">
        <Share2 size={14} />
        <span>Share</span>
      </button>

      <button
        className={`toolbar-btn ${viewMode === 'editor' ? 'active' : ''}`}
        onClick={() => onViewModeChange('editor')}
        title="Apenas Editor"
      >
        <Edit size={14} />
      </button>
      <button
        className={`toolbar-btn ${viewMode === 'split' ? 'active' : ''}`}
        onClick={() => onViewModeChange('split')}
        title="Dividir (Ctrl+\)"
      >
        <Columns size={14} />
      </button>
      <button
        className={`toolbar-btn ${viewMode === 'preview' ? 'active' : ''}`}
        onClick={() => onViewModeChange('preview')}
        title="Apenas Preview"
      >
        <Eye size={14} />
      </button>
    </div>
  );
}
