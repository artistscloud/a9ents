
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Activity, Bot, Box, Workflow } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type Profile = Database['public']['Tables']['profiles']['Row'];

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    agents: 0,
    tools: 0,
    workflows: 0,
  });
  const [creditUsage, setCreditUsage] = useState({
    used: 750,
    total: 1000,
  });

  // Sample data for charts - replace with real data from your backend
  const weeklyExecutions = [
    { name: 'Mon', success: 65, failure: 12 },
    { name: 'Tue', success: 59, failure: 8 },
    { name: 'Wed', success: 80, failure: 15 },
    { name: 'Thu', success: 81, failure: 11 },
    { name: 'Fri', success: 56, failure: 7 },
    { name: 'Sat', success: 55, failure: 9 },
    { name: 'Sun', success: 40, failure: 5 },
  ];

  const pieData = [
    { name: 'Successful', value: 435, color: '#22c55e' },
    { name: 'Failed', value: 67, color: '#ef4444' },
  ];

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

  const creditPercentage = (creditUsage.used / creditUsage.total) * 100;

  return (
    <div className="animate-in space-y-8">
      <h1 className="text-2xl font-bold mb-4">
        {isAdmin ? "Admin Dashboard" : "Dashboard"}
      </h1>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.agents}</div>
            <p className="text-xs text-muted-foreground">Active AI Agents</p>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tools</CardTitle>
              <Box className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tools}</div>
              <p className="text-xs text-muted-foreground">Available Tools</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workflows</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.workflows}</div>
            <p className="text-xs text-muted-foreground">Active Workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditUsage.used}/{creditUsage.total}</div>
            <Progress value={creditPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Credits Remaining: {creditUsage.total - creditUsage.used}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyExecutions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="success" fill="#22c55e" stackId="a" />
                <Bar dataKey="failure" fill="#ef4444" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
