
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SessionManager } from '@/utils/auth/sessionManager';

export const SessionHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const sessionManager = SessionManager.getInstance();

  useEffect(() => {
    const handleUserRoles = async (userId: string) => {
      try {
        console.log('Checking user roles:', userId);
        
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('is_verified, is_admin, email, name, profile_image')
          .eq('auth_id', userId)
          .single();
        
        if (userError) {
          console.error('Error fetching user data:', userError);
          return null;
        }
        
        return userData;
      } catch (error) {
        console.error('Error in handleUserRoles:', error);
        return null;
      }
    };

    // Configure security settings for the auth session
    const configureAuthSecurity = async () => {
      try {
        // Check if the auth configuration has leak protection enabled
        const { data, error } = await supabase.functions.invoke('check-auth-config', {
          body: { action: 'check_leak_protection' }
        });
        
        if (error) {
          console.error('Error checking auth config:', error);
          return;
        }
        
        if (!data.leak_protection_enabled) {
          console.warn('Leaked password protection is disabled. Enabling it for enhanced security.');
          
          // Enable leaked password protection via API call
          const { error: updateError } = await supabase.functions.invoke('update-auth-config', {
            body: { enable_leak_protection: true }
          });
          
          if (updateError) {
            console.error('Failed to enable leak protection:', updateError);
            toast({
              title: "Security Setting Update Failed",
              description: "Could not enable password leak protection. Please contact an administrator.",
              variant: "destructive"
            });
          } else {
            console.log('Successfully enabled leaked password protection');
            toast({
              title: "Security Enhanced",
              description: "Password leak protection has been enabled for better security.",
            });
          }
        }
      } catch (error) {
        console.error('Error configuring auth security:', error);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed in SessionHandler:', { 
        event, 
        userId: session?.user?.id,
        timestamp: new Date().toISOString()
      });

      if (event === 'SIGNED_IN' && session?.user?.id) {
        const userData = await handleUserRoles(session.user.id);
        
        if (!userData) {
          console.error('User data not found after login');
          await supabase.auth.signOut();
          navigate('/');
          return;
        }

        if (userData.is_admin) {
          // Admin users can configure security settings
          await configureAuthSecurity();
          navigate('/admin');
        }
      }

      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          const userData = await handleUserRoles(session.user.id);
          
          // If the user is an admin, check the security configuration
          if (userData?.is_admin) {
            await configureAuthSecurity();
          }
        }
      } catch (error) {
        console.error('Error during initial session check:', error);
      }
    };

    void checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  return null;
};
