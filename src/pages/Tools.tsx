
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Tools = () => {
  const [tools, setTools] = useState([]);

  return (
    <div className="animate-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Tools</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Tool
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create your first tool to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          tools.map((tool) => (
            <Card key={tool.id}>
              <CardHeader>
                <CardTitle>{tool.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tool.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Tools;
