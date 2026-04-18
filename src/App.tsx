import React, { useState, useRef } from 'react';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { Sidebar } from './components/panels/Sidebar';
import { NodeEditorPanel } from './components/panels/NodeEditorPanel';
import { SandboxPanel } from './components/panels/SandboxPanel';
import { useWorkflowStore } from './stores/workflowStore';

function App() {
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const { nodes, edges, setNodes, setEdges } = useWorkflowStore();
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
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-sm font-medium border border-input bg-transparent hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            Import JSON
          </button>
          <button 
            onClick={handleExport}
            className="px-3 py-1.5 text-sm font-medium border border-input bg-transparent hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
          >
            Export JSON
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button 
            onClick={() => setIsSandboxOpen(!isSandboxOpen)}
            className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${isSandboxOpen ? 'bg-accent text-accent-foreground border-accent' : 'border-input bg-transparent hover:bg-accent hover:text-accent-foreground'}`}
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
