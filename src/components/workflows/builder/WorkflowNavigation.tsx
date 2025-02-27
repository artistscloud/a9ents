
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CircuitBoard,
  Brain,
  Database,
  Globe,
  FileText,
  Headphones,
  GitFork,
  MessageSquare,
  Grid
} from "lucide-react";

interface WorkflowNavigationProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function WorkflowNavigation({ activeCategory, onCategoryChange }: WorkflowNavigationProps) {
  return (
    <div className="border-b">
      <div className="container py-2">
        <Tabs value={activeCategory} onValueChange={onCategoryChange}>
          <TabsList className="w-full justify-start gap-2 overflow-x-auto">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <CircuitBoard className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="llms" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              LLMs
            </TabsTrigger>
            <TabsTrigger value="knowledge-base" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Knowledge Base
            </TabsTrigger>
            <TabsTrigger value="multi-modal" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              Multi-Modal
            </TabsTrigger>
            <TabsTrigger value="logic" className="flex items-center gap-2">
              <GitFork className="h-4 w-4" />
              Logic
            </TabsTrigger>
            <TabsTrigger value="data-transformation" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Data Transform
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="triggers" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Triggers
            </TabsTrigger>
            <TabsTrigger value="data-loaders" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Loaders
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
