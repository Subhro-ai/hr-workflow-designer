import React, { useState } from 'react';
import { useWorkflowStore } from '../../stores/workflowStore';
import { mockApi, SimulationResult } from '../../services/mockApi';
import { Play, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SandboxPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SandboxPanel: React.FC<SandboxPanelProps> = ({ isOpen, onClose }) => {
  const { nodes, edges } = useWorkflowStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setResult(null);
    try {
      const simResult = await mockApi.simulateWorkflow(nodes, edges);
      setResult(simResult);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSimulating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-y-0 right-80 w-96 bg-card border-l border-r border-border shadow-2xl flex flex-col z-20 transition-transform duration-300">
      <div className="p-4 border-b flex items-center justify-between bg-muted/30">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Sandbox Test</h2>
          <p className="text-xs text-muted-foreground">Simulate and validate workflow</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 border-b">
        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSimulating ? (
            <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Play size={16} /> Run Simulation</>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900">
        {result && (
          <div className="space-y-6">
            {/* Validation Errors */}
            {result.errors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                  <AlertCircle size={16} /> Validation Failed
                </div>
                <ul className="list-disc pl-5 text-sm text-destructive/90 space-y-1">
                  {result.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Success Execution Logs */}
            {result.success && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                  <CheckCircle2 size={16} /> Graph Validated. Execution Path:
                </div>
                <div className="space-y-2 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {result.logs.map((log, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-border bg-card shadow-sm text-xs font-medium text-foreground">
                        {log}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {!result && !isSimulating && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center p-6">
            <Play size={32} className="mb-2 opacity-20" />
            <p className="text-sm">Click "Run Simulation" to serialize the graph and validate its structure.</p>
          </div>
        )}
      </div>
    </div>
  );
};
