
import { BaseNode } from '../nodes/BaseNode';

export type NodeTypes = {
  input: typeof BaseNode;
  output: typeof BaseNode;
  text: typeof BaseNode;
  pipeline: typeof BaseNode;
  transform: typeof BaseNode;
  'file-save': typeof BaseNode;
  note: typeof BaseNode;
  'llm-openai': typeof BaseNode;
  'llm-anthropic': typeof BaseNode;
  'llm-perplexity': typeof BaseNode;
  'kb-reader': typeof BaseNode;
  'kb-writer': typeof BaseNode;
  'kb-search': typeof BaseNode;
  audio: typeof BaseNode;
  image: typeof BaseNode;
  'logic-condition': typeof BaseNode;
  'logic-merge': typeof BaseNode;
  'logic-time': typeof BaseNode;
  'logic-ttsql': typeof BaseNode;
  'text-ops': typeof BaseNode;
  'json-ops': typeof BaseNode;
  'list-ops': typeof BaseNode;
  'file-ops': typeof BaseNode;
  'ai-ops': typeof BaseNode;
  notifications: typeof BaseNode;
  'data-enrichment': typeof BaseNode;
  'chat-memory': typeof BaseNode;
  'data-collector': typeof BaseNode;
  'chat-file-reader': typeof BaseNode;
  'integration-grid': typeof BaseNode;
  'trigger-webhook': typeof BaseNode;
  'trigger-schedule': typeof BaseNode;
  'data-csv': typeof BaseNode;
  'data-db': typeof BaseNode;
  'data-audio': typeof BaseNode;
};

export interface DataType {
  text: string;
  audio: string;
  image: string;
  json: string;
  video: string;
  file: string;
}

export interface NodeData {
  label: string;
  type: string;
  inputType?: keyof DataType;
  description?: string;
  inputs?: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
  outputs?: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
  [key: string]: unknown;
}
