import { useRef, useEffect, useCallback } from 'react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  syncScroll: boolean;
  onScrollSync?: (scrollPercentage: number) => void;
  externalScrollPercentage?: number;
  scrollSource: 'editor' | 'preview' | null;
  searchQuery?: string;
  searchMatches?: { start: number; end: number }[];
  currentMatchIndex?: number;
}

export function TextEditor({ 
  value, 
  onChange, 
  onSave, 
  syncScroll, 
  onScrollSync, 
  externalScrollPercentage,
  scrollSource,
  searchQuery = '',
  searchMatches = [],
  currentMatchIndex = -1
}: TextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const isUpdatingScroll = useRef(false);
  const highlightLayerRef = useRef<HTMLDivElement>(null);

  const lineCount = value.split('\n').length;
  const lines = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  // Calcula a porcentagem de scroll atual
  const getScrollPercentage = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return 0;

    const scrollTop = textarea.scrollTop;
    const scrollHeight = textarea.scrollHeight;
    const clientHeight = textarea.clientHeight;
    const maxScroll = scrollHeight - clientHeight;

    return maxScroll > 0 ? scrollTop / maxScroll : 0;
  }, []);

  // Handler de scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;

    // Sincroniza line numbers
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textarea.scrollTop;
    }

    // Se é atualização externa, não propaga
    if (isUpdatingScroll.current) {
      return;
    }

    if (!syncScroll || !onScrollSync) {
      return;
    }

    // Calcula e envia porcentagem de scroll
    const percentage = getScrollPercentage();
    onScrollSync(percentage);
  }, [syncScroll, onScrollSync, getScrollPercentage]);

  // Scroll externo
  useEffect(() => {
    if (!syncScroll) return;
    if (externalScrollPercentage === undefined || externalScrollPercentage === null) return;
    if (!textareaRef.current) return;

    // Só aplica scroll externo se veio do preview
    if (scrollSource !== 'preview') return;

    const textarea = textareaRef.current;
    const maxScroll = textarea.scrollHeight - textarea.clientHeight;

    if (maxScroll > 0) {
      isUpdatingScroll.current = true;

      const targetScrollTop = externalScrollPercentage * maxScroll;
      textarea.scrollTop = targetScrollTop;

      // Sincroniza line numbers
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = targetScrollTop;
      }

      // Libera o bloqueio no próximo frame
      requestAnimationFrame(() => {
        isUpdatingScroll.current = false;
      });
    }
  }, [externalScrollPercentage, syncScroll, scrollSource]);

  // Renderizar highlights da busca
  useEffect(() => {
    if (!highlightLayerRef.current || !textareaRef.current || !searchQuery || searchMatches.length === 0) {
      if (highlightLayerRef.current) {
        highlightLayerRef.current.innerHTML = '';
      }
      return;
    }

    const textarea = textareaRef.current;
    const highlightLayer = highlightLayerRef.current;

    const renderHighlights = () => {
      // Clear previous highlights
      highlightLayer.innerHTML = '';

      // Copy styles from textarea
      const computedStyle = window.getComputedStyle(textarea);
      highlightLayer.style.fontFamily = computedStyle.fontFamily;
      highlightLayer.style.fontSize = computedStyle.fontSize;
      highlightLayer.style.lineHeight = computedStyle.lineHeight;
      highlightLayer.style.padding = computedStyle.padding;
      highlightLayer.style.whiteSpace = 'pre';
      highlightLayer.style.overflow = 'hidden';
      highlightLayer.style.pointerEvents = 'none';

      // Create a test element to measure character dimensions
      const testChar = document.createElement('span');
      testChar.textContent = 'X';
      testChar.style.visibility = 'hidden';
      testChar.style.position = 'absolute';
      testChar.style.fontFamily = computedStyle.fontFamily;
      testChar.style.fontSize = computedStyle.fontSize;
      textarea.parentElement?.appendChild(testChar);
      const charWidth = testChar.getBoundingClientRect().width;
      const lineHeight = parseFloat(computedStyle.lineHeight) || 22.4;
      const paddingTop = parseFloat(computedStyle.paddingTop) || 16;
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 16;
      testChar.remove();

      // Create highlight marks
      searchMatches.forEach((match, index) => {
        const isCurrent = index === currentMatchIndex;

        const mark = document.createElement('div');
        mark.className = 'search-match-mark';
        mark.style.backgroundColor = isCurrent
          ? 'var(--search-current-match)'
          : 'var(--search-match)';
        mark.style.border = isCurrent ? '1px solid var(--search-current-border)' : 'none';
        mark.style.borderRadius = '2px';
        mark.style.pointerEvents = 'none';
        mark.style.position = 'absolute';

        // Calculate position
        const textBeforeMatch = value.substring(0, match.start);
        const lines = textBeforeMatch.split('\n');
        const lineNumber = lines.length - 1;
        const columnNumber = lines[lines.length - 1].length;

        // Position the highlight with scroll offset and padding
        mark.style.left = `${paddingLeft + columnNumber * charWidth}px`;
        mark.style.top = `${paddingTop + lineNumber * lineHeight - textarea.scrollTop}px`;
        mark.style.width = `${(match.end - match.start) * charWidth}px`;
        mark.style.height = `${lineHeight - 2}px`;

        highlightLayer.appendChild(mark);
      });
    };

    // Initial render
    renderHighlights();

    // Update on scroll
    textarea.addEventListener('scroll', renderHighlights);

    return () => {
      textarea.removeEventListener('scroll', renderHighlights);
      // Clear highlights on cleanup
      if (highlightLayerRef.current) {
        highlightLayerRef.current.innerHTML = '';
      }
    };
  }, [searchQuery, searchMatches, currentMatchIndex, value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tabulação
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }

    // Salvar (Ctrl+S)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      onSave();
    }

    // Negrito (Ctrl+B)
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      insertAroundCursor('**', '**');
    }

    // Itálico (Ctrl+I)
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      insertAroundCursor('*', '*');
    }

    // Código (Ctrl+K)
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      insertAroundCursor('`', '`');
    }
  }, [value, onChange, onSave]);

  const insertAroundCursor = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
    }, 0);
  };

  return (
    <div className="text-editor-container">
      <div
        ref={lineNumbersRef}
        className="line-numbers"
        aria-hidden="true"
      >
        {lines.map(line => (
          <span key={line}>{line}</span>
        ))}
      </div>
      <div className="editor-wrapper">
        {/* Highlight layer for search */}
        <div
          ref={highlightLayerRef}
          className="search-highlight-layer"
        />
        <textarea
          ref={textareaRef}
          className="text-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="Digite seu Markdown aqui..."
        />
      </div>
    </div>
  );
}
