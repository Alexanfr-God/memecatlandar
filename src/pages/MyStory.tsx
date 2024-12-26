import { Header } from "@/components/Header";
import { Support } from "@/components/Support";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

const MyStory = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsLoading(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load content. Please try again.",
        });
        setIsLoading(false);
      }
    };

    loadContent();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <section className="mb-20">
          <h1 className="text-4xl font-bold font-serif mb-12 text-center">Welcome to MemeCatLandar!</h1>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2">
              <img
                src="/lovable-uploads/687016b8-6c47-4357-9f3f-b4af5d2da3a7.png"
                alt="Project Illustration"
                className="w-full max-w-[500px] mx-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="lg:w-1/2 prose prose-lg">
              <p>Hi, my name is Ann Ostrovsky, and I am absolutely delighted to have you here! Let me share the story behind this project—a labor of love, creativity, and community.</p>
              <p>In today's fast-paced digital world, memes are everywhere, but they fade as quickly as they rise. Finding the right space to share a meme, grow a community, and leave a lasting impact can feel like an impossible mission. That's where MemeCatLandar comes in—a unique platform where memes are given the spotlight they deserve, and creators can build their legacy.</p>
              <p>Guided by Memeca, our fearless, toilet-riding space adventurer, this platform travels across the infinite galaxy of memes, bringing together creators and audiences. Here, everyone has the opportunity to craft their own meme card, launch their ideas, and connect with the world.</p>
              <h2 className="text-2xl font-bold mt-8 mb-4">What makes MemeCatLandar special?</h2>
              <p>It's not just a platform—it's a launchpad for creativity, a calendar for stories waiting to be told, and a community that champions new ideas. Whether you're here to explore, support, or create, you're part of something bigger.</p>
              <p>When I first dreamed of this project, I envisioned a space that was simple yet powerful, structured yet open. Now that dream has come to life, and it's all for you. I'm truly grateful for each and every person who joins this journey. Together, we can make memes more than fleeting jokes; we can turn them into stories, trends, and cultural milestones.</p>
              <p className="font-bold">Thank you for being here. Let's create, connect, and make meme history—one card at a time.</p>
              <p className="mt-8">With love,<br />Ann Ostrovsky</p>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold font-serif mb-12 text-center">About Project</h2>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2">
              <img
                src="/lovable-uploads/64675aff-6e69-4c08-ada3-33ce2e7497e7.png"
                alt="Project Features"
                className="w-full max-w-[500px] mx-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="lg:w-1/2 prose prose-lg">
              <p className="lead">Minimum Viable Product designed to bring your creative and humorous ideas to life while fostering a vibrant community of meme enthusiasts. Here's what makes it unique:</p>
              <ul className="space-y-4">
                <li><strong>Top 200 Memes</strong>: A dynamic leaderboard showcasing the best memes based purely on community votes. Sponsored memes are clearly marked to maintain transparency.</li>
                <li><strong>Watchlist</strong>: Your personal space to save and revisit your favorite memes anytime.</li>
                <li><strong>Tuzemoon</strong>: A premium section for exclusive content that gets extra visibility and reach.</li>
                <li><strong>AI-Powered Features (Coming Soon)</strong>: An intelligent assistant to enhance your experience with recommendations and support.</li>
                <li><strong>Telegram Integration</strong>: All memes are automatically shared in our Telegram channel to spark conversations and extend reach.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/2">
              <img
                src="/lovable-uploads/9d9a7503-4add-4cac-ad58-bf4c5e6174c7.png"
                alt="Tuzemoon Mascot"
                className="w-full max-w-[500px] mx-auto rounded-lg shadow-lg animate-float"
              />
            </div>
            <div className="lg:w-1/2 prose prose-lg">
              <h2 className="text-3xl font-bold font-serif mb-8">Tuzemoon RoadMap</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">1. Listing on Dexscreener</h3>
                  <p>Immediately after launch, the token will be listed on Dexscreener with liquidity pool support, allowing investors to easily track its price and trading volumes.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">2. Regular Platform Updates</h3>
                  <p>The platform will be regularly updated to improve functionality and design. Our goal is to make the website user-friendly and valuable for all users.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">3. Integration of an AI Assistant</h3>
                  <p>We plan to integrate our own AI assistant, which will:</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Analyze tokens, providing detailed insights into their potential.</li>
                    <li>Evaluate new blockchain-based projects.</li>
                    <li>Offer trading recommendations and guidance on adding tokens to portfolios.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">4. Fully Automated Platform</h3>
                  <p>In the future, we aim to make the platform completely automated for seamless user experience and efficiency.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Support />
      <Footer />
    </div>
  );
};

export default MyStory;
