
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Key, Trash } from "lucide-react";

export default function Api() {
  const { toast } = useToast();
  const [newKeyName, setNewKeyName] = useState("");

  const { data: apiKeys, refetch: refetchApiKeys } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for your API key",
        variant: "destructive",
      });
      return;
    }

    try {
      const keyBuffer = crypto.getRandomValues(new Uint8Array(32));
      const key = Array.from(keyBuffer)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      const { error } = await supabase
        .from('api_keys')
        .insert([{
          name: newKeyName,
          key: key,
          expires_at: null
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "API key created successfully",
      });
      
      setNewKeyName("");
      refetchApiKeys();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "API key deleted successfully",
      });
      
      refetchApiKeys();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8 space-y-8 animate-in">
      <div>
        <h1 className="text-4xl font-bold">API Access</h1>
        <p className="text-muted-foreground mt-2">
          Manage your API keys and explore our API documentation
        </p>
      </div>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="guides">Integration Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New API Key</CardTitle>
              <CardDescription>
                Generate an API key to access our endpoints programmatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="e.g., Production API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateApiKey}>
                <Key className="mr-2 h-4 w-4" />
                Generate API Key
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                Manage your existing API keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              {apiKeys?.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No API keys found. Create one to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys?.map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{key.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Created: {new Date(key.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyKey(key.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteKey(key.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Endpoints</CardTitle>
              <CardDescription>
                Explore our API endpoints and their usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Authentication</h3>
                <Alert>
                  <AlertTitle>API Key Authentication</AlertTitle>
                  <AlertDescription>
                    Include your API key in the request headers:
                    <pre className="mt-2 p-2 bg-muted rounded-md">
                      Authorization: Bearer YOUR_API_KEY
                    </pre>
                  </AlertDescription>
                </Alert>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Agents</h3>
                <div className="space-y-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-sm font-medium bg-primary/10 rounded">GET</span>
                      <code>/api/agents</code>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      List all your agents
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-sm font-medium bg-primary/10 rounded">POST</span>
                      <code>/api/agents</code>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Create a new agent
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Workflows</h3>
                <div className="space-y-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-sm font-medium bg-primary/10 rounded">GET</span>
                      <code>/api/workflows</code>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      List all your workflows
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-sm font-medium bg-primary/10 rounded">POST</span>
                      <code>/api/workflows/execute</code>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Execute a workflow
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Guides</CardTitle>
              <CardDescription>
                Learn how to integrate with our API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Quick Start</h3>
                <div className="prose max-w-none">
                  <ol className="space-y-4">
                    <li>Generate an API key from the "API Keys" tab</li>
                    <li>Include your API key in the request headers</li>
                    <li>Make requests to our REST API endpoints</li>
                    <li>Handle responses and errors appropriately</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Code Examples</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">JavaScript/TypeScript</h4>
                    <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                      {`const response = await fetch('https://api.example.com/agents', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const agents = await response.json();`}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Python</h4>
                    <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                      {`import requests

response = requests.get(
    'https://api.example.com/agents',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)

agents = response.json()`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
