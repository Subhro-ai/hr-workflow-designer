import React, { DragEvent, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';

import { useWorkflowStore } from '../../stores/workflowStore';
import { nodeTypes } from '../nodes';
import { NodeType, NodeData } from '../../types/workflow';

const defaultNodeData: Record<NodeType, Partial<NodeData>> = {
  [NodeType.START]: { title: 'Start' },
  [NodeType.TASK]: { title: 'New Task' },
  [NodeType.APPROVAL]: { title: 'Approval Step', approverRole: 'Manager' },
  [NodeType.AUTOMATED]: { title: 'Automated Action' },
  [NodeType.END]: { endMessage: 'End of Workflow' },
};

const WorkflowCanvasComponent = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNodeId,
  } = useWorkflowStore();

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (typeof type === 'undefined' || !type) {
        return;
      }

      // Convert the screen coordinate to the canvas coordinate
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: defaultNodeData[type] as NodeData,
      };

      addNode(newNode);
    },
    [addNode]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <div className="flex-1 h-full w-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-50"
      >
        <Background />
        <Controls />
        <MiniMap zoomable pannable nodeClassName={(n) => `bg-${n.type}`} />
      </ReactFlow>
    </div>
  );
};

export const WorkflowCanvas = () => (
  <ReactFlowProvider>
    <WorkflowCanvasComponent />
  </ReactFlowProvider>
);
