import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/user/Dashboard";
import Concours from "./pages/user/Concours";
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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/concours/:id" element={<Concours />} />
                <Route path="/correction/:id" element={<Correction />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/settings" element={<Settings />} />
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
