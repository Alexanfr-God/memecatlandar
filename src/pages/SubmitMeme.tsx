import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Support } from "@/components/Support";
import { MemeForm } from "@/components/meme/MemeForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Meme } from "@/types/meme";
import { useMemeDetails } from "@/hooks/useMemeDetails";
import { LoadingSpinner } from "@/components/meme/ui/LoadingSpinner";
import { ErrorState } from "@/components/meme/ui/ErrorState";

const SubmitMeme = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Fetch meme data if in edit mode
  const { data: memeData, isLoading, error } = useMemeDetails(id);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    } catch (error) {
      console.error('Auth check error:', error);
    }
  };

  const handleSubmitAttempt = () => {
    if (!user) {
      setIsLoginDialogOpen(true);
      return;
    }
  };

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (id && isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  if (id && error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ErrorState message="Failed to load meme data" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif text-center mb-8">
              {id ? "Edit Your Meme" : "Submit Your Meme"}
            </h2>
            <MemeForm 
              onSubmitAttempt={handleSubmitAttempt} 
              isAuthenticated={!!user}
              initialData={memeData}
              isEditMode={!!id}
            />
          </div>
        </div>
      </main>

      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              You need to log in to {id ? "edit" : "add"} memes. Please log in or sign up.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsLoginDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsLoginDialogOpen(false);
                navigate('/');
              }}
            >
              Log in
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Support />
      <Footer />
    </div>
  );
};

export default SubmitMeme;