import { Check, Globe, Lock, X } from 'lucide-react';
import { FC, useState } from 'react';
import { useLoaderData } from 'react-router';
import { URL_BASE } from '../../config';
import useToast from '../../hooks/useToast';
import { Group as GroupTemp } from '../../types';
import { Group, GroupVisibility } from '../../types/group';
import {
  GroupCreationRequest,
  parseGroupCreationRequest,
} from '../../types/group_creation_request';

const list: GroupTemp[] = [
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
  let loaderData = JSON.parse(useLoaderData() as string)
    .groupCreationReqs as GroupCreationRequest[];

  const [groupCreationReqs, setGroupCreationReqs] = useState<
    GroupCreationRequest[]
  >(
    loaderData.map((req) => {
      return parseGroupCreationRequest(req);
    }),
  );

  const toast = useToast();

  const handleAccept = async (id: string) => {
    try {
      const endpoint = `${URL_BASE}/requests/group_creation_requests/accept/${id}`;
      const res = await fetch(endpoint, {
        method: 'PATCH',
        credentials: 'include',
      });

      const data = await res.json();

      console.log(data);
      if (res.ok) {
        // Show toast
        toast.show({
          title: 'Group request accepted',
        });

        // Remove request
        setGroupCreationReqs((reqs) => reqs.filter((req) => req.id !== id));
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const endpoint = `${URL_BASE}/requests/group_creation_requests/reject/${id}`;
      const res = await fetch(endpoint, {
        method: 'PATCH',
        credentials: 'include',
      });

      const data = await res.json();

      console.log(data);
      if (res.ok) {
        // Show toast
        toast.show({
          title: 'Group request rejected',
        });

        // Remove request
        setGroupCreationReqs((reqs) => reqs.filter((req) => req.id !== id));
      } else {
        // Show toast
        toast.show({
          title: 'Something wrong',
          type: 'error',
        });
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  console.log(loaderData);

  return (
    <div className="border-2 border-border rounded-xl p-4">
      <h3 className="text-xl font-bold pb-3 border-b-2 border-border">
        Group Requests
      </h3>
      <div className="h-[400px] overflow-y-auto space-y-4 py-4 pr-2">
        {groupCreationReqs.map((req) => (
          <GroupRequestItem
            key={req.id}
            data={req}
            onAccept={() => {
              handleAccept(req.id);
            }}
            onReject={() => {
              handleReject(req.id);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupRequestList;

interface GroupRequestItemProps {
  data: GroupCreationRequest;
  onAccept: () => void;
  onReject: () => void;
}

const GroupRequestItem: FC<GroupRequestItemProps> = ({
  data: { id, user_id, status, group },
  onAccept,
  onReject,
}) => {
  console.log('data: ' + group);
  const { groupImage, coverImage, visibility, description, name } = group;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 w-full">
        <img
          src={groupImage}
          className="rounded-full bg-gray-500 size-12"
          alt="group image"
        />
        <div>
          <div className="flex items-center gap-1">
            <p className="text-base">{name}</p>
            <div>
              {visibility === GroupVisibility.PUBLIC ? (
                <Globe size={14} className="stroke-gray-500" />
              ) : (
                <Lock size={14} className="stroke-gray-500" />
              )}
            </div>
          </div>
          <p className="text-sm w-24 text-gray-500 truncate">@{id}</p>
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
