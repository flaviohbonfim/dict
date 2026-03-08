import { useState, useEffect, useCallback, useRef } from 'react';
import { Presentation, Loader2, X } from 'lucide-react';
import { ActivityBar } from './components/ActivityBar';
import { Sidebar } from './components/Sidebar';
import { EditorToolbar } from './components/EditorToolbar';
import { TextEditor } from './components/TextEditor';
import { Preview } from './components/Preview';
import { StatusBar } from './components/StatusBar';
import { Tabs } from './components/Tabs';
import { ContextMenu } from './components/ContextMenu';
import { SettingsPanel } from './components/SettingsPanel';
import { ConfirmModal } from './components/ConfirmModal';
import { ChangelogModal } from './components/ChangelogModal';
import { EmojiPickerComponent } from './components/EmojiPicker';
import { SearchBar } from './components/SearchBar';
import { Minimap } from './components/Minimap';
import { formatMarkdown } from './utils/formatter';
import { convertEmojiShortcodes } from './utils/emoji';
import { marked } from 'marked';
import './styles/global.css';
import './styles/layout.css';

interface FileData {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  parentId?: string; // ID da pasta pai
}

interface Tab {
  id: string;
  fileId: string;
  name: string;
  content: string;
  isDirty: boolean;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  target: 'explorer' | 'editor' | 'preview' | null;
  fileId?: string;
}

interface RecentFile {
  id: string;
  name: string;
  content: string;
  lastOpened: number;
}

const DEFAULT_CONTENT = `# Bem-vindo ao dict

Este é um editor de texto Markdown com suporte a diagramas Mermaid, visual similar ao VS Code e suporte a temas.

## Recursos

- **Editor de Markdown** com preview em tempo real
- **Diagramas Mermaid** para visualização de gráficos
- **Temas** claro e escuro
- **Layout estilo VS Code**
- **Abas** para múltiplos arquivos
- **Menu de contexto** customizado

## Exemplo de Markdown

### Negrito e Itálico
Este é um texto em **negrito** e este em *itálico*.

### Código
Use \`código inline\` ou blocos de código:

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Listas

- Item 1
- Item 2
- Item 3

### Links
[Visite o GitHub](https://github.com)

### Tabelas

| Nome | Idade | Cidade |
|------|-------|--------|
| João | 25    | São Paulo |
| Maria | 30   | Rio de Janeiro |

## Diagramas Mermaid

Você pode criar diagramas Mermaid usando blocos de código com a linguagem \`mermaid\`:

\`\`\`mermaid
graph TD
    A[Início] --> B{Decisão}
    B -->|Sim| C[Ação 1]
    B -->|Não| D[Ação 2]
    C --> E[Fim]
    D --> E
\`\`\`

### Fluxograma

\`\`\`mermaid
flowchart LR
    A[Cliente] -->|Solicitação| B[Servidor]
    B -->|Resposta| A
    B --> C[Banco de Dados]
    C -->|Dados| B
\`\`\`

### Gráfico de Sequência

\`\`\`mermaid
sequenceDiagram
    participant A as Cliente
    participant B as API
    participant C as Banco
    A->>B: Requisição
    B->>C: Query
    C-->>B: Dados
    B-->>A: Resposta
\`\`\`

### Gráfico de Pizza

\`\`\`mermaid
pie
    "Chrome" : 60
    "Firefox" : 20
    "Safari" : 15
    "Outros" : 5
\`\`\`

---

**Dica:** Use os atalhos de teclado para formatar seu texto mais rapidamente!
`;

const CHANGELOG = `## Versão 0.8.0 - Exportação, Compartilhamento e Edição Avançada

### Exportação e Compartilhamento
- **Exportar para PDF**: Gerar documentos PDF com melhorias de tema (Light/Nord) e quebra de página automática
- **Exportar para HTML**: Exportação standalone com suporte total a diagramas Mermaid e Emojis
- **Compartilhamento via Gist**: Upload direto para GitHub Gist (Público ou Privado) com geração automática de link

### Melhorias no Editor
- **Texto Sublinhado**: Suporte à tag <u> com atalho global Ctrl+U
- **Quebra de Linha Automática**: Opção de Word Wrap para facilitar a leitura de textos longos
- **Upload de Imagens**: Integração com ImgBB para inserção rápida de imagens via link Markdown

### UX e Correções
- Comportamento refinado de modais (fechamento sequencial com ESC)
- Fechamento automático do painel de Configurações ao clicar fora
- Correções de imports (Loader2) e limpeza de interface

---

## Versão 0.7.1 - Correções de UX e Modais

### Correções
- Modais agora fecham na ordem correta (inversa à abertura) ao pressionar ESC
- O painel de Configurações agora fecha ao clicar fora dele
- Adicionado suporte a ESC no modal "Ir para Linha" de forma global

---

## Versão 0.7.0 - Editor Avançado e Persistência de Workspace

### Novas Funcionalidades

#### Auto-complete Inteligente
- Sugestões automáticas de sintaxe Markdown (#, -, *, etc.)
- Autocomplete de emojis ao digitar \`:\` com suporte a +800 shortcodes
- Seleção com Enter/Tab e navegação intuitiva com setas
- Suporte a ícones visuais nas sugestões de emojis

#### Formatação de Documento
- Padronização de espaçamento e normalização instantânea de títulos
- Limpeza de espaços extras no final das linhas
- Atalho global \`Shift+Alt+F\`

#### Persistência de Workspace
- Abas abertas e aba ativa persistem entre recarregamentos de página
- Sincronização automática para evitar erros em arquivos excluídos

#### Interface e Contexto
- Opções "Inserir Emoji" e "Formatar Documento" no menu do editor
- Opção "Limpar Arquivos Recentes" no explorador
- Seções "Recentes" e "Favoritos" agora podem ser recolhidas (estado persistido)

### Melhorias de UX
- Suporte a shortcodes modernos no preview (:warning:, :fire:, etc.)
- Gatilho do autocomplete aprimorado para evitar disparos falsos
- Minimapa com posicionamento dinâmico e visibilidade condicionada

### Correções
- Resolvido bug do autocomplete ao fechar shortcode de emoji
- Corrigida inserção de emojis pela barra de tarefas
- Limpeza de estados e otimização de performance no App.tsx
- Sincronização de scroll refinada

---

## Versão 0.6.0 - Gerenciamento de Arquivos e Organização por Pastas

### Novas Funcionalidades

#### Arrastar e Soltar (Drag & Drop)
- Importar arquivos arrastando do computador
- Overlay visual com mensagem ao arrastar
- Aceita arquivos .md, .markdown e .txt
- Abertura automática ao soltar

#### Histórico de Arquivos Recentes
- Lista dos últimos 10 arquivos abertos
- Exibido na sidebar com ícone de relógio
- Tempo decorrido ("5min atrás", "2h atrás", "3d atrás")
- Reabre arquivo ao clicar
- Persiste no localStorage

#### Sistema de Favoritos
- Marcar arquivos como favoritos com estrela ⭐
- Seção dedicada no topo da sidebar
- Estrela dourada quando é favorito
- Acesso rápido aos arquivos importantes
- Persiste no localStorage

#### Organização por Pastas
- Criar pastas para organizar arquivos
- Estrutura hierárquica com indentação visual
- Expandir/recolher pastas (▶/▼)
- Arrastar arquivos para dentro das pastas
- Arrastar para área vazia para mover para raiz
- Renomear arquivos e pastas (botão ✏️)
- Excluir arquivos e pastas (botão 🗑️)
- Exclusão de pastas exclui filhos recursivamente
- Modal customizado para confirmação de exclusão

### Melhorias de UX

#### Interface Padronizada
- Todos os ícones na mesma cor (var(--text-secondary))
- Botões de ação com hover consistente
- Sem cores vermelhas (mantém padrão do tema)
- Ícones Lucide em todo o app

#### Drag & Drop Inteligente
- Overlay só aparece ao arrastar de FORA do app
- Ao arrastar do sidebar, overlay não aparece
- Dados transferidos com metadados (source, fileId)
- Stop propagation para não "borbulhar" eventos

#### Confirmação de Exclusão
- Modal customizado (não usa confirm() nativo)
- Mensagem contextual para pastas
- Avisa que filhos serão excluídos
- Mesma UI para fechar e excluir

### Correções

#### Bug do Renomear
- Input de renomear funcionando corretamente
- Enter salva, Escape cancela
- Blur salva automaticamente

#### Bug do Drag & Drop
- Overlay não fica aberto após drop
- Eventos não borbulham para main-layout
- Só processa drag do sidebar ou externo

---

## Versão 0.5.0 - Busca, Substituição e Navegação Avançada

### Novas Funcionalidades

#### Buscar no Arquivo (Ctrl+F)
- Barra de busca estilo VSCode
- Highlights visuais em todos os matches (azul ciano Nord)
- Match atual destacado com cor mais forte e borda
- Navegação entre resultados (Enter/Shift+Enter)
- Contador de resultados em tempo real
- Opções: Case sensitive, Palavra inteira
- Foco permanece na busca durante navegação
- Highlights limpam ao fechar busca

#### Substituir (Ctrl+H)
- Integrado com a busca
- Campo de substituição abaixo da busca
- Substituir ocorrência individual
- Substituir todas as ocorrências
- Layout inspirado no VSCode

#### Ir para Linha (Ctrl+G)
- Modal de navegação rápida
- Digite o número da linha
- Navegação instantânea
- Fecha com ESC

#### Refazer (Ctrl+Y)
- Sistema completo de Undo/Redo
- Histórico de até 100 alterações
- Suporte para Ctrl+Y e Ctrl+Shift+Z
- Limpa ao fazer nova alteração

#### Contagem de Tempo de Leitura
- Estimativa de tempo na StatusBar
- Baseado em 200 palavras por minuto
- Exibido ao lado da contagem de palavras

### Melhorias de UX

#### Highlights de Busca
- Cores do tema Nord (azul ciano)
- Match atual mais forte com borda
- Highlights sincronizam com scroll
- Limpam ao fechar busca ou apagar pesquisa

#### Navegação Circular
- Enter no último → volta pro primeiro
- Shift+Enter no primeiro → vai pro último
- Scroll automático para o match

#### Interface de Busca
- Botões de opção estilizados (sem checkboxes)
- Ícones para Case Sensitive e Palavra Inteira
- Contador "X de Y" ou "Sem resultados"
- Mensagem vermelha quando não acha nada

### Correções

#### Bug do Contador
- Contador zera ao apagar pesquisa
- Highlights limpam ao fechar busca
- Query vazia limpa resultados imediatamente

#### Bug do EmojiPicker
- Emojis duplicados removidos (lobster, shrimp, squid, oyster)
- Scroll adicionado para ver todos emojis
- Categorias não cortam mais
- Atualização correta ao mudar categoria

#### Bug do Preview
- Código não escapa aspas duplas
- JavaScript e JSON renderizam corretamente
- Syntax highlighting mantido

---

## Versão 0.4.0 - Emojis, Submenus e Melhorias de UX

### Novas Funcionalidades

#### Suporte a Emojis
- Picker de emojis com busca e categorias
- +400 emojis comuns disponíveis
- Shortcodes no formato :emoji: (ex: :joy:, :smile:)
- Emojis aparecem apenas no preview, não no editor
- Categorias: Smileys, Pessoas, Animais, Comida, Atividades, Viagem
- Botão "Emoji" na toolbar para acesso rápido

#### Submenus na Toolbar
- **Títulos**: H1, H2, H3 com um clique
- **Mermaid**: 7 tipos de diagramas com exemplos prontos:
  - Flowchart (Fluxograma)
  - Sequence (Sequência)
  - Class (Classes)
  - Pie (Pizza)
  - Gantt (Timeline)
  - ER (Entidade Relacionamento)
  - Journey (Jornada do Usuário)

#### Menu de Contexto do Preview
- Menu customizado para o preview
- Opções: Selecionar Tudo, Copiar
- Diferente do menu do editor (foco em visualização)

#### Persistência de Estado
- Sidebar salva estado (aberto/fechado) no localStorage
- Recarregue a página e o estado é mantido

#### Modal de Confirmação Customizado
- Design minimalista seguindo o tema Dict Nord
- Confirmação para fechar arquivos
- Sem modais nativos do browser

### Melhorias de UX

#### Atalhos de Teclado
- **ESC**: Fecha qualquer modal (Settings, Changelog, Emoji Picker, Confirmação)
- **Ctrl+,**: Alterna painel de configurações (abre/fecha)
- **Ctrl+Z**: Desfazer última alteração (undo)
- Ícone de configurações destaca quando aberto

#### Interface
- Titlebar removida para layout mais limpo
- Botão "×" para fechar arquivos no explorador
- Fundo da sidebar corrigido (sem áreas escuras)
- Scrollbar do preview não interfere mais ao digitar

#### Identidade Visual
- Tema Dict Nord (azul-acinzentado)
- Tema Dict Light (claro suave)
- Favicon com "d" minúsculo
- Cores consistentes em todos os componentes

### Correções
- Diagramas Mermaid ER e Class funcionando
- Auto-save sem loop infinito
- Linha/coluna atualizando em tempo real
- Submenus não fecham ao clicar

---

## Versão 0.3.0 - Auto-save, Syntax Highlighting e Identidade Visual

### Novas Funcionalidades

#### Auto-save
- Salvamento automático no localStorage
- Recupera arquivos ao reabrir o aplicativo
- Botão "Auto-save" na toolbar para ativar/desativar
- Indicador visual de salvamento na barra de status
- Dirty indicator (bolinha azul) some ao salvar
- Mensagens: "Salvo agora", "Salvo há Xs", "Salvo há Xmin"

#### Contagem de Palavras
- Exibição de contagem de palavras na barra de status
- Contagem em tempo real enquanto digita
- Métricas: palavras, caracteres, linhas

#### Realce de Sintaxe
- Highlight.js integrado para blocos de código
- Suporte a múltiplas linguagens (JavaScript, Python, CSS, HTML, etc.)
- Tema Atom One Dark para melhor legibilidade
- Detecção automática de linguagem

#### Identidade Visual Dict
- Novo tema "Dict Nord" - Tema escuro inspirado no Nord (tons de azul-acinzentado)
- Novo tema "Dict Light" - Tema claro suave
- Cores customizadas em todos os componentes
- Efeitos de glow em elementos ativos
- Transições suaves entre estados
- Novo favicon com cores Nord (fundo azul #5e81ac)
- StatusBar com cor de destaque
- Títulos e links com cor accent
- Persistência do tema selecionado no localStorage

### Melhorias Técnicas
- Preview com debounce de 500ms
- Scroll sync otimizado
- Lazy initialization do estado
- Custom renderer para Markdown
- Integração com Mermaid mantida

### Correções
- Scrollbar do preview não se mexe mais ao digitar
- Auto-save sem loop infinito
- Dirty indicator atualizado corretamente

---

## Versão 0.2.0 - Sincronização de Scroll

### Novas Funcionalidades

#### Sincronização de Scroll
- Scroll sincronizado entre editor e preview
- Botão "Sync Scroll" na toolbar para ativar/desativar
- Rolagem simultânea em ambos os painéis no modo split
- Algoritmo de sincronização baseado em porcentagem

#### Melhorias de Interface
- Removido seletor de tema da toolbar principal
- Tema agora acessível apenas pelo painel de Configurações
- Toolbar mais limpa e focada em edição

### Correções
- Sincronização de scroll bidirecional totalmente revisada
- Prevenção de conflitos de scroll entre painéis
- Correção do canto das scrollbars (scrollbar corner)
- Melhoria na renderização de diagramas Mermaid
- Validação de sintaxe Mermaid com mensagens de erro claras
- Suporte a tema claro/escuro nos diagramas Mermaid

---

## Versão 0.1.0 - Lançamento Inicial

### Funcionalidades Implementadas

#### Editor
- Editor de texto Markdown com numeração de linhas
- Preview em tempo real do conteúdo renderizado
- Suporte a diagramas Mermaid (fluxograma, sequência, pizza, etc.)
- Sistema de abas para múltiplos arquivos abertos
- Detecção de alterações não salvas (dirty state)

#### Interface
- Layout inspirado no VS Code
- Activity bar lateral simplificada
- Sidebar com explorador de arquivos
- Barra de status com informações do arquivo
- Sistema de temas (Escuro, Claro, Escuro Moderno)
- Menu de contexto customizado (botão direito)

#### Gerenciamento de Arquivos
- Criar novos arquivos
- Abrir arquivos .md do sistema
- Salvar arquivos (download)
- Renomear arquivos
- Duplicar arquivos
- Fechar arquivos

#### Atalhos de Teclado
- Ctrl+B: Negrito
- Ctrl+I: Itálico
- Ctrl+H: Título
- Ctrl+K: Código inline
- Ctrl+L: Link
- Ctrl+U: Lista
- Ctrl+S: Salvar
- Ctrl+\\: Alternar modo de visualização
- Ctrl+Shift+E: Alternar explorador

#### Configurações
- Painel de configurações estilo VS Code
- Seletor de temas
- Lista de atalhos de teclado
- Changelog da versão
- Informações sobre o aplicativo`;

// Helper function to escape regex characters
const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('dict-theme');
    return savedTheme || 'dict-nord';
  });
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [activeView, setActiveView] = useState<'explorer' | ''>(() => {
    // Carregar estado do sidebar do localStorage
    const savedView = localStorage.getItem('dict-sidebar');
    console.log('[Sidebar] Estado carregado do localStorage:', savedView);
    // Se não tem nada salvo, usa 'explorer', senão usa o valor salvo
    return savedView !== null ? savedView as 'explorer' | '' : 'explorer';
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [syncScroll, setSyncScroll] = useState(true);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [scrollSource, setScrollSource] = useState<'editor' | 'preview' | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState({ x: 0, y: 0 });
  const [headingMenuOpen, setHeadingMenuOpen] = useState(false);
  const [mermaidMenuOpen, setMermaidMenuOpen] = useState(false);
  const [headingMenuPosition, setHeadingMenuPosition] = useState({ x: 0, y: 0 });
  const [mermaidMenuPosition, setMermaidMenuPosition] = useState({ x: 0, y: 0 });
  const [showMinimap, setShowMinimap] = useState(() => {
    const saved = localStorage.getItem('dict-minimap');
    return saved !== 'false'; // Default true se não tiver salvo
  });
  const [wordWrap, setWordWrap] = useState(() => {
    const saved = localStorage.getItem('dict-word-wrap');
    return saved === 'true';
  });
  const [isSlidesMode, setIsSlidesMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharingType, setSharingType] = useState<'public' | 'private' | null>(null);
  const [shareResult, setShareResult] = useState<string | null>(null);
  const [editorScrollPercentage, setEditorScrollPercentage] = useState(0);
  // Search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMatches, setSearchMatches] = useState<{ start: number; end: number }[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [replacementText, setReplacementText] = useState('');
  // Go to line state
  const [showGoToLine, setShowGoToLine] = useState(false);
  const [goToLineNumber, setGoToLineNumber] = useState('');
  // Undo/Redo history
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const MAX_HISTORY = 100;
  // Confirm modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{ fileId: string; fileName: string; action: 'close' | 'delete' } | null>(null);
  // Drag & Drop state
  const [isDragging, setIsDragging] = useState(false);
  // Recent files state
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>(() => {
    const saved = localStorage.getItem('dict-recent-files');
    return saved ? JSON.parse(saved) : [];
  });
  // Favorite files state
  const [favoriteFiles, setFavoriteFiles] = useState<string[]>(() => {
    const saved = localStorage.getItem('dict-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [imgbbApiKey, setImgbbApiKey] = useState(() => {
    return localStorage.getItem('dict-imgbb-api-key') || '';
  });
  const [githubToken, setGithubToken] = useState(() => {
    return localStorage.getItem('dict-github-token') || '';
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [exportMenuPosition, setExportMenuPosition] = useState({ x: 0, y: 0 });
  
  const [files, setFiles] = useState<FileData[]>(() => {
    // Lazy initialization - carrega do localStorage no estado inicial
    const savedFiles = localStorage.getItem('dict-files');
    if (savedFiles) {
      try {
        const parsed = JSON.parse(savedFiles) as FileData[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Erro ao carregar arquivos salvos:', e);
      }
    }
    return [{ id: '1', name: 'Bem-vindo.md', type: 'file', content: DEFAULT_CONTENT }];
  });
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const savedTabs = localStorage.getItem('dict-tabs');
    const savedFiles = localStorage.getItem('dict-files');
    
    if (savedTabs && savedFiles) {
      try {
        const parsedTabs = JSON.parse(savedTabs) as Tab[];
        const parsedFiles = JSON.parse(savedFiles) as FileData[];
        const fileIds = new Set(parsedFiles.map((f: FileData) => f.id));
        
        // Filtra apenas abas cujos arquivos ainda existem
        const validTabs = parsedTabs.filter((t: Tab) => fileIds.has(t.fileId));
        
        if (validTabs.length > 0) {
          return validTabs;
        }
      } catch (e) {
        console.error('Erro ao carregar abas salvas:', e);
      }
    }
    
    // Fallback: abre o primeiro arquivo disponível
    if (savedFiles) {
      try {
        const parsed = JSON.parse(savedFiles) as FileData[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const firstFile = parsed[0];
          return [{
            id: `tab-${firstFile.id}`,
            fileId: firstFile.id,
            name: firstFile.name,
            content: firstFile.content || '',
            isDirty: false
          }];
        }
      } catch (e) {
        console.error('Erro ao processar arquivos salvos para fallback de abas:', e);
      }
    }
    return [{ id: 'tab-1', fileId: '1', name: 'Bem-vindo.md', content: DEFAULT_CONTENT, isDirty: false }];
  });

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    const savedActiveTab = localStorage.getItem('dict-active-tab');
    const savedTabs = localStorage.getItem('dict-tabs');
    
    if (savedActiveTab && savedTabs) {
      try {
        const parsedTabs = JSON.parse(savedTabs) as Tab[];
        if (parsedTabs.some((t: Tab) => t.id === savedActiveTab)) {
          return savedActiveTab;
        }
      } catch (e) {
        console.error('Erro ao validar aba ativa salva:', e);
      }
    }
    
    // Fallback: se houver abas, pega a primeira
    if (savedTabs) {
      try {
        const parsedTabs = JSON.parse(savedTabs) as Tab[];
        if (parsedTabs.length > 0) return parsedTabs[0].id;
      } catch (e) {
        console.error('Erro ao processar abas salvas para fallback:', e);
      }
    }
    
    return 'tab-1';
  });
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    target: null,
    fileId: undefined
  });
  
  // Adicionar arquivo aos recentes (Moved up)
  const addToRecentFiles = useCallback((recentFile: RecentFile) => {
    setRecentFiles(prev => {
      // Remove se já existe
      const filtered = prev.filter(f => f.id !== recentFile.id);
      // Adiciona no início
      const updated = [recentFile, ...filtered].slice(0, 10); // Mantém últimos 10
      localStorage.setItem('dict-recent-files', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  const editorRef = useRef<HTMLDivElement>(null);
  const explorerRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find(t => t.id === activeTabId);
  const activeFile = files.find(f => f.id === activeTab?.fileId);

  const isInitialLoadRef = useRef(true);
  useEffect(() => {
    isInitialLoadRef.current = false;
  }, []);

  // Salvar abas no localStorage quando houver mudanças
  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem('dict-tabs', JSON.stringify(tabs));
    }
  }, [tabs]);

  // Salvar aba ativa no localStorage
  useEffect(() => {
    if (activeTabId) {
      localStorage.setItem('dict-active-tab', activeTabId);
    }
  }, [activeTabId]);

  // Auto-save: salvar arquivos no localStorage quando houver mudanças
  useEffect(() => {
    if (isInitialLoadRef.current) return;

    if (autoSaveEnabled && files.length > 0) {
      localStorage.setItem('dict-files', JSON.stringify(files));
      setTimeout(() => setLastSavedTime(new Date()), 0);
    }
  }, [files, autoSaveEnabled]);

  // Aplicar tema e salvar no localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dict-theme', theme);
  }, [theme]);

  // Salvar estado do minimapa no localStorage
  useEffect(() => {
    localStorage.setItem('dict-minimap', String(showMinimap));
  }, [showMinimap]);

  // Salvar estado do sidebar no localStorage
  useEffect(() => {
    localStorage.setItem('dict-sidebar', activeView);
  }, [activeView]);

  // Salvar estado da quebra de linha no localStorage
  useEffect(() => {
    localStorage.setItem('dict-word-wrap', String(wordWrap));
  }, [wordWrap]);

  // Salvar API Key do ImgBB no localStorage
  useEffect(() => {
    localStorage.setItem('dict-imgbb-api-key', imgbbApiKey);
  }, [imgbbApiKey]);

  // Salvar GitHub Token no localStorage
  useEffect(() => {
    localStorage.setItem('dict-github-token', githubToken);
  }, [githubToken]);

  // Fechar menu de contexto e submenus ao clicar fora
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        setContextMenu(prev => ({ ...prev, visible: false }));
      }
      if (headingMenuOpen) {
        setHeadingMenuOpen(false);
      }
      if (mermaidMenuOpen) {
        setMermaidMenuOpen(false);
      }
      if (exportMenuOpen) {
        setExportMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [contextMenu.visible, headingMenuOpen, mermaidMenuOpen, exportMenuOpen]);

  // Calcular posição do cursor
  const updateCursorPosition = useCallback(() => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      const text = textarea.value.substring(0, textarea.selectionStart);
      const lines = text.split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      setCursorPosition({ line, column });
    }
  }, []);

  // Atualizar posição do cursor periodicamente quando houver interação
  useEffect(() => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const handleSelectionChange = () => {
      updateCursorPosition();
    };

    textarea.addEventListener('click', handleSelectionChange);
    textarea.addEventListener('keyup', handleSelectionChange);
    textarea.addEventListener('select', handleSelectionChange);

    return () => {
      textarea.removeEventListener('click', handleSelectionChange);
      textarea.removeEventListener('keyup', handleSelectionChange);
      textarea.removeEventListener('select', handleSelectionChange);
    };
  }, [updateCursorPosition, activeTabId]);

  // Abrir/criar aba para um arquivo
  const openFileInTab = useCallback((fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const existingTab = tabs.find(t => t.fileId === fileId);
    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      const newTab: Tab = {
        id: `tab-${Date.now()}`,
        fileId: file.id,
        name: file.name,
        content: file.content || '',
        isDirty: false
      };
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
    }
  }, [files, tabs]);

  // Fechar aba
  const closeTab = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;

    // Se há alterações não salvas, confirmar fechamento
    if (tab.isDirty) {
      const confirmClose = window.confirm(`O arquivo "${tab.name}" tem alterações não salvas. Deseja fechar mesmo assim?`);
      if (!confirmClose) return;
    }

    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);

    if (activeTabId === tabId && newTabs.length > 0) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    } else if (newTabs.length === 0) {
      setActiveTabId('');
    }
  }, [tabs, activeTabId]);

  // Atualizar conteúdo da aba ativa
  const handleContentChange = useCallback((newContent: string) => {
    if (!activeTab) return;

    // Adicionar ao histórico de undo
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(activeTab.content);
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
    setRedoStack([]); // Limpar redo stack ao fazer nova alteração

    setTabs(prev => prev.map(t =>
      t.id === activeTabId
        ? { ...t, content: newContent, isDirty: !autoSaveEnabled }
        : t
    ));

    setFiles(prev => prev.map(f =>
      f.id === activeTab.fileId
        ? { ...f, content: newContent }
        : f
    ));
  }, [activeTab, activeTabId, historyIndex, autoSaveEnabled]);

  // Formatar o documento atual
  const handleFormatDocument = useCallback(() => {
    if (!activeTab) return;

    const formatted = formatMarkdown(activeTab.content);
    if (formatted === activeTab.content) return;

    handleContentChange(formatted);
  }, [activeTab, handleContentChange]);

  // Função de Undo (Ctrl+Z)
  const handleUndo = useCallback(() => {
    if (historyIndex < 0 || !activeTab) return;

    const previousContent = history[historyIndex];
    
    // Adicionar conteúdo atual ao redo stack
    setRedoStack(prev => [activeTab.content, ...prev]);
    setHistoryIndex(prev => prev - 1);

    setTabs(prev => prev.map(t =>
      t.id === activeTabId
        ? { ...t, content: previousContent, isDirty: true }
        : t
    ));

    setFiles(prev => prev.map(f =>
      f.id === activeTab.fileId
        ? { ...f, content: previousContent }
        : f
    ));
  }, [history, historyIndex, activeTab, activeTabId]);

  // Função de Redo (Ctrl+Y)
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0 || !activeTab) return;

    const [nextContent, ...remainingRedo] = redoStack;
    
    // Adicionar conteúdo atual ao history
    setHistory(prev => [...prev, activeTab.content]);
    setHistoryIndex(prev => prev + 1);
    setRedoStack(remainingRedo);

    setTabs(prev => prev.map(t =>
      t.id === activeTabId
        ? { ...t, content: nextContent, isDirty: true }
        : t
    ));

    setFiles(prev => prev.map(f =>
      f.id === activeTab.fileId
        ? { ...f, content: nextContent }
        : f
    ));
  }, [redoStack, activeTab, activeTabId]);

  // Funções de Busca
  const handleSearch = useCallback((query: string, options: { matchCase: boolean; matchWholeWord: boolean }) => {
    setSearchQuery(query);
    
    if (!query || !activeTab || query.trim() === '') {
      setSearchMatches([]);
      setCurrentMatchIndex(-1);
      return;
    }

    const content = activeTab.content;
    const matches: { start: number; end: number }[] = [];
    
    const flags = options.matchCase ? 'g' : 'gi';
    
    if (options.matchWholeWord) {
      const regex = new RegExp(`\\b${escapeRegex(query)}\\b`, flags);
      let match;
      while ((match = regex.exec(content)) !== null) {
        matches.push({ start: match.index, end: match.index + match[0].length });
      }
    } else {
      const regex = new RegExp(escapeRegex(query), flags);
      let match;
      while ((match = regex.exec(content)) !== null) {
        matches.push({ start: match.index, end: match.index + match[0].length });
      }
    }

    setSearchMatches(matches);
    // Keep current index if valid, otherwise reset to 0
    setCurrentMatchIndex(prev => {
      if (matches.length === 0) return -1;
      return prev >= 0 && prev < matches.length ? prev : 0;
    });
  }, [activeTab]);

  useEffect(() => {
    if (searchQuery && activeTab) {
      // Re-run search to update matches with new content
      // Use a small timeout to avoid cascading render warning
      const timeoutId = setTimeout(() => {
        handleSearch(searchQuery, { matchCase: false, matchWholeWord: false });
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [activeTab, searchQuery, handleSearch]);

  // Clear search highlights when closing search bar
  const handleCloseSearch = useCallback(() => {
    // Clear state synchronously
    setSearchQuery('');
    setSearchMatches([]);
    setCurrentMatchIndex(-1);
    // Then close
    setTimeout(() => setShowSearch(false), 0);
  }, []);

  const scrollToMatch = useCallback((index: number) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea || searchMatches.length === 0) return;

    const match = searchMatches[index];

    // Calculate line number and scroll to make it visible
    const textBeforeMatch = textarea.value.substring(0, match.start);
    const lineNumber = textBeforeMatch.split('\n').length;
    const lineHeight = 22.4; // Approximate line height
    const visibleLines = Math.floor(textarea.clientHeight / lineHeight);

    // Scroll to center the match
    const targetScrollLine = lineNumber - Math.floor(visibleLines / 2);
    
    // Scroll to the position
    textarea.scrollTop = Math.max(0, targetScrollLine * lineHeight);
  }, [searchMatches]);

  const handleFindNext = useCallback(() => {
    if (searchMatches.length === 0) return;
    
    const nextIndex = (currentMatchIndex + 1) % searchMatches.length;
    setCurrentMatchIndex(nextIndex);
    // Scroll after state update
    setTimeout(() => {
      scrollToMatch(nextIndex);
    }, 50);
  }, [searchMatches, currentMatchIndex, scrollToMatch]);

  const handleFindPrevious = useCallback(() => {
    if (searchMatches.length === 0) return;
    
    // Properly loop back to the last match when going backwards from first
    const prevIndex = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
    setCurrentMatchIndex(prevIndex);
    // Scroll after state update
    setTimeout(() => {
      scrollToMatch(prevIndex);
    }, 50);
  }, [searchMatches, currentMatchIndex, scrollToMatch]);

  const handleReplace = useCallback((replacement: string) => {
    setReplacementText(replacement);
  }, []);

  const handleReplaceOne = useCallback(() => {
    if (!activeTab || searchMatches.length === 0 || currentMatchIndex < 0) return;

    const match = searchMatches[currentMatchIndex];
    const newContent = activeTab.content.substring(0, match.start) + 
                       replacementText + 
                       activeTab.content.substring(match.end);
    
    handleContentChange(newContent);
    
    // Re-search after replacement
    setTimeout(() => {
      handleSearch(searchQuery, { matchCase: false, matchWholeWord: false });
    }, 100);
  }, [activeTab, searchMatches, currentMatchIndex, replacementText, handleContentChange, handleSearch, searchQuery]);

  const handleReplaceAll = useCallback(() => {
    if (!activeTab || !searchQuery) return;

    const flags = 'g';
    const regex = new RegExp(escapeRegex(searchQuery), flags);
    const newContent = activeTab.content.replace(regex, replacementText);
    
    handleContentChange(newContent);
    setSearchMatches([]);
    setCurrentMatchIndex(-1);
  }, [activeTab, searchQuery, replacementText, handleContentChange]);

  // Ir para Linha
  const handleGoToLine = useCallback(() => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea || !goToLineNumber) return;

    const line = parseInt(goToLineNumber, 10);
    if (isNaN(line) || line < 1) return;

    const content = activeTab?.content || '';
    const lines = content.split('\n');
    
    if (line > lines.length) return;

    // Calcular posição do início da linha
    let position = 0;
    for (let i = 0; i < line - 1; i++) {
      position += lines[i].length + 1;
    }

    textarea.focus();
    textarea.setSelectionRange(position, position);
    setShowGoToLine(false);
  }, [goToLineNumber, activeTab]);

  // Handler para atalhos de Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo (Ctrl+Z)
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }
      
      // Redo (Ctrl+Y ou Ctrl+Shift+Z)
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
        e.preventDefault();
        handleRedo();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Novo arquivo
  const handleNewFile = useCallback(() => {
    const id = Date.now().toString();
    const name = `novo-arquivo-${files.length + 1}.md`;
    const newFile: FileData = {
      id,
      name,
      type: 'file',
      content: '# Novo Arquivo\n\nComece a escrever...'
    };
    setFiles(prev => [...prev, newFile]);
    
    const newTab: Tab = {
      id: `tab-${id}`,
      fileId: id,
      name,
      content: newFile.content || '',
      isDirty: false
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [files.length]);

  // Abrir arquivo do sistema
  const handleOpenFile = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const id = Date.now().toString();
          const newFile: FileData = {
            id,
            name: file.name,
            type: 'file',
            content: event.target?.result as string
          };
          setFiles(prev => [...prev, newFile]);

          const newTab: Tab = {
            id: `tab-${id}`,
            fileId: id,
            name: file.name,
            content: newFile.content || '',
            isDirty: false
          };
          setTabs(prev => [...prev, newTab]);
          setActiveTabId(newTab.id);
          
          // Adicionar aos recentes
          addToRecentFiles({
            id,
            name: file.name,
            content: event.target?.result as string,
            lastOpened: Date.now()
          });
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [addToRecentFiles]);


  // Toggle favorite
  const toggleFavorite = useCallback((fileId: string) => {
    setFavoriteFiles(prev => {
      const isFavorite = prev.includes(fileId);
      const updated = isFavorite 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId];
      localStorage.setItem('dict-favorites', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Criar nova pasta
  const handleNewFolder = useCallback(() => {
    const id = Date.now().toString();
    const name = `Nova Pasta`;
    const newFolder: FileData = {
      id,
      name,
      type: 'folder',
      parentId: undefined
    };
    setFiles(prev => [...prev, newFolder]);
  }, []);

  // Mover arquivo/pasta para pasta
  const moveToFolder = useCallback((fileId: string, folderId: string | undefined) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, parentId: folderId } : f
    ));
  }, []);

  // Handlers para Drag & Drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Só mostra overlay se não for do sidebar
    const source = e.dataTransfer.getData('source');
    if (source !== 'sidebar') {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    // Só processa se não for do sidebar
    const source = e.dataTransfer.getData('source');
    if (source === 'sidebar') {
      return;
    }
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.name.endsWith('.md') || file.name.endsWith('.markdown') || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
          const newFile: FileData = {
            id,
            name: file.name,
            type: 'file',
            content: event.target?.result as string
          };
          setFiles(prev => [...prev, newFile]);

          const newTab: Tab = {
            id: `tab-${id}`,
            fileId: id,
            name: file.name,
            content: newFile.content || '',
            isDirty: false
          };
          setTabs(prev => [...prev, newTab]);
          setActiveTabId(newTab.id);
          
          // Adicionar aos recentes
          addToRecentFiles({
            id,
            name: file.name,
            content: event.target?.result as string,
            lastOpened: Date.now()
          });
        };
        reader.readAsText(file);
      }
    });
  }, [addToRecentFiles]);

  // Salvar arquivo
  const handleSave = useCallback(() => {
    if (!activeTab || !activeFile) return;
    
    const blob = new Blob([activeTab.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);

    // Marcar como salvo
    setTabs(prev => prev.map(t => 
      t.id === activeTabId ? { ...t, isDirty: false } : t
    ));
  }, [activeTab, activeFile, activeTabId]);

  // Renomear arquivo
  const handleRenameFile = useCallback((fileId: string, newName: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, name: newName } : f
    ));
    setTabs(prev => prev.map(t => 
      t.fileId === fileId ? { ...t, name: newName } : t
    ));
  }, []);

  // Duplicar arquivo
  const handleDuplicateFile = useCallback((fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const id = Date.now().toString();
    const name = file.name.replace('.md', '-copy.md') || `${file.name}-copy`;
    const newFile: FileData = {
      id,
      name,
      type: 'file',
      content: file.content
    };
    setFiles(prev => [...prev, newFile]);
    
    const newTab: Tab = {
      id: `tab-${id}`,
      fileId: id,
      name,
      content: file.content || '',
      isDirty: false
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [files]);

  // Fechar arquivo
  const handleCloseFile = useCallback((fileId: string) => {
    const tabsToClose = tabs.filter(t => t.fileId === fileId);
    tabsToClose.forEach(tab => closeTab(tab.id));
  }, [tabs, closeTab]);

  // Fechar arquivo do explorador
  const handleCloseFileFromExplorer = useCallback((fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    setConfirmModalData({ fileId, fileName: file.name, action: 'close' });
    setShowConfirmModal(true);
  }, [files]);

  // Excluir arquivo/pasta do explorador
  const handleDeleteFileFromExplorer = useCallback((fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    setConfirmModalData({ fileId, fileName: file.name, action: 'delete' });
    setShowConfirmModal(true);
  }, [files]);

  // Confirmar ação do modal
  const handleConfirmAction = useCallback(() => {
    if (!confirmModalData) return;

    const { fileId, action } = confirmModalData;

    if (action === 'close') {
      // Fechar todas as tabs relacionadas a este arquivo
      const tabsToClose = tabs.filter(t => t.fileId === fileId);
      tabsToClose.forEach(tab => {
        setTabs(prev => prev.filter(t => t.id !== tab.id));
      });

      // Remover o arquivo da lista
      setFiles(prev => prev.filter(f => f.id !== fileId));

      // Se o arquivo fechado era o ativo, selecionar outro
      if (activeTabId && tabsToClose.some(t => t.id === activeTabId)) {
        const remainingTabs = tabs.filter(t => t.fileId !== fileId);
        if (remainingTabs.length > 0) {
          setActiveTabId(remainingTabs[remainingTabs.length - 1].id);
        } else {
          setActiveTabId('');
        }
      }
    } else if (action === 'delete') {
      // Fechar tabs relacionadas
      const tabsToClose = tabs.filter(t => t.fileId === fileId);
      tabsToClose.forEach(tab => {
        setTabs(prev => prev.filter(t => t.id !== tab.id));
      });

      // Excluir arquivo e seus filhos (se for pasta)
      const deleteRecursive = (id: string) => {
        setFiles(prev => {
          const children = prev.filter(f => f.parentId === id);
          children.forEach(child => deleteRecursive(child.id));
          return prev.filter(f => f.id !== id);
        });
      };

      deleteRecursive(fileId);

      // Selecionar outra aba se necessário
      if (activeTabId && tabsToClose.some(t => t.id === activeTabId)) {
        const remainingTabs = tabs.filter(t => t.fileId !== fileId);
        if (remainingTabs.length > 0) {
          setActiveTabId(remainingTabs[remainingTabs.length - 1].id);
        } else {
          setActiveTabId('');
        }
      }
    }

    setShowConfirmModal(false);
    setConfirmModalData(null);
  }, [confirmModalData, tabs, activeTabId]);

  // Ações do preview
  const handlePreviewSelectAll = useCallback(() => {
    const previewElement = document.querySelector('.preview-content') as HTMLElement;
    if (previewElement) {
      const range = document.createRange();
      range.selectNodeContents(previewElement);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, []);

  const handlePreviewCopy = useCallback(() => {
    const previewElement = document.querySelector('.preview-content') as HTMLElement;
    if (previewElement) {
      const text = previewElement.innerText;
      navigator.clipboard.writeText(text);
    }
  }, []);

  // Menu de contexto
  const handleContextMenu = useCallback((e: React.MouseEvent, target: 'explorer' | 'editor' | 'preview', fileId?: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      target,
      fileId
    });
  }, []);
  
  const handleClearRecentFiles = useCallback(() => {
    setRecentFiles([]);
    localStorage.removeItem('dict-recent-files');
  }, []);

  // Inserir formatação no editor
  const insertFormatting = useCallback((before: string, after: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea || !activeTab) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = activeTab.content.substring(start, end);
    const newContent = activeTab.content.substring(0, start) + before + selectedText + after + activeTab.content.substring(end);
    handleContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
      updateCursorPosition();
    }, 0);
  }, [activeTab, handleContentChange, updateCursorPosition]);

  // Handler para clique no minimapa
  const handleMinimapClick = useCallback((percentage: number) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    const preview = document.querySelector('.preview-content') as HTMLDivElement;
    
    if (textarea) {
      const maxScroll = textarea.scrollHeight - textarea.clientHeight;
      textarea.scrollTop = percentage * maxScroll;
      textarea.focus();
    }
    
    if (preview) {
      const maxScroll = preview.scrollHeight - preview.clientHeight;
      preview.scrollTop = percentage * maxScroll;
    }
  }, []);

  const handleBold = () => insertFormatting('**', '**');
  const handleItalic = () => insertFormatting('*', '*');
  const handleUnderline = () => insertFormatting('<u>', '</u>');
  const handleCode = () => insertFormatting('`', '`');
  const handleLink = () => insertFormatting('[', '](url)');
  const handleList = () => insertFormatting('- ', '');
  const handleToggleWordWrap = () => setWordWrap(!wordWrap);

  const handleImageUpload = (file: File) => {
    if (!imgbbApiKey) {
      alert('Por favor, configure sua API Key do ImgBB nas configurações primeiro.');
      setShowSettings(true);
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const imageUrl = data.data.url;
          insertFormatting(`![Imagem](${imageUrl})`, '');
        } else {
          alert('Erro ao fazer upload da imagem: ' + data.error.message);
        }
      })
      .catch(error => {
        console.error('Erro no upload:', error);
        alert('Erro ao conectar com a API do ImgBB.');
      })
      .finally(() => {
        setIsUploadingImage(false);
      });
  };



  const extractSlides = (markdown: string): string[] => {
    const lines = markdown.split('\n');
    const slides: string[] = [];
    let currentSlide = '';

    for (const line of lines) {
      if (line.match(/^#{1,2}\s/)) {
        if (currentSlide.trim()) {
          slides.push(currentSlide.trim());
        }
        currentSlide = line + '\n';
      } else {
        currentSlide += line + '\n';
      }
    }

    if (currentSlide.trim()) {
      slides.push(currentSlide.trim());
    }

    return slides.length > 0 ? slides : [markdown];
  };

  const handleToggleSlides = () => {
    if (!activeTab) return;

    if (!isSlidesMode) {
      setCurrentSlideIndex(0);
      setIsSlidesMode(true);
      document.documentElement.requestFullscreen?.();
    } else {
      setIsSlidesMode(false);
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    }
  };

  const handleNextSlide = useCallback(() => {
    const slides = extractSlides(activeTab?.content || '');
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  }, [activeTab, currentSlideIndex]);

  const handlePrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  }, [currentSlideIndex]);



  // Handlers para submenu de Heading
  const handleHeadingMenu = (e: React.MouseEvent) => {
    const button = (e.target as HTMLElement).closest('button');
    if (button) {
      const rect = button.getBoundingClientRect();
      setHeadingMenuPosition({ x: rect.left, y: rect.bottom });
      setHeadingMenuOpen(!headingMenuOpen);
      setMermaidMenuOpen(false);
    }
  };

  const handleExportMenuToggle = (e: React.MouseEvent) => {
    const button = (e.target as HTMLElement).closest('button');
    if (button) {
      const rect = button.getBoundingClientRect();
      setExportMenuPosition({ x: rect.left, y: rect.bottom });
      setExportMenuOpen(!exportMenuOpen);
    }
  };

  const handleExportPDF = async () => {
    setExportMenuOpen(false);
    console.log('[PDF EXPORT] Initiated');
    if (!activeTab) {
      console.warn('[PDF EXPORT] No active tab to export.');
      return;
    }

    console.log('[PDF EXPORT] Active tab found:', activeTab.name);

    // Importações dinâmicas para não poluir o bundle principal
    console.log('[PDF EXPORT] Loading html2pdf.js and mermaid...');
    const html2pdf = (await import('html2pdf.js')).default;
    const mermaid = (await import('mermaid')).default;
    console.log('[PDF EXPORT] Libraries loaded.');

    const containerId = `pdf-render-temp-${Date.now()}`;
    const pdfContainer = document.createElement('div');

    try {
      // 1. Preparar conteúdo HTML
      const contentWithEmojis = convertEmojiShortcodes(activeTab.content);
      
      const renderer = new marked.Renderer();
      renderer.code = ({ text, lang }) => {
        const language = lang?.trim().toLowerCase();
        if (language === 'mermaid') {
          return `<div class="mermaid-target">${text}</div>`;
        }
        return `<pre><code class="language-${language}">${text}</code></pre>`;
      };

      const htmlContent = String(marked.parse(contentWithEmojis, { renderer }));

      // 2. Configurar container (não precisamos anexar ao DOM)
      pdfContainer.id = containerId;
      Object.assign(pdfContainer.style, {
        width: '180mm', // Considera A4 (210) menos as margens laterais (2x 15mm)
        backgroundColor: '#ffffff',
        color: '#24292e',
        padding: '0', // O padding interno é 0 pois html2pdf usará o margin nativo a cada página recortada
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      });

      pdfContainer.innerHTML = `
        <style>
          #${containerId} * { box-sizing: border-box; }
          #${containerId} { font-size: 14px; line-height: 1.6; color: #24292e; background: #fff; }
          #${containerId} * { page-break-inside: avoid; } /* Evita cortes no meio de qualquer linha de texto */
          #${containerId} h1, #${containerId} h2, #${containerId} h3 { color: #000; margin-top: 24px; margin-bottom: 16px; font-weight: 600; page-break-after: avoid; page-break-inside: avoid; }
          #${containerId} h1 { font-size: 2em; border-bottom: 2px solid #eaecef; padding-bottom: .3em; }
          #${containerId} h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: .3em; }
          #${containerId} h3 { font-size: 1.25em; }
          #${containerId} p { margin-top: 0; margin-bottom: 16px; page-break-inside: avoid; }
          #${containerId} a { color: #0366d6; }
          #${containerId} code { font-family: Consolas, "Liberation Mono", monospace; font-size: 0.85em; background: rgba(27,31,35,.05); padding: .2em .4em; border-radius: 3px; }
          #${containerId} pre { background: #f6f8fa; padding: 16px; border-radius: 6px; border: 1px solid #dfe2e5; margin-bottom: 16px; overflow: visible; white-space: pre-wrap; word-wrap: break-word; page-break-inside: avoid; }
          #${containerId} pre code { background: transparent; padding: 0; white-space: pre-wrap; word-wrap: break-word; }
          #${containerId} table { border-collapse: collapse; width: 100%; margin-bottom: 16px; page-break-inside: auto; }
          #${containerId} tr { page-break-inside: avoid; page-break-after: auto; }
          #${containerId} th, #${containerId} td { padding: 6px 13px; border: 1px solid #dfe2e5; }
          #${containerId} th { background: #f1f3f5; font-weight: 600; }
          #${containerId} tr:nth-child(even) { background: #f6f8fa; }
          #${containerId} blockquote { border-left: 4px solid #dfe2e5; padding: 8px 16px; margin: 0 0 16px 0; color: #6a737d; background: #f6f8fa; page-break-inside: avoid; }
          #${containerId} ul, #${containerId} ol { margin-bottom: 16px; padding-left: 2em; page-break-inside: auto; }
          #${containerId} li { margin-bottom: 6px; page-break-inside: avoid; }
          #${containerId} img { max-width: 100%; page-break-inside: avoid; }
          #${containerId} .mermaid-target { text-align: center; margin-bottom: 16px; page-break-inside: avoid; }
          #${containerId} hr { border: none; border-top: 1px solid #eaecef; margin: 24px 0; }
        </style>
        ${htmlContent}
      `;

      // 3. Renderizar diagramas Mermaid sem colocar no DOM
      console.log('[PDF EXPORT] Initializing Mermaid...');
      mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
      const mermaidEls = pdfContainer.querySelectorAll('.mermaid-target');
      console.log(`[PDF EXPORT] Found ${mermaidEls.length} mermaid diagrams`);
      for (let i = 0; i < mermaidEls.length; i++) {
        const el = mermaidEls[i];
        const def = el.textContent?.trim() || '';
        if (def) {
          try {
            const { svg } = await mermaid.render(`mermaid-pdf-${i}`, def);
            el.innerHTML = svg;
          } catch {
            el.textContent = '[diagrama não disponível]';
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      // 4. Gerar PDF
      console.log('[PDF EXPORT] Calling html2pdf().save()...');
      const opt = {
        margin: [15, 15], // 15mm no topo/baixo e 15mm na esquerda/direita para todas as páginas
        filename: `${activeTab.name.replace(/\.md$/, '')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // @ts-expect-error - html2pdf type issues
      await html2pdf().set(opt).from(pdfContainer).save();
      console.log('[PDF EXPORT] PDF generation completed successfully.');

    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao gerar o PDF. Verifique o console.');
    } finally {
      setExportMenuOpen(false);
    }
  };

  const handleExportHTML = () => {
    if (!activeTab) return;
    
    // Convert emojis first
    const contentWithEmojis = convertEmojiShortcodes(activeTab.content);
    
    // Ensure mermaid blocks are wrapped correctly for the script
    const renderer = new marked.Renderer();
    renderer.code = ({ text, lang }) => {
      const language = lang?.trim().toLowerCase();
      if (language === 'mermaid') {
        return `<div class="mermaid">${text}</div>`;
      }
      return `<pre><code class="language-${language}">${text}</code></pre>`;
    };

    const htmlContent = marked.parse(contentWithEmojis, { renderer });
    const fullHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${activeTab.name}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.7.0/styles/github.min.css">
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.2.4/dist/mermaid.min.js"></script>
    <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
          line-height: 1.6; 
          padding: 40px; 
          max-width: 900px; 
          margin: 0 auto; 
          color: #24292e;
          background-color: #ffffff;
        }
        h1, h2, h3 { border-bottom: 1px solid #eaecef; padding-bottom: .3em; }
        pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
        code { background: rgba(27,31,35,.05); padding: .2em .4em; border-radius: 3px; font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace; }
        pre code { background: transparent; padding: 0; }
        img { max-width: 100%; box-sizing: content-box; background-color: #fff; }
        table { border-spacing: 0; border-collapse: collapse; width: 100%; margin-top: 0; margin-bottom: 16px; }
        table th, table td { padding: 6px 13px; border: 1px solid #dfe2e5; }
        table tr { background-color: #fff; border-top: 1px solid #c6cbd1; }
        table tr:nth-child(2n) { background-color: #f6f8fa; }
        .mermaid { margin-bottom: 16px; display: flex; justify-content: center; }
    </style>
</head>
<body>
    <div class="markdown-body">
        ${htmlContent}
    </div>
    <script>
        mermaid.initialize({ 
          startOnLoad: true, 
          theme: 'default',
          securityLevel: 'loose'
        });
    </script>
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab.name}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMenuOpen(false);
  };

  const handleCopyHTML = async () => {
    if (!activeTab) return;
    const contentWithEmojis = convertEmojiShortcodes(activeTab.content);
    const htmlContent = marked.parse(contentWithEmojis);
    try {
      await navigator.clipboard.writeText(String(htmlContent));
      alert('HTML copiado para a área de transferência!');
      setExportMenuOpen(false);
    } catch (error) {
      console.error('Erro ao copiar HTML:', error);
    }
  };

  const handleToggleFullscreen = () => {
    setIsFullscreenMode(!isFullscreenMode);
    if (!isFullscreenMode) {
      setViewMode('preview');
    }
  };

  const handleShare = async (isPublic: boolean = true) => {
    if (!activeTab || !activeFile) return;
    
    if (!githubToken) {
      alert('Por favor, configure seu GitHub Token nas configurações para criar um Gist.');
      setShowSettings(true);
      return;
    }

    setSharingType(isPublic ? 'public' : 'private');
    setShareResult(null);

    try {
      const response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: `Documento compartilhado via dict: ${activeFile.name}`,
          public: isPublic,
          files: {
            [activeFile.name.endsWith('.md') ? activeFile.name : `${activeFile.name}.md`]: {
              content: activeTab.content
            }
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro API GitHub: ${response.status}`);
      }

      const data = await response.json();
      const gistUrl = data.html_url;
      
      setShareResult(gistUrl);
      await navigator.clipboard.writeText(gistUrl);
    } catch (error) {
      console.error('Erro ao criar Gist:', error);
      alert('Erro ao criar Gist: ' + (error instanceof Error ? error.message : 'Verifique seu token e conexão.'));
    } finally {
      setSharingType(null);
    }
  };

  const handleOpenShareModal = () => {
    setExportMenuOpen(false);
    setShowShareModal(true);
    setShareResult(null);
  };

  const handleInsertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageUpload(file);
      }
    };
    input.click();
  };

  const handleHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    insertFormatting(prefix, '');
    setHeadingMenuOpen(false);
  };

  // Handlers para submenu de Mermaid
  const handleMermaidMenu = (e: React.MouseEvent) => {
    const button = (e.target as HTMLElement).closest('button');
    if (button) {
      const rect = button.getBoundingClientRect();
      setMermaidMenuPosition({ x: rect.left, y: rect.bottom + 5 });
      setMermaidMenuOpen(!mermaidMenuOpen);
      setHeadingMenuOpen(false);
    }
  };

  const handleMermaid = (type: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea || !activeTab) return;

    const start = textarea.selectionStart;
    let mermaidTemplate = '';

    switch (type) {
      case 'flowchart':
        mermaidTemplate = `\n\`\`\`mermaid
flowchart TD
    A[Início] --> B{Decisão?}
    B -->|Sim| C[Ação 1]
    B -->|Não| D[Ação 2]
    C --> E[Fim]
    D --> E
\`\`\`\n`;
        break;
      case 'sequence':
        mermaidTemplate = `\n\`\`\`mermaid
sequenceDiagram
    participant C as Cliente
    participant A as API
    participant D as Database
    C->>A: Requisição
    A->>D: Query
    D-->>A: Dados
    A-->>C: Resposta
\`\`\`\n`;
        break;
      case 'class':
        mermaidTemplate = `\n\`\`\`mermaid
classDiagram
    class Animal {
        String name
        eat()
        sleep()
    }
    class Dog {
        bark()
    }
    Animal <|-- Dog
\`\`\`\n`;
        break;
      case 'pie':
        mermaidTemplate = `\n\`\`\`mermaid
pie title Navegadores
    "Chrome" : 60
    "Firefox" : 20
    "Safari" : 15
    "Outros" : 5
\`\`\`\n`;
        break;
      case 'gantt':
        mermaidTemplate = `\n\`\`\`mermaid
gantt
    title Projeto de Desenvolvimento
    dateFormat  YYYY-MM-DD
    section Planejamento
    Requisitos       :a1, 2024-01-01, 7d
    Design          :a2, after a1, 5d
    section Desenvolvimento
    Codificação     :a3, after a2, 14d
    Testes          :a4, after a3, 7d
\`\`\`\n`;
        break;
      case 'er':
        mermaidTemplate = `\n\`\`\`mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int id
        date createdAt
    }
    LINE-ITEM {
        int productId
        int quantity
        float price
    }
\`\`\`\n`;
        break;
      case 'journey':
        mermaidTemplate = `\n\`\`\`mermaid
journey
    title Jornada do Usuário
    section Pesquisa
      Encontrar produto: 5: Usuário
      Comparar preços: 4: Usuário
    section Compra
      Adicionar ao carrinho: 3: Usuário
      Finalizar compra: 2: Usuário
\`\`\`\n`;
        break;
      default:
        mermaidTemplate = `\n\`\`\`mermaid
graph TD
    A[Início] --> B[Fim]
\`\`\`\n`;
    }

    const newContent = activeTab.content.substring(0, start) + mermaidTemplate + activeTab.content.substring(textarea.selectionEnd);
    handleContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + mermaidTemplate.length;
      updateCursorPosition();
      setMermaidMenuOpen(false);
    }, 0);
  };

  const handleEmoji = () => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const rect = textarea.getBoundingClientRect();
    const cursorPos = textarea.selectionStart;
    
    // Calcular posição aproximada do cursor
    const textBeforeCursor = textarea.value.substring(0, cursorPos);
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines.length - 1;
    const currentCol = lines[lines.length - 1].length;
    
    // Posicionar o picker perto do cursor
    const lineHeight = 22.4; // 14px * 1.6 line-height
    const charWidth = 8.4; // aproximado para fonte 14px
    
    setEmojiPickerPosition({
      x: rect.left + 200 + (currentCol * charWidth),
      y: rect.top + 100 + (currentLine * lineHeight)
    });
    setShowEmojiPicker(true);
  };

  const handleInsertEmoji = (emojiId: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea || !activeTab) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    // Insere o shortcode no formato :emoji:
    const shortcode = `:${emojiId}:`;
    const newContent = activeTab.content.substring(0, start) + shortcode + activeTab.content.substring(end);
    handleContentChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + shortcode.length;
      updateCursorPosition();
    }, 0);
  };

  const charCount = activeTab?.content.length || 0;
  const lineCount = activeTab?.content.split('\n').length || 0;
  const wordCount = activeTab?.content.trim() ? activeTab.content.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200); // Média: 200 palavras por minuto

  // Atalhos de teclado globais
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Fechar modais com ESC
      if (e.key === 'Escape') {
        if (showConfirmModal) {
          e.preventDefault();
          setShowConfirmModal(false);
          setConfirmModalData(null);
          return;
        }
        if (showChangelog) {
          e.preventDefault();
          setShowChangelog(false);
          return;
        }
        if (showSettings) {
          e.preventDefault();
          setShowSettings(false);
          return;
        }
        if (showEmojiPicker) {
          e.preventDefault();
          setShowEmojiPicker(false);
          return;
        }
        if (showSearch) {
          e.preventDefault();
          setShowSearch(false);
          return;
        }
        if (showGoToLine) {
          e.preventDefault();
          setShowGoToLine(false);
          return;
        }
      }

      // Buscar (Ctrl+F)
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
        return;
      }

      // Substituir (Ctrl+H)
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        setShowSearch(true);
        return;
      }

      // Ir para Linha (Ctrl+G)
      if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        setShowGoToLine(true);
        setGoToLineNumber('');
        return;
      }

      // Modo Slides - ESC para sair
      if (e.key === 'Escape' && isSlidesMode) {
        e.preventDefault();
        setIsSlidesMode(false);
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
        return;
      }

      // Modo Slides - Setas para navegar
      if (isSlidesMode) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          handleNextSlide();
          return;
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          handlePrevSlide();
          return;
        }
      }

      // Alternar view mode (Ctrl+\)
      if (e.ctrlKey && e.key === '\\') {
        e.preventDefault();
        setViewMode(prev => prev === 'split' ? 'editor' : 'split');
      }

      // Salvar (Ctrl+S)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }

      // Alternar sidebar (Ctrl+Shift+E)
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        setActiveView(prev => prev === 'explorer' ? '' : 'explorer');
      }

      // Alternar configurações (Ctrl+,)
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        setShowSettings(prev => !prev);
      }

      // Formatar Documento (Shift+Alt+F)
      if (e.shiftKey && e.altKey && e.key === 'F') {
        e.preventDefault();
        handleFormatDocument();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch, showSettings, showChangelog, showEmojiPicker, showConfirmModal, showGoToLine, handleFormatDocument, handleSave, activeView, setViewMode, setActiveView, setShowSettings, setShowSearch, setShowGoToLine, setShowConfirmModal, isSlidesMode, handleNextSlide, handlePrevSlide]);

  return (
    <div className={`app-container ${isFullscreenMode ? 'fullscreen-mode' : ''}`}>
      {isFullscreenMode && (
        <button className="fullscreen-exit-btn" onClick={() => setIsFullscreenMode(false)}>
          <Presentation size={14} />
          <span>Sair do Fullscreen</span>
        </button>
      )}
      {/* Main Layout */}
      <div 
        className="main-layout"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag Overlay */}
        {isDragging && (
          <div className="drag-overlay">
            <div className="drag-message">
              <span style={{ fontSize: '48px' }}>📁</span>
              <p>Solte o arquivo aqui para abrir</p>
            </div>
          </div>
        )}

        {/* Activity Bar */}
        <ActivityBar
          activeView={activeView}
          onViewChange={setActiveView}
          onOpenSettings={() => setShowSettings(prev => !prev)}
          isSettingsOpen={showSettings}
        />

        {/* Sidebar */}
        {activeView === 'explorer' && (
          <div ref={explorerRef} onContextMenu={(e) => handleContextMenu(e, 'explorer')}>
            <Sidebar
              files={files}
              activeFile={activeTab?.fileId || null}
              onFileSelect={openFileInTab}
              onNewFile={handleNewFile}
              onNewFolder={handleNewFolder}
              onOpenFile={handleOpenFile}
              onRenameFile={handleRenameFile}
              onCloseFile={handleCloseFileFromExplorer}
              onDeleteFile={handleDeleteFileFromExplorer}
              onMoveToFolder={moveToFolder}
              recentFiles={recentFiles}
              onRecentFileSelect={(file) => {
                // Re-abrir arquivo recente
                const existingTab = tabs.find(t => t.fileId === file.id);
                if (existingTab) {
                  setActiveTabId(existingTab.id);
                } else {
                  // Adicionar arquivo aos arquivos atuais se não existir
                  const existingFile = files.find(f => f.id === file.id);
                  if (!existingFile) {
                    // Criar o arquivo na lista de files
                    const newFile: FileData = {
                      id: file.id,
                      name: file.name,
                      type: 'file',
                      content: file.content
                    };
                    setFiles(prev => [...prev, newFile]);
                  }
                  
                  const newTab: Tab = {
                    id: `tab-${file.id}`,
                    fileId: file.id,
                    name: file.name,
                    content: file.content || '',
                    isDirty: false
                  };
                  setTabs(prev => [...prev, newTab]);
                  setActiveTabId(newTab.id);
                }
              }}
              favoriteFiles={favoriteFiles}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        )}

        {/* Editor Area */}
        <div className="editor-area">
          {/* Tabs */}
          {tabs.length > 0 && (
            <Tabs
              tabs={tabs}
              activeTabId={activeTabId}
              onTabClick={setActiveTabId}
              onTabClose={closeTab}
            />
          )}

          {/* Toolbar */}
          <EditorToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onBold={handleBold}
            onItalic={handleItalic}
            onUnderline={handleUnderline}
            onHeading={handleHeadingMenu}
            onHeadingSelect={handleHeading}
            headingMenuOpen={headingMenuOpen}
            headingMenuPosition={headingMenuPosition}
            onCode={handleCode}
            onLink={handleLink}
            onList={handleList}
            onMermaid={handleMermaidMenu}
            onMermaidSelect={handleMermaid}
            mermaidMenuOpen={mermaidMenuOpen}
            mermaidMenuPosition={mermaidMenuPosition}
            onEmoji={handleEmoji}
            showMinimap={showMinimap}
            onToggleMinimap={() => setShowMinimap(!showMinimap)}
            onFormatDocument={handleFormatDocument}
            wordWrap={wordWrap}
            onToggleWordWrap={handleToggleWordWrap}
            onImageUpload={handleImageUpload}
            isUploadingImage={isUploadingImage}
            onExportPDF={handleExportPDF}
            onExportHTML={handleExportHTML}
            onFullscreen={handleToggleFullscreen}
            onToggleSlides={handleToggleSlides}
            onShare={handleOpenShareModal}
            exportMenuOpen={exportMenuOpen}
            onExportMenuToggle={handleExportMenuToggle}
            exportMenuPosition={exportMenuPosition}
          />

          {/* Editor Split View */}
          <div
            ref={editorRef}
            className={`editor-split view-${viewMode} ${showMinimap ? 'with-minimap' : ''}`}
          >
            {activeTab && (
              <>
                <div
                  className="editor-pane"
                  onContextMenu={(e) => handleContextMenu(e, 'editor')}
                >
                  <TextEditor
                    value={activeTab.content}
                    onChange={handleContentChange}
                    onSave={handleSave}
                    syncScroll={syncScroll}
                    onScrollSync={(percentage) => {
                      setScrollPercentage(percentage);
                      setScrollSource('editor');
                    }}
                    externalScrollPercentage={scrollSource === 'preview' ? scrollPercentage : undefined}
                    scrollSource={scrollSource}
                    searchQuery={searchQuery}
                    searchMatches={searchMatches}
                    currentMatchIndex={currentMatchIndex}
                    onScroll={(percentage) => {
                      setEditorScrollPercentage(percentage);
                    }}
                    wordWrap={wordWrap}
                  />
                </div>
                <div
                  className="preview-pane"
                  onContextMenu={(e) => handleContextMenu(e, 'preview')}
                >
                  <Preview
                    content={activeTab.content}
                    syncScroll={syncScroll}
                    onScrollSync={(percentage) => {
                      setScrollPercentage(percentage);
                      setScrollSource('preview');
                    }}
                    externalScrollPercentage={scrollSource === 'editor' ? scrollPercentage : undefined}
                    scrollSource={scrollSource}
                    theme={theme}
                    onScroll={(percentage) => {
                      setEditorScrollPercentage(percentage);
                    }}
                  />
                </div>
                {showMinimap && viewMode !== 'editor' && (
                  <div className="minimap-pane">
                    <Minimap
                      content={activeTab.content}
                      editorScrollPercentage={editorScrollPercentage}
                      onMinimapClick={handleMinimapClick}
                    />
                  </div>
                )}
              </>
            )}
            {!activeTab && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                <div style={{ textAlign: 'center' }}>
                  <p>Nenhum arquivo aberto</p>
                  <p style={{ fontSize: '12px', marginTop: '8px' }}>Crie um novo arquivo ou abra um existente</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="modal-overlay" onClick={() => setShowSettings(false)} style={{ justifyContent: 'flex-end', background: 'transparent' }}>
            <div onClick={(e) => e.stopPropagation()} style={{ height: '100%' }}>
              <SettingsPanel
                theme={theme}
                onThemeChange={setTheme}
                onClose={() => setShowSettings(false)}
                onOpenChangelog={() => setShowChangelog(true)}
                syncScroll={syncScroll}
                onSyncScrollChange={() => setSyncScroll(!syncScroll)}
                autoSave={autoSaveEnabled}
                onAutoSaveChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                imgbbApiKey={imgbbApiKey}
                onImgbbApiKeyChange={setImgbbApiKey}
                githubToken={githubToken}
                onGithubTokenChange={setGithubToken}
              />
            </div>
          </div>
        )}

        {/* Changelog Modal */}
        {showChangelog && (
          <ChangelogModal
            changelog={CHANGELOG}
            onClose={() => setShowChangelog(false)}
          />
        )}

        {/* Confirm Modal */}
        {showConfirmModal && confirmModalData && (
          <ConfirmModal
            title={confirmModalData.action === 'delete' ? 'Excluir arquivo' : 'Fechar arquivo'}
            message={
              confirmModalData.action === 'delete'
                ? `Tem certeza que deseja excluir "${confirmModalData.fileName}"? ${files.find(f => f.id === confirmModalData.fileId)?.type === 'folder' ? 'Todos os arquivos dentro desta pasta também serão excluídos.' : ''}`
                : `Deseja realmente fechar "${confirmModalData.fileName}"?`
            }
            confirmText={confirmModalData.action === 'delete' ? 'Excluir' : 'Fechar'}
            cancelText="Cancelar"
            onConfirm={handleConfirmAction}
            onCancel={() => {
              setShowConfirmModal(false);
              setConfirmModalData(null);
            }}
          />
        )}

        {/* Search Bar */}
        {showSearch && activeTab && (
          <SearchBar
            onSearch={handleSearch}
            onReplace={handleReplace}
            onReplaceOne={handleReplaceOne}
            onReplaceAll={handleReplaceAll}
            onClose={handleCloseSearch}
            totalMatches={searchMatches.length}
            currentIndex={currentMatchIndex}
            onFindNext={handleFindNext}
            onFindPrevious={handleFindPrevious}
          />
        )}

        {/* Go to Line Modal */}
        {showGoToLine && (
          <div className="modal-overlay" onClick={() => setShowGoToLine(false)}>
            <div className="go-to-line-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Ir para Linha</h3>
              <input
                type="number"
                className="go-to-line-input"
                placeholder="Número da linha"
                value={goToLineNumber}
                onChange={(e) => setGoToLineNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleGoToLine();
                  } else if (e.key === 'Escape') {
                    setShowGoToLine(false);
                  }
                }}
                autoFocus
              />
              <div className="go-to-line-actions">
                <button className="btn btn-secondary" onClick={() => setShowGoToLine(false)}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleGoToLine}>
                  Ir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <EmojiPickerComponent
            onSelectEmoji={handleInsertEmoji}
            onClose={() => setShowEmojiPicker(false)}
            position={emojiPickerPosition}
          />
        )}

        {/* Slides Mode */}
        {isSlidesMode && activeTab && (
          <div className="presentation-overlay">
            <div className="presentation-content">
              <Preview
                content={extractSlides(activeTab.content)[currentSlideIndex]}
                syncScroll={false}
                theme={theme}
                scrollSource={null}
              />
            </div>
            <div className="presentation-controls">
              <button 
                className="presentation-btn" 
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0}
              >
                ← Anterior
              </button>
              <span className="presentation-counter">
                {currentSlideIndex + 1} / {extractSlides(activeTab.content).length}
              </span>
              <button 
                className="presentation-btn" 
                onClick={handleNextSlide}
                disabled={currentSlideIndex === extractSlides(activeTab.content).length - 1}
              >
                Próximo →
              </button>
              <button 
                className="presentation-btn presentation-exit" 
                onClick={handleToggleSlides}
              >
                Sair (ESC)
              </button>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
            <div className="share-modal confirm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-modal-header">
                <h3>Compartilhar via GitHub Gist</h3>
                <button className="modal-close" onClick={() => setShowShareModal(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className="confirm-modal-body">
                {!githubToken ? (
                  <div className="share-warning">
                    <p>Você precisa configurar um GitHub Personal Access Token nas Configurações para compartilhar.</p>
                    <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={() => { setShowShareModal(false); setShowSettings(true); }}>
                      Abrir Configurações
                    </button>
                  </div>
                ) : shareResult ? (
                  <div className="share-success">
                    <div className="success-icon">✓</div>
                    <p>Gist criado com sucesso!</p>
                    <div className="share-link-container">
                      <input type="text" readOnly value={shareResult} className="share-link-input" />
                      <button 
                        className="btn btn-primary" 
                        onClick={() => {
                          navigator.clipboard.writeText(shareResult);
                          // Poderíamos adicionar um estado de feedback aqui
                        }}
                      >
                        Copiar
                      </button>
                    </div>
                    <a href={shareResult} target="_blank" rel="noopener noreferrer" className="view-link">
                      Visualizar no GitHub
                    </a>
                  </div>
                ) : (
                  <div className="share-options">
                    <p>Escolha o tipo de compartilhamento para <strong>{activeFile?.name}</strong>:</p>
                    <div className="share-info" style={{ marginTop: '8px', marginBottom: '16px' }}>
                      <p>Gists privados não aparecem em buscas, mas qualquer pessoa com o link poderá visualizar.</p>
                    </div>
                    <div className="confirm-modal-footer" style={{ padding: 0, marginTop: '20px', justifyContent: 'center', background: 'none', borderTop: 'none' }}>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleShare(false)}
                        disabled={sharingType !== null}
                      >
                        {sharingType === 'private' ? <Loader2 size={14} className="animate-spin" /> : 'Gist Privado'}
                      </button>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleShare(true)}
                        disabled={sharingType !== null}
                      >
                        {sharingType === 'public' ? <Loader2 size={14} className="animate-spin" /> : 'Gist Público'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <StatusBar
        fileName={activeFile?.name || ''}
        charCount={charCount}
        wordCount={wordCount}
        lineCount={lineCount}
        column={cursorPosition.column}
        line={cursorPosition.line}
        isDirty={activeTab?.isDirty ?? false}
        lastSavedTime={lastSavedTime}
        readingTime={readingTime}
      />


      {/* Context Menu */}
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          target={contextMenu.target}
          fileId={contextMenu.fileId}
          onRename={(fileId) => {
            const file = files.find(f => f.id === fileId);
            if (file) {
              const newName = prompt('Novo nome:', file.name);
              if (newName && newName !== file.name) {
                handleRenameFile(fileId, newName);
              }
            }
            setContextMenu(prev => ({ ...prev, visible: false }));
          }}
          onDuplicate={handleDuplicateFile}
          onClose={handleCloseFile}
          onNewFile={handleNewFile}
          onOpenFile={handleOpenFile}
          onClearRecentFiles={handleClearRecentFiles}
          editorActions={{
            bold: handleBold,
            italic: handleItalic,
            underline: handleUnderline,
            heading: () => handleHeading(2),
            code: handleCode,
            link: handleLink,
            image: handleInsertImage,
            list: handleList,
            mermaid: () => handleMermaid('flowchart'),
            format: handleFormatDocument,
            emoji: () => setShowEmojiPicker(true)
          }}
          previewActions={{
            selectAll: handlePreviewSelectAll,
            copy: handlePreviewCopy
          }}
        />
      )}
    </div>
  );
}

export default App;
