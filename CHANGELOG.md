# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [0.8.0] - 2026-03-08

### 🚀 Exportação e Compartilhamento

- **Exportar para PDF**: Agora com suporte aprimorado a temas (Light/Nord), controle de quebras de página e renderização fiel de diagramas.
- **Exportar para HTML**: Nova opção de exportação standalone que preserva estilos, emojis e diagramas Mermaid.
- **Compartilhamento via Gist**: Integração direta com a API do GitHub para criar Gists públicos ou privados instantaneamente.

### 📝 Melhorias no Editor

- **Texto Sublinhado**: Implementado suporte à tag `<u>` com botão na toolbar e atalho `Ctrl+U`.
- **Quebra de Linha Automática**: Adicionado toggle de "Word Wrap" para melhor visualização de parágrafos longos.
- **Upload de Imagens**: Integração com ImgBB permitindo o upload direto de arquivos locais para a nuvem.

### ✨ UX & Correções

- **Navegação de Modais**: Corrigida a lógica da pilha de modais ao usar a tecla ESC.
- **Configurações Inteligentes**: O painel lateral agora se comporta como um modal, fechando ao clicar na área externa.
- **Refatoração Interna**: Remoção de bugs de importação e otimização de renderização no preview.

---

## [0.7.1] - 2026-03-07

### 🐛 Correções de UX e Modais

- Modais agora fecham na ordem correta (inversa à abertura) ao pressionar ESC.
- O painel de Configurações agora fecha ao clicar fora dele (comportamento de modal).
- Adicionado suporte a ESC no modal "Ir para Linha" de forma consistente.

---

## [0.7.0] - Editor Avançado e Persistência de Workspace

### 🎉 Novas Funcionalidades

#### Auto-complete Inteligente

- Sugestões automáticas de sintaxe Markdown (#, -, \*, etc.)
- Autocomplete de emojis ao digitar `:` com suporte a mais de 800 shortcodes
- Seleção com Enter/Tab e navegação intuitiva com setas do teclado
- Suporte a ícones visuais nas sugestões de emojis para facilitar a escolha

#### Formatação de Documento

- Novo botão "Formatar Documento" na toolbar para padronização instantânea
- Atalho global `Shift+Alt+F` para acessibilidade rápida
- Limpeza inteligente de espaços extras no final de cada linha
- Normalização de títulos (garante espaço após o símbolo `#`) e parágrafos

#### Persistência de Workspace

- As abas abertas agora são totalmente salvas e restauradas ao atualizar a página
- A aba ativa também é persistida no `localStorage`, mantendo o fluxo de trabalho
- Sincronização automática para evitar referências a arquivos que foram excluídos ou renomeados

#### Interface e Contexto

- Opção **"Limpar Arquivos Recentes"** adicionada ao menu de contexto do explorador
- Opção **"Inserir Emoji"** adicionada ao botão direito dentro do editor
- Opção **"Formatar Documento"** integrada ao menu de contexto e toolbar lateral
- As seções **"Recentes"** e **"Favoritos"** na sidebar agora podem ser recolhidas para economizar espaço
- Estado de expansão (aberto/fechado) é persistido individualmente no `localStorage`

### ✨ Melhorias de UX

#### Refinamento de Emojis

- Suporte a shortcodes modernos (`:warning:`, `:fire:`, `:sparkles:`, etc.) no preview
- Inserção via picker agora utiliza obrigatoriamente códigos Markdown (ex: `:smile:`)
- Gatilho do autocomplete `:` aprimorado com regex para evitar disparos falsos durante a escrita normal

#### Minimapa Inteligente

- Visibilidade condicionada inteligentemente ao modo Preview (Split/Preview)
- Posicionamento dinâmico à direita da tela, evitando obstrução do texto

### 🐛 Correções

- Resolvido bug onde o autocomplete disparava erroneamente ao fechar um código de emoji
- Corrigida a inserção de emojis através da barra de tarefas que apresentava falhas intermitentes
- Limpeza profunda de estados obsoletos e otimização significativa de performance no `App.tsx`
- Sincronização de scroll aprimorada para lidar com conteúdos formatados dinamicamente

---

### 🎉 Novas Funcionalidades

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

### ✨ Melhorias de UX

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

### 🐛 Correções

#### Bug do Renomear

- Input de renomear funcionando corretamente
- Enter salva, Escape cancela
- Blur salva automaticamente

#### Bug do Drag & Drop

- Overlay não fica aberto após drop
- Eventos não borbulham para main-layout
- Só processa drag do sidebar ou externo

---

## [0.5.0] - Busca, Substituição e Navegação Avançada

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

## [0.4.0] - Emojis, Submenus e Melhorias de UX

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

## [0.3.0] - Auto-save, Syntax Highlighting e Identidade Visual

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

## [0.2.0] - Sincronização de Scroll

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

## [0.1.0] - Lançamento Inicial

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
