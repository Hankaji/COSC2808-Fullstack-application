import { Check, Globe, Lock, X } from 'lucide-react';
import { FC, useState } from 'react';
import { useLoaderData } from 'react-router';
import { URL_BASE } from '../../config';
import useToast from '../../hooks/useToast';
import { GroupVisibility } from '../../types/group';
import {
  GroupCreationRequest,
  parseGroupCreationRequest,
} from '../../types/group_creation_request';

const GroupRequestList: FC = () => {
  const loaderData = JSON.parse(useLoaderData() as string)
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
    const acceptRequest = async () => {
      try {
        const endpoint = `${URL_BASE}/requests/group_creation_requests/accept/${id}`;
        const res = await fetch(endpoint, {
          method: 'PATCH',
          credentials: 'include',
        });

        const data = await res.json();

        if (res.ok) {
          // Remove request
          setGroupCreationReqs((reqs) => reqs.filter((req) => req.id !== id));
        }
        return data;
      } catch (error: any) {
        console.error(error);
      }
    };

    toast.showAsync(acceptRequest, {
      loading: {
        title: 'Loading...',
      },
      success: (_) => ({
        title: 'Group request accepted',
      }),
      error: (_) => ({
        title: 'Something wrong happened',
      }),
    });
  };

  const handleReject = async (id: string) => {
    const rejectRequest = async () => {
      try {
        const endpoint = `${URL_BASE}/requests/group_creation_requests/reject/${id}`;
        const res = await fetch(endpoint, {
          method: 'PATCH',
          credentials: 'include',
        });

        const data = await res.json();

        console.log(data);
        if (res.ok) {
          // Remove request
          setGroupCreationReqs((reqs) => reqs.filter((req) => req.id !== id));
        } else {
        }
        return data;
      } catch (error: any) {
        console.error(error);
      }
    };

    toast.showAsync(rejectRequest, {
      loading: {
        title: 'Loading...',
      },
      success: (_) => ({
        title: 'Group request rejected successfully',
      }),
      error: (_) => ({
        title: 'Something wrong happened',
      }),
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="flex-grow overflow-y-auto mt-6 pr-3">
        <div className="space-y-6">
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
  data: { id, group },
  onAccept,
  onReject,
}) => {
  const { groupImage, visibility, name } = group;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 w-full">
        <img
          src={groupImage}
          className="rounded-full bg-gray-500 size-12"
          alt="group"
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
