import React, { useState, useRef } from 'react';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { Sidebar } from './components/panels/Sidebar';
import { NodeEditorPanel } from './components/panels/NodeEditorPanel';
import { SandboxPanel } from './components/panels/SandboxPanel';
import { useWorkflowStore } from './stores/workflowStore';
import { getLayoutedElements } from './utils/layout';
import { Undo2, Redo2, Network } from 'lucide-react';

function App() {
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const { 
    nodes, edges, setNodes, setEdges, 
    undo, redo, past, future 
  } = useWorkflowStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (parsed.nodes && parsed.edges) {
            setNodes(parsed.nodes);
            setEdges(parsed.edges);
          }
        } catch (error) {
          console.error("Failed to parse workflow file");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAutoLayout = () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, 'TB');
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Hidden file input for importing */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImport} 
        accept=".json" 
        className="hidden" 
      />
      
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
            HR
          </div>
          <h1 className="font-semibold text-foreground tracking-tight">Workflow Designer</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/50 rounded-md p-1 border">
            <button 
              onClick={undo}
              disabled={past.length === 0}
              className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded-sm hover:bg-background transition-colors"
              title="Undo"
            >
              <Undo2 size={16} />
            </button>
            <button 
              onClick={redo}
              disabled={future.length === 0}
              className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 rounded-sm hover:bg-background transition-colors"
              title="Redo"
            >
              <Redo2 size={16} />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button 
              onClick={handleAutoLayout}
              className="p-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-sm hover:bg-background transition-colors"
              title="Auto-Layout Graph"
            >
              <Network size={16} /> Layout
            </button>
          </div>

          <div className="w-px h-6 bg-border mx-2" />

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-sm font-medium border border-input bg-transparent hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            Import
          </button>
          <button 
            onClick={handleExport}
            className="px-3 py-1.5 text-sm font-medium border border-input bg-transparent hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            Export
          </button>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <button 
            onClick={() => setIsSandboxOpen(!isSandboxOpen)}
            className={`px-4 py-1.5 text-sm font-medium border rounded-md transition-all shadow-sm ${isSandboxOpen ? 'bg-accent text-accent-foreground border-accent' : 'border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground'}`}
          >
            {isSandboxOpen ? 'Close Sandbox' : 'Sandbox / Test'}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <WorkflowCanvas />
        <SandboxPanel isOpen={isSandboxOpen} onClose={() => setIsSandboxOpen(false)} />
        <NodeEditorPanel />
      </main>
    </div>
  );
}

export default App;
