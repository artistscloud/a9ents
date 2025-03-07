import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Tools from "@/pages/Tools";
import Agents from "@/pages/Agents";
import Workflows from "@/pages/Workflows";
import Knowledgebase from "@/pages/Knowledgebase";
import Dashboard from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Api from "@/pages/Api";
import Documentation from "@/pages/Documentation";
import AdminDashboard from "@/pages/admin/Dashboard";
import "./App.css";
import UserManual from "@/pages/UserManual";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<AuthLayout>{<Outlet />}</AuthLayout>}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>
            <Route element={<MainLayout>{<Outlet />}</MainLayout>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/workflows/:id" element={<Workflows />} />
              <Route path="/knowledgebase" element={<Knowledgebase />} />
              <Route path="/api" element={<Api />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/user-manual" element={<UserManual />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
