
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { FormField, QueryParamsFormProps } from "./types";

export function QueryParamsForm({ fields, onFieldsChange }: QueryParamsFormProps) {
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
        <Label>Query Parameters</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={addField}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Parameter
        </Button>
      </div>
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
    </div>
  );
}
