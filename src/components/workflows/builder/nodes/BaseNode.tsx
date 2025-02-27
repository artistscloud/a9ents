
import { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Settings, X, RefreshCw, ChevronRight } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface BaseNodeProps {
  id: string;
  data: {
    label: string;
    type: string;
    systemPrompt?: string;
    prompt?: string;
    model?: string;
    usePersonalKey?: boolean;
    fileName?: string;
    files?: { name: string; type: string }[];
    outputFields?: {
      name: string;
      type: string;
      description: string;
    }[];
  };
  selected?: boolean;
}

export function BaseNode({ id, data, selected }: BaseNodeProps) {
  const [showOutputs, setShowOutputs] = useState(false);

  const getIconForType = () => {
    switch (data.type) {
      case 'llm-openai':
        return '🤖';
      case 'llm-anthropic':
        return 'AI';
      case 'file-save':
        return '💾';
      case 'llm-together':
        return '🔗';
      default:
        return '📄';
    }
  };

  const renderFields = () => {
    switch (data.type) {
      case 'llm-openai':
      case 'llm-anthropic':
      case 'llm-together':
        return (
          <>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                System (Instructions)
                <span className="text-xs text-blue-500 bg-blue-100 px-1 rounded">Text</span>
              </Label>
              <Textarea 
                placeholder="Answer the Question based on Context in a professional manner."
                value={data.systemPrompt}
                className="resize-none min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Prompt
                <span className="text-xs text-blue-500 bg-blue-100 px-1 rounded">Text</span>
              </Label>
              <Textarea 
                placeholder="Type '{{' to utilize variables. E.g., Question: {{input_0.text}}"
                value={data.prompt}
                className="resize-none min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Model</Label>
              <Select value={data.model}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {data.type === 'llm-openai' && (
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                  )}
                  {data.type === 'llm-anthropic' && (
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                  )}
                  {data.type === 'llm-together' && (
                    <SelectItem value="deepseek-ai/DeepSeek-R1">DeepSeek-R1</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="api-key" checked={data.usePersonalKey} />
              <Label htmlFor="api-key">Use Personal API Key</Label>
            </div>
          </>
        );

      case 'file-save':
        return (
          <>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                File Name <span className="text-red-500">*</span>
                <span className="text-xs text-blue-500 bg-blue-100 px-1 rounded">Text</span>
              </Label>
              <Input 
                placeholder="Type '{{' to utilize variables"
                value={data.fileName}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Files <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Switch />
                <span className="text-xs bg-blue-100 px-1 rounded">List Files</span>
              </div>
              <div className="border rounded-md p-2">
                <Label>Item 1*</Label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Select file" />
                  <Button variant="outline" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" className="w-full mt-2 text-sm">
                  + Add Item
                </Button>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderOutputPanel = () => {
    if (!showOutputs) return null;

    return (
      <div className="absolute left-full top-0 ml-2 w-80 bg-white rounded-lg border shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Outputs</h3>
          <Button variant="ghost" size="icon" onClick={() => setShowOutputs(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Type "{{" in downstream nodes to leverage output fields.
        </p>
        <div className="space-y-4">
          {data.outputFields?.map((field, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{field.name}</span>
                <span className="text-xs text-blue-500 bg-blue-100 px-1 rounded">
                  {field.type}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{field.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative group">
      <div className={`bg-white rounded-lg border shadow-sm p-4 min-w-[400px] ${selected ? 'border-blue-500' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getIconForType()}</span>
            <span className="font-medium">{data.label || id}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-sm bg-slate-50 p-2 rounded mb-4">
          {id}
        </div>

        <div className="space-y-4">
          {renderFields()}
        </div>

        <Handle type="target" position={Position.Left} className="w-2 h-4 !bg-slate-400" />
        <Handle type="source" position={Position.Right} className="w-2 h-4 !bg-slate-400" />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-10 top-1/2 -translate-y-1/2"
        onClick={() => setShowOutputs(!showOutputs)}
      >
        <ChevronRight className={`h-4 w-4 transition-transform ${showOutputs ? 'rotate-180' : ''}`} />
      </Button>

      {renderOutputPanel()}
    </div>
  );
}
