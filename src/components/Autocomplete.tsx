import { useState, useEffect, useRef } from 'react';

interface Suggestion {
  label: string;
  insertText: string;
  type: 'heading' | 'list' | 'code' | 'quote' | 'rule' | 'table' | 'link' | 'image';
}

interface AutocompleteProps {
  trigger: string;
  position: { x: number; y: number };
  onSelect: (text: string) => void;
  onClose: () => void;
}

const SUGGESTIONS: Record<string, Suggestion[]> = {
  '#': [
    { label: 'H1 - Título Principal', insertText: '# ', type: 'heading' },
    { label: 'H2 - Subtítulo', insertText: '## ', type: 'heading' },
    { label: 'H3 - Seção', insertText: '### ', type: 'heading' },
    { label: 'H4 - Subseção', insertText: '#### ', type: 'heading' },
  ],
  '-': [
    { label: 'Lista com marcadores', insertText: '- ', type: 'list' },
    { label: 'Lista de tarefas', insertText: '- [ ] ', type: 'list' },
  ],
  '*': [
    { label: 'Lista com marcadores', insertText: '* ', type: 'list' },
    { label: 'Negrito', insertText: '****', type: 'code' },
    { label: 'Itálico', insertText: '**', type: 'code' },
  ],
  '`': [
    { label: 'Código inline', insertText: '``', type: 'code' },
    { label: 'Bloco de código', insertText: '```\n\n```', type: 'code' },
    { label: 'Bloco Mermaid', insertText: '```mermaid\n\n```', type: 'code' },
  ],
  '>': [
    { label: 'Citação', insertText: '> ', type: 'quote' },
  ],
  '---': [
    { label: 'Linha horizontal', insertText: '---\n', type: 'rule' },
  ],
  '|': [
    { label: 'Tabela', insertText: '| Coluna 1 | Coluna 2 |\n|----------|----------|\n| Valor 1  | Valor 2  |', type: 'table' },
  ],
  '![': [
    { label: 'Imagem', insertText: '![alt text](url)', type: 'image' },
  ],
  '[': [
    { label: 'Link', insertText: '[texto](url)', type: 'link' },
  ],
};

export function Autocomplete({ trigger, position, onSelect, onClose }: AutocompleteProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const suggestions = SUGGESTIONS[trigger] || [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [trigger]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (suggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          onSelect(suggestions[selectedIndex].insertText);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [suggestions, selectedIndex, onSelect, onClose]);

  if (suggestions.length === 0) return null;

  return (
    <div
      ref={suggestionsRef}
      className="autocomplete-popup"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 10001,
      }}
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className={`autocomplete-item ${index === selectedIndex ? 'selected' : ''}`}
          onClick={() => onSelect(suggestion.insertText)}
        >
          <span className={`autocomplete-icon ${suggestion.type}`}>
            {getIcon(suggestion.type)}
          </span>
          <span className="autocomplete-label">{suggestion.label}</span>
        </button>
      ))}
    </div>
  );
}

function getIcon(type: string): string {
  switch (type) {
    case 'heading': return '#';
    case 'list': return '•';
    case 'code': return '</>';
    case 'quote': return '"';
    case 'rule': return '—';
    case 'table': return '▦';
    case 'link': return '🔗';
    case 'image': return '🖼️';
    default: return '•';
  }
}
