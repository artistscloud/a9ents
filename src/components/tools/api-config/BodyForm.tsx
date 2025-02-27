
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { FormField, BodyFormProps } from "./types";

export function BodyForm({ 
  isFormData, 
  fields, 
  rawBody,
  onFieldsChange,
  onRawBodyChange,
  onIsFormDataChange,
}: BodyFormProps) {
  const addField = () => {
    const newFields = [...fields, { key: '', value: '' }];
    onFieldsChange(newFields);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    onFieldsChange(newFields);
  };

  const updateField = (index: number, field: FormField) => {
    const newFields = [...fields];
    newFields[index] = field;
    onFieldsChange(newFields);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Body</Label>
        <div className="flex items-center gap-2">
          <Label htmlFor="form-data">Form Data</Label>
          <Switch
            id="form-data"
            checked={isFormData}
            onCheckedChange={onIsFormDataChange}
          />
        </div>
      </div>
      {isFormData ? (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Key"
                value={field.key}
                onChange={(e) => updateField(index, { ...field, key: e.target.value })}
              />
              <Input
                placeholder="Value"
                value={field.value}
                onChange={(e) => updateField(index, { ...field, value: e.target.value })}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeField(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addField}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </div>
      ) : (
        <Textarea
          value={rawBody}
          onChange={(e) => onRawBodyChange(e.target.value)}
          placeholder="Raw JSON body"
        />
      )}
    </div>
  );
}
