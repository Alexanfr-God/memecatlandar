import { WatchlistButton } from "../actions/WatchlistButton";
import { TuzemoonButton } from "./TuzemoonButton";

interface MemeActionsProps {
  memeId: string;
  memeTitle: string;
  userId: string | null;
  isAdmin: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  onUpdate: () => Promise<void>;
}

export const MemeActions = ({
  memeId,
  memeTitle,
  userId,
  isAdmin,
  isVerified,
  isFeatured,
  onUpdate
}: MemeActionsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <WatchlistButton 
          memeId={memeId} 
          userId={userId} 
          showText={true} 
          className="w-full justify-center"
        />
        {(isAdmin || isVerified) && (
          <>
            <TuzemoonButton
              memeId={memeId}
              memeTitle={memeTitle}
              isFeatured={isFeatured}
              isAdmin={isAdmin}
              isVerified={isVerified}
              onUpdate={onUpdate}
            />
          </>
        )}
      </div>
    </div>
  );
};
