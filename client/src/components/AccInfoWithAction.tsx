import { Check, Plus, UserRoundCheck } from 'lucide-react';
import { FC } from 'react';
import { Account } from '../types';

interface AccInfoWithActionProps {
  data: Account;
  status: 'friend' | 'requestSent' | 'none';
  actionFn?: () => void;
}

const AccInfoWithAction: FC<AccInfoWithActionProps> = ({
  data: { username, displayName, imgUrl },
  actionFn,
  status,
}) => {
  const actionButton = (() => {
    switch (status) {
      case 'friend':
        return (
          <button className="rounded-full p-1.5 bg-green-100">
            <UserRoundCheck size={16} className="stroke-green-900" />
          </button>
        );
      case 'requestSent':
        return (
          <button className="rounded-full p-1.5 bg-gray-100 cursor-default">
            <Check size={16} className="stroke-gray-900" />
          </button>
        );
      case 'none':
        return (
          <button
            onClick={actionFn}
            className="rounded-full p-1.5 bg-blue-100 hover:bg-blue-200"
          >
            <Plus size={16} className="stroke-blue-900" />
          </button>
        );
    }
  })();

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <img
          src={imgUrl}
          className="rounded-full bg-gray-500 size-12 flex-shrink-0"
          alt={username}
        />
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className="text-base font-medium truncate">{displayName}</p>
          <p className="text-sm text-gray-500 truncate">@{username}</p>
        </div>
      </div>
      {actionButton}
    </div>
  );
};

export default AccInfoWithAction;
