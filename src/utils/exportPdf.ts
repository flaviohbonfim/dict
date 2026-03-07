import html2pdf from 'html2pdf.js';
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

export async function exportToPdf(markdown: string, filename: string = 'document.pdf'): Promise<void> {
  // Tema claro forçado para PDF (mais legível para impressão)
  const mermaidTheme = 'default';
  
  mermaid.initialize({
    startOnLoad: false,
    theme: mermaidTheme,
    securityLevel: 'loose',
  });

  const htmlWithEmojis = convertEmojiShortcodes(markdown);
  let htmlContent = marked.parse(htmlWithEmojis) as string;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Renderizar diagramas Mermaid
  const mermaidElements = tempDiv.querySelectorAll('.mermaid');
  
  for (let i = 0; i < mermaidElements.length; i++) {
    const element = mermaidElements[i];
    const graphDefinition = element.textContent?.trim() || '';

    if (graphDefinition) {
      try {
        const id = `mermaid-pdf-${Date.now()}-${i}`;
        const { svg } = await mermaid.render(id, graphDefinition);
        
        const container = document.createElement('div');
        container.className = 'mermaid-container';
        container.innerHTML = svg;
        
        element.replaceWith(container);
      } catch (error) {
        console.error('Mermaid render error:', error);
        element.innerHTML = `<span style="color: red;">[Erro ao renderizar diagrama]</span>`;
      }
    }
  }

  htmlContent = tempDiv.innerHTML;
  
  // Cores do tema claro
  const bgColor = '#ffffff';
  const textColor = '#2e3440';
  const codeBg = '#e5e9f0';
  const accentColor = '#5e81ac';
  const borderColor = '#d8dee9';

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: ${bgColor};
          color: ${textColor};
          line-height: 1.6;
          padding: 40px;
          font-size: 12pt;
        }
        h1, h2, h3, h4, h5, h6 {
          color: ${accentColor};
          margin-top: 20px;
          margin-bottom: 12px;
          font-weight: 600;
          page-break-after: avoid;
        }
        h1 { font-size: 24pt; border-bottom: 1px solid ${borderColor}; padding-bottom: 8px; }
        h2 { font-size: 18pt; border-bottom: 1px solid ${borderColor}; padding-bottom: 6px; }
        h3 { font-size: 14pt; }
        p { margin-bottom: 12px; page-break-inside: avoid; }
        a { color: ${accentColor}; text-decoration: none; }
        code {
          font-family: 'Consolas', monospace;
          background-color: ${codeBg};
          padding: 2px 4px;
          border-radius: 3px;
          font-size: 10pt;
        }
        pre {
          background-color: ${codeBg};
          padding: 12px;
          border-radius: 4px;
          overflow: auto;
          margin-bottom: 12px;
          page-break-inside: avoid;
        }
        pre code { background: none; padding: 0; }
        blockquote {
          border-left: 3px solid ${accentColor};
          padding-left: 12px;
          margin-left: 0;
          margin-bottom: 12px;
          color: #4c566a;
          background-color: ${codeBg};
          padding: 8px 12px;
        }
        ul, ol { margin-bottom: 12px; padding-left: 20px; }
        li { margin-bottom: 4px; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 12px; page-break-inside: avoid; }
        th, td { border: 1px solid ${borderColor}; padding: 6px 10px; text-align: left; }
        th { background-color: ${codeBg}; font-weight: 600; color: ${accentColor}; }
        img { max-width: 100%; page-break-inside: avoid; }
        hr { border: none; border-top: 1px solid ${borderColor}; margin: 20px 0; }
        .mermaid-container { 
          text-align: center; 
          margin: 16px 0; 
          page-break-inside: avoid;
        }
        .mermaid-container svg {
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  // Criar elemento temporário para renderização
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '210mm'; // Largura A4
  container.innerHTML = fullHtml;
  document.body.appendChild(container);

  // Adicionar atributo crossorigin a todas as imagens
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    img.setAttribute('crossorigin', 'anonymous');
  });

  // Opções do html2pdf com suporte a múltiplas páginas
  const opt = {
    margin: 10,
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      letterRendering: true,
    },
    jsPDF: { 
      unit: 'mm' as const, 
      format: 'a4' as const, 
      orientation: 'portrait' as const,
      compress: true,
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'] as const,
      avoid: ['h1', 'h2', 'h3', 'h4', 'pre', 'table', '.mermaid-container'],
    }
  };

  try {
    await html2pdf().set(opt).from(container).save();
  } finally {
    document.body.removeChild(container);
  }
}
