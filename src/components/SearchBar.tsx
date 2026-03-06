import { useState, useEffect, useRef } from 'react';
import { X, ChevronUp, ChevronDown, Replace, CaseSensitive, WholeWord } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, options: { matchCase: boolean; matchWholeWord: boolean }) => void;
  onReplace?: (replacement: string) => void;
  onReplaceOne?: () => void;
  onReplaceAll?: () => void;
  onClose: () => void;
  totalMatches: number;
  currentIndex: number;
  onFindNext: () => void;
  onFindPrevious: () => void;
}

export function SearchBar({
  onSearch,
  onReplace,
  onReplaceOne,
  onReplaceAll,
  onClose,
  totalMatches,
  currentIndex,
  onFindNext,
  onFindPrevious
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [replacement, setReplacement] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [matchWholeWord, setMatchWholeWord] = useState(false);
  const [showReplace, setShowReplace] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Always call onSearch, even with empty query to clear results
      onSearch(query, { matchCase, matchWholeWord });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, matchCase, matchWholeWord, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        onFindPrevious();
      } else {
        onFindNext();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleReplaceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onReplaceOne?.();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-row">
        {/* Find Input */}
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Buscar"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {totalMatches > 0 && (
            <span className="search-count">{currentIndex + 1} de {totalMatches}</span>
          )}
        </div>

        {/* Navigation */}
        <div className="search-nav">
          <button
            className="search-nav-btn"
            onClick={onFindPrevious}
            disabled={totalMatches === 0}
            title="Anterior (Shift+Enter)"
          >
            <ChevronUp size={16} />
          </button>
          <button
            className="search-nav-btn"
            onClick={onFindNext}
            disabled={totalMatches === 0}
            title="Próximo (Enter)"
          >
            <ChevronDown size={16} />
          </button>
          {totalMatches > 0 ? (
            <span className="search-count">{currentIndex + 1} de {totalMatches}</span>
          ) : query ? (
            <span className="search-count no-results">Sem resultados</span>
          ) : null}
        </div>

        {/* Toggle Replace */}
        {onReplace && (
          <button
            className={`search-toggle-replace ${showReplace ? 'active' : ''}`}
            onClick={() => {
              setShowReplace(!showReplace);
              if (!showReplace) {
                setTimeout(() => replaceInputRef.current?.focus(), 50);
              }
            }}
            title="Substituir (Ctrl+H)"
          >
            <Replace size={16} />
          </button>
        )}

        {/* Close */}
        <button className="search-close-btn" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <div className="search-options-row">
        <button
          className={`search-option-btn ${matchCase ? 'active' : ''}`}
          onClick={() => setMatchCase(!matchCase)}
          title="Maiúsculas/Minúsculas"
        >
          <CaseSensitive size={14} />
        </button>
        <button
          className={`search-option-btn ${matchWholeWord ? 'active' : ''}`}
          onClick={() => setMatchWholeWord(!matchWholeWord)}
          title="Palavra Inteira"
        >
          <WholeWord size={14} />
        </button>
      </div>

      {/* Replace Row */}
      {onReplace && showReplace && (
        <div className="search-row replace-row">
          <div className="search-input-wrapper">
            <input
              ref={replaceInputRef}
              type="text"
              className="search-input replace-input"
              placeholder="Substituir"
              value={replacement}
              onChange={(e) => {
                setReplacement(e.target.value);
                onReplace(e.target.value);
              }}
              onKeyDown={handleReplaceKeyDown}
            />
          </div>
          <div className="replace-actions">
            {onReplaceOne && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={onReplaceOne}
                title="Substituir (Enter)"
              >
                Substituir
              </button>
            )}
            {onReplaceAll && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={onReplaceAll}
                title="Substituir Todos"
              >
                Todos
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
