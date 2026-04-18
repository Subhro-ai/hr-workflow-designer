# Tredence HR Workflow Designer (Tredence Case Study)

🚀 **[Live Interactive Demo](https://hr-workflow-designer-one.vercel.app/)**

A robust, architectural-grade visual workflow editor built with React Flow, Zustand, and Tailwind CSS. This application allows users to design, configure, and simulate complex HR processes (like Onboarding or Background Checks) through an intuitive drag-and-drop interface.

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

## ✅ Completed Features & Engineering Highlights

- [x] **Schema-Driven Node Editor**: Dynamic forms based on selected node type. Proves extensibility.
- [x] **Undo / Redo (Temporal State)**: Implemented a custom temporal history stack inside Zustand to manage `past` and `future` states for the graph. Shows deep state-management understanding.
- [x] **Dagre.js Graph Auto-Layout**: Implemented an algorithmic layout engine that automatically untangles messy nodes into a perfect Directed Acyclic Graph tree structure.
- [x] **Graph Structural Validation (DFS)**: Sandbox uses Depth-First Search cycle detection, and validates orphans, starts, and ends.
- [x] **React Flow Canvas** with custom themed nodes
- [x] **Mock API Integration** for fetching automation actions
- [x] **Sandbox Simulation Panel** with visual execution logs
- [x] **Export / Import JSON** functionality
- [x] **Sidebar** with Drag-and-Drop support
- [x] **Key-Value Pair Input Support** for metadata and custom fields
- [x] **Mini-map & Zoom Controls**

## 🔮 What I would add with more time

1. **Node Templates**: Pre-configured groupings of nodes that can be dragged as a single unit (e.g., "Standard Background Check Flow").
2. **Visual Error Badges**: Highlighting specific nodes in red on the canvas if they fail validation in the sandbox.
3. **Live Execution Highlighting**: As the simulation runs, the nodes light up sequentially on the canvas.

## 🐛 Tricky Bug Solved During Development

**The Bug:** When rapidly typing into the Node Property form, the React Flow canvas would re-render entirely on every keystroke, causing noticeable lag and losing focus on the input field.

**The Fix:** I decoupled the local form state from the Zustand store's `updateNodeData`. The `NodeEditorPanel` now maintains its own fast `localData` state for instant UI updates, while simultaneously dispatching updates to the store to keep the canvas in sync. This eliminated the lag and fixed the input focus bug.
