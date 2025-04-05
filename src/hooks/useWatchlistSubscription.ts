
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useWatchlistSubscription = (onUpdate: () => void) => {
  useEffect(() => {
    const channel = supabase
      .channel('watchlist_broadcasts')
      .on(
        'broadcast',
        { event: '*' },
        (payload) => {
          console.log("Watchlist broadcast received:", payload);
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [onUpdate]);
};
