
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function UserManual() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const content = document.getElementById('user-manual-content');
      if (!content) return;

      const canvas = await html2canvas(content);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      // Add title
      pdf.setFontSize(24);
      pdf.text('AI Agent Platform User Manual', pdfWidth / 2, 20, { align: 'center' });
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('user-manual.pdf');

      toast({
        title: "Success",
        description: "User manual downloaded successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container py-8 space-y-8 animate-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">User Manual</h1>
          <p className="text-muted-foreground mt-2">
            Complete documentation for the AI Agent Platform
          </p>
        </div>
        <Button onClick={handleDownloadPDF} disabled={isGenerating}>
          <FileText className="mr-2 h-4 w-4" />
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div id="user-manual-content" className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Welcome to the AI Agent Platform, a comprehensive solution for creating, managing,
              and deploying AI agents with automated workflows. This manual provides detailed
              information about all features and functionalities of the platform.
            </p>
            <h3 className="text-lg font-semibold">System Requirements</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
              <li>Internet connection</li>
              <li>Valid account credentials</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Account Setup</h3>
            <p>
              To begin using the platform:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Sign up for an account using your email</li>
              <li>Verify your email address</li>
              <li>Complete your profile setup</li>
              <li>Configure your API keys for different LLM providers</li>
            </ol>

            <h3 className="text-lg font-semibold mt-4">Navigation</h3>
            <p>
              The platform consists of several main sections:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Dashboard - Overview of your agents and activities</li>
              <li>Agents - Create and manage AI agents</li>
              <li>Workflows - Design and monitor automated processes</li>
              <li>Tools - Configure and manage available tools</li>
              <li>Knowledge Base - Manage your agent's knowledge sources</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Creating Agents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Agent Configuration</h3>
            <p>
              To create a new agent:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Click "New Agent" in the Agents section</li>
              <li>Provide a detailed job description</li>
              <li>Select the AI model and adjust parameters:
                <ul className="list-disc pl-6 mt-2">
                  <li>Temperature (creativity vs. precision)</li>
                  <li>Max tokens (response length)</li>
                  <li>Model selection (GPT-4, Claude, etc.)</li>
                </ul>
              </li>
              <li>Choose required tools and capabilities</li>
              <li>Link to knowledge bases if needed</li>
              <li>Associate with or create new workflows</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Workflow Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Creating Workflows</h3>
            <p>
              Design automated processes using the workflow builder:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Drag and drop nodes to create process flow</li>
              <li>Configure node parameters and connections</li>
              <li>Set up conditional branching</li>
              <li>Add error handling and retries</li>
              <li>Test workflows before deployment</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">Workflow Types</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sequential Processing</li>
              <li>Parallel Execution</li>
              <li>Event-Driven Workflows</li>
              <li>Scheduled Automations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Tools and Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Available Tools</h3>
            <p>
              The platform provides various tools for agents:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Web Search and Data Retrieval</li>
              <li>File Processing and Analysis</li>
              <li>API Integrations</li>
              <li>Custom Tool Creation</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">API Configuration</h3>
            <p>
              Steps to configure API integrations:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Select the API tool type</li>
              <li>Configure authentication</li>
              <li>Set up endpoints and parameters</li>
              <li>Test the connection</li>
              <li>Save and enable for agents</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Knowledge Base Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Adding Knowledge</h3>
            <p>
              Methods to expand your agent's knowledge:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Document Upload
                <ul className="list-disc pl-6 mt-2">
                  <li>PDF documents</li>
                  <li>Word documents</li>
                  <li>Text files</li>
                  <li>HTML content</li>
                </ul>
              </li>
              <li>Website Scraping
                <ul className="list-disc pl-6 mt-2">
                  <li>URL configuration</li>
                  <li>Crawl settings</li>
                  <li>Content filtering</li>
                </ul>
              </li>
              <li>Direct Input
                <ul className="list-disc pl-6 mt-2">
                  <li>Text editor</li>
                  <li>Markdown support</li>
                  <li>Version control</li>
                </ul>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Monitoring and Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Performance Tracking</h3>
            <p>
              Monitor your agents and workflows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Real-time execution monitoring</li>
              <li>Success/failure rates</li>
              <li>Response times</li>
              <li>Resource usage</li>
              <li>Cost tracking</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">Analytics Dashboard</h3>
            <p>
              Available metrics and visualizations:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Agent performance metrics</li>
              <li>Workflow execution statistics</li>
              <li>Resource utilization graphs</li>
              <li>Cost analysis reports</li>
              <li>Usage trends</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Common Issues</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authentication Problems
                <ul className="list-disc pl-6 mt-2">
                  <li>Check API key validity</li>
                  <li>Verify account status</li>
                  <li>Review access permissions</li>
                </ul>
              </li>
              <li>Workflow Errors
                <ul className="list-disc pl-6 mt-2">
                  <li>Validate node configurations</li>
                  <li>Check connection settings</li>
                  <li>Review error logs</li>
                </ul>
              </li>
              <li>Performance Issues
                <ul className="list-disc pl-6 mt-2">
                  <li>Optimize workflow design</li>
                  <li>Adjust resource allocation</li>
                  <li>Monitor system metrics</li>
                </ul>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
