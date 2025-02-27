
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
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers: Field[];
  queryParams: Field[];
  body: Field[];
  isFormData: boolean;
}

interface APIConfigurationFormProps {
  initialData?: {
    title?: string;
    name?: string;
    description?: string;
    instruction?: string;
    iconUrl?: string;
    tags?: string[];
    apiConfig?: ApiConfig;
  };
  onSubmit: (config: ApiConfig) => void;
  onBack: () => void;
}

export function APIConfigurationForm({ initialData, onSubmit, onBack }: APIConfigurationFormProps) {
  const [config, setConfig] = useState<ApiConfig>({
    method: 'GET',
    url: '',
    headers: [],
    queryParams: [],
    body: [],
    isFormData: false,
    ...initialData?.apiConfig,
  });

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    instruction: initialData?.instruction || '',
    iconUrl: initialData?.iconUrl || '',
    tags: initialData?.tags || [],
  });

  const addField = (type: 'headers' | 'queryParams' | 'body') => {
    setConfig(prev => ({
      ...prev,
      [type]: [...prev[type], { key: '', value: '', description: '' }],
    }));
  };

  const removeField = (type: 'headers' | 'queryParams' | 'body', index: number) => {
    setConfig(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const updateField = (
    type: 'headers' | 'queryParams' | 'body',
    index: number,
    field: string,
    value: string
  ) => {
    setConfig(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = () => {
    onSubmit(config);
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
            onValueChange={(value: 'GET' | 'POST' | 'PUT' | 'DELETE') => 
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
            <Label>Headers ({config.headers.length})</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addField('headers')}
            >
              <Plus className="h-4 w-4" />
              Add field
            </Button>
          </div>
          {config.headers.map((header, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Key"
                value={header.key}
                onChange={(e) => updateField('headers', index, 'key', e.target.value)}
              />
              <Input
                placeholder="Value"
                value={header.value}
                onChange={(e) => updateField('headers', index, 'value', e.target.value)}
              />
              <Input
                placeholder="Description"
                value={header.description}
                onChange={(e) => updateField('headers', index, 'description', e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeField('headers', index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Query Parameters ({config.queryParams.length})</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addField('queryParams')}
            >
              <Plus className="h-4 w-4" />
              Add field
            </Button>
          </div>
          {config.queryParams.map((param, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Key"
                value={param.key}
                onChange={(e) => updateField('queryParams', index, 'key', e.target.value)}
              />
              <Input
                placeholder="Value"
                value={param.value}
                onChange={(e) => updateField('queryParams', index, 'value', e.target.value)}
              />
              <Input
                placeholder="Description"
                value={param.description}
                onChange={(e) => updateField('queryParams', index, 'description', e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeField('queryParams', index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="form-data"
                checked={config.isFormData}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, isFormData: checked }))}
              />
              <Label htmlFor="form-data">The API call body is in form data</Label>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Label>Body ({config.body.length})</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addField('body')}
            >
              <Plus className="h-4 w-4" />
              Add field
            </Button>
          </div>
          {config.body.map((bodyField, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Key"
                value={bodyField.key}
                onChange={(e) => updateField('body', index, 'key', e.target.value)}
              />
              <Input
                placeholder="Value"
                value={bodyField.value}
                onChange={(e) => updateField('body', index, 'value', e.target.value)}
              />
              <Input
                placeholder="Description"
                value={bodyField.description}
                onChange={(e) => updateField('body', index, 'description', e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeField('body', index)}
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
