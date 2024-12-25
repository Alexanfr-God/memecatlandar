import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Index from "./pages/Index";
import SubmitMeme from "./pages/SubmitMeme";
import { MemeDetailPage } from "./components/meme/detail/MemeDetailPage";
import TopMemes from "./pages/TopMemes";
import AdminDashboard from "./pages/AdminDashboard";
import Terms from "./pages/Terms";
import MyStory from "./pages/MyStory";
import Dashboard from "./pages/Dashboard";
import MyMemes from "./pages/MyMemes";
import Watchlist from "./pages/Watchlist";
import Tuzemoon from "./pages/Tuzemoon";

const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID = "815250406099-noep2rm2svbegg4hpevbenkucu1qhur1.apps.googleusercontent.com";

const AppContent = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/submit" element={<SubmitMeme />} />
              <Route path="/meme/:id" element={<MemeDetailPage />} />
              <Route path="/top-memes" element={<TopMemes />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/my-story" element={<MyStory />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-memes" element={<MyMemes />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/tuzemoon" element={<Tuzemoon />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <AppContent />
    </React.StrictMode>
  );
};

export default App;