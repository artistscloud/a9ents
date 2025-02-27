
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { ApiConfig, CustomTool } from "./types";
import { FormField } from "./api-config/types";
import { HeadersForm } from "./api-config/HeadersForm";
import { QueryParamsForm } from "./api-config/QueryParamsForm";
import { BodyForm } from "./api-config/BodyForm";

interface APIConfigurationFormProps {
  tool?: Partial<CustomTool>;
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
    isFormData: tool?.apiConfig?.isFormData || false,
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
    setHeaderFields(fields);
  };

  const updateQueryParams = (fields: FormField[]) => {
    const queryParams: Record<string, string> = {};
    fields.forEach(field => {
      if (field.key) queryParams[field.key] = field.value;
    });
    setConfig(prev => ({ ...prev, queryParams }));
    setQueryFields(fields);
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
    setBodyFields(fields);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="space-y-4">
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

        <HeadersForm
          fields={headerFields}
          onFieldsChange={updateHeaders}
        />

        <QueryParamsForm
          fields={queryFields}
          onFieldsChange={updateQueryParams}
        />

        <BodyForm
          isFormData={config.isFormData}
          fields={bodyFields}
          rawBody={config.body}
          onFieldsChange={updateBody}
          onRawBodyChange={(body) => setConfig(prev => ({ ...prev, body }))}
          onIsFormDataChange={(isFormData) => {
            setConfig(prev => ({ ...prev, isFormData }));
            setBodyFields(isFormData ? [{ key: '', value: '' }] : [{ key: '', value: config.body }]);
          }}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={() => onCreate(config)}>Create Tool</Button>
      </div>
    </div>
  );
}
