import { Check, X } from 'lucide-react';
import { FC } from 'react';
import { Account } from '../../types';

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
];

const FriendRequestList: FC = () => {
  return (
    <div className="border-2 border-border rounded-xl p-4">
      <h3 className="text-xl font-bold pb-3 border-b-2 border-border">
        Friend Requests
      </h3>
      <div className="h-[300px] overflow-y-auto space-y-4 py-4 pr-2">
        {[...list].map((acc) => (
          <FriendRequestItem
            key={acc.id}
            data={acc}
            onAccept={() => {}}
            onReject={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendRequestList;

interface FriendRequestItemProps {
  data: Account;
  onAccept: () => void;
  onReject: () => void;
}

const FriendRequestItem: FC<FriendRequestItemProps> = ({
  data: { id, name, imgUrl },
  onAccept,
  onReject,
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
      <div className="flex gap-1.5 items-center">
        <button
          onClick={onAccept}
          className="rounded-full p-1.5 bg-green-100 hover:bg-green-200"
        >
          <Check size={12} className="stroke-green-900" />
        </button>
        <button
          onClick={onReject}
          className="rounded-full p-1.5 bg-red-100 hover:bg-red-200"
        >
          <X size={12} className="stroke-red-900" />
        </button>
      </div>
    </div>
  );
};
