
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

export default function Landing() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (provider?: 'github' | 'google') => {
    try {
      setLoading(true);
      if (provider) {
        await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });
      } else {
        // Redirect to login page for email login
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold">
                Home
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link to="/features" className="text-muted-foreground hover:text-foreground">
                Features
              </Link>
              <Link to="/use-cases" className="text-muted-foreground hover:text-foreground">
                Use Cases
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
            
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img 
                src="/placeholder.svg" 
                alt="Logo" 
                className="h-8 w-auto"
              />
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {loading ? "Loading..." : "Sign In"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onSelect={() => handleLogin()}>
                    Email Sign In
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleLogin('github')}>
                    Continue with GitHub
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleLogin('google')}>
                    Continue with Google
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => window.location.href = '/signup'}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to A9ents
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Your AI Agent Automation Platform
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" onClick={() => window.location.href = '/signup'}>
              Get started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.location.href = '/about'}
            >
              Learn more
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
