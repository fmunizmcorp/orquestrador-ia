/**
 * Workflow Designer Component
 * Visual workflow builder with drag-and-drop interface
 */
import React, { useState, useCallback, useRef } from 'react';
import { trpc } from '../lib/trpc';

interface WorkflowNode {
  id: string;
  type: 'task' | 'condition' | 'parallel' | 'loop' | 'webhook' | 'integration';
  title: string;
  config: any;
  position: { x: number; y: number };
  inputs: string[];
  outputs: string[];
}

interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface WorkflowDesignerProps {
  workflowId?: number;
  onSave?: (workflow: any) => void;
}

export const WorkflowDesigner: React.FC<WorkflowDesignerProps> = ({ workflowId, onSave }) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [draggedNode, setDraggedNode] = useState<WorkflowNode | null>(null);
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const createWorkflow = trpc.workflows.create.useMutation();
  const updateWorkflow = trpc.workflows.update.useMutation();

  // Node templates
  const nodeTemplates: Partial<WorkflowNode>[] = [
    { type: 'task', title: 'AI Task', config: { modelId: null, prompt: '' } },
    { type: 'condition', title: 'Condition', config: { condition: '', trueLabel: 'Yes', falseLabel: 'No' } },
    { type: 'parallel', title: 'Parallel', config: { branches: 2 } },
    { type: 'loop', title: 'Loop', config: { maxIterations: 10 } },
    { type: 'webhook', title: 'Webhook', config: { url: '', method: 'POST' } },
    { type: 'integration', title: 'Integration', config: { service: '', action: '' } },
  ];

  // Add node to canvas
  const addNode = (template: Partial<WorkflowNode>, position?: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: template.type!,
      title: template.title!,
      config: template.config || {},
      position: position || { x: 100, y: 100 },
      inputs: ['in'],
      outputs: ['out'],
    };

    if (template.type === 'condition') {
      newNode.outputs = ['true', 'false'];
    } else if (template.type === 'parallel') {
      newNode.outputs = ['branch1', 'branch2'];
    }

    setNodes([...nodes, newNode]);
  };

  // Handle node drag
  const handleNodeDragStart = (e: React.DragEvent, node: WorkflowNode) => {
    setDraggedNode(node);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeDragEnd = () => {
    setDraggedNode(null);
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggedNode && !nodes.find(n => n.id === draggedNode.id)) {
      // Adding new node from palette
      addNode(draggedNode, { x, y });
    } else if (draggedNode) {
      // Moving existing node
      setNodes(nodes.map(n => 
        n.id === draggedNode.id ? { ...n, position: { x, y } } : n
      ));
    }

    setDraggedNode(null);
  };

  // Update node configuration
  const updateNodeConfig = (nodeId: string, config: any) => {
    setNodes(nodes.map(n => 
      n.id === nodeId ? { ...n, config: { ...n.config, ...config } } : n
    ));
  };

  // Delete node
  const deleteNode = (nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.source !== nodeId && c.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  // Connect nodes
  const connectNodes = (sourceId: string, targetId: string, sourceHandle?: string, targetHandle?: string) => {
    const newConnection: WorkflowConnection = {
      id: `conn-${Date.now()}`,
      source: sourceId,
      target: targetId,
      sourceHandle,
      targetHandle,
    };
    setConnections([...connections, newConnection]);
  };

  // Save workflow
  const handleSave = async () => {
    const workflowData = {
      name: workflowName,
      userId: 1,
      config: JSON.stringify({
        nodes,
        connections,
      }),
      isActive: true,
    };

    try {
      if (workflowId) {
        await updateWorkflow.mutateAsync({ id: workflowId, ...workflowData });
      } else {
        const result = await createWorkflow.mutateAsync(workflowData);
        if (onSave) onSave(result);
      }
      alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Failed to save workflow:', error);
      alert('Failed to save workflow');
    }
  };

  // Auto-layout nodes
  const autoLayout = () => {
    const layoutNodes = [...nodes];
    const layers: { [key: number]: WorkflowNode[] } = {};

    // Simple layer-based layout
    layoutNodes.forEach((node, index) => {
      const layer = Math.floor(index / 3);
      if (!layers[layer]) layers[layer] = [];
      layers[layer].push(node);
    });

    Object.entries(layers).forEach(([layerIndex, layerNodes]) => {
      layerNodes.forEach((node, nodeIndex) => {
        node.position = {
          x: 150 + parseInt(layerIndex) * 300,
          y: 100 + nodeIndex * 150,
        };
      });
    });

    setNodes(layoutNodes);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Node Palette */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Components</h2>
        
        <div className="space-y-2">
          {nodeTemplates.map((template, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleNodeDragStart(e, template as WorkflowNode)}
              onDragEnd={handleNodeDragEnd}
              className="p-3 bg-blue-50 border border-blue-200 rounded cursor-move hover:bg-blue-100 transition"
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl">
                  {template.type === 'task' && '🤖'}
                  {template.type === 'condition' && '❓'}
                  {template.type === 'parallel' && '⚡'}
                  {template.type === 'loop' && '🔄'}
                  {template.type === 'webhook' && '🌐'}
                  {template.type === 'integration' && '🔗'}
                </span>
                <span className="font-medium text-sm">{template.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold mb-3">Workflow Settings</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workflow Name
              </label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={autoLayout}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Auto Layout
            </button>

            <button
              onClick={handleSave}
              disabled={createWorkflow.isLoading || updateWorkflow.isLoading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {createWorkflow.isLoading || updateWorkflow.isLoading ? 'Saving...' : 'Save Workflow'}
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <div
          ref={canvasRef}
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
          className="w-full h-full bg-gray-100 relative overflow-auto"
          style={{
            backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          {/* Render connections */}
          <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            {connections.map(conn => {
              const sourceNode = nodes.find(n => n.id === conn.source);
              const targetNode = nodes.find(n => n.id === conn.target);
              
              if (!sourceNode || !targetNode) return null;

              const x1 = sourceNode.position.x + 100;
              const y1 = sourceNode.position.y + 40;
              const x2 = targetNode.position.x;
              const y2 = targetNode.position.y + 40;

              return (
                <g key={conn.id}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                </g>
              );
            })}
            
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
              </marker>
            </defs>
          </svg>

          {/* Render nodes */}
          {nodes.map(node => (
            <div
              key={node.id}
              draggable
              onDragStart={(e) => handleNodeDragStart(e, node)}
              onDragEnd={handleNodeDragEnd}
              onClick={() => setSelectedNode(node)}
              className={`absolute bg-white border-2 rounded-lg shadow-lg cursor-move p-4 ${
                selectedNode?.id === node.id ? 'border-blue-500' : 'border-gray-300'
              }`}
              style={{
                left: node.position.x,
                top: node.position.y,
                width: '200px',
                zIndex: 2,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{node.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(node.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  ✕
                </button>
              </div>
              
              <div className="text-xs text-gray-600">
                Type: {node.type}
              </div>

              {/* Connection points */}
              <div className="absolute -left-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2" />
              <div className="absolute -right-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full transform -translate-y-1/2" />
            </div>
          ))}

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-xl font-semibold mb-2">Drag components from the sidebar</p>
                <p className="text-sm">to start building your workflow</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Properties Panel */}
      {selectedNode && (
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Node Properties</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Node Title
              </label>
              <input
                type="text"
                value={selectedNode.title}
                onChange={(e) => updateNodeConfig(selectedNode.id, { title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {selectedNode.type === 'task' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prompt Template
                  </label>
                  <textarea
                    value={selectedNode.config.prompt || ''}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { prompt: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {selectedNode.type === 'condition' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition Expression
                </label>
                <input
                  type="text"
                  value={selectedNode.config.condition || ''}
                  onChange={(e) => updateNodeConfig(selectedNode.id, { condition: e.target.value })}
                  placeholder="e.g., result.score > 0.8"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {selectedNode.type === 'webhook' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={selectedNode.config.url || ''}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Method
                  </label>
                  <select
                    value={selectedNode.config.method || 'POST'}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { method: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
