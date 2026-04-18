import { NodeType } from '../types/workflow';

export type FieldType = 'text' | 'number' | 'select' | 'boolean' | 'key-value' | 'date';

export interface FormField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[]; // For select fields
  placeholder?: string;
  dependsOn?: string; // Field key it depends on
}

export const nodeFormSchemas: Record<NodeType, FormField[]> = {
  [NodeType.START]: [
    { key: 'title', label: 'Start Title', type: 'text', required: true },
    { key: 'metadata', label: 'Metadata', type: 'key-value' },
  ],
  [NodeType.TASK]: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'assignee', label: 'Assignee', type: 'text', placeholder: 'e.g. jdoe@example.com' },
    { key: 'dueDate', label: 'Due Date', type: 'date' },
    { key: 'customFields', label: 'Custom Fields', type: 'key-value' },
  ],
  [NodeType.APPROVAL]: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { 
      key: 'approverRole', 
      label: 'Approver Role', 
      type: 'select', 
      options: [
        { label: 'Manager', value: 'Manager' },
        { label: 'HRBP', value: 'HRBP' },
        { label: 'Director', value: 'Director' },
      ],
      required: true 
    },
    { key: 'autoApproveThreshold', label: 'Auto-Approve Threshold (Days)', type: 'number' },
  ],
  [NodeType.AUTOMATED]: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { 
      key: 'actionId', 
      label: 'Action', 
      type: 'select', 
      // Options will be injected dynamically from the Mock API
      options: [], 
      required: true 
    },
    { key: 'actionParams', label: 'Action Parameters', type: 'key-value' },
  ],
  [NodeType.END]: [
    { key: 'endMessage', label: 'End Message', type: 'text', required: true },
    { key: 'isSummaryFlag', label: 'Generate Summary', type: 'boolean' },
  ],
};
