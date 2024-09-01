import { useLoaderData, useParams } from 'react-router';
import PostCreationPanel from '../../../components/PostCreationPanel';
import { mergeClassNames } from '../../../utils';
import PostsView from '../../../components/PostsView';
import { Group } from '../../../types/group';
import { FC } from 'react';

const GroupPanel = () => {
  const groupData = useLoaderData() as Group;

  const params = useParams();
  const groupId = params.groupId;

  console.log(groupId);

  return (
    <div className="flex flex-col gap-4">
      <GroupHeader
        coverImg={groupData.coverImage}
        avatarImg={groupData.groupImage}
        name={groupData.name}
        isJoined={true}
      />
      <PostCreationPanel />
      {/* <PostsView posts={null} /> */}
    </div>
  );
};

interface GroupHeaderProps {
  coverImg?: string;
  avatarImg?: string;
  name: string;
  isJoined: boolean;
}

const GroupHeader: FC<GroupHeaderProps> = ({
  coverImg,
  avatarImg,
  name,
  isJoined,
}) => {
  return (
    <div className="w-full">
      <img
        className="w-full bg-gray-500 object-cover rounded-lg h-40"
        src={coverImg}
        alt="group cover"
      />
      <div className="relative flex gap-2 p-2">
        {/* Avatar img container */}
        <div className="h-0 min-w-fit">
          <img
            className={mergeClassNames(
              'bg-gray-500 object-cover',
              'relative aspect-square rounded-full size-24 -translate-y-1/2',
              'border-background border-solid border-4',
            )}
            src={avatarImg}
            alt="group avatar"
          />
        </div>
        {/* Group info */}
        <div className="flex gap-2 w-full items-center">
          <h1 className="font-bold text-2xl">g/{name}</h1>
          <div className="px-4 py-2 ml-auto border-border border-solid border-2 rounded-lg bg-background">
            Joined
          </div>
          {!isJoined ? (
            <button className="px-4 py-2 transition-colors rounded-lg bg-primary hover:bg-secondary">
              Join
            </button>
          ) : (
            <button className="px-4 py-2 transition-colors rounded-lg bg-danger hover:bg-secondary">
              Leave
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupPanel;
