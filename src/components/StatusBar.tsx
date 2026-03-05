import { Monitor, Type, FileText, CheckCircle, Circle } from 'lucide-react';

interface StatusBarProps {
  fileName: string;
  charCount: number;
  wordCount: number;
  lineCount: number;
  column: number;
  line: number;
  isDirty: boolean;
  lastSavedTime: Date | null;
}

export function StatusBar({ 
  fileName, 
  charCount, 
  wordCount, 
  lineCount, 
  column, 
  line,
  isDirty,
  lastSavedTime
}: StatusBarProps) {
  // Formata o tempo de salvamento
  const formatSavedTime = (date: Date | null) => {
    if (!date) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 5) return 'Salvo agora';
    if (diff < 60) return `Salvo há ${diff}s`;
    if (diff < 3600) return `Salvo há ${Math.floor(diff / 60)}min`;
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <div className="status-bar-item">
          <Monitor size={12} />
          <span>Markdown Editor</span>
        </div>
        {lastSavedTime && (
          <div className="status-bar-item" title={lastSavedTime.toLocaleString()}>
            {isDirty ? (
              <>
                <Circle size={12} />
                <span>Não salvo</span>
              </>
            ) : (
              <>
                <CheckCircle size={12} />
                <span>{formatSavedTime(lastSavedTime)}</span>
              </>
            )}
          </div>
        )}
      </div>
      <div className="status-bar-right">
        <div className="status-bar-item">
          <span>Ln {line}, Col {column}</span>
        </div>
        <div className="status-bar-item">
          <span>{wordCount} palavras</span>
        </div>
        <div className="status-bar-item">
          <span>{charCount} caracteres</span>
        </div>
        <div className="status-bar-item">
          <span>{lineCount} linhas</span>
        </div>
        <div className="status-bar-item">
          <Type size={12} />
          <span>Markdown</span>
        </div>
        {fileName && (
          <div className="status-bar-item">
            <FileText size={12} />
            <span>{fileName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
