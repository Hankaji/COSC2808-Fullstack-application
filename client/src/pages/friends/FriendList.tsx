import { FC, useCallback, useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import type { Account } from '../../types';
import { URL_BASE } from '../../config';
import AccInfoWithTextBtn from '../../components/AccInfoWithTextBtn';

const FriendList: FC = () => {
  const { auth } = useAuth();
  const toast = useToast();

  const [list, setList] = useState<Account[]>([]);

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
      const removeFriend = async () => {
        const endpoint = `${URL_BASE}/users/unfriend/${user.id}`;

        const res = await fetch(endpoint, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (res.ok) {
          await fetchFriendList();
        } else {
          throw Error('Failed to remove friend');
        }
      };

      toast.showAsync(removeFriend, {
        loading: {
          title: 'Loading...',
        },
        success: (_) => ({
          title: `Removed ${user.displayName} from your friend list`,
        }),
        error: (_) => ({
          title: 'Something wrong happened',
        }),
      });
    },
    [auth.user, fetchFriendList, toast],
  );

  useEffect(() => {
    fetchFriendList();
  }, [fetchFriendList]);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex-grow overflow-y-auto mt-2 pr-3">
        {list.map((acc) => (
          <AccInfoWithTextBtn
            data={acc}
            button={{
              text: 'Remove',
              actionFn: () => handleRemoveFriend(acc),
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendList;
