# Tredence HR Workflow Designer

A robust, schema-driven visual workflow editor built with **React**, **TypeScript**, **Zustand**, and **React Flow**. Designed to allow HR admins to visually create, configure, and simulate internal workflows like onboarding or leave approvals.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🏗️ Architecture & Design Decisions

I took an **architecture-first approach** to ensure this prototype scales easily from 5 node types to 500 node types without turning into a monolithic mess.

### 1. Schema-Driven Dynamic Forms (`src/constants/formSchemas.ts`)
Instead of hardcoding a massive switch statement for the node property panels, I built a **Form Registry**. Each node type defines its own `FormField` schema. The `NodeEditorPanel` simply reads the schema and dynamically renders the inputs (text, selects, booleans, key-value maps).
* **Why?** Adding a new node type in the future requires zero changes to the UI code. Just define the types and add the schema.

### 2. Strict State Separation (`src/stores/workflowStore.ts`)
React Flow state (nodes, edges) and UI state (selected node) are managed globally via **Zustand**. 
* **Why?** Prevents prop-drilling, allows components like the Sandbox and Sidebar to access the graph cleanly, and is lighter and faster than Redux or React Context.

### 3. Mock API Layer with Delay Simulation (`src/services/mockApi.ts`)
The API layer abstracts the asynchronous actions:
- `getAutomations()`: Fetches available actions for the "Automated Step" node.
- `simulateWorkflow()`: Accepts the graph, validates its structure, and returns a step-by-step execution log.
* **Why?** Encapsulating API logic means swapping this out for real `fetch` or `axios` calls later is a one-file change.

### 4. Graph Structural Validation (DFS)
The Sandbox doesn't just pretend to work. It actually parses the graph as a Directed Graph and validates:
- **Exactly one Start Node** (no incoming edges)
- **At least one End Node** (no outgoing edges)
- **No Orphan Nodes** (every node must be connected)
- **Cycle Detection** (Uses Depth-First Search to ensure the workflow is a DAG - Directed Acyclic Graph)

## ✅ Completed Features

- [x] **React Flow Canvas** with custom themed nodes
- [x] **Sidebar** with Drag-and-Drop support
- [x] **Schema-Driven Node Editor** (Dynamic forms based on selected node type)
- [x] **Key-Value Pair Input Support** for metadata and custom fields
- [x] **Mock API Integration** for fetching automation actions
- [x] **Sandbox Simulation Panel** with full structural graph validation and visual execution logs
- [x] **Export / Import JSON** functionality (Bonus Feature)
- [x] **Mini-map & Zoom Controls** (Bonus Feature)

## 🔮 What I would add with more time

1. **Undo / Redo History**: Could be easily implemented by tracking a history stack of the Zustand state.
2. **Auto-Layout (Dagre.js)**: A button to automatically tidy up messy graphs.
3. **Node Templates**: Pre-configured groupings of nodes that can be dragged as a single unit (e.g., "Standard Background Check Flow").
4. **Visual Error Badges**: Highlighting specific nodes in red on the canvas if they fail validation in the sandbox.

## 🐛 Tricky Bug Solved During Development

**The Bug:** When rapidly typing into the Node Property form, the React Flow canvas would re-render entirely on every keystroke, causing noticeable lag and losing focus on the input field.

**The Fix:** I decoupled the local form state from the Zustand store's `updateNodeData`. The `NodeEditorPanel` now maintains its own fast `localData` state for instant UI updates, while simultaneously dispatching updates to the store to keep the canvas in sync. This eliminated the lag and fixed the input focus bug.
