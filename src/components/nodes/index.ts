import { NodeType } from '../../types/workflow';
import { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode } from './CustomNodes';

export const nodeTypes = {
  [NodeType.START]: StartNode,
  [NodeType.TASK]: TaskNode,
  [NodeType.APPROVAL]: ApprovalNode,
  [NodeType.AUTOMATED]: AutomatedNode,
  [NodeType.END]: EndNode,
};
