import { X, Moon, Sun, Keyboard, Info, FileText, Save, MoveVertical } from 'lucide-react';

interface SettingsPanelProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  onClose: () => void;
  onOpenChangelog: () => void;
  syncScroll: boolean;
  onSyncScrollChange: () => void;
  autoSave: boolean;
  onAutoSaveChange: () => void;
}

export function SettingsPanel({ 
  theme, 
  onThemeChange, 
  onClose, 
  onOpenChangelog,
  syncScroll,
  onSyncScrollChange,
  autoSave,
  onAutoSaveChange
}: SettingsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <span>Configurações</span>
        <button className="settings-close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="settings-content">
        <div className="settings-section">
          <h3>
            <Save size={16} />
            Preferências do Editor
          </h3>
          <div className="theme-options">
            <button
              className={`theme-option ${autoSave ? 'active' : ''}`}
              onClick={() => onAutoSaveChange()}
            >
              <Save size={20} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 600 }}>Auto-save</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {autoSave ? 'Ativado - Salva automaticamente no localStorage' : 'Desativado - Clique para ativar'}
                </div>
              </div>
            </button>
            <button
              className={`theme-option ${syncScroll ? 'active' : ''}`}
              onClick={() => onSyncScrollChange()}
            >
              <MoveVertical size={20} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 600 }}>Sync Scroll</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {syncScroll ? 'Ativado - Scroll sincronizado entre editor e preview' : 'Desativado - Clique para ativar'}
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>
            <Moon size={16} />
            Tema
          </h3>
          <div className="theme-options">
            <button
              className={`theme-option ${theme === 'dict-nord' ? 'active' : ''}`}
              onClick={() => onThemeChange('dict-nord')}
            >
              <Moon size={20} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 600 }}>dict nord</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Tema escuro inspirado no Nord</div>
              </div>
            </button>
            <button
              className={`theme-option ${theme === 'dict-light' ? 'active' : ''}`}
              onClick={() => onThemeChange('dict-light')}
            >
              <Sun size={20} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 600 }}>dict light</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Tema claro suave</div>
              </div>
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>
            <Keyboard size={16} />
            Atalhos de Teclado
          </h3>
          <div className="shortcuts-list">
            <div className="shortcut-item">
              <span>Salvar</span>
              <div className="kbd-group">
                <kbd>Ctrl</kbd> + <kbd>S</kbd>
              </div>
            </div>
            <div className="shortcut-item">
              <span>Negrito</span>
              <div className="kbd-group">
                <kbd>Ctrl</kbd> + <kbd>B</kbd>
              </div>
            </div>
            <div className="shortcut-item">
              <span>Itálico</span>
              <div className="kbd-group">
                <kbd>Ctrl</kbd> + <kbd>I</kbd>
              </div>
            </div>
            <div className="shortcut-item">
              <span>Título</span>
              <div className="kbd-group">
                <kbd>Ctrl</kbd> + <kbd>H</kbd>
              </div>
            </div>
            <div className="shortcut-item">
              <span>Código</span>
              <div className="kbd-group">
                <kbd>Ctrl</kbd> + <kbd>K</kbd>
              </div>
            </div>
            <div className="shortcut-item">
              <span>Link</span>
              <div className="kbd-group">
                <kbd>Ctrl</kbd> + <kbd>L</kbd>
              </div>
            </div>
            <div className="shortcut-item">
              <span>Lista</span>
              <div className="kbd-group">
                <kbd>Ctrl</kbd> + <kbd>U</kbd>
              </div>
            </div>
            <div className="shortcut-item">
              <span>Alternar View</span>
              <div className="kbd-group">
                <kbd>Ctrl</kbd> + <kbd>\</kbd>
              </div>
            </div>
            <div className="shortcut-item">
              <span>Alternar Explorador</span>
              <div className="kbd-group">
                <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>E</kbd>
              </div>
            </div>
            <div className="shortcut-item">
              <span>Abrir Configurações</span>
              <div className="kbd-group">
                <kbd>Ctrl</kbd> + <kbd>,</kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>
            <Info size={16} />
            Sobre o dict
          </h3>
          <div className="about-info">
            <p><strong>dict</strong> é um editor de Markdown leve e moderno,</p>
            <p>inspirado no VS Code, com suporte a diagramas Mermaid.</p>
            <br />
            <p><strong>Versão:</strong> 0.0.5</p>
            <p><strong>Tecnologias:</strong> React, TypeScript, Vite</p>
            <br />
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Desenvolvido com identidade visual exclusiva Dict
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h3>
            <FileText size={16} />
            Histórico de Versões
          </h3>
          <button className="btn btn-changelog" onClick={onOpenChangelog}>
            <FileText size={16} />
            <span>Ver Changelog Completo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
