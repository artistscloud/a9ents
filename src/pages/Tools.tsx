
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateCustomToolSheet } from "@/components/tools/CreateCustomToolSheet";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Tools = () => {
  const { data: tools = [], isLoading } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="animate-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Tools</h1>
          <CreateCustomToolSheet />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="animate-pulse bg-muted h-6 w-32 rounded" />
            </CardHeader>
            <CardContent>
              <p className="animate-pulse bg-muted h-4 w-full rounded" />
            </CardContent>
          </Card>
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
            <Card key={tool.id}>
              <CardHeader className="flex flex-row items-center gap-2">
                {tool.icon_url && (
                  <img src={tool.icon_url} alt="" className="w-6 h-6 rounded" />
                )}
                <CardTitle>{tool.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tool.description}</p>
                {tool.tags && tool.tags.length > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {tool.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Tools;
