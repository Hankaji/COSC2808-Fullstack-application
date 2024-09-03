import { FC } from 'react';
import type { Account } from '../../types';

interface UserListProps {
  list: Account[];
}

const UserList: FC<UserListProps> = ({ list }) => {
  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="flex-grow overflow-y-auto mt-6 pr-3">
        <div className="space-y-6">
          {list.map((acc) => (
            <UserListItem key={acc.id} data={acc} actionFn={() => {}} />
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
