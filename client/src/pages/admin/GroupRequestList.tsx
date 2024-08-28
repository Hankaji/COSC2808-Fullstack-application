import { Check, Globe, Lock, X } from 'lucide-react';
import { FC } from 'react';
import { Group } from '../../types';

const list: Group[] = [
  {
    id: 'group1',
    name: 'Dog Lovers',
    description: 'A group for dog lovers',
    visibility: 'public',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
  },
  {
    id: 'group2',
    name: 'Single Moms',
    description: 'A group for single moms',
    visibility: 'public',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
  },
  {
    id: 'group3',
    name: 'Gym bros',
    description: 'A group for gym bros',
    visibility: 'private',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
  },
];

const GroupRequestList: FC = () => {
  return (
    <div className="border-2 border-border rounded-xl p-4">
      <h3 className="text-xl font-bold pb-3 border-b-2 border-border">
        Group Requests
      </h3>
      <div className="h-[400px] overflow-y-auto space-y-4 py-4 pr-2">
        {[...list].map((acc) => (
          <GroupRequestItem
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

export default GroupRequestList;

interface GroupRequestItemProps {
  data: Group;
  onAccept: () => void;
  onReject: () => void;
}

const GroupRequestItem: FC<GroupRequestItemProps> = ({
  data: { id, name, imgUrl, visibility },
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
          <div className="flex items-center gap-1">
            <p className="text-base">{name}</p>
            <div>
              {visibility === 'public' ? (
                <Globe size={14} className="stroke-gray-500" />
              ) : (
                <Lock size={14} className="stroke-gray-500" />
              )}
            </div>
          </div>
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
