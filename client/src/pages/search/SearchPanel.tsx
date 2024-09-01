import React, { FC, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthorPfp } from '../../components/Post';
import Tabs, { Tab } from '../../components/Tabs';
import { User } from '../../types/post';
import { URL_BASE } from '../../config';
import { mergeClassNames } from '../../utils';

const SearchPanel = () => {
  return (
    <div>
      <TabSections />
    </div>
  );
};

const TabSections = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchAllUsers = async () => {
    const endpoint = `${URL_BASE}/users`;
    const res = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    setUsers(data as User[]);
    console.log(data);
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const tabs: Tab[] = [
    {
      name: 'All',
      element: 'All people and groups',
    },
    {
      name: 'People',
      element: <People users={users} />,
    },
    {
      name: 'Groups',
      element: 'Only groups here',
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
      {users.map((user, _) => {
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

export default SearchPanel;
