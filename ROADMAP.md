# 🗺️ Roadmap de Desenvolvimento - dict

Este documento contém o planejamento de desenvolvimento do **dict** desde a versão atual até a versão 1.0.0.

---

## 📊 Status Atual

| Versão | Status       | Data                               |
| ------ | ------------ | ---------------------------------- |
| 0.1.0  | ✅ Completa  | Lançamento Inicial                 |
| 0.2.0  | ✅ Completa  | Sincronização de Scroll            |
| 0.3.0  | ✅ Completa  | Auto-save e Identidade Visual      |
| 0.4.0  | ✅ Completa  | Emojis e Submenus                  |
| 0.5.0  | ✅ Completa  | Busca, Substituição e Navegação    |
| 0.6.0  | ✅ Completa  | Gerenciamento de Arquivos e Pastas |
| 0.7.0  | ✅ Completa  | Março 2026                         |
| 0.8.0  | 📋 Planejada | Exportação e Compartilhamento      |
| 0.9.0  | 📋 Planejada | Personalização                     |
| 1.0.0  | 📋 Planejada | Release Estável                    |

---

## 🎯 Versão 0.6.0 - COMPLETA ✅

### Gerenciamento de Arquivos e Organização por Pastas

**Funcionalidades Implementadas:**

| Feature                | Descrição                      | Status |
| ---------------------- | ------------------------------ | ------ |
| Arrastar e Soltar      | Importar arquivos arrastando   | ✅     |
| Histórico Recentes     | Últimos 10 arquivos abertos    | ✅     |
| Favoritos              | Marcar arquivos favoritos      | ✅     |
| Organização por Pastas | Estrutura hierárquica          | ✅     |
| Renomear               | Botão ✏️ para renomear         | ✅     |
| Excluir                | Botão 🗑️ com modal customizado | ✅     |

**Benefícios:**

- Fluxo de trabalho mais natural
- Acesso rápido a arquivos frequentes
- Melhor organização de projetos
- Interface padronizada sem cores vermelhas

**Duração Real:** 1-2 semanas

---

## 🎯 Versão 0.7.0 - COMPLETA ✅

**Foco:** Recursos profissionais de edição e robustez do sistema

| Feature            | Descrição                             | Prioridade | Status |
| ------------------ | ------------------------------------- | ---------- | ------ |
| Minimapa Smart     | Visão geral com visibilidade dinâmica | 🔴 Alta    | ✅     |
| Auto-complete      | Sugestões de sintaxe e +800 emojis    | 🔴 Alta    | ✅     |
| Formatar Documento | Padronização e limpeza de espaços     | 🟡 Média   | ✅     |
| Persistência Total | Salvar abas, estado e workspace       | 🔴 Alta    | ✅     |
| Context Menus      | Atalhos rápidos no editor e explorer  | 🟡 Média   | ✅     |

**Benefícios:**

- Edição profissional fluida e assistida
- Recuperação instantânea de workspace após crash/reload
- Markdown padronizado seguindo boas práticas
- Interface limpa com seções colapsáveis na sidebar

**Duração Estimada:** 2 semanas

---

### Versão 0.8.0 - Exportação e Compartilhamento

**Foco:** Compartilhar e exportar documentos

| Feature           | Descrição                       | Prioridade | Status |
| ----------------- | ------------------------------- | ---------- | ------ |
| Exportar PDF      | Gerar PDF do Markdown           | 🔴 Alta    | 📋     |
| Exportar HTML     | HTML standalone                 | 🔴 Alta    | 📋     |
| Modo Apresentação | Fullscreen no preview           | 🟡 Média   | 📋     |
| Copiar como HTML  | Copiar formatado para clipboard | 🟡 Média   | 📋     |
| Compartilhar Link | Exportar para gist/cloud        | 🟢 Baixa   | 📋     |

**Benefícios:**

- Compartilhamento profissional de documentos
- Múltiplos formatos de saída
- Apresentações diretas do editor

**Duração Estimada:** 1-2 semanas

---

### Versão 0.9.0 - Personalização

**Foco:** Customização da experiência

| Feature                 | Descrição                        | Prioridade | Status |
| ----------------------- | -------------------------------- | ---------- | ------ |
| Fontes Customizáveis    | Escolher fonte do editor         | 🔴 Alta    | 📋     |
| Tamanho da Fonte        | Ajuste fino                      | 🔴 Alta    | 📋     |
| Atalhos Personalizáveis | Remapear teclas                  | 🟡 Média   | 📋     |
| Tema Customizado        | Criar/editar temas               | 🟡 Média   | 📋     |
| Layouts Salvos          | Salvar configuração de workspace | 🟢 Baixa   | 📋     |

**Benefícios:**

- Experiência personalizada
- Acessibilidade melhorada
- Conforto em longas sessões

**Duração Estimada:** 1-2 semanas

---

### Versão 1.0.0 - Release Estável 🎉

**Foco:** Polimento e estabilidade

| Feature        | Descrição                     | Status |
| -------------- | ----------------------------- | ------ |
| PWA Support    | Instalar como app, offline    | 📋     |
| Performance    | Otimizações gerais            | 📋     |
| Bug Fixes      | Correção de issues reportados | 📋     |
| Documentação   | README, wiki, tutoriais       | 📋     |
| Testes         | Suite de testes automatizados | 📋     |
| Acessibilidade | WCAG compliance básico        | 📋     |

**Critérios para Release:**

- ✅ Todas as features anteriores implementadas
- ✅ Zero bugs críticos
- ✅ Documentação completa
- ✅ Performance aceitável (< 3s load time)
- ✅ Funciona offline (PWA)

**Duração Estimada:** 2 semanas

---

## 📅 Cronograma Geral

```
┌─────────────────────────────────────────────────────────────┐
│  Semana  │  Versão  │  Foco                                │
├──────────┼──────────┼──────────────────────────────────────┤
│  1-2     │  0.6.0   │  Gerenciamento de Arquivos ✅        │
│  3-4     │  0.7.0   │  Editor Avançado ✅                 │
│  5-6     │  0.8.0   │  Exportação e Compartilhamento       │
│  7-8     │  0.9.0   │  Personalização                      │
│  9-10    │  1.0.0   │  Release Estável + Polimento         │
└─────────────────────────────────────────────────────────────┘

Total: 10 semanas (~2.5 meses) até a versão 1.0.0
```

---

1. **Minimapa, Auto-complete e Formatação** (v0.7.0 ✅)
   - Visão geral, sugestões inteligentes e padronização.

2. **Persistência de Workspace** (v0.7.0 ✅)
   - Abas e estado do editor salvos no recarregamento.

---

## 📝 Notas de Desenvolvimento

### Prioridades

- 🔴 **Alta**: Essencial para a versão
- 🟡 **Média**: Importante mas pode esperar
- 🟢 **Baixa**: Nice to have

### Status

- 📋 Planejado
- 🔄 Em Desenvolvimento
- ✅ Completo
- ❌ Cancelado

---

## 🎯 Visão de Longo Prazo (Pós 0.1.0)

### Versão 0.2.0 - Colaboração

- Edição em tempo real
- Comentários e sugestões
- Histórico de versões

### Versão 0.3.0 - Integrações

- GitHub/GitLab integration
- Cloud sync (Google Drive, Dropbox)
- Plugins e extensões

### Versão 1.0.0 - Release Final

- Todos os recursos estáveis
- Documentação completa
- Comunidade ativa

---

---

## 📂 Backlog (Sem versão definida)

| Feature    | Descrição                           | Status |
| ---------- | ----------------------------------- | ------ |
| Snippets   | Templates de Markdown pré-definidos | 📋     |
| Breadcrumb | Navegação hierárquica               | 📋     |

**Última Atualização:** Março 2026
**Versão Atual:** 0.7.0
**Próxima Versão:** 0.8.0 - Exportação e Compartilhamento
