export enum NodeType {
  START = 'start',
  TASK = 'task',
  APPROVAL = 'approval',
  AUTOMATED = 'automated',
  END = 'end',
}

// Data structures for node configuration forms
export interface StartNodeData {
  title: string;
  metadata?: Record<string, string>;
}

export interface TaskNodeData {
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: Record<string, string>;
}

export interface ApprovalNodeData {
  title: string;
  approverRole?: string; // e.g. "Manager", "HRBP", "Director"
  autoApproveThreshold?: number;
}

export interface AutomatedStepNodeData {
  title: string;
  actionId?: string; // Corresponds to the mock API list
  actionParams?: Record<string, string>;
}

export interface EndNodeData {
  endMessage: string;
  isSummaryFlag?: boolean;
}

export type NodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData;

export interface ValidationState {
  isValid: boolean;
  errors: string[];
}
