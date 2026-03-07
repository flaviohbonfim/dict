import { useRef, useCallback, useEffect, useState } from 'react';

interface MinimapProps {
  content: string;
  editorScrollPercentage: number;
  onMinimapClick: (percentage: number) => void;
}

export function Minimap({ content, editorScrollPercentage, onMinimapClick }: MinimapProps) {
  const minimapRef = useRef<HTMLDivElement>(null);
  const [minimapScrollPercentage, setMinimapScrollPercentage] = useState(0);

  // Atualiza scroll do minimapa quando editor scrolla
  useEffect(() => {
    setMinimapScrollPercentage(editorScrollPercentage);
  }, [editorScrollPercentage]);

  const handleMinimapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!minimapRef.current) return;
    
    const rect = minimapRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top - 8; // Subtrai padding
    const minimapHeight = rect.height - 16; // Subtrai padding top/bottom
    const percentage = Math.max(0, Math.min(1, clickY / minimapHeight));
    onMinimapClick(percentage);
  }, [onMinimapClick]);

  // Preparar linhas para exibição no minimapa
  const lines = content.split('\n');
  const maxDisplayLines = 100; // Limite de linhas para performance
  const displayLines = lines.slice(0, maxDisplayLines);

  // Calcular posição do viewport indicator
  const viewportHeight = 10; // Altura do viewport em %
  const viewportTop = minimapScrollPercentage * (100 - viewportHeight);

  return (
    <div className="minimap" ref={minimapRef} onClick={handleMinimapClick}>
      {/* Viewport Indicator */}
      <div 
        className="minimap-viewport"
        style={{
          top: `${viewportTop}%`,
        }}
      />
      
      {/* Content Preview */}
      <div className="minimap-content">
        {displayLines.map((line, index) => {
          const trimmedLine = line.trim();
          
          // Detectar tipo de linha para cor e estilo
          let lineClass = 'minimap-line';
          let width = Math.min(trimmedLine.length * 2, 100);

          if (trimmedLine.startsWith('#')) {
            lineClass += ' heading';
            width = Math.min(width * 1.5, 100); // Títulos são mais largos/imponentes
          } else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            lineClass += ' list';
          } else if (trimmedLine.startsWith('```')) {
            lineClass += ' code-block';
          } else if (trimmedLine.startsWith('>')) {
            lineClass += ' quote';
          } else if (trimmedLine.startsWith('!') && trimmedLine.includes('[') && trimmedLine.includes(']')) {
            lineClass += ' image';
            width = 80; // Imagens geralmente ocupam bastante espaço horizontal
          } else if (trimmedLine.includes('[') && trimmedLine.includes('](')) {
            lineClass += ' link';
          } else if (trimmedLine.startsWith('|')) {
            lineClass += ' table';
            width = 90;
          } else if (trimmedLine.length === 0) {
            lineClass += ' empty';
          }
          
          return (
            <div 
              key={index}
              className={lineClass}
              style={{ width: `${width}%` }}
              title={trimmedLine.substring(0, 50)}
            >
              {trimmedLine.substring(0, 80)}
            </div>
          );
        })}
        
        {lines.length > maxDisplayLines && (
          <div className="minimap-more">
            +{lines.length - maxDisplayLines} linhas
          </div>
        )}
      </div>
    </div>
  );
}
