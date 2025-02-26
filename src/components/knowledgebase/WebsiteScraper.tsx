
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface WebsiteScraperProps {
  onSuccess: () => void;
}

export function WebsiteScraper({ onSuccess }: WebsiteScraperProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      const { data: scrapeData, error: scrapeError } = await supabase.functions
        .invoke('scrape-website', {
          body: { url },
        });

      if (scrapeError) throw scrapeError;

      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      const { error: insertError } = await supabase
        .from('knowledgebase')
        .insert({
          title: scrapeData.title || url,
          content: scrapeData.content,
          source_type: 'website',
          url: url,
          user_id: user.id
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Website content saved successfully",
      });
      onSuccess();
    } catch (error) {
      console.error('Scraping error:', error);
      toast({
        title: "Error",
        description: "Failed to scrape website",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleScrape} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
        />
      </div>
      <Button type="submit" disabled={!url || loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Scrape Website
      </Button>
    </form>
  );
}
