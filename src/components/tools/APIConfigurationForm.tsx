import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, ArrowLeft, X } from "lucide-react";

interface Field {
  key: string;
  value: string;
  description?: string;
}

interface ApiConfig {
  method: string;
  url: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body: string;
}

interface APIConfigurationFormProps {
  tool?: {
    title?: string;
    name?: string;
    description?: string;
    instruction?: string;
    iconUrl?: string;
    tags?: string[];
    apiConfig?: Partial<ApiConfig>;
  };
  onCreate: (config: ApiConfig) => void;
  onBack: () => void;
}

export function APIConfigurationForm({ tool, onCreate, onBack }: APIConfigurationFormProps) {
  const [config, setConfig] = useState<ApiConfig>({
    method: tool?.apiConfig?.method || 'GET',
    url: tool?.apiConfig?.url || '',
    headers: tool?.apiConfig?.headers || {},
    queryParams: tool?.apiConfig?.queryParams || {},
    body: tool?.apiConfig?.body || '',
  });

  const [formData, setFormData] = useState({
    title: tool?.title || '',
    name: tool?.name || '',
    description: tool?.description || '',
    instruction: tool?.instruction || '',
    iconUrl: tool?.iconUrl || '',
    tags: tool?.tags || [],
  });

  const handleSubmit = () => {
    onCreate(config);
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Title (for humans) <span className="text-red-500">*</span></Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="OpenRouter AI API"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Name (for AI) <span className="text-red-500">*</span></Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="openrouter_ai"
          />
        </div>

        <div className="space-y-2">
          <Label>Description (for AI) <span className="text-red-500">*</span></Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Provides access to OpenRouter AI services for various AI tasks."
          />
        </div>

        <div className="space-y-2">
          <Label>Icon URL</Label>
          <Input
            value={formData.iconUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, iconUrl: e.target.value }))}
            placeholder="https://example.com/icon.png"
          />
        </div>

        <div className="space-y-2">
          <Label>Instructions</Label>
          <Textarea
            value={formData.instruction}
            onChange={(e) => setFormData(prev => ({ ...prev, instruction: e.target.value }))}
            placeholder="How to use this tool"
          />
        </div>

        <div className="space-y-2">
          <Label>API endpoint (URL) to call <span className="text-red-500">*</span></Label>
          <Input
            value={config.url}
            onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://api.example.com"
          />
        </div>

        <div className="space-y-2">
          <Label>Method <span className="text-red-500">*</span></Label>
          <Select
            value={config.method}
            onValueChange={(value: string) => 
              setConfig(prev => ({ ...prev, method: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Headers ({Object.keys(config.headers).length})</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfig(prev => ({
                ...prev,
                headers: { ...prev.headers, '': '' }
              }))}
            >
              <Plus className="h-4 w-4" />
              Add field
            </Button>
          </div>
          {Object.entries(config.headers).map(([key, value], index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Key"
                value={key}
                onChange={(e) => {
                  const newHeaders = { ...config.headers };
                  delete newHeaders[key];
                  newHeaders[e.target.value] = value;
                  setConfig(prev => ({ ...prev, headers: newHeaders }));
                }}
              />
              <Input
                placeholder="Value"
                value={value}
                onChange={(e) => {
                  const newHeaders = { ...config.headers };
                  newHeaders[key] = e.target.value;
                  setConfig(prev => ({ ...prev, headers: newHeaders }));
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newHeaders = { ...config.headers };
                  delete newHeaders[key];
                  setConfig(prev => ({ ...prev, headers: newHeaders }));
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Query Parameters ({Object.keys(config.queryParams).length})</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfig(prev => ({
                ...prev,
                queryParams: { ...prev.queryParams, '': '' }
              }))}
            >
              <Plus className="h-4 w-4" />
              Add field
            </Button>
          </div>
          {Object.entries(config.queryParams).map(([key, value], index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Key"
                value={key}
                onChange={(e) => {
                  const newParams = { ...config.queryParams };
                  delete newParams[key];
                  newParams[e.target.value] = value;
                  setConfig(prev => ({ ...prev, queryParams: newParams }));
                }}
              />
              <Input
                placeholder="Value"
                value={value}
                onChange={(e) => {
                  const newParams = { ...config.queryParams };
                  newParams[key] = e.target.value;
                  setConfig(prev => ({ ...prev, queryParams: newParams }));
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newParams = { ...config.queryParams };
                  delete newParams[key];
                  setConfig(prev => ({ ...prev, queryParams: newParams }));
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="form-data"
              checked={config.isFormData}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, isFormData: checked }))}
            />
            <Label htmlFor="form-data">The API call body is in form data</Label>
          </div>

          <div className="flex justify-between items-center">
            <Label>Body ({Object.keys(config.body).length})</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfig(prev => ({
                ...prev,
                body: { ...prev.body, '': '' }
              }))}
            >
              <Plus className="h-4 w-4" />
              Add field
            </Button>
          </div>
          {Object.entries(config.body).map(([key, value], index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Key"
                value={key}
                onChange={(e) => {
                  const newBody = { ...config.body };
                  delete newBody[key];
                  newBody[e.target.value] = value;
                  setConfig(prev => ({ ...prev, body: newBody }));
                }}
              />
              <Input
                placeholder="Value"
                value={value}
                onChange={(e) => {
                  const newBody = { ...config.body };
                  newBody[key] = e.target.value;
                  setConfig(prev => ({ ...prev, body: newBody }));
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newBody = { ...config.body };
                  delete newBody[key];
                  setConfig(prev => ({ ...prev, body: newBody }));
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleSubmit}>Create</Button>
      </div>
    </div>
  );
}
