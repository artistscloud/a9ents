
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GlobalNav } from "@/components/layout/GlobalNav";
import { Bot, Zap, Star, Clock, Users, Brain } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const workflowTemplates = [
    { title: "Customer Support Bot", icon: <Users className="h-6 w-6" /> },
    { title: "Data Analysis Assistant", icon: <Brain className="h-6 w-6" /> },
    { title: "Content Generator", icon: <Bot className="h-6 w-6" /> },
    { title: "Process Automation", icon: <Zap className="h-6 w-6" /> },
    { title: "Research Assistant", icon: <Clock className="h-6 w-6" /> },
    { title: "Meeting Summarizer", icon: <Star className="h-6 w-6" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-24">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Build Your AI Workforce to
            <span className="block text-primary">Automate</span>
          </h1>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" onClick={() => navigate('/signup')}>
              Get started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/about')}
            >
              Learn more
            </Button>
          </div>
        </div>

        {/* Templates Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">
              Get inspired by our curated collection of
              <span className="text-primary"> AI workflow templates</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowTemplates.map((template, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  {template.icon}
                  <h3 className="text-xl font-semibold">{template.title}</h3>
                </div>
                <Button variant="outline" className="w-full">
                  Use Template
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Speed Section */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Build an AI workflow at{" "}
            <span className="text-primary">typing speed</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Create, test, and deploy AI workflows as fast as you can type.
            No coding required.
          </p>
          <Button size="lg">
            Start Building
          </Button>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h2 className="text-3xl font-bold">
              Recommended by
              <span className="block text-primary">the world's most innovative professionals</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <p className="text-muted-foreground mb-4">
                  "A9ents has transformed how we handle our AI workflows. 
                  The automation capabilities are outstanding."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10" />
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-sm text-muted-foreground">Tech Lead, Example Corp</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-6">
                <h3 className="font-semibold mb-2">How does A9ents work?</h3>
                <p className="text-muted-foreground">
                  A9ents provides an intuitive platform for creating and managing AI workflows.
                  Simply choose a template or start from scratch, customize your workflow,
                  and deploy it in minutes.
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Make AI your business's operational advantage
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals using A9ents to automate their workflows
            and scale their operations.
          </p>
          <Button size="lg" onClick={() => navigate('/signup')}>
            Get Started
          </Button>
        </section>
      </main>
    </div>
  );
}
