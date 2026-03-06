# dict - editor de markdown

<div align="center">

![Versão](https://img.shields.io/badge/versão-0.0.5-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646cff)

**Editor de Markdown moderno com identidade visual exclusiva, suporte a emojis, diagramas Mermaid e muito mais!**

[📋 Changelog](CHANGELOG.md)

</div>

---

## 📖 Sobre o dict

O **dict** é um editor de Markdown leve e moderno, inspirado no VS Code, desenvolvido com React, TypeScript e Vite. Oferece uma experiência de edição rica com recursos como:

- ✍️ **Editor Markdown** com preview em tempo real
- 😊 **Suporte a Emojis** com picker integrado (+400 emojis)
- 📊 **Diagramas Mermaid** (fluxograma, sequência, classes, etc.)
- 🎨 **Temas Customizados** (Dict Nord e Dict Light)
- 💾 **Auto-save** com persistência no localStorage
- ⌨️ **Atalhos de Teclado** para produtividade
- 🔍 **Syntax Highlighting** para blocos de código
- 📑 **Sistema de Abas** para múltiplos arquivos
- 🎯 **Scroll Sincronizado** entre editor e preview

---

## 🚀 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- npm ou yarn

### Passos

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/dict.git
   cd dict
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Abra no navegador:**
   ```
   http://localhost:5173
   ```

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Compila o projeto para produção |
| `npm run preview` | Visualiza a build de produção |
| `npm run lint` | Executa o linter ESLint |

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl + S` | Salvar arquivo |
| `Ctrl + B` | Negrito |
| `Ctrl + I` | Itálico |
| `Ctrl + H` | Título |
| `Ctrl + K` | Código inline |
| `Ctrl + L` | Link |
| `Ctrl + U` | Lista |
| `Ctrl + \` | Alternar view (split/editor/preview) |
| `Ctrl + Shift + E` | Alternar explorador |
| `Ctrl + ,` | Abrir/Fechar configurações |
| `ESC` | Fechar modais |
| `Ctrl + Z` | Desfazer alteração |

---

## 🎨 Temas

O dict possui dois temas exclusivos:

### Dict Nord (Padrão)
- Tema escuro com tons de azul-acinzentado
- Inspirado no popular tema Nord
- Ideal para uso noturno

### Dict Light
- Tema claro e suave
- Perfeito para ambientes bem iluminados
- Alto contraste para melhor legibilidade

**Para trocar:** Abra Configurações (Ctrl+,) → Selecione o tema desejado

---

## 📝 Recursos

### Editor
- Numeração de linhas
- Detecção de alterações não salvas
- Múltiplas abas
- Auto-save opcional

### Preview
- Renderização em tempo real
- Scroll sincronizado com o editor
- Diagramas Mermaid
- Syntax highlighting para código

### Emojis
- Picker com +400 emojis
- Busca por categoria
- Shortcodes no formato `:emoji:`
- Categorias: Smileys, Pessoas, Animais, Comida, Atividades, Viagem

### Mermaid
Suporte a 7 tipos de diagramas com exemplos prontos:
- Flowchart (Fluxograma)
- Sequence (Sequência)
- Class (Classes)
- Pie (Pizza)
- Gantt (Timeline)
- ER (Entidade Relacionamento)
- Journey (Jornada do Usuário)

---

## 🔧 Configuração de Debug (VS Code)

### 1. Instale a extensão

Instale a extensão **"Debugger for Chrome"** ou use o debugger built-in do VS Code.

### 2. Configure o launch.json

O arquivo `.vscode/launch.json` já está configurado com 2 opções:
- **Dict: Debug no Chrome**
- **Dict: Debug no Edge**

### 3. Como usar

**Opção 1 - Iniciar manualmente:**

1. No terminal, execute:
   ```bash
   npm run dev
   ```

2. Pressione **F5** no VS Code
3. Selecione **"Dict: Debug no Chrome"**
4. O Chrome abrirá automaticamente em `http://localhost:5173`

**Opção 2 - Usando breakpoints:**

1. Abra um arquivo `.tsx` ou `.ts`
2. Clique na margem esquerda para adicionar breakpoints (ponto vermelho)
3. Pressione **F5** para iniciar o debug
4. Quando o código atingir o breakpoint, a execução pausa
5. Use o painel de Debug para inspecionar variáveis

### 4. Recursos do Debug

- **Breakpoints**: Pause a execução em pontos específicos
- **Watch**: Monitore variáveis em tempo real
- **Call Stack**: Veja a pilha de chamadas
- **Source Maps**: Debug o TypeScript diretamente

### Configuração do launch.json

O arquivo já está configurado no projeto. Aqui está o conteúdo:

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Dict: Debug no Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}",
      "sourceMaps": true,
      "userDataDir": true
    }
  ]
}
```

---

## 📁 Estrutura do Projeto

```
dict/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ActivityBar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── EditorToolbar.tsx
│   │   ├── TextEditor.tsx
│   │   ├── Preview.tsx
│   │   ├── StatusBar.tsx
│   │   ├── Tabs.tsx
│   │   ├── ContextMenu.tsx
│   │   ├── SettingsPanel.tsx
│   │   ├── ChangelogModal.tsx
│   │   ├── ConfirmModal.tsx
│   │   └── EmojiPicker.tsx
│   ├── styles/
│   │   ├── global.css
│   │   └── layout.css
│   ├── utils/
│   │   └── emoji.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .vscode/
│   └── launch.json
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🛠️ Tecnologias

- **React 19.2.0** - Biblioteca UI
- **TypeScript 5.9.3** - Tipagem estática
- **Vite 7.3.1** - Build tool
- **Lucide React** - Ícones
- **Marked** - Parser Markdown
- **Mermaid** - Diagramas
- **Highlight.js** - Syntax highlighting


---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📬 Contato

- **Projeto**: https://github.com/flaviohbonfim/dict
- **Issues**: https://github.com/flaviohbonfim/dict/issues

---

<div align="center">

**Feito com ❤️ usando React + TypeScript + Vite**

</div>
