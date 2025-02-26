
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthLayout } from "./components/layout/AuthLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Index from "./pages/Index";
import Agents from "./pages/Agents";
import Tools from "./pages/Tools";
import Workflows from "./pages/Workflows";
import Knowledgebase from "./pages/Knowledgebase";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <AuthLayout>
              <Index />
            </AuthLayout>
          }
        />
        <Route
          path="/agents"
          element={
            <AuthLayout>
              <Agents />
            </AuthLayout>
          }
        />
        <Route
          path="/tools"
          element={
            <AuthLayout requireAdmin>
              <Tools />
            </AuthLayout>
          }
        />
        <Route
          path="/workflows"
          element={
            <AuthLayout>
              <Workflows />
            </AuthLayout>
          }
        />
        <Route
          path="/knowledgebase"
          element={
            <AuthLayout>
              <Knowledgebase />
            </AuthLayout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
