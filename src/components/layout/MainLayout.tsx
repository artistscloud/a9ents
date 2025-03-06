
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GlobalNav } from "./GlobalNav";
import { SiteNotification } from "./SiteNotification";
import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

const dashboardLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/agents", label: "Agents" },
  { href: "/workflows", label: "Workflows" },
  { href: "/tools", label: "Tools" },
  { href: "/knowledgebase", label: "Knowledgebase" },
];

export function MainLayout({ children }: MainLayoutProps) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full">
        <GlobalNav />
        
        {user && (
          <nav className="border-b bg-muted/40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-14 items-center justify-center space-x-8">
                {dashboardLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        )}

        <SiteNotification />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
