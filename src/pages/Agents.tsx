
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CreateAgentModal } from "@/components/agents/CreateAgentModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const Agents = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch agents with their related data
  const { data: agents = [], refetch } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agents')
        .select(`
          *,
          workflows:workflow_id(*),
          knowledgebase:knowledgebase_id(*)
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const handleDeleteAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="animate-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Agents</h1>
        <Button onClick={() => setCreateModalOpen(true)}>
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
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {agent.workflows && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Workflow:</span>
                      <span className="text-sm text-muted-foreground">
                        {agent.workflows.name}
                      </span>
                    </div>
                  )}
                  {agent.knowledgebase && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Knowledgebase:</span>
                      <span className="text-sm text-muted-foreground">
                        {agent.knowledgebase.title}
                      </span>
                    </div>
                  )}
                  {agent.selected_tools && agent.selected_tools.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Tools:</span>
                      <span className="text-sm text-muted-foreground">
                        {agent.selected_tools.length} tools selected
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteAgent(agent.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                {agent.workflows && (
                  <Link to={`/workflows/${agent.workflows.id}`}>
                    <Button variant="outline" size="sm">
                      View Workflow
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <CreateAgentModal 
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
};

export default Agents;
