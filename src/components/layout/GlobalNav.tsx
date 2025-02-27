
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  UserCircle,
  Settings,
  HelpCircle,
  LayoutDashboard,
  Shield,
  Book,
  Key,
  FileText
} from "lucide-react";

export function GlobalNav() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  
  return (
    <nav className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold">
              Home
            </Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link to="/admin" className="text-muted-foreground hover:text-foreground">
              Admin Panel
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    {user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onSelect={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/admin')}>
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/tools')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Tools
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/agents')}>
                    <Key className="mr-2 h-4 w-4" />
                    Agents
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/workflows')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Workflows
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/knowledgebase')}>
                    <Book className="mr-2 h-4 w-4" />
                    Knowledge Base
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/docs')}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Documentation
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
