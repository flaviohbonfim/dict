# 🗺️ Roadmap de Desenvolvimento - dict

Este documento contém o planejamento de desenvolvimento do **dict** desde a versão atual até a versão 1.0.0.

---

## 📊 Status Atual

| Versão | Status | Data |
|--------|--------|------|
| 0.0.1 | ✅ Completa | Lançamento Inicial |
| 0.0.2 | ✅ Completa | Sincronização de Scroll |
| 0.0.3 | ✅ Completa | Auto-save e Identidade Visual |
| 0.0.4 | ✅ Completa | Emojis e Submenus |
| 0.0.5 | ✅ Completa | Busca, Substituição e Navegação |
| 0.0.6 | ✅ Completa | Gerenciamento de Arquivos e Pastas |
| 0.0.7 | 📋 Planejada | Editor Avançado |
| 0.0.8 | 📋 Planejada | Exportação e Compartilhamento |
| 0.0.9 | 📋 Planejada | Personalização |
| 0.1.0 | 📋 Planejada | Release Estável |

---

## 🎯 Versão 0.0.6 - COMPLETA ✅

### Gerenciamento de Arquivos e Organização por Pastas

**Funcionalidades Implementadas:**

| Feature | Descrição | Status |
|---------|-----------|--------|
| Arrastar e Soltar | Importar arquivos arrastando | ✅ |
| Histórico Recentes | Últimos 10 arquivos abertos | ✅ |
| Favoritos | Marcar arquivos favoritos | ✅ |
| Organização por Pastas | Estrutura hierárquica | ✅ |
| Renomear | Botão ✏️ para renomear | ✅ |
| Excluir | Botão 🗑️ com modal customizado | ✅ |

**Benefícios:**
- Fluxo de trabalho mais natural
- Acesso rápido a arquivos frequentes
- Melhor organização de projetos
- Interface padronizada sem cores vermelhas

**Duração Real:** 1-2 semanas

---

## 🎯 Próximas Versões

### Versão 0.0.7 - Editor Avançado

**Foco:** Recursos profissionais de edição

| Feature | Descrição | Prioridade | Status |
|---------|-----------|------------|--------|
| Minimapa | Visão geral do documento | 🔴 Alta | 📋 |
| Snippets | Templates de Markdown pré-definidos | 🔴 Alta | 📋 |
| Auto-complete | Sugestões de sintaxe Markdown | 🟡 Média | 📋 |
| Formatar Documento | Padronizar formatação | 🟡 Média | 📋 |
| Breadcrumb | Navegação hierárquica | 🟢 Baixa | 📋 |

**Benefícios:**
- Edição mais rápida com snippets
- Visão geral de documentos longos
- Markdown consistente e padronizado

**Duração Estimada:** 2 semanas

---

### Versão 0.0.8 - Exportação e Compartilhamento

**Foco:** Compartilhar e exportar documentos

| Feature | Descrição | Prioridade | Status |
|---------|-----------|------------|--------|
| Exportar PDF | Gerar PDF do Markdown | 🔴 Alta | 📋 |
| Exportar HTML | HTML standalone | 🔴 Alta | 📋 |
| Modo Apresentação | Fullscreen no preview | 🟡 Média | 📋 |
| Copiar como HTML | Copiar formatado para clipboard | 🟡 Média | 📋 |
| Compartilhar Link | Exportar para gist/cloud | 🟢 Baixa | 📋 |

**Benefícios:**
- Compartilhamento profissional de documentos
- Múltiplos formatos de saída
- Apresentações diretas do editor

**Duração Estimada:** 1-2 semanas

---

### Versão 0.0.9 - Personalização

**Foco:** Customização da experiência

| Feature | Descrição | Prioridade | Status |
|---------|-----------|------------|--------|
| Fontes Customizáveis | Escolher fonte do editor | 🔴 Alta | 📋 |
| Tamanho da Fonte | Ajuste fino | 🔴 Alta | 📋 |
| Atalhos Personalizáveis | Remapear teclas | 🟡 Média | 📋 |
| Tema Customizado | Criar/editar temas | 🟡 Média | 📋 |
| Layouts Salvos | Salvar configuração de workspace | 🟢 Baixa | 📋 |

**Benefícios:**
- Experiência personalizada
- Acessibilidade melhorada
- Conforto em longas sessões

**Duração Estimada:** 1-2 semanas

---

### Versão 0.1.0 - Release Estável 🎉

**Foco:** Polimento e estabilidade

| Feature | Descrição | Status |
|---------|-----------|--------|
| PWA Support | Instalar como app, offline | 📋 |
| Performance | Otimizações gerais | 📋 |
| Bug Fixes | Correção de issues reportados | 📋 |
| Documentação | README, wiki, tutoriais | 📋 |
| Testes | Suite de testes automatizados | 📋 |
| Acessibilidade | WCAG compliance básico | 📋 |

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
│  1-2     │  0.0.6   │  Gerenciamento de Arquivos ✅        │
│  3-4     │  0.0.7   │  Editor Avançado                     │
│  5-6     │  0.0.8   │  Exportação e Compartilhamento       │
│  7-8     │  0.0.9   │  Personalização                      │
│  9-10    │  0.1.0   │  Release Estável + Polimento         │
└─────────────────────────────────────────────────────────────┘

Total: 10 semanas (~2.5 meses) até a versão 0.1.0
```

---

## 🚀 Próximos Passos Imediatos

### Para Versão 0.0.7:

1. **Minimapa** (Prioridade Máxima)
   - Implementar visão geral do documento
   - Scroll sincronizado com editor
   - Highlight da área visível

2. **Snippets** (Prioridade Alta)
   - Templates de Markdown pré-definidos
   - Atalhos para inserção rápida
   - Snippets customizáveis

3. **Auto-complete** (Prioridade Média)
   - Sugestões de sintaxe Markdown
   - Headers, listas, code blocks
   - Trigger automático ou manual

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

**Última Atualização:** Março 2024
**Versão Atual:** 0.0.6
**Próxima Versão:** 0.0.7 - Editor Avançado
