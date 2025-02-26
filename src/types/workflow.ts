
export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  position: { x: number; y: number };
  data: {
    label: string;
    triggerType?: 'webhook' | 'schedule' | 'manual' | 'event';
    actionType?: 'api' | 'email' | 'agent' | 'llm' | 'tool';
    conditionType?: 'if' | 'switch' | 'wait';
    configuration?: Record<string, any>;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  created_at?: string;
}
