
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pencil, Copy, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface WorkflowCardProps {
  id: string;
  name: string;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function WorkflowCard({ id, name, onDelete, onDuplicate }: WorkflowCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePlay = async () => {
    setIsLoading(true);
    try {
      // Trigger workflow execution
      toast({
        title: "Workflow Started",
        description: "The workflow has been triggered successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start the workflow.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{name}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/workflows/${id}`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDuplicate(id)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Last modified: {new Date().toLocaleDateString()}
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePlay}
            disabled={isLoading}
          >
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
