
import { useCallback, useState } from 'react';
import { addEdge, Connection, Edge, Node, useEdgesState, useNodesState } from '@xyflow/react';
import { useParams } from 'react-router-dom';
import { WorkflowNavigation } from './WorkflowNavigation';
import { NodePalette } from './NodePalette';
import { WorkflowFlow } from './components/WorkflowFlow';
import { NodeConfigPanel } from './components/NodeConfigPanel';
import { useWorkflow } from './hooks/useWorkflow';
import { BaseNode } from './nodes/BaseNode';
import { NodeData, NodeTypes } from './types/nodes';

const nodeTypes: NodeTypes = {
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
  'integration-grid': BaseNode,
  'trigger-webhook': BaseNode,
  'trigger-schedule': BaseNode,
  'data-csv': BaseNode,
  'data-db': BaseNode,
  'data-audio': BaseNode,
};

export function WorkflowBuilder() {
  const { id } = useParams<{ id: string }>();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [activeCategory, setActiveCategory] = useState('general');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const { data: workflow, isLoading } = useWorkflow(id);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
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
        data: {
          type,
          label: type.split('-').pop() || type,
          inputs: [],
          outputs: [],
        } as NodeData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const updateNodeData = (nodeId: string, newData: Partial<NodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, ...newData } as NodeData,
          };
        }
        return node;
      })
    );
  };

  if (!id) {
    return <div>Invalid workflow ID</div>;
  }

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
        <WorkflowFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
        />
        <NodeConfigPanel
          selectedNode={selectedNode}
          updateNodeData={updateNodeData}
        />
      </div>
    </div>
  );
}
