import { FC, useMemo, useState } from 'react';
import type { Account } from '../../types';
import { mergeClassNames } from '../../utils';

const list: Account[] = [
  {
    id: 'alice_on_chain',
    name: 'Alice',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'its_bob',
    name: 'Bob',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: true,
  },
  {
    id: 'charliexcx',
    name: 'Charlie',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'david.nguyen',
    name: 'David',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: true,
  },
  {
    id: 'eve_irl',
    name: 'Eve',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'frank_castle',
    name: 'Frank',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'grace_hopper',
    name: 'Grace',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: true,
  },
  {
    id: 'henry8',
    name: 'Henry',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'isabella_swan',
    name: 'Isabella',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'jack_sparrow',
    name: 'Jack',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: true,
  },
  {
    id: 'kate_austen',
    name: 'Kate',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'liam_neeson',
    name: 'Liam',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'mia_wallace',
    name: 'Mia',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: true,
  },
  {
    id: 'neo_matrix',
    name: 'Neo',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'olivia_pope',
    name: 'Olivia',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'peter_parker',
    name: 'Peter',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: true,
  },
  {
    id: 'quinn_fabray',
    name: 'Quinn',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'ron_weasley',
    name: 'Ron',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
  {
    id: 'sarah_connor',
    name: 'Sarah',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: true,
  },
  {
    id: 'tony_stark',
    name: 'Tony',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
    isSuspended: false,
  },
];

type Tab = 'active' | 'suspended';

const UserList: FC = () => {
  // TODO: fetch user list

  const [activeTab, setActiveTab] = useState<Tab>('active');

  const displayList = useMemo(
    () =>
      list.filter((item) =>
        activeTab === 'active' ? !item.isSuspended : item.isSuspended,
      ),
    [activeTab],
  );

  return (
    <div className="space-y-6 overflow-hidden flex flex-col h-[calc(100vh-100px)]">
      <div className="pb-3 border-b-2 border-border flex items-center justify-between">
        <h2 className="font-bold text-3xl">All Users</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('active')}
            className={mergeClassNames(
              'rounded-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 text-sm font-bold',
              activeTab === 'active'
                ? 'border border-white hover:bg-slate-800'
                : '',
            )}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('suspended')}
            className={mergeClassNames(
              'rounded-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 text-sm font-bold',
              activeTab === 'suspended'
                ? 'border border-white hover:bg-slate-800'
                : '',
            )}
          >
            Suspended
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto pr-3">
        <div className="space-y-6">
          {[...displayList].map((acc) => (
            <UserListItem key={acc.id} data={acc} actionFn={() => {}} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;

interface UserListItemProps {
  data: Account;
  actionFn: () => void;
}

const UserListItem: FC<UserListItemProps> = ({
  data: { id, name, imgUrl, isSuspended },
  actionFn,
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
          <p className="text-base">{name}</p>
          <p className="text-sm text-gray-500">@{id}</p>
        </div>
      </div>
      <button
        onClick={actionFn}
        className="rounded-full bg-white hover:bg-slate-300 text-black px-4 py-2 text-sm font-bold"
      >
        {isSuspended ? 'Resume' : 'Suspend'}
      </button>
    </div>
  );
};
