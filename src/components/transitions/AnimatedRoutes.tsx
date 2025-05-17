import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";

// Page Components
import Index from "@/pages/Index";
import Dashboard from "@/pages/user/Dashboard";
import ConcoursPage from "@/pages/user/Concours";
import ExamView from "@/pages/user/ExamView";
import Correction from "@/pages/user/Correction";
import Payment from "@/pages/user/Payment";
import Admin from "@/pages/admin/Admin";
import Login from "@/pages/user/Login";
import Support from "@/pages/user/Support";
import Settings from "@/pages/user/Settings";
import NotFound from "@/pages/user/NotFound";
import AuthCallback from "@/pages/user/AuthCallback";
import RequireAuth from "@/components/RequireAuth";

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          } 
        />
        <Route 
          path="/support" 
          element={
            <PageTransition>
              <Support />
            </PageTransition>
          } 
        />
        <Route 
          path="/payment" 
          element={
            <PageTransition>
              <Payment />
            </PageTransition>
          } 
        />
        <Route 
          path="/auth/callback" 
          element={
            <PageTransition>
              <AuthCallback />
            </PageTransition>
          } 
        />
        
        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route 
            path="/statistiques" 
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            } 
          />
          <Route 
            path="/concours" 
            element={
              <PageTransition>
                <ConcoursPage />
              </PageTransition>
            } 
          />
          <Route 
            path="/exam/:id" 
            element={
              <PageTransition>
                <ExamView />
              </PageTransition>
            } 
          />
          <Route 
            path="/exam-view/:id" 
            element={
              <PageTransition>
                <ExamView />
              </PageTransition>
            } 
          />
          <Route 
            path="/correction/:id" 
            element={
              <PageTransition>
                <Correction />
              </PageTransition>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <PageTransition>
                <Admin />
              </PageTransition>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <PageTransition>
                <Settings />
              </PageTransition>
            } 
          />
          
          {/* Legacy routes redirects */}
          <Route path="/dashboard" element={<Navigate replace to="/statistiques" />} />
          <Route path="/concours/:id" element={<Navigate replace to="/exam-view/:id" />} />
        </Route>
        
        {/* 404 route */}
        <Route 
          path="*" 
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
