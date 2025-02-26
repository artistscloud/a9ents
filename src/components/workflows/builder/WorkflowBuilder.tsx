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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NodePalette } from './NodePalette';
import { BaseNode } from './nodes/BaseNode';
import { useToast } from '@/hooks/use-toast';
import '@xyflow/react/dist/style.css';

const nodeTypes = {
  trigger: BaseNode,
  action: BaseNode,
  condition: BaseNode,
};

export function WorkflowBuilder() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Fetch workflow data
  const { data: workflow, isLoading } = useQuery({
    queryKey: ['workflow', id],
    queryFn: async () => {
      const { data: workflowData, error: workflowError } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .single();

      if (workflowError) throw workflowError;

      const { data: nodesData, error: nodesError } = await supabase
        .from('workflow_nodes')
        .select('*')
        .eq('workflow_id', id);

      if (nodesError) throw nodesError;

      const { data: edgesData, error: edgesError } = await supabase
        .from('workflow_edges')
        .select('*')
        .eq('workflow_id', id);

      if (edgesError) throw edgesError;

      return {
        ...workflowData,
        nodes: nodesData.map((node) => ({
          id: node.id,
          type: node.node_type,
          position: node.position,
          data: {
            label: node.label,
            type: node.trigger_type || node.action_type || node.condition_type,
          },
        })),
        edges: edgesData.map((edge) => ({
          id: edge.id,
          source: edge.source_node_id,
          target: edge.target_node_id,
          label: edge.condition,
        })),
      };
    },
  });

  // Save workflow mutation
  const saveWorkflow = useMutation({
    mutationFn: async () => {
      // Save nodes
      const { error: nodesError } = await supabase
        .from('workflow_nodes')
        .upsert(
          nodes.map((node) => ({
            id: node.id,
            workflow_id: id,
            node_type: node.type,
            position: node.position,
            label: node.data.label,
            [node.type === 'trigger' ? 'trigger_type' : 
             node.type === 'action' ? 'action_type' : 
             'condition_type']: node.data.type,
          }))
        );

      if (nodesError) throw nodesError;

      // Save edges
      const { error: edgesError } = await supabase
        .from('workflow_edges')
        .upsert(
          edges.map((edge) => ({
            id: edge.id,
            workflow_id: id,
            source_node_id: edge.source,
            target_node_id: edge.target,
            condition: edge.label,
          }))
        );

      if (edgesError) throw edgesError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow', id] });
      toast({
        title: 'Success',
        description: 'Workflow saved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to save workflow.',
        variant: 'destructive',
      });
    },
  });

  const updateNode = useCallback((nodeId: string, updates: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            ...updates,
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Update nodeTypes to pass updateNode
  const nodeTypes = {
    trigger: (props: any) => <BaseNode {...props} onUpdate={updateNode} />,
    action: (props: any) => <BaseNode {...props} onUpdate={updateNode} />,
    condition: (props: any) => <BaseNode {...props} onUpdate={updateNode} />,
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

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
        type: type.split('-')[0],
        position,
        data: { label: type.split('-')[1], type: type.split('-')[1] },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex">
      <NodePalette onDragStart={onDragStart} />
      <div className="flex-1">
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
  );
}
