
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkflowNavigationProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function WorkflowNavigation({ activeCategory, onCategoryChange }: WorkflowNavigationProps) {
  return (
    <div className="border-b">
      <div className="container py-2">
        <Tabs value={activeCategory} onValueChange={onCategoryChange}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="llms">LLMs</TabsTrigger>
            <TabsTrigger value="logic">Logic</TabsTrigger>
            <TabsTrigger value="triggers">Triggers</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
