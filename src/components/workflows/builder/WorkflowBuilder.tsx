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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import '@xyflow/react/dist/style.css';

// Define types for node data
interface BaseNodeData {
  label: string;
  description?: string;
}

interface InputNodeData extends BaseNodeData {
  inputType: 'text' | 'file' | 'json';
}

interface LLMNodeData extends BaseNodeData {
  model: string;
  systemPrompt: string;
  temperature: number;
}

interface KBNodeData extends BaseNodeData {
  knowledgeBase: string;
  searchType?: 'semantic' | 'keyword' | 'hybrid';
}

interface LogicNodeData extends BaseNodeData {
  conditionType: 'equals' | 'contains' | 'greater-than' | 'less-than';
  value: string;
}

type NodeData = BaseNodeData | InputNodeData | LLMNodeData | KBNodeData | LogicNodeData;

// Define a type for our custom node
type CustomNode = Node<NodeData>;

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
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [activeCategory, setActiveCategory] = useState('general');
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);

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

  const updateNodeData = (nodeId: string, newData: Partial<NodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, ...newData },
          };
        }
        return node;
      })
    );
  };

  const renderNodeConfig = (node: CustomNode) => {
    switch (node.type) {
      case 'input': {
        const data = node.data as InputNodeData;
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Input Type</Label>
              <Select 
                value={data.inputType} 
                onValueChange={(value: 'text' | 'file' | 'json') => 
                  updateNodeData(node.id, { inputType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select input type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Label</Label>
              <Input 
                value={data.label} 
                onChange={(e) => updateNodeData(node.id, { label: e.target.value })} 
                placeholder="Enter label"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={data.description || ''} 
                onChange={(e) => updateNodeData(node.id, { description: e.target.value })} 
                placeholder="Enter description"
              />
            </div>
          </div>
        );
      }

      case 'llm-openai':
      case 'llm-anthropic':
      case 'llm-perplexity': {
        const data = node.data as LLMNodeData;
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Model</Label>
              <Select 
                value={data.model} 
                onValueChange={(value) => updateNodeData(node.id, { model: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {node.type === 'llm-openai' && (
                    <>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </>
                  )}
                  {node.type === 'llm-anthropic' && (
                    <>
                      <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                    </>
                  )}
                  {node.type === 'llm-perplexity' && (
                    <>
                      <SelectItem value="pplx-7b">PPLX 7B</SelectItem>
                      <SelectItem value="pplx-70b">PPLX 70B</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>System Prompt</Label>
              <Textarea 
                value={data.systemPrompt} 
                onChange={(e) => updateNodeData(node.id, { systemPrompt: e.target.value })} 
                placeholder="Enter system prompt"
              />
            </div>
            <div className="space-y-2">
              <Label>Temperature</Label>
              <Input 
                type="number" 
                min="0" 
                max="2" 
                step="0.1"
                value={data.temperature} 
                onChange={(e) => updateNodeData(node.id, { temperature: parseFloat(e.target.value) })} 
              />
            </div>
          </div>
        );
      }

      case 'kb-reader':
      case 'kb-writer':
      case 'kb-search': {
        const data = node.data as KBNodeData;
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Knowledge Base</Label>
              <Select 
                value={data.knowledgeBase} 
                onValueChange={(value) => updateNodeData(node.id, { knowledgeBase: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select knowledge base" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main KB</SelectItem>
                  <SelectItem value="customer-support">Customer Support KB</SelectItem>
                  <SelectItem value="documentation">Documentation KB</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {node.type === 'kb-search' && (
              <div className="space-y-2">
                <Label>Search Type</Label>
                <Select 
                  value={data.searchType} 
                  onValueChange={(value: 'semantic' | 'keyword' | 'hybrid') => 
                    updateNodeData(node.id, { searchType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select search type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semantic">Semantic Search</SelectItem>
                    <SelectItem value="keyword">Keyword Search</SelectItem>
                    <SelectItem value="hybrid">Hybrid Search</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );
      }

      case 'logic-condition':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Condition Type</Label>
              <Select onValueChange={(value) => updateNodeData(node.id, { conditionType: value })} defaultValue={node.data.conditionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="greater-than">Greater Than</SelectItem>
                  <SelectItem value="less-than">Less Than</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input 
                value={node.data.value || ''} 
                onChange={(e) => updateNodeData(node.id, { value: e.target.value })} 
                placeholder="Enter comparison value"
              />
            </div>
          </div>
        );

      // Add more node type configurations as needed...

      default: {
        const data = node.data as BaseNodeData;
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input 
                value={data.label} 
                onChange={(e) => updateNodeData(node.id, { label: e.target.value })} 
                placeholder="Enter label"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={data.description || ''} 
                onChange={(e) => updateNodeData(node.id, { description: e.target.value })} 
                placeholder="Enter description"
              />
            </div>
          </div>
        );
      }
    }
  };

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
        {selectedNode && (
          <div className="w-80 border-l p-4 bg-background">
            <h3 className="text-lg font-semibold mb-4">
              {(selectedNode.data as BaseNodeData).label || selectedNode.type} Configuration
            </h3>
            {renderNodeConfig(selectedNode)}
          </div>
        )}
      </div>
    </div>
  );
}
