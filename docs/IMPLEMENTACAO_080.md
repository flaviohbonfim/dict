# Plano de Implementação - Versão 0.8.0

## Visão Geral

Este documento detalha o plano de implementação para a versão 0.8.0 do editor de Markdown "dict". A versão inclui funcionalidades de exportação/compartilhamento e três novos recursos de edição avançada.

---

## 1. Funcionalidades de Exportação e Compartilhamento

### 1.1 Exportar PDF

**Prioridade:** 🔴 Alta | **Estimativa:** 3-5 dias

**Dependências:**

- Biblioteca `html2pdf.js` ou `jspdf`

**Implementação:**

1. Adicionar botão na barra de ferramentas (próximo aos botões de viewMode)
2. Criar componente de geração de PDF:
   - Capturar conteúdo renderizado do Preview
   - Aplicar estilos CSS específicos para PDF
   - Gerar arquivo PDF para download
3. Tratamento de erros (tabelas grandes, imagens, diagramas Mermaid)

**Arquivos a modificar:**

- `src/components/EditorToolbar.tsx` - Adicionar botão
- `src/App.tsx` - Handler de exportação PDF
- `src/styles/` - Novos estilos para impressão

---

### 1.2 Exportar HTML

**Prioridade:** 🔴 Alta | **Estimativa:** 2-3 dias

**Implementação:**

1. Criar função de geração de HTML standalone:
   - Template HTML com estilos inline
   - Incluir CSS do preview
   - Suporte a Mermaid (incluir библиотеку)
2. Adicionar botão na barra de ferramentas
3. Download como arquivo `.html`

**Arquivos a modificar:**

- `src/App.tsx` - Função de exportação HTML
- `src/components/EditorToolbar.tsx` - Adicionar botão

---

### 1.3 Modo Apresentação (Fullscreen Preview)

**Prioridade:** 🟡 Média | **Estimativa:** 2-3 dias

**Implementação:**

1. Adicionar botão na barra de ferramentas
2. Implementar modo fullscreen:
   - Usar Fullscreen API do navegador
   - Ocultar toda UI exceto o preview
   - Adicionar controls mínimos (sair, próximo/anterior slide seções)
3. Detectar seções H1/H2 para criar "slides"
4. Atalhos: ESC para sair, setas para navegar

**Arquivos a modificar:**

- `src/App.tsx` - Lógica de fullscreen
- `src/components/Preview.tsx` - Adicionar modo apresentação
- `src/styles/layout.css` - Estilos para fullscreen

---

### 1.4 Copiar como HTML

**Prioridade:** 🟡 Média | **Estimativa:** 1-2 dias

**Implementação:**

1. Adicionar botão na barra de ferramentas
2. Usar Clipboard API para copiar HTML formatado
3. Feedback visual (toast notification)

**Arquivos a modificar:**

- `src/App.tsx` - Função de cópia para clipboard

---

### 1.5 Compartilhar Link (Gist/Cloud)

**Prioridade:** 🟢 Baixa | **Estimativa:** 3-5 dias

**Implementação:**

1. Criar integração com GitHub Gists API:
   - Autenticação via Personal Access Token (configurável)
   - Criar gist público ou privado
   - Gerar URL compartilhável
2. Adicionar painel de compartilhamento:
   - Opção de criar gist anônima ou autenticada
   - Listar gists anteriores
3. Salvar token no localStorage (criptografado)

**Arquivos a modificar:**

- `src/App.tsx` - Integração com Gist API
- `src/components/SettingsPanel.tsx` - Configuração de token
- Criar novo componente: `src/components/ShareModal.tsx`

---

## 2. Novas Funcionalidades de Edição

### 2.1 Texto Sublinhado

**Prioridade:** 🔴 Alta | **Estimativa:** 1-2 dias

**Dependências:** Nenhuma (usar tag HTML `<u>`)

**Implementação:**

#### 2.1.1 Handler de formatação

```typescript
// Em src/App.tsx
const handleUnderline = () => insertFormatting("<u>", "</u>");
```

#### 2.1.2 Adicionar ao EditorToolbar

- Importar ícone `Underline` do lucide-react
- Adicionar botão com título "Sublinhado (Ctrl+U)"
- Conectar ao handler `handleUnderline`

#### 2.1.3 Adicionar ao ContextMenu

- Importar ícone no ContextMenu.tsx
- Adicionar item ao menu de contexto do editor
- Conectar ao handler

#### 2.1.4 Adicionar atalho de teclado

```typescript
// Em src/components/TextEditor.tsx - handleKeyDown
if (e.ctrlKey && e.key === "u") {
  e.preventDefault();
  // Chamar callback de sublinhado
}
```

**Arquivos a modificar:**

- `src/App.tsx` - Adicionar handleUnderline e props
- `src/components/EditorToolbar.tsx` - Adicionar botão
- `src/components/ContextMenu.tsx` - Adicionar opção
- `src/components/TextEditor.tsx` - Adicionar atalho Ctrl+U
- `src/utils/icons.ts` - Adicionar ícone (se necessário)

---

### 2.2 Quebra de Linha Automática

**Prioridade:** 🔴 Alta | **Estimativa:** 2-3 dias

**Implementação:**

#### 2.2.1 Estado da aplicação

```typescript
// Em src/App.tsx
const [wordWrap, setWordWrap] = useState(() => {
  return localStorage.getItem("wordWrap") === "true";
});
```

#### 2.2.2 Persistência

```typescript
useEffect(() => {
  localStorage.setItem("wordWrap", wordWrap.toString());
}, [wordWrap]);
```

#### 2.2.3 Estilo CSS condicional

```css
/* Em src/styles/layout.css */
.text-editor.word-wrap {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.text-editor.no-wrap {
  white-space: pre;
  overflow-x: auto;
}
```

#### 2.2.4 Passar prop para TextEditor

```typescript
// Em App.tsx
<TextEditor
  // ...outras props
  wordWrap={wordWrap}
/>
```

#### 2.2.5 Aplicar estilo no TextEditor

```typescript
// Em src/components/TextEditor.tsx
<textarea
  className={`text-editor ${wordWrap ? 'word-wrap' : 'no-wrap'}`}
  // ...
/>
```

#### 2.2.6 Adicionar botão na barra

- Importar ícone `WrapText` do lucide-react
- Adicionar toggle button com indicador de estado ativo
- Tooltip: "Quebra de Linha Automática"

**Arquivos a modificar:**

- `src/App.tsx` - Estado wordWrap, handlers, persistência
- `src/components/EditorToolbar.tsx` - Adicionar botão toggle
- `src/components/TextEditor.tsx` - Aplicar classe condicional
- `src/styles/layout.css` - Estilos word-wrap

---

### 2.3 Inserir Imagem (Uploadthing)

**Prioridade:** 🔴 Alta | **Estimativa:** 4-6 dias

**Dependências:**

- SDK Uploadthing (`@uploadthing/react`)

#### 2.3.1 Instalação

```bash
npm install @uploadthing/react
```

#### 2.3.2 Configuração do Uploadthing

1. Criar conta em uploadthing.com
2. Criar app e obter API key
3. Configurar no SettingsPanel:
   - Campo para inserir API key
   - Validação da chave
   - Armazenar no localStorage

#### 2.3.3 Criar utilitário de upload

```typescript
// src/utils/uploadImage.ts
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "./api/uploadthing/[...]/route";

export const useUploadThing = generateReactHelpers<OurFileRouter>();
```

**Nota:** O Uploadthing requer um backend API route. Para uma aplicação frontend-only, usar a API direct upload ou alternativa como ImgBB.

#### 2.3.4 Alternativa: ImgBB (se API key do Uploadthing não disponível)

Para evitar necessidade de backend, usar ImgBB API:

1. Obter API key gratuita em imgbb.com
2. Upload via fetch:

```typescript
async function uploadToImgbb(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${API_KEY}`,
    { method: "POST", body: formData },
  );

  const data = await response.json();
  return data.data.url;
}
```

#### 2.3.5 Componente de seleção de imagem

- Input hidden type="file" com accept="image/\*"
- Botão na toolbar que dispara o input
- Estado de loading com spinner
- Feedback de erro/sucesso

#### 2.3.6 Inserção no editor

```typescript
const handleImageInsert = (imageUrl: string) => {
  insertFormatting("![Imagem](", ")");
  //ou para posicionar cursor corretamente:
  insertAtCursor(`![Imagem](${imageUrl})`);
};
```

#### 2.3.7 Adicionar ao ContextMenu

- Opção "Inserir Imagem..."
  -same handler do botão na toolbar

**Arquivos a modificar:**

- `src/App.tsx` - Handlers de upload, estado
- `src/components/EditorToolbar.tsx` - Botão de imagem
- `src/components/ContextMenu.tsx` - Opção de inserir imagem
- `src/components/SettingsPanel.tsx` - Configuração de API key
- `src/utils/uploadImage.ts` - Função de upload (novo)
- `src/styles/layout.css` - Estilos de loading

---

## 3. Estrutura de Arquivos

### Arquivos a criar:

```
src/
  utils/
    uploadImage.ts      # Funções de upload de imagem
    exportPdf.ts       # Funções de exportação PDF
    exportHtml.ts      # Funções de exportação HTML
  components/
    ShareModal.tsx      # Modal de compartilhamento (Gist)
    ImageUploader.tsx  # Componente de upload de imagem
```

### Arquivos a modificar:

```
src/
  App.tsx
  components/
    EditorToolbar.tsx
    ContextMenu.tsx
    TextEditor.tsx
    SettingsPanel.tsx
    Preview.tsx
  styles/
    layout.css
```

---

## 4. Ordem de Implementação Sugerida

### Semana 1: Recursos de Edição

1. ✅ Texto Sublinhado
2. ✅ Quebra de Linha Automática
3. ✅ Inserir Imagem (com ImgBB como fallback)

### Semana 2: Exportação

4. Exportar HTML
5. Exportar PDF
6. Copiar como HTML

### Semana 3: Compartilhamento e Finalização

7. Modo Apresentação
8. Compartilhar Link (Gist)
9. Testes e correções

---

## 5. Checklist de Implementação

- [ ] Texto Sublinhado - Toolbar
- [ ] Texto Sublinhado - ContextMenu
- [ ] Texto Sublinhado - Atalho Ctrl+U
- [ ] Quebra de Linha - Toggle na toolbar
- [ ] Quebra de Linha - Persistência localStorage
- [ ] Quebra de Linha - Estilo CSS condicional
- [ ] Inserir Imagem - Configuração API
- [ ] Inserir Imagem - Upload de arquivo
- [ ] Inserir Imagem - Toolbar
- [ ] Inserir Imagem - ContextMenu
- [ ] Inserir Imagem - Feedback visual
- [ ] Exportar PDF
- [ ] Exportar HTML
- [ ] Copiar como HTML
- [ ] Modo Apresentação
- [ ] Compartilhar Link (Gist)

---

## 6. Considerações Adicionais

### Performance

- Lazy load de bibliotecas de exportação
- Cache de conteúdo renderizado para PDF

### Acessibilidade

- Todos os botões com aria-label
- Suporte a keyboard navigation
- Contraste de cores

### Edge Cases

- Arquivos muito grandes para PDF
- Imagens de tamanho muito grande
- Falha de rede durante upload
- Timeout de requisições

---

**Documento criado para versão 0.8.0**
**Última atualização:** Março 2026
