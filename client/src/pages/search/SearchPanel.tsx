import React, { FC, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthorPfp } from '../../components/Post';
import Tabs, { Tab } from '../../components/Tabs';
import { parseBasicUser, User } from '../../types/post';
import { URL_BASE } from '../../config';
import { mergeClassNames } from '../../utils';
import { Group, parseGroup } from '../../types/group';
import { CompactedGroupComp } from '../groups/JoinedGroupList';

const SearchPanel = () => {
  return (
    <div>
      <TabSections />
    </div>
  );
};

const TabSections = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  const fetchAllUsers = async () => {
    const endpoint = `${URL_BASE}/users`;
    const res = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include',
    });
    const data: any[] = await res.json();
    const users = data.map((user) => parseBasicUser(user));
    setUsers(users);
  };

  const fetchAllGroups = async () => {
    const endpoint = `${URL_BASE}/groups`;
    const res = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include',
    });

    const data: any[] = await res.json();
    const groups = data.map((grp) => parseGroup(grp));
    setGroups(groups);
  };

  useEffect(() => {
    fetchAllUsers();
    fetchAllGroups();
  }, []);

  const tabs: Tab[] = [
    {
      name: 'People',
      element: <People users={users} />,
    },
    {
      name: 'Groups',
      element: <AllGroups groups={groups} />,
    },
  ];

  return (
    <>
      <Tabs tabs={tabs} />
    </>
  );
};

const People: FC<{ users: User[] }> = ({ users }) => {
  return (
    <div>
      {users.map((user) => {
        return <PeopleComp key={user.id} data={user} />;
      })}
    </div>
  );
};

const PeopleComp: FC<{ data: User }> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        navigate(`/users/${data.id}`);
      }}
      className="rounded-lg w-full flex items-center justify-start gap-2 p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
    >
      <AuthorPfp data={data} />
      <button
        className={mergeClassNames(
          'py-1 px-4 bg-white text-black font-bold rounded-lg hover:bg-secondary hover:text-foreground transition-colors',
          'ml-auto',
        )}
      >
        Add friend
      </button>
    </div>
  );
};

const AllGroups: FC<{ groups: Group[] }> = ({ groups }) => {
  return (
    <div>
      {groups.map((group) => {
        return <CompactedGroupComp data={group} />;
      })}
    </div>
  );
};

export default SearchPanel;
