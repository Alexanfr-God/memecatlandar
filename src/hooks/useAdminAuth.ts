import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log('Checking admin status...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No session found, redirecting to login');
          setIsAdmin(false);
          setIsLoading(false);
          navigate('/');
          return;
        }

        const { data: userData, error } = await supabase
          .from('Users')
          .select('is_admin')
          .eq('auth_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching admin status:', error);
          throw error;
        }

        console.log('Admin status check:', {
          userId: session.user.id,
          isAdmin: userData?.is_admin
        });

        setIsAdmin(userData?.is_admin || false);

        // Only show the toast if we're on the admin route and user is not an admin
        if (!userData?.is_admin && location.pathname === '/admin') {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin panel.",
            variant: "destructive"
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Admin auth error:', error);
        setIsAdmin(false);
        if (location.pathname === '/admin') {
          toast({
            title: "Authentication Error",
            description: "Please try logging in again.",
            variant: "destructive"
          });
          navigate('/');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);

  return { isAdmin, isLoading };
};