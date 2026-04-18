import React, { DragEvent } from 'react';
import { NodeType } from '../../types/workflow';
import { PlayCircle, CheckSquare, UserCheck, Settings, Flag } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const onDragStart = (event: DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeTypesConfig = [
    { type: NodeType.START, label: 'Start Node', icon: <PlayCircle size={18} className="text-green-600" /> },
    { type: NodeType.TASK, label: 'Task Node', icon: <CheckSquare size={18} className="text-blue-600" /> },
    { type: NodeType.APPROVAL, label: 'Approval Node', icon: <UserCheck size={18} className="text-amber-600" /> },
    { type: NodeType.AUTOMATED, label: 'Automated Step', icon: <Settings size={18} className="text-purple-600" /> },
    { type: NodeType.END, label: 'End Node', icon: <Flag size={18} className="text-rose-600" /> },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-card-foreground">Nodes</h2>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          Drag nodes to the canvas to build your workflow.
        </p>
      </div>
      
      <div className="flex flex-col gap-3">
        {nodeTypesConfig.map(({ type, label, icon }) => (
          <div
            key={type}
            className="flex items-center gap-3 p-3 border rounded-lg bg-background hover:border-primary/50 cursor-grab active:cursor-grabbing transition-colors shadow-sm"
            onDragStart={(event) => onDragStart(event, type)}
            draggable
          >
            {icon}
            <span className="font-medium text-sm text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};
