import { ComponentProps, FC, useCallback, useEffect, useState } from 'react';
import Alert from '../../components/ui/Alert';
import useAuth from '../../hooks/useAuth';
import type { Account } from '../../types';
import { URL_BASE } from '../../config';

const FriendList: FC = () => {
  const { auth } = useAuth();

  const [list, setList] = useState<Account[]>([]);
  const [alert, setAlert] = useState<Pick<
    ComponentProps<typeof Alert>,
    'title' | 'type'
  > | null>(null);

  const fetchFriendList = useCallback(async () => {
    if (!auth.user) return;
    const endpoint = `${URL_BASE}/users/${auth.user.userId}/friends`;
    const res = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include',
    });
    const result = await res.json();
    setList(
      result.map(
        (acc: any) =>
          ({
            id: acc._id,
            username: acc.username,
            displayName: acc.displayName,
            imgUrl: acc.virtualProfileImage ?? '',
          }) satisfies Account,
      ),
    );
  }, [auth.user]);

  const handleRemoveFriend = useCallback(
    async (user: Account) => {
      if (!auth.user) return;
      const endpoint = `${URL_BASE}/users/unfriend/${user.id}`;
      try {
        await fetch(endpoint, {
          method: 'DELETE',
          credentials: 'include',
        });
        fetchFriendList();
        setAlert({
          type: 'success',
          title: `Successfully removed ${user.displayName} from your friend list`,
        });
      } catch (error: any) {
        setAlert({
          type: 'error',
          title: `Failed to remove ${user.displayName} from your friend list`,
        });
      }
    },
    [auth.user, fetchFriendList],
  );

  useEffect(() => {
    fetchFriendList();
  }, [fetchFriendList]);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <h2 className="font-bold text-3xl pb-3 border-b-2 border-border mb-2">
        All Friends
      </h2>
      {alert !== null && (
        <Alert
          {...alert}
          onRemove={() => {
            setAlert(null);
          }}
        />
      )}
      <div className="flex-grow overflow-y-auto mt-6 pr-3">
        <div className="space-y-6">
          {list.map((acc) => (
            <FriendListItem
              key={acc.id}
              data={acc}
              onRemove={() => handleRemoveFriend(acc)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendList;

interface FriendListItemProps {
  data: Account;
  onRemove: () => void;
}

const FriendListItem: FC<FriendListItemProps> = ({
  data: { username, displayName, imgUrl },
  onRemove,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img
          src={imgUrl}
          className="rounded-full bg-gray-500 size-12"
          alt={username}
        />
        <div>
          <p className="text-base">{displayName}</p>
          <p className="text-sm text-gray-500">@{username}</p>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="rounded-full bg-white hover:bg-slate-300 text-black px-4 py-2 text-sm font-bold"
      >
        Remove
      </button>
    </div>
  );
};
