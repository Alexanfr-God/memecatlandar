import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface DeleteButtonProps {
  meme: {
    id: string;
    created_by?: string | null;
  };
  userId: string | null;
}

export const DeleteButton = ({ meme, userId }: DeleteButtonProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", userId],
    queryFn: async () => {
      if (!userId) return false;
      
      const { data, error } = await supabase
        .from("Users")
        .select("is_admin")
        .eq("auth_id", userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }

      return data?.is_admin || false;
    },
    enabled: !!userId,
    staleTime: 30000,
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to delete memes",
      });
      return;
    }

    if (!isAdmin && userId !== meme.created_by) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You don't have permission to delete this meme",
      });
      return;
    }

    try {
      setIsDeleting(true);
      
      // Обновляем запись, устанавливая is_deleted в true
      const { error: updateError } = await supabase
        .from('Memes')
        .update({ 
          is_deleted: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', parseInt(meme.id));

      if (updateError) {
        console.error('Delete error:', updateError);
        throw updateError;
      }

      // Инвалидируем все связанные запросы для обновления UI
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["memes"] }),
        queryClient.invalidateQueries({ queryKey: ["user-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["watchlist-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["featured-memes"] }),
        queryClient.invalidateQueries({ queryKey: ["top-memes"] })
      ]);

      toast({
        title: "Success",
        description: "Meme deleted successfully",
      });

      setIsOpen(false);

      // Перенаправляем на главную, если мы на странице деталей мема
      if (window.location.pathname.includes('/meme/')) {
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error deleting meme:', error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete meme. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Показываем кнопку удаления только для админов или владельцев мема
  if (!userId || (!isAdmin && userId !== meme.created_by)) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:text-red-500"
          disabled={isDeleting}
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Meme</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this meme? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};