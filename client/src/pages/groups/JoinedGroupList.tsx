import { Globe, Lock } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Tabs, { Tab } from '../../components/Tabs';
import { URL_BASE } from '../../config';
import useAuth from '../../hooks/useAuth';
import { Group, GroupVisibility, parseGroup } from '../../types/group';

type CompactedGroup = {
  id: string;
  name: string;
  decription: string;
  visibility: GroupVisibility;
  admins: string[];
  virtualGroupImage?: string;
};

const JoinedGroupList = () => {
  const { auth } = useAuth();

  const [joinedGrpList, setJoinedGroups] = useState<Group[]>([]);
  const [moderatingGrpList, setModeratingGroups] = useState<Group[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const endpoint = `${URL_BASE}/users/${auth.user?.userId}/groups`;
        const res = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include',
        });

        const data: any[] = await res.json();
        const groups = data.map((grp) => {
          return {
            id: grp.id,
            name: grp.name,
            description: grp.description,
            visibility:
              GroupVisibility[
              (
                grp.visibility as string
              ).toUpperCase() as keyof typeof GroupVisibility
              ],
            admins: grp.admins,
            groupImage: grp.virtualGroupImage,
          } as Group;
        });

        const joined = groups.filter((grp) => {
          return !(grp.admins as unknown as string[]).includes(
            auth.user!.userId,
          );
        });
        const moderating = groups.filter((grp) => {
          return (grp.admins as unknown as string[]).includes(
            auth.user!.userId,
          );
        });
        setJoinedGroups(joined);
        setModeratingGroups(moderating);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const tabs: Tab[] = [
    {
      name: 'Joined groups',
      element: <GroupsTab groups={joinedGrpList} />,
    },
    {
      name: 'Moderating groups',
      element: <GroupsTab groups={moderatingGrpList} />,
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <Tabs tabs={tabs} />
    </div>
  );
};

const GroupsTab: FC<{ groups: Group[] }> = ({ groups }) => {
  return (
    <div className="flex-grow overflow-y-auto mt-6 pr-3">
      <div className="space-y-6">
        {groups.length > 0 ? (
          groups.map((grp) => {
            return <CompactedGroupComp key={grp.id} data={grp} />;
          })
        ) : (
          <p>You have yet joined a group</p>
        )}
      </div>
    </div>
  );
};

const CompactedGroupComp: FC<{ data: Group }> = ({ data }) => {
  return (
    <Link
      to={`/groups/${data.id}`}
      className="flex gap-4 items-center justify-start hover:bg-secondary/50 rounded-lg py-2 px-4 cursor-pointer transition-colors"
    >
      <div className="size-16 overflow-hidden rounded-full bg-gray-500">
        {data.groupImage && (
          <img
            className="object-cover"
            sizes="64"
            src={data.groupImage}
            alt="Group"
          />
        )}
      </div>
      <p className="text-lg font-bold">{data.name}</p>
      {data.visibility === GroupVisibility.PUBLIC ? <Globe /> : <Lock />}
    </Link>
  );
};

export { CompactedGroupComp };
export default JoinedGroupList;
