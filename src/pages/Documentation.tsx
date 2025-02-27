
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Documentation() {
  return (
    <div className="container py-8 space-y-8 animate-in">
      <div>
        <h1 className="text-4xl font-bold">Documentation</h1>
        <p className="text-muted-foreground mt-2">
          Learn how to use our platform effectively
        </p>
      </div>

      <div className="grid md:grid-cols-[250px_1fr] gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              <a href="#getting-started" className="block text-sm hover:text-primary">Getting Started</a>
              <a href="#agents" className="block text-sm hover:text-primary">Agents</a>
              <a href="#workflows" className="block text-sm hover:text-primary">Workflows</a>
              <a href="#tools" className="block text-sm hover:text-primary">Tools</a>
              <a href="#knowledgebase" className="block text-sm hover:text-primary">Knowledge Base</a>
              <a href="#api" className="block text-sm hover:text-primary">API Integration</a>
            </nav>
          </CardContent>
        </Card>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-8 pr-6">
            <section id="getting-started">
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <p>
                      Our platform provides a powerful way to create, manage, and automate AI agents
                      and workflows. Here's what you need to know to get started:
                    </p>
                    <ul>
                      <li>Create agents with specific capabilities and tools</li>
                      <li>Design workflows to automate complex processes</li>
                      <li>Integrate with external tools and APIs</li>
                      <li>Manage your knowledge base for improved agent performance</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="agents">
              <h2 className="text-2xl font-bold mb-4">Agents</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <h3>Creating Agents</h3>
                    <p>
                      Agents are AI-powered assistants that can perform specific tasks. To create an agent:
                    </p>
                    <ol>
                      <li>Click the "Create Agent" button</li>
                      <li>Provide a detailed description of the agent's purpose</li>
                      <li>Select the appropriate AI model and settings</li>
                      <li>Choose required tools and knowledge base access</li>
                      <li>Link to relevant workflows if needed</li>
                    </ol>

                    <h3>Agent Configuration</h3>
                    <p>
                      Each agent can be configured with:
                    </p>
                    <ul>
                      <li>Different AI models (OpenAI, Anthropic, etc.)</li>
                      <li>Custom tools and capabilities</li>
                      <li>Access to specific knowledge bases</li>
                      <li>Integration with workflows</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="workflows">
              <h2 className="text-2xl font-bold mb-4">Workflows</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <h3>Creating Workflows</h3>
                    <p>
                      Workflows allow you to chain together multiple actions and agents. Key features include:
                    </p>
                    <ul>
                      <li>Visual workflow builder</li>
                      <li>Multiple node types for different actions</li>
                      <li>Conditional branching</li>
                      <li>Error handling and retries</li>
                    </ul>

                    <h3>Workflow Types</h3>
                    <p>
                      You can create various types of workflows:
                    </p>
                    <ul>
                      <li>Sequential processing</li>
                      <li>Parallel execution</li>
                      <li>Event-driven workflows</li>
                      <li>Scheduled automations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="tools">
              <h2 className="text-2xl font-bold mb-4">Tools</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <p>
                      Tools extend the capabilities of your agents. Available tools include:
                    </p>
                    <ul>
                      <li>Web search and data retrieval</li>
                      <li>File processing and analysis</li>
                      <li>API integrations</li>
                      <li>Custom tool creation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="knowledgebase">
              <h2 className="text-2xl font-bold mb-4">Knowledge Base</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <p>
                      The knowledge base stores information that agents can access:
                    </p>
                    <ul>
                      <li>Document upload and processing</li>
                      <li>Website scraping and indexing</li>
                      <li>Structured data management</li>
                      <li>Version control and updates</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="api">
              <h2 className="text-2xl font-bold mb-4">API Integration</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <p>
                      Access platform features programmatically through our REST API:
                    </p>
                    <ul>
                      <li>Generate and manage API keys</li>
                      <li>Access agents and workflows</li>
                      <li>Automate processes</li>
                      <li>Integrate with external systems</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
