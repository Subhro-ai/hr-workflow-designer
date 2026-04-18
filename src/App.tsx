import React, { useState } from 'react';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { Sidebar } from './components/panels/Sidebar';
import { NodeEditorPanel } from './components/panels/NodeEditorPanel';
import { SandboxPanel } from './components/panels/SandboxPanel';

function App() {
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
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
            onClick={() => setIsSandboxOpen(!isSandboxOpen)}
            className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors ${isSandboxOpen ? 'bg-accent text-accent-foreground border-accent' : 'border-input bg-transparent hover:bg-accent hover:text-accent-foreground'}`}
          >
            {isSandboxOpen ? 'Close Sandbox' : 'Sandbox / Test'}
          </button>
          <button className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md shadow-sm transition-colors">
            Save Workflow
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
