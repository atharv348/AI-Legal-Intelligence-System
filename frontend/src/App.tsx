import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/components/DashboardLayout";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ChatbotPage from "./pages/ChatbotPage";
import SearchPage from "./pages/SearchPage";
import DrafterPage from "./pages/DrafterPage";
import PredictorPage from "./pages/PredictorPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedPage = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard>
    <DashboardLayout>{children}</DashboardLayout>
  </AuthGuard>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
          <Route path="/chatbot" element={<ProtectedPage><ChatbotPage /></ProtectedPage>} />
          <Route path="/search" element={<ProtectedPage><SearchPage /></ProtectedPage>} />
          <Route path="/drafter" element={<ProtectedPage><DrafterPage /></ProtectedPage>} />
          <Route path="/predictor" element={<ProtectedPage><PredictorPage /></ProtectedPage>} />
          <Route path="/profile" element={<ProtectedPage><ProfilePage /></ProtectedPage>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
