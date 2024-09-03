import { FC } from 'react';
import Layout from '../../components/Layout';
import type { Account } from '../../types';
import Tabs, { Tab } from '../../components/Tabs';
import GroupRequestList from './GroupRequestList';
import UserList from './UserList';

const list: Account[] = [
  {
    id: 'alice_on_chain',
    username: 'alice_on_chain',
    displayName: 'Alice',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'its_bob',
    username: 'its_bob',
    displayName: 'Bob',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: true,
  },
  {
    id: 'charliexcx',
    username: 'charliexcx',
    displayName: 'Charlie',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'david.nguyen',
    username: 'david.nguyen',
    displayName: 'David',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: true,
  },
  {
    id: 'eve_irl',
    username: 'eve_irl',
    displayName: 'Eve',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'frank_castle',
    username: 'frank_castle',
    displayName: 'Frank',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'grace_hopper',
    username: 'grace_hopper',
    displayName: 'Grace',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: true,
  },
  {
    id: 'henry8',
    username: 'henry8',
    displayName: 'Henry',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'isabella_swan',
    username: 'isabella_swan',
    displayName: 'Isabella',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'jack_sparrow',
    username: 'jack_sparrow',
    displayName: 'Jack',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: true,
  },
  {
    id: 'kate_austen',
    username: 'kate_austen',
    displayName: 'Kate',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'liam_neeson',
    username: 'liam_neeson',
    displayName: 'Liam',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'mia_wallace',
    username: 'mia_wallace',
    displayName: 'Mia',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: true,
  },
  {
    id: 'neo_matrix',
    username: 'neo_matrix',
    displayName: 'Neo',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'olivia_pope',
    username: 'olivia_pope',
    displayName: 'Olivia',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'peter_parker',
    username: 'peter_parker',
    displayName: 'Peter',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: true,
  },
  {
    id: 'quinn_fabray',
    username: 'quinn_fabray',
    displayName: 'Quinn',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'ron_weasley',
    username: 'ron_weasley',
    displayName: 'Ron',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'sarah_connor',
    username: 'sarah_connor',
    displayName: 'Sarah',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: true,
  },
  {
    id: 'tony_stark',
    username: 'tony_stark',
    displayName: 'Tony',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
];

const tabs: Tab[] = [
  {
    name: 'Active Accounts',
    element: <UserList list={list.filter((item) => !item.isSuspended)} />,
  },
  {
    name: 'Suspended Accounts',
    element: <UserList list={list.filter((item) => item.isSuspended)} />,
  },
  {
    name: 'Group Requests',
    element: <GroupRequestList />,
  },
];

const AdminPage: FC = () => {
  return (
    <Layout
      // stickyRightSideCmp={<GroupRequestList />}
      mainClassName="overflow-y-hidden"
    >
      <Tabs tabs={tabs} />
    </Layout>
  );
};

export default AdminPage;
