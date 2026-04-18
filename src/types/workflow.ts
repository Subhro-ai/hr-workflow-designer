export enum NodeType {
  START = 'start',
  TASK = 'task',
  APPROVAL = 'approval',
  AUTOMATED = 'automated',
  END = 'end',
}

export type BaseNodeData = Record<string, unknown>;

// Data structures for node configuration forms
export interface StartNodeData extends BaseNodeData {
  title: string;
  metadata?: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
  title: string;
  approverRole?: string; // e.g. "Manager", "HRBP", "Director"
  autoApproveThreshold?: number;
}

export interface AutomatedStepNodeData extends BaseNodeData {
  title: string;
  actionId?: string; // Corresponds to the mock API list
  actionParams?: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
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
