
export interface Tool {
  id: string;
  name: string;
  description: string;
  function: string;
  created_at: string;
}

export interface ToolFormData {
  name: string;
  description: string;
  function: string;
}
