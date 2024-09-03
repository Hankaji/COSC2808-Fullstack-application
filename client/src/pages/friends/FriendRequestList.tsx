import { Check, X } from "lucide-react";
import { FC } from "react";
import { Account } from "../../types";

const list: Account[] = [
  {
    id: "alice_on_chain",
    username: "alice_on_chain",
    displayName: "Alice",
    imgUrl:
      "https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6",
  },
  {
    id: "its_bob",
    username: "its_bob",
    displayName: "Bob",
    imgUrl:
      "https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6",
  },
  {
    id: "charliexcx",
    username: "charliexcx",
    displayName: "Charlie",
    imgUrl:
      "https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6",
  },
];

const FriendRequestList: FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex-grow overflow-y-auto mt-6 pr-3">
        <div className="space-y-6">
          {list.map((acc) => (
            <FriendRequestItem
              key={acc.id}
              data={acc}
              onAccept={() => {}}
              onReject={() => {}}
            />
          ))}
        </div>
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
  data: { username, displayName, imgUrl },
  onAccept,
  onReject,
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
      <div className="flex gap-1.5 items-center">
        <button
          onClick={onAccept}
          className="rounded-full p-1.5 bg-green-100 hover:bg-green-200"
        >
          <Check size={16} className="stroke-green-900" />
        </button>
        <button
          onClick={onReject}
          className="rounded-full p-1.5 bg-red-100 hover:bg-red-200"
        >
          <X size={16} className="stroke-red-900" />
        </button>
      </div>
    </div>
  );
};
