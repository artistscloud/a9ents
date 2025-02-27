
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InitialToolFormProps {
  sampleRequest: string;
  purpose: string;
  onSampleRequestChange: (value: string) => void;
  onPurposeChange: (value: string) => void;
  onGenerateWithAI: () => void;
  onImportJSON: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InitialToolForm({
  sampleRequest,
  purpose,
  onSampleRequestChange,
  onPurposeChange,
  onGenerateWithAI,
  onImportJSON,
}: InitialToolFormProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="sample-request">Sample API Request</Label>
        <Textarea
          id="sample-request"
          placeholder="e.g., GET https://api.example.com/users/123"
          value={sampleRequest}
          onChange={(e) => onSampleRequestChange(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="purpose">Purpose (optional)</Label>
        <Input
          type="text"
          id="purpose"
          placeholder="e.g., Fetch user data"
          value={purpose}
          onChange={(e) => onPurposeChange(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <label htmlFor="json-upload" className="cursor-pointer">
            Import JSON
          </label>
          <input
            type="file"
            id="json-upload"
            accept=".json"
            className="hidden"
            onChange={onImportJSON}
          />
        </Button>
        <Button onClick={onGenerateWithAI}>Generate with AI</Button>
      </div>
    </div>
  );
}
