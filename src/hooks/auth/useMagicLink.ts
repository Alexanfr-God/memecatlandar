import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useMagicLink = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const sendMagicLink = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      toast({
        title: "Magic link sent!",
        description: "Please check your email for the login link.",
      });
    } catch (error: any) {
      console.error('Magic link error:', error);
      toast({
        variant: "destructive",
        title: "Failed to send magic link",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkCallback = async () => {
    try {
      const { error } = await supabase.auth.getSessionFromUrl();
      if (error) throw error;

      toast({
        title: "Success!",
        description: "Successfully logged in!",
      });
      navigate('/my-memes');
    } catch (error: any) {
      console.error('Magic link callback error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
      navigate('/');
    }
  };

  return {
    sendMagicLink,
    handleMagicLinkCallback,
    isLoading
  };
};