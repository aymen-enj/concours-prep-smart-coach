import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/user/Dashboard";
import ConcoursPage from "./pages/user/Concours";
import ExamView from "./pages/user/ExamView";
import Correction from "./pages/user/Correction";
import Payment from "./pages/user/Payment";
import Admin from "./pages/admin/Admin";
import Login from "./pages/user/Login";
import Support from "./pages/user/Support";
import Settings from "./pages/user/Settings";
import NotFound from "./pages/user/NotFound";
import FloatingChatButton from "./components/FloatingChatButton";
import { ThemeProvider } from "./providers/ThemeProvider";
import AuthProvider from "./providers/AuthProvider";
import RequireAuth from "./components/RequireAuth";

// Import global styles
import "@/styles/landing-transitions.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/support" element={<Support />} />
              <Route path="/payment" element={<Payment />} />

              {/* Protected routes */}
              <Route element={<RequireAuth />}>
                <Route path="/statistiques" element={<Dashboard />} />
                <Route path="/concours" element={<ConcoursPage />} />
                <Route path="/exam/:id" element={<ExamView />} />
                <Route path="/exam-view/:id" element={<ExamView />} />
                <Route path="/correction/:id" element={<Correction />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Legacy routes redirects */}
                <Route path="/dashboard" element={<Navigate replace to="/statistiques" />} />
                <Route path="/concours/:id" element={<Navigate replace to="/exam-view/:id" />} />
              </Route>

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <FloatingChatButton />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
