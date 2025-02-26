
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    agents: 0,
    tools: 0,
    workflows: 0,
  });

  useEffect(() => {
    const checkRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          setIsAdmin(profile?.role === 'admin');

          // Fetch stats
          const [agents, tools, workflows] = await Promise.all([
            supabase.from('agents').select('id', { count: 'exact' }),
            supabase.from('tools').select('id', { count: 'exact' }),
            supabase.from('workflows').select('id', { count: 'exact' }),
          ]);

          setStats({
            agents: agents.count || 0,
            tools: tools.count || 0,
            workflows: workflows.count || 0,
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="animate-in">
      <h1 className="text-4xl font-bold mb-8">
        {isAdmin ? "Admin Dashboard" : "Dashboard"}
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.agents}</p>
            <p className="text-muted-foreground">Total Agents</p>
          </CardContent>
        </Card>
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.tools}</p>
              <p className="text-muted-foreground">Available Tools</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.workflows}</p>
            <p className="text-muted-foreground">Active Workflows</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
