
import { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  Connection,
  Edge,
  Node,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NodePalette } from './NodePalette';
import { WorkflowNavigation } from './WorkflowNavigation';
import { BaseNode } from './nodes/BaseNode';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import '@xyflow/react/dist/style.css';

// Define a single node type that will be used for all nodes
const nodeTypes = {
  input: BaseNode,
  output: BaseNode,
  text: BaseNode,
  pipeline: BaseNode,
  transform: BaseNode,
  'file-save': BaseNode,
  note: BaseNode,
  'llm-openai': BaseNode,
  'llm-anthropic': BaseNode,
  'llm-perplexity': BaseNode,
  'kb-reader': BaseNode,
  'kb-writer': BaseNode,
  'kb-search': BaseNode,
  audio: BaseNode,
  image: BaseNode,
  'logic-condition': BaseNode,
  'logic-merge': BaseNode,
  'logic-time': BaseNode,
  'logic-ttsql': BaseNode,
  'text-ops': BaseNode,
  'json-ops': BaseNode,
  'list-ops': BaseNode,
  'file-ops': BaseNode,
  'ai-ops': BaseNode,
  notifications: BaseNode,
  'data-enrichment': BaseNode,
  'chat-memory': BaseNode,
  'data-collector': BaseNode,
  'chat-file-reader': BaseNode,
  'data-csv': BaseNode,
  'data-db': BaseNode,
  'data-audio': BaseNode,
  'integration-grid': BaseNode,
  'trigger-webhook': BaseNode,
  'trigger-schedule': BaseNode,
};

export function WorkflowBuilder() {
  const { id } = useParams<{ id: string }>();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [activeCategory, setActiveCategory] = useState('general');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const { data: workflow, isLoading } = useQuery({
    queryKey: ['workflow', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (!type) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: crypto.randomUUID(),
        type,
        position,
        data: { label: type.split('-').pop() || type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  if (isLoading) {
    return <div>Loading workflow...</div>;
  }

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <WorkflowNavigation 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className="flex flex-1">
        <NodePalette 
          category={activeCategory}
          onDragStart={onDragStart}
        />
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        {selectedNode && selectedNode.type === 'input' && (
          <div className="w-80 border-l p-4 bg-background">
            <h3 className="text-lg font-semibold mb-4">Input Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Input Type</label>
                <select className="w-full p-2 border rounded">
                  <option value="text">Text</option>
                  <option value="file">File</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Label</label>
                <Input type="text" placeholder="Enter label" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea placeholder="Enter description" />
              </div>
              {/* File-specific options */}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="processFiles" />
                <label htmlFor="processFiles" className="text-sm">
                  Process Files into Text
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
