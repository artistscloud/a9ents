
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateCustomToolSheet } from "@/components/tools/CreateCustomToolSheet";
import { Plus, MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { EditToolForm } from "@/components/tools/EditToolForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  created_at: string;
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

const Tools = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: tools = [], isLoading } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Tool[];
    },
  });

  const handleEditClick = (tool: Tool) => {
    setSelectedTool(tool);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="animate-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Tools</h1>
          <CreateCustomToolSheet />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-muted rounded" />
                    <div className="h-4 w-24 bg-muted rounded mt-2" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Tools</h1>
        <CreateCustomToolSheet />
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
            <Card 
              key={tool.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleEditClick(tool)}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-center gap-4">
                  {tool.icon_url && (
                    <img 
                      src={tool.icon_url} 
                      alt="" 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <CardTitle className="text-xl">{tool.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Last updated {format(new Date(tool.created_at), 'M/d/yyyy')}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(tool);
                    }}>
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update custom API tool</DialogTitle>
          </DialogHeader>
          {selectedTool && (
            <EditToolForm 
              tool={selectedTool}
              onClose={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tools;
