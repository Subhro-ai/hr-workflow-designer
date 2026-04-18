import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { 
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedStepNodeData,
  EndNodeData,
  NodeData
} from '../types/workflow';

// Define our specific node type
export type AppNode = 
  | Node<StartNodeData, 'start'>
  | Node<TaskNodeData, 'task'>
  | Node<ApprovalNodeData, 'approval'>
  | Node<AutomatedStepNodeData, 'automated'>
  | Node<EndNodeData, 'end'>;

export interface TemporalState {
  nodes: AppNode[];
  edges: Edge[];
}

export interface WorkflowState {
  nodes: AppNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  past: TemporalState[];
  future: TemporalState[];
  
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  setNodes: (nodes: AppNode[] | ((nodes: AppNode[]) => AppNode[])) => void;
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  addNode: (node: AppNode) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  setSelectedNodeId: (id: string | null) => void;
  
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  past: [],
  future: [],

  saveHistory: () => {
    const { nodes, edges, past } = get();
    // Keep last 50 states to prevent memory bloat
    const newPast = [...past, { nodes, edges }].slice(-50);
    set({ past: newPast, future: [] });
  },

  undo: () => {
    const { past, future, nodes, edges } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    set({
      past: newPast,
      future: [{ nodes, edges }, ...future],
      nodes: previous.nodes,
      edges: previous.edges,
      selectedNodeId: null,
    });
  },

  redo: () => {
    const { past, future, nodes, edges } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      past: [...past, { nodes, edges }],
      future: newFuture,
      nodes: next.nodes,
      edges: next.edges,
      selectedNodeId: null,
    });
  },

  onNodesChange: (changes: NodeChange<AppNode>[]) => {
    // Only save history for significant changes (add/remove), not every drag pixel
    const isSignificant = changes.some(c => c.type === 'remove' || c.type === 'add');
    if (isSignificant) get().saveHistory();
    
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    get().saveHistory();
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    get().saveHistory();
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  setNodes: (nodes) => {
    get().saveHistory();
    set({ nodes: typeof nodes === 'function' ? nodes(get().nodes) : nodes });
  },

  setEdges: (edges) => {
    get().saveHistory();
    set({ edges: typeof edges === 'function' ? edges(get().edges) : edges });
  },

  addNode: (node: AppNode) => {
    get().saveHistory();
    set({ nodes: [...get().nodes, node] });
  },

  updateNodeData: (id: string, data: Partial<NodeData>) => {
    get().saveHistory();
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, ...data } as NodeData,
          } as AppNode;
        }
        return node;
      }),
    });
  },

  setSelectedNodeId: (id: string | null) => {
    set({ selectedNodeId: id });
  },
}));
