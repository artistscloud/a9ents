
import { Json } from "@/integrations/supabase/types";

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
  apiConfig?: ApiConfig;
}

export interface GenerateToolResponse {
  name?: string;
  description?: string;
  instruction?: string;
  iconUrl?: string;
  tags?: string[];
  apiConfig?: Partial<ApiConfig>;
}

export interface ToolData {
  name: string;
  description: string | null;
  icon_url: string | null;
  instruction: string | null;
  tags: string[] | null;
  api_config: Json;
}
