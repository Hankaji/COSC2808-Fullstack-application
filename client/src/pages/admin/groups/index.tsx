import { FC, useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import Tabs, { Tab } from '../../../components/Tabs';
import { URL_BASE } from '../../../config';
import { Group, parseGroup } from '../../../types/group';
import CompactedGroup from '../../../components/CompactedGroup';

const AdminGroupsPage: FC = () => {
  const [groups, getGroups] = useState<Group[]>([]);

  const fetchAllGroups = async () => {
    const endpoint = `${URL_BASE}/groups`;
    const res = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include',
    });

    const data: any[] = await res.json();
    const groups = data.map((grp) => parseGroup(grp));
    getGroups(groups);
    console.log(groups);
  };

  const tabs: Tab[] = [
    {
      name: 'All Groups',
      element: (
        <div className="mt-2 flex flex-col h-[calc(100vh-180px)]">
          <div className="flex-[1] overflow-y-auto pr-3">
            {groups.map((group) => {
              return <CompactedGroup data={group} />;
            })}
          </div>
        </div>
      ),
    },
    {
      name: 'Group Requests',
      element: 'Group Requests',
    },
  ];

  useEffect(() => {
    fetchAllGroups();
  }, []);

  return (
    <Layout mainClassName="overflow-y-hidden">
      <Tabs tabs={tabs} />
    </Layout>
  );
};

export default AdminGroupsPage;
