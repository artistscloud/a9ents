
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
  apiConfig: ApiConfig;
}

export interface GenerateToolResponse {
  name?: string;
  description?: string;
  instruction?: string;
  iconUrl?: string;
  tags?: string[];
  apiConfig?: Partial<ApiConfig>;
}
