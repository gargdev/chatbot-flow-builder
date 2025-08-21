# 🧩 Chatbot Flow Builder

A simple and extensible **Chatbot Flow Builder** built using **React**, **React Flow**, **TypeScript**, and **TailwindCSS**.  
This project was created as part of the **BiteSpeed Frontend Task**.

---

## 🚀 Live Demo

🔗 [Chatbot Flow Builder – Live](https://anoopchatbotflowbuilder.netlify.app/)

---

## ✨ Features

- **Text Node**: Supports adding multiple text message nodes.
- **Drag & Drop Node Panel**: Easily add nodes to the flow.
- **Connections (Edges)**: Connect nodes using source and target handles.
  - Each source handle can have only one outgoing edge.
  - Each target handle can have multiple incoming edges.
- **Settings Panel**:
  - Replaces the Node Panel when a node is selected.
  - Allows editing text of the selected node.
- **Validation & Save**:
  - Ensures every node (except the last one) has a connected edge.
  - Displays an error if multiple nodes have empty target handles.
- **Extensible Architecture**: Easily add new node types in the future.

---

## 🛠️ Tech Stack

- ⚡ **Vite** – Fast bundler & dev server
- ⚛️ **React 18**
- 🎨 **TailwindCSS**
- 🕸️ **React Flow** – For flow builder
- 🔧 **TypeScript**

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/gargdev/chatbot-flow-builder.git
cd chatbot-flow-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run in Development Mode

```bash
npm run dev
```

App will be available at: [http://localhost:5173](http://localhost:5173)

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

---

## 📂 Project Structure

```
.
├── src/                  # Source code
│   ├── components/       # Reusable React components
├── package.json
└── vite.config.ts
```

---

## 📸 Screenshots

### Flow Builder

![Flow Builder](https://raw.githubusercontent.com/gargdev/chatbot-flow-builder/main/screenshots/flow-builder.png)

---

## 📝 Submission Details

- **Live Link:** [https://anoopchatbotflowbuilder.netlify.app/](https://anoopchatbotflowbuilder.netlify.app/)
- **Repo Link:** [https://github.com/gargdev/chatbot-flow-builder](https://github.com/gargdev/chatbot-flow-builder)

---

## 👨‍💻 Author

**Anoop Pandey**
[LinkedIn](https://www.linkedin.com/in/anooppandey) • [GitHub](https://github.com/gargdev)

```

```
