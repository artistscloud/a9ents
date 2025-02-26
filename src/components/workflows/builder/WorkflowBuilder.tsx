
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
import '@xyflow/react/dist/style.css';

const nodeTypes = {
  input: BaseNode,
  output: BaseNode,
  'llm-openai': BaseNode,
  'llm-anthropic': BaseNode,
  'llm-perplexity': BaseNode,
  'logic-if': BaseNode,
  'logic-switch': BaseNode,
  'trigger-webhook': BaseNode,
  'trigger-schedule': BaseNode,
  'data-csv': BaseNode,
  'data-db': BaseNode,
};

export function WorkflowBuilder() {
  const { id } = useParams<{ id: string }>();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [activeCategory, setActiveCategory] = useState('general');

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

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - event.currentTarget.getBoundingClientRect().left,
        y: event.clientY - event.currentTarget.getBoundingClientRect().top,
      };

      const newNode: Node = {
        id: crypto.randomUUID(),
        type,
        position,
        data: { label: type.split('-')[1] || type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
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
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
