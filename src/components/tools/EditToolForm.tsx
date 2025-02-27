
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  instruction: string;
  tags: string[];
  api_config: {
    method: string;
    url: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
    body: string;
    isFormData?: boolean;
  };
}

interface EditToolFormProps {
  tool: Tool;
  onClose: () => void;
}

export function EditToolForm({ tool, onClose }: EditToolFormProps) {
  const [formData, setFormData] = useState({
    name: tool.name,
    description: tool.description,
    icon_url: tool.icon_url,
    instruction: tool.instruction,
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('tools')
        .update(formData)
        .eq('id', tool.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['tools'] });
      
      toast({
        title: "Success",
        description: "Tool updated successfully",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tool",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name (for AI)</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description (for AI)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="icon_url">Icon URL</Label>
          <Input
            id="icon_url"
            value={formData.icon_url}
            onChange={(e) => setFormData(prev => ({ ...prev, icon_url: e.target.value }))}
            type="url"
          />
        </div>

        <div>
          <Label htmlFor="instruction">Instruction</Label>
          <Textarea
            id="instruction"
            value={formData.instruction}
            onChange={(e) => setFormData(prev => ({ ...prev, instruction: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Update
        </Button>
      </div>
    </form>
  );
}
