import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";

interface WorkflowCardProps {
  id: string;
  name: string;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function WorkflowCard({ id, name, onDelete, onDuplicate }: WorkflowCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Workflow ID: {id}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add any additional workflow information here */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDuplicate(id)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Link to={`/workflows/${id}`}>
          <Button>Edit Workflow</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
