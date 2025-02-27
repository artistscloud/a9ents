
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, ArrowLeft, X } from "lucide-react";

interface ApiConfig {
  method: string;
  url: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body: string;
  isFormData?: boolean;
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

type FormField = {
  key: string;
  value: string;
};

export function APIConfigurationForm({ tool, onCreate, onBack }: APIConfigurationFormProps) {
  const [config, setConfig] = useState<ApiConfig>({
    method: tool?.apiConfig?.method || 'GET',
    url: tool?.apiConfig?.url || '',
    headers: tool?.apiConfig?.headers || {},
    queryParams: tool?.apiConfig?.queryParams || {},
    body: tool?.apiConfig?.body || '',
    isFormData: tool?.apiConfig?.isFormData || false,
  });

  const [formData, setFormData] = useState({
    title: tool?.title || '',
    name: tool?.name || '',
    description: tool?.description || '',
    instruction: tool?.instruction || '',
    iconUrl: tool?.iconUrl || '',
    tags: tool?.tags || [],
  });

  const [headerFields, setHeaderFields] = useState<FormField[]>(
    Object.entries(config.headers).map(([key, value]) => ({ key, value }))
  );

  const [queryFields, setQueryFields] = useState<FormField[]>(
    Object.entries(config.queryParams).map(([key, value]) => ({ key, value }))
  );

  const [bodyFields, setBodyFields] = useState<FormField[]>(
    Object.entries(typeof config.body === 'string' ? {} : config.body).map(([key, value]) => ({ key, value: String(value) }))
  );

  const updateHeaders = (fields: FormField[]) => {
    const headers: Record<string, string> = {};
    fields.forEach(field => {
      if (field.key) headers[field.key] = field.value;
    });
    setConfig(prev => ({ ...prev, headers }));
  };

  const updateQueryParams = (fields: FormField[]) => {
    const queryParams: Record<string, string> = {};
    fields.forEach(field => {
      if (field.key) queryParams[field.key] = field.value;
    });
    setConfig(prev => ({ ...prev, queryParams }));
  };

  const updateBody = (fields: FormField[]) => {
    if (config.isFormData) {
      const bodyObj: Record<string, string> = {};
      fields.forEach(field => {
        if (field.key) bodyObj[field.key] = field.value;
      });
      setConfig(prev => ({ ...prev, body: JSON.stringify(bodyObj) }));
    } else {
      setConfig(prev => ({ ...prev, body: fields[0]?.value || '' }));
    }
  };

  const handleSubmit = () => {
    onCreate(config);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="space-y-4">
        {/* Method and URL */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label>Method</Label>
            <Select
              value={config.method}
              onValueChange={(value) => setConfig(prev => ({ ...prev, method: value }))}
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
          <div className="col-span-3">
            <Label>URL</Label>
            <Input
              value={config.url}
              onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://api.example.com/endpoint"
            />
          </div>
        </div>

        {/* Headers */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Headers</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newFields = [...headerFields, { key: '', value: '' }];
                setHeaderFields(newFields);
                updateHeaders(newFields);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Header
            </Button>
          </div>
          {headerFields.map((field, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Key"
                value={field.key}
                onChange={(e) => {
                  const newFields = [...headerFields];
                  newFields[index] = { ...field, key: e.target.value };
                  setHeaderFields(newFields);
                  updateHeaders(newFields);
                }}
              />
              <Input
                placeholder="Value"
                value={field.value}
                onChange={(e) => {
                  const newFields = [...headerFields];
                  newFields[index] = { ...field, value: e.target.value };
                  setHeaderFields(newFields);
                  updateHeaders(newFields);
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newFields = headerFields.filter((_, i) => i !== index);
                  setHeaderFields(newFields);
                  updateHeaders(newFields);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Query Parameters */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Query Parameters</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newFields = [...queryFields, { key: '', value: '' }];
                setQueryFields(newFields);
                updateQueryParams(newFields);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Parameter
            </Button>
          </div>
          {queryFields.map((field, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Key"
                value={field.key}
                onChange={(e) => {
                  const newFields = [...queryFields];
                  newFields[index] = { ...field, key: e.target.value };
                  setQueryFields(newFields);
                  updateQueryParams(newFields);
                }}
              />
              <Input
                placeholder="Value"
                value={field.value}
                onChange={(e) => {
                  const newFields = [...queryFields];
                  newFields[index] = { ...field, value: e.target.value };
                  setQueryFields(newFields);
                  updateQueryParams(newFields);
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newFields = queryFields.filter((_, i) => i !== index);
                  setQueryFields(newFields);
                  updateQueryParams(newFields);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Body</Label>
            <div className="flex items-center gap-2">
              <Label htmlFor="form-data">Form Data</Label>
              <Switch
                id="form-data"
                checked={config.isFormData}
                onCheckedChange={(checked) => {
                  setConfig(prev => ({ ...prev, isFormData: checked }));
                  setBodyFields(checked ? [{ key: '', value: '' }] : [{ key: '', value: config.body }]);
                }}
              />
            </div>
          </div>
          {config.isFormData ? (
            <div className="space-y-2">
              {bodyFields.map((field, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Key"
                    value={field.key}
                    onChange={(e) => {
                      const newFields = [...bodyFields];
                      newFields[index] = { ...field, key: e.target.value };
                      setBodyFields(newFields);
                      updateBody(newFields);
                    }}
                  />
                  <Input
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => {
                      const newFields = [...bodyFields];
                      newFields[index] = { ...field, value: e.target.value };
                      setBodyFields(newFields);
                      updateBody(newFields);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newFields = bodyFields.filter((_, i) => i !== index);
                      setBodyFields(newFields);
                      updateBody(newFields);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newFields = [...bodyFields, { key: '', value: '' }];
                  setBodyFields(newFields);
                  updateBody(newFields);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
          ) : (
            <Textarea
              value={config.body}
              onChange={(e) => setConfig(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Raw JSON body"
            />
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSubmit}>Create Tool</Button>
      </div>
    </div>
  );
}
