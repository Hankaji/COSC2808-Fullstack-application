import { useLoaderData, useParams } from 'react-router';
import PostCreationPanel from '../../../components/PostCreationPanel';
import { mergeClassNames } from '../../../utils';
import PostsView from '../../../components/PostsView';
import { Group, parseGroup } from '../../../types/group';
import { FC } from 'react';
import useAuth from '../../../hooks/useAuth';
import { URL_BASE } from '../../../config';
import useToast from '../../../hooks/useToast';

const GroupPanel = () => {
  const groupData = useLoaderData() as Group;
  const { auth } = useAuth();

  const params = useParams();
  const groupId = params.groupId;

  const joinGroup = async () => {
    try {
      const endpoint = `${URL_BASE}/requests/group_requests`;
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          group_id: groupId,
        }),
      });

      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {}
  };

  return (
    <div className="flex flex-col gap-4">
      <GroupHeader
        coverImg={groupData.coverImage}
        avatarImg={groupData.groupImage}
        name={groupData.name}
        onJoin={joinGroup}
        isJoined={
          groupData.members.filter((mem) => mem.id === auth.user!.userId)
            .length > 0
        }
      />
      <PostCreationPanel />
      {/* <PostsView posts={null} /> */}
    </div>
  );
};

interface GroupHeaderProps {
  coverImg?: string;
  avatarImg?: string;
  onJoin: () => Promise<any>;
  name: string;
  isJoined: boolean;
}

const GroupHeader: FC<GroupHeaderProps> = ({
  coverImg,
  avatarImg,
  onJoin,
  name,
  isJoined,
}) => {
  const toast = useToast();

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
          {isJoined && (
            <div className="px-4 py-2 ml-auto border-border border-solid border-2 rounded-lg bg-background">
              Joined
            </div>
          )}
          {!isJoined ? (
            <button
              onClick={(e) => {
                toast.showAsync(onJoin, {
                  loading: {
                    title: 'Sending request...',
                  },
                  success: (_) => ({
                    title: 'Request sent',
                  }),
                  error: (_) => ({
                    title: 'Coulnt send request',
                  }),
                });
              }}
              className="px-4 py-2 transition-colors rounded-lg bg-primary hover:bg-secondary ml-auto"
            >
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
