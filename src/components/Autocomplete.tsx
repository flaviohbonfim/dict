import { useState, useEffect, useRef, useMemo } from 'react';

interface Suggestion {
  label: string;
  insertText: string;
  type: 'heading' | 'list' | 'code' | 'quote' | 'rule' | 'table' | 'link' | 'image';
  icon?: string;
}

interface AutocompleteProps {
  trigger: string;
  query?: string;
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
    { label: 'Citação em bloco', insertText: '> ', type: 'quote' },
  ],
  '---': [
    { label: 'Linha horizontal', insertText: '---\n', type: 'rule' },
  ],
  '|': [
    { label: 'Tabela Simples', insertText: '| Coluna 1 | Coluna 2 |\n|----------|----------|\n| Valor 1  | Valor 2  |', type: 'table' },
    { label: 'Tabela 3 Colunas', insertText: '| Col 1 | Col 2 | Col 3 |\n|-------|-------|-------|\n| Val 1 | Val 2 | Val 3 |', type: 'table' },
  ],
  '![': [
    { label: 'Imagem', insertText: '![alt text](url)', type: 'image' },
  ],
  '[': [
    { label: 'Link', insertText: '[texto](url)', type: 'link' },
    { label: 'Link de Checkbox', insertText: '- [ ] ', type: 'list' },
  ],
  ':': [
    { label: 'Sorrindo', insertText: ':smile:', type: 'image', icon: '😄' },
    { label: 'Foguete', insertText: ':rocket:', type: 'image', icon: '🚀' },
    { label: 'Aviso', insertText: ':warning:', type: 'image', icon: '⚠️' },
    { label: 'Ideia', insertText: ':bulb:', type: 'image', icon: '💡' },
    { label: 'Check', insertText: ':white_check_mark:', type: 'image', icon: '✅' },
    { label: 'Fogo', insertText: ':fire:', type: 'image', icon: '🔥' },
    { label: 'Brilhos', insertText: ':sparkles:', type: 'image', icon: '✨' },
  ],
};

export function Autocomplete({ trigger, query = '', position, onSelect, onClose }: AutocompleteProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const suggestions = useMemo(() => {
    const list = SUGGESTIONS[trigger] || [];
    if (!query) return list;
    return list.filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.insertText.toLowerCase().includes(query.toLowerCase())
    );
  }, [trigger, query]);

  // Reset selection when suggestions change length or trigger changes
  useEffect(() => {
    // Usar um timeout pequeno ou verificar se o valor mudou para evitar cascata imediata
    const timer = setTimeout(() => {
      setSelectedIndex(0);
    }, 0);
    return () => clearTimeout(timer);
  }, [suggestions.length, trigger]);

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
            {suggestion.type === 'image' ? (suggestion.icon || '🖼️') : getIcon(suggestion.type)}
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
