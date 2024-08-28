import { FC } from 'react';
import type { Account } from '../../types';

const list: Account[] = [
  {
    id: 'alice_on_chain',
    name: 'Alice',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
  },
  {
    id: 'its_bob',
    name: 'Bob',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
  },
  {
    id: 'charliexcx',
    name: 'Charlie',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
  },
  {
    id: 'david.nguyen',
    name: 'David',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
  },
  {
    id: 'eve_irl',
    name: 'Eve',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
  },
];

const FriendList: FC = () => {
  // TODO: fetch friends list

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <h2 className="font-bold text-3xl pb-3 border-b-2 border-border">
        All Friends
      </h2>
      <div className="flex-grow overflow-y-auto mt-6 pr-3">
        <div className="space-y-6">
          {[...list, ...list, ...list, ...list, ...list].map((acc) => (
            <FriendListItem key={acc.id} data={acc} onRemove={() => {}} />
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
  data: { id, name, imgUrl },
  onRemove,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img
          src={imgUrl}
          className="rounded-full bg-gray-500 size-12"
          alt={name}
        />
        <div>
          <p className="text-base">{name}</p>
          <p className="text-sm text-gray-500">@{id}</p>
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
