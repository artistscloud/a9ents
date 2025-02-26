
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Agents = () => {
  const [agents, setAgents] = useState([]);

  return (
    <div className="animate-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Agents</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Agent
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create your first agent to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          agents.map((agent) => (
            <Card key={agent.id}>
              <CardHeader>
                <CardTitle>{agent.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{agent.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Agents;
