import { FC } from 'react';
import type { Account } from '../../../types';

interface UserListProps {
  list: Account[];
  actionFn: (acc: Account) => void;
}

const UserList: FC<UserListProps> = ({ list, actionFn }) => {
  return (
    <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
      <div className="flex-[1] overflow-y-auto pr-3">
        <div className="space-y-6">
          {list.map((acc) => (
            <UserListItem
              key={acc.id}
              data={acc}
              actionFn={() => actionFn(acc)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;

interface UserListItemProps {
  data: Account;
  actionFn: () => void;
}

const UserListItem: FC<UserListItemProps> = ({
  data: { username, displayName, imgUrl, isSuspended },
  actionFn,
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
        onClick={actionFn}
        className="rounded-full bg-white hover:bg-slate-300 text-black px-4 py-2 text-sm font-bold"
      >
        {isSuspended ? 'Resume' : 'Suspend'}
      </button>
    </div>
  );
};
