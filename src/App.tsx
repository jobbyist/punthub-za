import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import BottomNav from "@/components/BottomNav";
import CookieBanner from "@/components/CookieBanner";
import PuntHubAI from "@/components/PuntHubAI";
import Index from "./pages/Index";
import Markets from "./pages/Markets";
import Rewards from "./pages/Rewards";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Casino from "./pages/Casino";
import Sports from "./pages/Sports";
import Wallet from "./pages/Wallet";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Verify from "./pages/Verify";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import About from "./pages/About";
import Careers from "./pages/Careers";
import FoundingMembers from "./pages/FoundingMembers";
import Legal from "./pages/Legal";
import ResponsibleGaming from "./pages/ResponsibleGaming";
import NotFound from "./pages/NotFound";

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
              <Route path="/" element={<Index />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/casino" element={<Casino />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/wallet/deposit" element={<Deposit />} />
              <Route path="/wallet/withdraw" element={<Withdraw />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/founding-members" element={<FoundingMembers />} />
              <Route path="/responsible-gaming" element={<ResponsibleGaming />} />
              <Route path="/legal/:doc" element={<Legal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
            <CookieBanner />
            <PuntHubAI />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
