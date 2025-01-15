import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLikeActions = (memeId: string, userId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLike = async () => {
    if (!userId) {
      throw new Error("Please login to like memes");
    }

    try {
      const { error: insertError } = await supabase
        .from('Likes')
        .insert([{ 
          user_id: userId, 
          meme_id: Number(memeId)
        }]);

      if (insertError) {
        throw insertError;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["memes"] }),
        queryClient.invalidateQueries({ queryKey: ["user-likes"] })
      ]);

    } catch (error: any) {
      console.error("Error in handleLike:", error);
      throw error;
    }
  };

  const handleUnlike = async () => {
    if (!userId) {
      throw new Error("Please login to unlike memes");
    }

    try {
      const { error: deleteError } = await supabase
        .from('Likes')
        .delete()
        .eq('user_id', userId)
        .eq('meme_id', Number(memeId));

      if (deleteError) {
        throw deleteError;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["memes"] }),
        queryClient.invalidateQueries({ queryKey: ["user-likes"] })
      ]);

    } catch (error: any) {
      console.error("Error in handleUnlike:", error);
      throw error;
    }
  };

  return {
    handleLike,
    handleUnlike,
    isProcessing
  };
};