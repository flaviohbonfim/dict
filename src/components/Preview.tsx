import { useEffect, useRef, useCallback } from 'react';
import { marked } from 'marked';
import mermaid from 'mermaid';
import hljs from 'highlight.js';
import { convertEmojiShortcodes } from '../utils/emoji';

import 'highlight.js/styles/atom-one-dark.css';

interface PreviewProps {
  content: string;
  syncScroll: boolean;
  onScrollSync?: (scrollPercentage: number) => void;
  externalScrollPercentage?: number;
  scrollSource: 'editor' | 'preview' | null;
  theme: string;
}

export function Preview({ content, syncScroll, onScrollSync, externalScrollPercentage, scrollSource, theme }: PreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const isUpdatingScroll = useRef(false);
  const lastSyncPercentage = useRef<number>(-1);
  const mermaidInitialized = useRef(false);
  const contentRef = useRef<string>('');
  const debounceTimeoutRef = useRef<number | null>(null);

  // Configurar custom renderer para Mermaid e código com highlight.js
  const renderer = new marked.Renderer();
  renderer.code = ({ text, lang, escaped }) => {
    const language = lang?.trim().toLowerCase();

    if (language === 'mermaid') {
      return `<div class="mermaid">${text}</div>`;
    }

    // Usa highlight.js para realce de sintaxe
    const code = escaped ? text : text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    let highlightedCode = code;
    if (language && hljs.getLanguage(language)) {
      try {
        highlightedCode = hljs.highlight(code, { language }).value;
      } catch (e) {
        console.error('Erro ao aplicar highlight.js:', e);
      }
    }

    return `<pre><code class="language-${language}">${highlightedCode}</code></pre>`;
  };

  marked.setOptions({
    renderer,
    breaks: true,
    gfm: true,
  });

  // Calcula a porcentagem de scroll atual
  const getScrollPercentage = useCallback(() => {
    const preview = previewRef.current;
    if (!preview) return 0;

    const scrollTop = preview.scrollTop;
    const scrollHeight = preview.scrollHeight;
    const clientHeight = preview.clientHeight;
    const maxScroll = scrollHeight - clientHeight;

    return maxScroll > 0 ? scrollTop / maxScroll : 0;
  }, []);

  // Handler de scroll - apenas envia atualizações quando usuário rola manualmente
  const handlePreviewScroll = useCallback(() => {
    if (!previewRef.current) return;

    // Se é atualização externa, não propaga
    if (isUpdatingScroll.current) {
      return;
    }

    if (!syncScroll || !onScrollSync) {
      return;
    }

    // Envia porcentagem de scroll para sincronização
    const percentage = getScrollPercentage();

    // Previne enviar o mesmo valor repetidamente
    if (Math.abs(lastSyncPercentage.current - percentage) < 0.01) {
      return;
    }

    lastSyncPercentage.current = percentage;
    onScrollSync(percentage);
  }, [syncScroll, onScrollSync, getScrollPercentage]);

  // Renderiza o preview com debounce
  useEffect(() => {
    // Atualiza a referência do conteúdo imediatamente
    contentRef.current = content;

    // Cancela o timeout anterior se houver
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Salva a posição do scroll antes de renderizar
    const savedScrollTop = previewRef.current?.scrollTop || 0;

    // Debounce de 500ms para renderizar o preview
    debounceTimeoutRef.current = setTimeout(() => {
      const renderPreview = async () => {
        if (!previewRef.current) return;

        // Determinar tema do Mermaid baseado no tema atual
        const mermaidTheme = theme === 'dict-light' ? 'default' : 'dark';

        // Inicializar/reconfigurar Mermaid com o tema correto
        mermaid.initialize({
          startOnLoad: false,
          theme: mermaidTheme,
          securityLevel: 'loose',
          fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
          flowchart: { useMaxWidth: true, htmlLabels: true },
          sequence: { useMaxWidth: true, wrap: true },
          er: { useMaxWidth: true },
          class: { useMaxWidth: true },
        });
        mermaidInitialized.current = true;

        // Renderizar Markdown com conversão de emojis
        const htmlWithEmojis = convertEmojiShortcodes(contentRef.current);
        const html = marked.parse(htmlWithEmojis) as string;
        previewRef.current!.innerHTML = html;

        // Renderizar diagramas Mermaid
        const mermaidElements = previewRef.current!.querySelectorAll('.mermaid');

        for (let i = 0; i < mermaidElements.length; i++) {
          const element = mermaidElements[i];
          const graphDefinition = element.textContent?.trim() || '';

          if (graphDefinition) {
            try {
              const id = `mermaid-${Date.now()}-${i}`;
              element.innerHTML = '';
              const { svg } = await mermaid.render(id, graphDefinition);
              element.innerHTML = svg;
            } catch (error) {
              console.error('Erro ao renderizar Mermaid:', error);
              const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
              element.innerHTML = `<div style="color: #ef4444; padding: 8px; background: rgba(239, 68, 68, 0.1); border-radius: 4px; font-size: 12px;">❌ Erro: ${errorMessage}</div>`;
            }
          }
        }

        // Restaura a posição do scroll após renderizar
        if (previewRef.current && savedScrollTop > 0) {
          previewRef.current.scrollTop = Math.min(savedScrollTop, previewRef.current.scrollHeight - previewRef.current.clientHeight);
        }
      };

      renderPreview();
    }, 500); // 500ms de debounce

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [content, theme]);

  // Scroll externo - apenas quando externalScrollPercentage muda
  useEffect(() => {
    if (!syncScroll) return;
    if (externalScrollPercentage === undefined || externalScrollPercentage === null) return;
    if (!previewRef.current) return;

    // Só aplica scroll externo se veio do editor
    if (scrollSource !== 'editor') return;

    const preview = previewRef.current;
    const maxScroll = preview.scrollHeight - preview.clientHeight;

    if (maxScroll > 0) {
      isUpdatingScroll.current = true;

      const targetScrollTop = externalScrollPercentage * maxScroll;
      preview.scrollTop = targetScrollTop;

      // Libera o bloqueio no próximo frame
      requestAnimationFrame(() => {
        isUpdatingScroll.current = false;
      });
    }
  }, [externalScrollPercentage, syncScroll, scrollSource]);

  return (
    <div
      ref={previewRef}
      className="preview-content"
      onScroll={handlePreviewScroll}
    />
  );
}
