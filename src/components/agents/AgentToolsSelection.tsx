
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AgentToolsSelectionProps {
  selectedKnowledgebase: string;
  selectedTools: string[];
  selectedWorkflow: string;
  workflows: Array<{ id: string; name: string }>;
  onKnowledgebaseChange: (value: string) => void;
  onToolsChange: (tools: string[]) => void;
  onWorkflowChange: (value: string) => void;
}

export function AgentToolsSelection({
  selectedKnowledgebase,
  selectedTools,
  selectedWorkflow,
  workflows,
  onKnowledgebaseChange,
  onToolsChange,
  onWorkflowChange,
}: AgentToolsSelectionProps) {
  const availableTools = [
    { id: "1", name: "Web Search" },
    { id: "2", name: "File Processing" },
    { id: "3", name: "Data Analysis" },
    { id: "4", name: "Code Generation" },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Workflow</Label>
        <Select value={selectedWorkflow} onValueChange={onWorkflowChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select workflow" />
          </SelectTrigger>
          <SelectContent>
            {workflows.map((workflow) => (
              <SelectItem key={workflow.id} value={workflow.id}>
                {workflow.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Knowledgebase</Label>
        <Select value={selectedKnowledgebase} onValueChange={onKnowledgebaseChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select knowledgebase" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kb1">Company Guidelines</SelectItem>
            <SelectItem value="kb2">Technical Documentation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tools</Label>
        <div className="flex flex-wrap gap-2">
          {availableTools.map((tool) => (
            <Badge
              key={tool.id}
              variant={selectedTools.includes(tool.id) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                onToolsChange(
                  selectedTools.includes(tool.id)
                    ? selectedTools.filter(id => id !== tool.id)
                    : [...selectedTools, tool.id]
                );
              }}
            >
              {tool.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
