import { UserRoundPlus } from 'lucide-react';
import { FC } from 'react';
import { User } from '../../../types/user';
import { mergeClassNames } from '../../../utils';

interface Props {
  userData: User;
}

const UserSideBar: FC<Props> = ({ userData }) => {
  return (
    <div className="block-container flex-col overflow-hidden">
      {/* Overview cover image */}
      <div className="relative m-0 -mt-4 -mx-4 max-h-40 overflow-hidden rounded-t-lg">
        <img
          className="size-full overflow-hidden object-cover bg-gradient-to-b from-transparent to-background"
          src="https://static.vecteezy.com/system/resources/thumbnails/028/126/729/small_2x/dark-theme-wood-black-background-texture-high-quality-closeup-may-be-used-for-design-as-background-copy-space-generative-ai-photo.jpeg"
          alt={userData.displayName}
        />
        <div className="absolute top-0 z-10 w-full h-full bg-gradient-to-b from-transparent from-50% to-background"></div>
      </div>
      <p className="text-lg font-bold">{userData.displayName}</p>
      <div className="flex gap-4">
        <button
          className={mergeClassNames(
            'flex gap-2 items-center justify-center',
            'rounded-full bg-primary hover:bg-secondary transition-colors text-foreground px-4 py-2 text-sm font-bold',
          )}
        >
          <UserRoundPlus size={16} />
          Add friend or remove
        </button>
      </div>
      <Achievement topLine="N/a" category="Posts" />
      <Achievement topLine="N/a" category="Comments" />
      {/* TODO: add createdAt */}
      {/* <Achievement topLine={joinedDateStr} category="Joined" /> */}
    </div>
  );
};

const Achievement: FC<{
  topLine: string | number;
  category: string;
}> = ({ topLine, category }) => {
  return (
    <p className="flex flex-col font-bold text-sm">
      {topLine}
      <span className="font-normal text-muted-foreground">{category}</span>
    </p>
  );
};

export default UserSideBar;
