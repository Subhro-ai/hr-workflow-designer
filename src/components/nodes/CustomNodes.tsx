import React from 'react';
import { NodeProps, Node } from '@xyflow/react';
import { PlayCircle, CheckSquare, UserCheck, Settings, Flag } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { 
  StartNodeData, 
  TaskNodeData, 
  ApprovalNodeData, 
  AutomatedStepNodeData, 
  EndNodeData 
} from '../../types/workflow';

export const StartNode: React.FC<NodeProps<Node<StartNodeData, 'start'>>> = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.title || 'Start'}
      icon={<PlayCircle size={16} />}
      colorClass="bg-green-600 border-green-700"
      hasInput={false}
    >
      <div className="text-xs text-muted-foreground text-center">Workflow entry point</div>
    </BaseNode>
  );
};

export const TaskNode: React.FC<NodeProps<Node<TaskNodeData, 'task'>>> = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.title || 'Human Task'}
      icon={<CheckSquare size={16} />}
      colorClass="bg-blue-600 border-blue-700"
    >
      <div className="flex flex-col gap-1">
        {data.assignee ? (
          <div className="text-xs font-medium text-foreground">Assignee: {data.assignee}</div>
        ) : (
          <div className="text-xs italic text-muted-foreground">Unassigned</div>
        )}
        {data.dueDate && (
          <div className="text-[10px] text-muted-foreground">Due: {data.dueDate}</div>
        )}
      </div>
    </BaseNode>
  );
};

export const ApprovalNode: React.FC<NodeProps<Node<ApprovalNodeData, 'approval'>>> = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.title || 'Approval Step'}
      icon={<UserCheck size={16} />}
      colorClass="bg-amber-600 border-amber-700"
    >
      <div className="text-xs font-medium text-foreground text-center">
        {data.approverRole || 'Manager'} Approval
      </div>
    </BaseNode>
  );
};

export const AutomatedNode: React.FC<NodeProps<Node<AutomatedStepNodeData, 'automated'>>> = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.title || 'Automated Step'}
      icon={<Settings size={16} />}
      colorClass="bg-purple-600 border-purple-700"
    >
      <div className="text-xs text-center text-muted-foreground truncate">
        {data.actionId ? `Action: ${data.actionId}` : 'No action selected'}
      </div>
    </BaseNode>
  );
};

export const EndNode: React.FC<NodeProps<Node<EndNodeData, 'end'>>> = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.endMessage || 'End'}
      icon={<Flag size={16} />}
      colorClass="bg-rose-600 border-rose-700"
      hasOutput={false}
    >
      {data.isSummaryFlag && (
        <div className="text-[10px] text-muted-foreground text-center">Summary generated</div>
      )}
    </BaseNode>
  );
};
