
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { MainLayout } from "./components/layout/MainLayout";

import Index from "./pages/Index";
import Agents from "./pages/Agents";
import Tools from "./pages/Tools";
import Workflows from "./pages/Workflows";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
    <Toaster />
  </QueryClientProvider>
);

export default App;
