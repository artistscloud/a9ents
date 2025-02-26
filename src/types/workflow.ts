
export interface WorkflowStep {
  agent_id: string;
  tool_id: string;
  order: number;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  created_at: string;
}

export interface WorkflowFormData {
  name: string;
  steps: WorkflowStep[];
}
