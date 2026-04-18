import React from 'react';
import { NodeProps } from '@xyflow/react';
import { PlayCircle, CheckSquare, UserCheck, Settings, Flag } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { 
  StartNodeData, 
  TaskNodeData, 
  ApprovalNodeData, 
  AutomatedStepNodeData, 
  EndNodeData 
} from '../../types/workflow';

export const StartNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const nodeData = data as StartNodeData;
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={nodeData.title || 'Start'}
      icon={<PlayCircle size={16} />}
      colorClass="bg-green-600 border-green-700"
      hasInput={false}
    >
      <div className="text-xs text-muted-foreground text-center">Workflow entry point</div>
    </BaseNode>
  );
};

export const TaskNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const nodeData = data as TaskNodeData;
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={nodeData.title || 'Human Task'}
      icon={<CheckSquare size={16} />}
      colorClass="bg-blue-600 border-blue-700"
    >
      <div className="flex flex-col gap-1">
        {nodeData.assignee ? (
          <div className="text-xs font-medium text-foreground">Assignee: {nodeData.assignee}</div>
        ) : (
          <div className="text-xs italic text-muted-foreground">Unassigned</div>
        )}
        {nodeData.dueDate && (
          <div className="text-[10px] text-muted-foreground">Due: {nodeData.dueDate}</div>
        )}
      </div>
    </BaseNode>
  );
};

export const ApprovalNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const nodeData = data as ApprovalNodeData;
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={nodeData.title || 'Approval Step'}
      icon={<UserCheck size={16} />}
      colorClass="bg-amber-600 border-amber-700"
    >
      <div className="text-xs font-medium text-foreground text-center">
        {nodeData.approverRole || 'Manager'} Approval
      </div>
    </BaseNode>
  );
};

export const AutomatedNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const nodeData = data as AutomatedStepNodeData;
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={nodeData.title || 'Automated Step'}
      icon={<Settings size={16} />}
      colorClass="bg-purple-600 border-purple-700"
    >
      <div className="text-xs text-center text-muted-foreground truncate">
        {nodeData.actionId ? `Action: ${nodeData.actionId}` : 'No action selected'}
      </div>
    </BaseNode>
  );
};

export const EndNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const nodeData = data as EndNodeData;
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={nodeData.endMessage || 'End'}
      icon={<Flag size={16} />}
      colorClass="bg-rose-600 border-rose-700"
      hasOutput={false}
    >
      {nodeData.isSummaryFlag && (
        <div className="text-[10px] text-muted-foreground text-center">Summary generated</div>
      )}
    </BaseNode>
  );
};
