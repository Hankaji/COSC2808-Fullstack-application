import { Globe, Lock } from 'lucide-react';
import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { URL_BASE } from '../../config';
import useAuth from '../../hooks/useAuth';

type CompactedGroup = {
  id: string;
  name: string;
  decription: string;
  visibility: 'Public' | 'Private';
  virtualGroupImage: string;
};

const JoinedGroupList = () => {
  const { auth } = useAuth();

  const [grpList, setGroups] = useState<CompactedGroup[]>([]);

  const endpoint = `${URL_BASE}/users/${auth.user?.userId}/groups`;

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include',
        });

        const data = (await res.json()) as CompactedGroup[];
        console.log(data);
        setGroups(data);
      } catch (error) {}
    };

    getData();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <h2 className="font-bold text-3xl pb-3 border-b-2 border-border mb-2">
        All Groups
      </h2>
      <div className="flex-grow overflow-y-auto mt-6 pr-3">
        <div className="space-y-6">
          {grpList.length > 0 ? (
            grpList.map((grp) => {
              return <CompactedGroupComp key={grp.id} data={grp} />;
            })
          ) : (
            <p>You have yet joined a group</p>
          )}
        </div>
      </div>
    </div>
  );
};

const CompactedGroupComp: FC<{ data: CompactedGroup }> = ({ data }) => {
  return (
    <Link
      to={`/groups/${data.id}`}
      className="flex gap-4 items-center justify-start hover:bg-secondary/50 rounded-lg py-2 px-4 cursor-pointer transition-colors"
    >
      <div className="size-16 rounded-full bg-gray-500">
        {data.virtualGroupImage && (
          <img
            className="object-cover"
            sizes="64"
            src={data.virtualGroupImage}
            alt="Group image"
          />
        )}
      </div>
      <p className="text-lg font-bold">{data.name}</p>
      {data.visibility == 'Public' ? <Globe /> : <Lock />}
    </Link>
  );
};

export default JoinedGroupList;
