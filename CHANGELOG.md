# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [0.0.5] - 2024 - Busca, Substituição e Navegação Avançada

### 🎉 Novas Funcionalidades

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

### ✨ Melhorias de UX

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

### 🐛 Correções

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

## [0.0.4] - Emojis, Submenus e Melhorias de UX

### 🎉 Novas Funcionalidades

#### Suporte a Emojis
- Picker de emojis com busca e categorias
- +400 emojis comuns disponíveis
- Shortcodes no formato `:emoji:` (ex: `:joy:`, `:smile:`)
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

### ✨ Melhorias de UX

#### Atalhos de Teclado
- **ESC**: Fecha qualquer modal (Settings, Changelog, Emoji Picker, Confirmação)
- **Ctrl+,**: Alterna painel de configurações (abre/fecha)
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

### 🐛 Correções
- Diagramas Mermaid ER e Class funcionando
- Auto-save sem loop infinito
- Linha/coluna atualizando em tempo real
- Submenus não fecham ao clicar

---

## [0.0.3] - Auto-save, Syntax Highlighting e Identidade Visual

### 🎉 Novas Funcionalidades

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

### 🔧 Melhorias Técnicas
- Preview com debounce de 500ms
- Scroll sync otimizado
- Lazy initialization do estado
- Custom renderer para Markdown
- Integração com Mermaid mantida

### 🐛 Correções
- Scrollbar do preview não se mexe mais ao digitar
- Auto-save sem loop infinito
- Dirty indicator atualizado corretamente

---

## [0.0.2] - Sincronização de Scroll

### 🎉 Novas Funcionalidades

#### Sincronização de Scroll
- Scroll sincronizado entre editor e preview
- Botão "Sync Scroll" na toolbar para ativar/desativar
- Rolagem simultânea em ambos os painéis no modo split
- Algoritmo de sincronização baseado em porcentagem

#### Melhorias de Interface
- Removido seletor de tema da toolbar principal
- Tema agora acessível apenas pelo painel de Configurações
- Toolbar mais limpa e focada em edição

### 🐛 Correções
- Sincronização de scroll bidirecional totalmente revisada
- Prevenção de conflitos de scroll entre painéis
- Correção do canto das scrollbars (scrollbar corner)
- Melhoria na renderização de diagramas Mermaid
- Validação de sintaxe Mermaid com mensagens de erro claras
- Suporte a tema claro/escuro nos diagramas Mermaid

---

## [0.0.1] - Lançamento Inicial

### 🎉 Funcionalidades Implementadas

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
- Informações sobre o aplicativo
