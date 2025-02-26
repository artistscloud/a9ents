
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Globe, Loader2 } from "lucide-react";

type KnowledgeItem = {
  id: string;
  title: string;
  content: string | null;
  tags: string[] | null;
  source_type: string;
  file_path: string | null;
  file_type: string | null;
  url: string | null;
  created_at: string;
};

export function KnowledgebaseList() {
  const { data: items, isLoading } = useQuery({
    queryKey: ['knowledgebase'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledgebase')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as KnowledgeItem[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!items?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No items in knowledge base yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              {item.source_type === 'file' ? (
                <FileText className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Globe className="h-5 w-5 text-muted-foreground" />
              )}
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {item.content}
            </p>
            <div className="flex flex-wrap gap-2">
              {item.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
