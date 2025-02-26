
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlobalNav } from "@/components/layout/GlobalNav";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to A9ents
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Your AI Agent Automation Platform
          </p>
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
      </main>
    </div>
  );
}
