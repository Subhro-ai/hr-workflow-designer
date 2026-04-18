import React, { useEffect, useState } from 'react';
import { useWorkflowStore } from '../../stores/workflowStore';
import { nodeFormSchemas, FormField } from '../../constants/formSchemas';
import { NodeData } from '../../types/workflow';
import { mockApi, MockAutomatedAction } from '../../services/mockApi';

export const NodeEditorPanel: React.FC = () => {
  const { nodes, selectedNodeId, updateNodeData } = useWorkflowStore();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // We use local state to handle fast typing without lagging the canvas
  const [localData, setLocalData] = useState<Partial<NodeData>>({});
  const [mockActions, setMockActions] = useState<MockAutomatedAction[]>([]);

  useEffect(() => {
    mockApi.getAutomations().then(setMockActions).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedNode) {
      setLocalData(selectedNode.data);
    } else {
      setLocalData({});
    }
  }, [selectedNode]);

  if (!selectedNodeId || !selectedNode) {
    return (
      <aside className="w-80 border-l border-border bg-card p-6 flex flex-col items-center justify-center text-center">
        <div className="text-muted-foreground">
          <p className="font-medium text-foreground">No node selected</p>
          <p className="text-sm mt-1">Select a node on the canvas to edit its properties.</p>
        </div>
      </aside>
    );
  }

  const schema = nodeFormSchemas[selectedNode.type].map(field => {
    if (field.key === 'actionId') {
      return {
        ...field,
        options: mockActions.map(action => ({ label: action.label, value: action.id }))
      };
    }
    return field;
  });

  const handleChange = (key: string, value: any) => {
    const updatedData = { ...localData, [key]: value };
    setLocalData(updatedData);
    // Push updates back to the store so the canvas updates in real-time
    updateNodeData(selectedNode.id, { [key]: value });
  };

  const handleKeyValueChange = (key: string, objKey: string, objValue: string) => {
    const currentObj = (localData[key as keyof NodeData] as Record<string, string>) || {};
    const updatedObj = { ...currentObj, [objKey]: objValue };
    handleChange(key, updatedObj);
  };

  const handleRemoveKeyValue = (key: string, objKey: string) => {
    const currentObj = { ...(localData[key as keyof NodeData] as Record<string, string>) };
    delete currentObj[objKey];
    handleChange(key, currentObj);
  };

  return (
    <aside className="w-80 border-l border-border bg-card flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-card-foreground">Node Properties</h2>
        <p className="text-xs text-muted-foreground capitalize">{selectedNode.type} Node</p>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        {schema.map((field: FormField) => {
          const val = localData[field.key as keyof NodeData] as any;
          
          return (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {field.label} {field.required && <span className="text-destructive">*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  value={val || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  value={val || ''}
                  onChange={(e) => handleChange(field.key, Number(e.target.value))}
                  placeholder={field.placeholder}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              )}

              {field.type === 'date' && (
                <input
                  type="date"
                  value={val || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              )}

              {field.type === 'select' && (
                <select
                  value={val || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="" disabled>Select an option</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'boolean' && (
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!val}
                    onChange={(e) => handleChange(field.key, e.target.checked)}
                    className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Enable</span>
                </label>
              )}

              {field.type === 'key-value' && (
                <div className="space-y-2 border rounded-md p-3 bg-muted/30">
                  {Object.entries((val as Record<string, string>) || {}).map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <input
                        type="text"
                        value={k}
                        readOnly
                        className="flex h-8 w-1/3 rounded-md border border-input bg-muted px-2 py-1 text-xs"
                      />
                      <input
                        type="text"
                        value={v}
                        onChange={(e) => handleKeyValueChange(field.key, k, e.target.value)}
                        className="flex h-8 w-flex-1 rounded-md border border-input bg-transparent px-2 py-1 text-xs"
                      />
                      <button
                        onClick={() => handleRemoveKeyValue(field.key, k)}
                        className="text-destructive hover:text-destructive/80 px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <input
                      id={`new-key-${field.key}`}
                      type="text"
                      placeholder="Key"
                      className="flex h-8 w-1/3 rounded-md border border-input bg-transparent px-2 py-1 text-xs"
                    />
                    <input
                      id={`new-value-${field.key}`}
                      type="text"
                      placeholder="Value"
                      className="flex h-8 flex-1 rounded-md border border-input bg-transparent px-2 py-1 text-xs"
                    />
                    <button
                      onClick={() => {
                        const keyInput = document.getElementById(`new-key-${field.key}`) as HTMLInputElement;
                        const valInput = document.getElementById(`new-value-${field.key}`) as HTMLInputElement;
                        if (keyInput.value && valInput.value) {
                          handleKeyValueChange(field.key, keyInput.value, valInput.value);
                          keyInput.value = '';
                          valInput.value = '';
                        }
                      }}
                      className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
