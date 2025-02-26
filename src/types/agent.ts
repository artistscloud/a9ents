
export interface Agent {
  id: string;
  name: string;
  description: string;
  tools: string[];
  created_at: string;
}

export interface AgentFormData {
  name: string;
  description: string;
  tools: string[];
}
