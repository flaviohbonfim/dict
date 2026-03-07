import { marked } from 'marked';
import hljs from 'highlight.js';
import mermaid from 'mermaid';
import { convertEmojiShortcodes } from './emoji';

import 'highlight.js/styles/atom-one-dark.css';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

const renderer = new marked.Renderer();
renderer.code = ({ text, lang }) => {
  const language = lang?.trim().toLowerCase();

  if (language === 'mermaid') {
    return `<div class="mermaid">${text}</div>`;
  }

  let highlightedCode = text;
  if (language && hljs.getLanguage(language)) {
    try {
      highlightedCode = hljs.highlight(text, { language }).value;
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

export async function generateHtmlContent(markdown: string, theme: string = 'dict-nord'): Promise<string> {
  const isDark = theme === 'dict-nord';
  const mermaidTheme = isDark ? 'dark' : 'default';
  
  mermaid.initialize({
    startOnLoad: false,
    theme: mermaidTheme,
    securityLevel: 'loose',
  });

  const htmlWithEmojis = convertEmojiShortcodes(markdown);
  let htmlContent = marked.parse(htmlWithEmojis) as string;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Renderizar diagramas Mermaid como SVG inline
  const mermaidElements = tempDiv.querySelectorAll('.mermaid');
  
  for (let i = 0; i < mermaidElements.length; i++) {
    const element = mermaidElements[i];
    const graphDefinition = element.textContent?.trim() || '';

    if (graphDefinition) {
      try {
        const id = `mermaid-${Date.now()}-${i}`;
        const { svg } = await mermaid.render(id, graphDefinition);
        
        // Criar container para o SVG
        const container = document.createElement('div');
        container.className = 'mermaid';
        container.innerHTML = svg;
        
        element.replaceWith(container);
      } catch (error) {
        console.error('Mermaid render error:', error);
        element.innerHTML = `<span style="color: red;">[Erro ao renderizar diagrama]</span>`;
      }
    }
  }

  htmlContent = tempDiv.innerHTML;
  
  const bgColor = isDark ? '#1a1a2e' : '#ffffff';
  const textColor = isDark ? '#d8dee9' : '#2e3440';
  const codeBg = isDark ? '#2e3440' : '#e5e9f0';
  const accentColor = isDark ? '#88c0d0' : '#5e81ac';
  const borderColor = isDark ? '#4c566a' : '#d8dee9';

  // Não incluímos mais o script do Mermaid pois os SVGs já estão inline
  // Isso evita problemas de renderização e torna o HTML mais compatível
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documento Exportado</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background-color: ${bgColor};
      color: ${textColor};
      line-height: 1.6;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    h1, h2, h3, h4, h5, h6 {
      color: ${accentColor};
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
    }
    h1 { font-size: 2em; border-bottom: 1px solid ${borderColor}; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid ${borderColor}; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }
    p { margin-bottom: 16px; }
    a { color: ${accentColor}; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code {
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      background-color: ${codeBg};
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
    }
    pre {
      background-color: ${codeBg};
      padding: 16px;
      border-radius: 6px;
      overflow: auto;
      margin-bottom: 16px;
    }
    pre code {
      background: none;
      padding: 0;
    }
    /* Estilos para SVG inline do Mermaid */
    .mermaid {
      display: flex;
      justify-content: center;
      margin: 16px 0;
      padding: 16px;
      background-color: ${codeBg};
      border-radius: 6px;
      overflow: auto;
    }
    .mermaid svg {
      max-width: 100%;
      height: auto;
    }
    blockquote {
      border-left: 4px solid ${accentColor};
      padding-left: 16px;
      margin-left: 0;
      margin-bottom: 16px;
      color: ${isDark ? '#81a1c1' : '#4c566a'};
      background-color: ${codeBg};
      padding: 12px 16px;
      border-radius: 0 4px 4px 0;
    }
    ul, ol { margin-bottom: 16px; padding-left: 24px; }
    li { margin-bottom: 4px; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
    th, td { border: 1px solid ${borderColor}; padding: 8px 12px; text-align: left; }
    th { background-color: ${codeBg}; font-weight: 600; color: ${accentColor}; }
    img { max-width: 100%; border-radius: 4px; }
    hr { border: none; border-top: 1px solid ${borderColor}; margin: 24px 0; }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`;
}

export async function downloadHtml(markdown: string, filename: string = 'document.html', theme: string = 'dict-nord'): Promise<void> {
  const html = await generateHtmlContent(markdown, theme);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
