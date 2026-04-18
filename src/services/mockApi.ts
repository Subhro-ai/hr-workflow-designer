import { AppNode } from '../stores/workflowStore';
import { Edge } from '@xyflow/react';
import { NodeType } from '../types/workflow';

// Define the API types
export interface MockAutomatedAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationResult {
  success: boolean;
  logs: string[];
  errors: string[];
}

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // GET /automations
  getAutomations: async (): Promise<MockAutomatedAction[]> => {
    await delay(300);
    return [
      { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
      { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
      { id: 'update_db', label: 'Update Database', params: ['table', 'recordId'] },
      { id: 'notify_slack', label: 'Slack Notification', params: ['channel', 'message'] },
    ];
  },

  // POST /simulate
  simulateWorkflow: async (nodes: AppNode[], edges: Edge[]): Promise<SimulationResult> => {
    await delay(800); // Simulate network and processing time
    
    const logs: string[] = [];
    const errors: string[] = [];
    
    // 1. Structural Validation
    
    // Check Start Node
    const startNodes = nodes.filter(n => n.type === NodeType.START);
    if (startNodes.length === 0) {
      errors.push("Workflow must have exactly one Start Node.");
    } else if (startNodes.length > 1) {
      errors.push("Workflow cannot have multiple Start Nodes.");
    } else {
      // Start node shouldn't have incoming edges
      const incomingToStart = edges.filter(e => e.target === startNodes[0].id);
      if (incomingToStart.length > 0) {
        errors.push("Start Node cannot have incoming connections.");
      }
    }

    // Check End Node
    const endNodes = nodes.filter(n => n.type === NodeType.END);
    if (endNodes.length === 0) {
      errors.push("Workflow must have at least one End Node.");
    } else {
      // End node shouldn't have outgoing edges
      for (const endNode of endNodes) {
        const outgoingFromEnd = edges.filter(e => e.source === endNode.id);
        if (outgoingFromEnd.length > 0) {
          errors.push(`End Node "${endNode.data.endMessage || 'End'}" cannot have outgoing connections.`);
        }
      }
    }

    // Check for orphan nodes (unconnected)
    if (nodes.length > 1) {
      const connectedNodeIds = new Set([
        ...edges.map(e => e.source),
        ...edges.map(e => e.target)
      ]);
      
      const orphanNodes = nodes.filter(n => !connectedNodeIds.has(n.id));
      if (orphanNodes.length > 0) {
        errors.push(`Found ${orphanNodes.length} disconnected node(s). All nodes must be part of the flow.`);
      }
    }

    // Check for cycles (DFS)
    const buildAdjacencyList = () => {
      const graph: Record<string, string[]> = {};
      nodes.forEach(n => { graph[n.id] = []; });
      edges.forEach(e => {
        if (graph[e.source]) {
          graph[e.source].push(e.target);
        }
      });
      return graph;
    };

    const graph = buildAdjacencyList();
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const detectCycle = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const neighbors = graph[nodeId] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (detectCycle(neighbor)) return true;
        } else if (recursionStack.has(neighbor)) {
          return true; // Cycle detected
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    let hasCycle = false;
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (detectCycle(node.id)) {
          hasCycle = true;
          break;
        }
      }
    }

    if (hasCycle) {
      errors.push("Workflow contains an infinite loop (cycle). Workflows must be Directed Acyclic Graphs (DAGs).");
    }

    // If validation fails, return early
    if (errors.length > 0) {
      return { success: false, logs, errors };
    }

    // 2. Simulate Execution (Traversal)
    logs.push("Workflow Simulation Started.");
    
    if (startNodes.length === 1) {
      let currentNodeId: string | undefined = startNodes[0].id;
      const executionPath = [];
      
      // Simple traversal (assumes no complex branching for this basic simulation)
      while (currentNodeId) {
        const node = nodes.find(n => n.id === currentNodeId);
        if (!node) break;
        
        executionPath.push(node);
        
        switch (node.type) {
          case NodeType.START:
            logs.push(`[START] Initiated workflow: ${node.data.title || 'Start'}`);
            break;
          case NodeType.TASK:
            logs.push(`[TASK] Assigned task "${node.data.title}" to ${node.data.assignee || 'Unassigned'}`);
            break;
          case NodeType.APPROVAL:
            logs.push(`[APPROVAL] Requesting approval from ${node.data.approverRole || 'Manager'}`);
            break;
          case NodeType.AUTOMATED:
            logs.push(`[SYSTEM] Executing action: ${node.data.actionId || 'Unknown'}`);
            break;
          case NodeType.END:
            logs.push(`[END] Workflow completed. Message: ${node.data.endMessage}`);
            break;
        }

        // Find next node
        const outgoingEdge = edges.find(e => e.source === currentNodeId);
        currentNodeId = outgoingEdge?.target; // Just follows the first path it finds
      }
    }

    logs.push("Workflow Simulation Completed Successfully.");

    return { success: true, logs, errors };
  }
};
