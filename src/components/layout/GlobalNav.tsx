
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, HelpCircle, LayoutDashboard, Settings, UserCircle, Book, Key } from "lucide-react";

export function GlobalNav() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
            {!loading && (
              user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                  <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Account
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onSelect={() => navigate('/dashboard')}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => navigate('/api')}>
                          <Key className="mr-2 h-4 w-4" />
                          API
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => navigate('/docs')}>
                          <Book className="mr-2 h-4 w-4" />
                          Documentation
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DialogTrigger asChild>
                          <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuItem onSelect={() => navigate('/help')}>
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Help
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={handleSignOut}>
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="profile" className="mt-4">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="profile">Profile</TabsTrigger>
                          <TabsTrigger value="subscription">Subscription</TabsTrigger>
                          <TabsTrigger value="general">General</TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile" className="space-y-4 mt-4">
                          <div className="flex items-center gap-4">
                            <UserCircle className="h-20 w-20 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium">{user.email}</h4>
                              <p className="text-sm text-muted-foreground">
                                Update your profile information
                              </p>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="subscription" className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Current Plan</h4>
                            <p className="text-sm text-muted-foreground">
                              Free Plan
                            </p>
                          </div>
                        </TabsContent>
                        <TabsContent value="general" className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">General Settings</h4>
                            <p className="text-sm text-muted-foreground">
                              Manage your general preferences
                            </p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/signup')}>
                    Sign Up
                  </Button>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
