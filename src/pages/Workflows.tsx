
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Workflows = () => {
  const [workflows, setWorkflows] = useState([]);

  return (
    <div className="animate-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Workflows</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Workflow
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workflows.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create your first workflow to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          workflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <CardTitle>{workflow.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {workflow.steps.length} steps
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Workflows;
