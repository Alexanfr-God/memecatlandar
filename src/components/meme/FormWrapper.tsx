import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { FormHeader } from "./form/FormHeader";
import { FormBody } from "./form/FormBody";
import { FormFooter } from "./form/FormFooter";

export interface FormWrapperProps {
  onSubmitAttempt: () => void;
  isAuthenticated: boolean;
}

export const FormWrapper = ({ onSubmitAttempt, isAuthenticated }: FormWrapperProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [createdAt, setCreatedAt] = useState<Date>();
  const [twitterLink, setTwitterLink] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [tradeLink, setTradeLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session);
      setUser(session?.user || null);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      console.log("User not authenticated");
      onSubmitAttempt();
      return;
    }

    if (!imageUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting meme with user ID:", user.id);
      const memeData = {
        title,
        description,
        blockchain,
        twitter_link: twitterLink || null,
        telegram_link: telegramLink || null,
        trade_link: tradeLink || null,
        image_url: imageUrl,
        created_by: user.id,
        created_at: createdAt?.toISOString() || new Date().toISOString(),
        time_until_listing: createdAt?.toISOString() || new Date().toISOString()
      };

      console.log("Meme data to submit:", memeData);

      if (isEditing && editingId) {
        const { error: updateError } = await supabase
          .from('Memes')
          .update(memeData)
          .eq('id', editingId);

        if (updateError) {
          console.error("Update error:", updateError);
          throw updateError;
        }
      } else {
        const { error: insertError } = await supabase
          .from('Memes')
          .insert([memeData]);

        if (insertError) {
          console.error("Insert error:", insertError);
          throw insertError;
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["memes"] });

      toast({
        title: "Success!",
        description: isEditing ? "Meme updated successfully." : "Meme submitted successfully.",
      });
      
      navigate("/my-memes");
    } catch (error: any) {
      console.error('Error submitting meme:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Unable to submit the meme. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormHeader isEditing={isEditing} />
      
      <FormBody
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        blockchain={blockchain}
        setBlockchain={setBlockchain}
        createdAt={createdAt}
        setCreatedAt={setCreatedAt}
        twitterLink={twitterLink}
        setTwitterLink={setTwitterLink}
        telegramLink={telegramLink}
        setTelegramLink={setTelegramLink}
        tradeLink={tradeLink}
        setTradeLink={setTradeLink}
      />
      
      <FormFooter 
        isEditing={isEditing} 
        isSubmitting={isSubmitting} 
      />
    </form>
  );
};