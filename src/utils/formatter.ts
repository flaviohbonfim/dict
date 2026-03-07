/**
 * Utilitário para formatação de Markdown
 */

export function formatMarkdown(content: string): string {
  if (!content) return '';

  let lines = content.split('\n');
  
  // 1. Limpar espaços em branco no final de cada linha
  lines = lines.map(line => line.trimEnd());

  // 2. Garantir que títulos (#) tenham um espaço após o símbolo
  lines = lines.map(line => {
    const match = line.match(/^(#+)([^#\s].*)$/);
    if (match) {
      return `${match[1]} ${match[2]}`;
    }
    return line;
  });

  // 3. Padronizar espaçamento entre parágrafos (máximo 1 linha em branco)
  let formattedContent = lines.join('\n');
  formattedContent = formattedContent.replace(/\n{3,}/g, '\n\n');

  // 4. Garantir que o arquivo termine com exatamente uma linha em branco (opcional, mas boa prática)
  formattedContent = formattedContent.trimEnd() + '\n';

  return formattedContent;
}
