
export interface ApiConfig {
  method: string;
  url: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body: string;
  isFormData?: boolean;
}

export interface CustomTool {
  name: string;
  description: string;
  instruction: string;
  iconUrl: string;
  tags: string[];
  apiConfig?: ApiConfig; // Made optional to match GenerateToolResponse
}

export interface GenerateToolResponse {
  name?: string;
  description?: string;
  instruction?: string;
  iconUrl?: string;
  tags?: string[];
  apiConfig?: Partial<ApiConfig>;
}

// Type for the database schema
export interface ToolData {
  name: string;
  description: string;
  icon_url: string;
  instruction: string;
  tags: string[];
  api_config: Record<string, unknown>;
}
