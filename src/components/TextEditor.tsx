import { useRef, useEffect, useCallback } from 'react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  syncScroll: boolean;
  onScrollSync?: (scrollPercentage: number) => void;
  externalScrollPercentage?: number;
  scrollSource: 'editor' | 'preview' | null;
}

export function TextEditor({ value, onChange, onSave, syncScroll, onScrollSync, externalScrollPercentage, scrollSource }: TextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const isUpdatingScroll = useRef(false);
  const lastSyncPercentage = useRef<number>(-1);

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

  // Handler de scroll - apenas envia atualizações quando usuário rola manualmente
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

    // Previne enviar o mesmo valor repetidamente
    if (Math.abs(lastSyncPercentage.current - percentage) < 0.01) {
      return;
    }

    lastSyncPercentage.current = percentage;
    onScrollSync(percentage);
  }, [syncScroll, onScrollSync, getScrollPercentage]);

  // Scroll externo - apenas quando externalScrollPercentage muda
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
