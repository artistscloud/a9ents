
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkflowCard } from "@/components/workflows/WorkflowCard";

export default function Workflows() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch workflows
  const { data: workflows = [], isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create workflow mutation
  const createWorkflow = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('workflows')
        .insert([{ name: 'New Workflow' }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({
        title: "Success",
        description: "New workflow created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create workflow.",
        variant: "destructive",
      });
    },
  });

  // Delete workflow mutation
  const deleteWorkflow = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({
        title: "Success",
        description: "Workflow deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete workflow.",
        variant: "destructive",
      });
    },
  });

  // Duplicate workflow mutation
  const duplicateWorkflow = useMutation({
    mutationFn: async (id: string) => {
      // First get the workflow to duplicate
      const { data: workflow, error: fetchError } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Create new workflow with same data
      const { error: insertError } = await supabase
        .from('workflows')
        .insert([{
          name: `${workflow.name} (Copy)`,
          steps: workflow.steps
        }]);

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({
        title: "Success",
        description: "Workflow duplicated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to duplicate workflow.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="animate-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Workflows</h1>
        <Button onClick={() => createWorkflow.mutate()}>
          <Plus className="h-4 w-4 mr-2" />
          New Workflow
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div>Loading workflows...</div>
        ) : workflows.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">
            No workflows yet. Create your first one to get started.
          </div>
        ) : (
          workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              id={workflow.id}
              name={workflow.name}
              onDelete={(id) => deleteWorkflow.mutate(id)}
              onDuplicate={(id) => duplicateWorkflow.mutate(id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
