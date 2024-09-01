import { BadgeCheck, CircleSlash } from 'lucide-react';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import { Posts } from '../../../types/post';
import PostsView from '../../../components/PostsView';
import Tabs, { Tab } from '../../../components/Tabs';
import { User } from '../../../types/user';
import { mergeClassNames } from '../../../utils';

const mockData: Posts[] = [
  {
    _id: '1',
    user: {
      virtualProfileImage: 'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
      username: 'UngaBunga',
      displayName: 'Anonymous',
      _id: '',
      id: ''
    },
    content: 'Check out my new artwork',
    images: [
      'https://pbs.twimg.com/media/GUwiAFWagAAmQ5I?format=jpg&name=small',
    ],
    reactions: [],
    comments: [],
    editHistory: [],
    group_id: null,
    visibility: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
  },
];

interface Props {
  userData: User;
}

const tabs: Tab[] = [
  {
    name: 'Posts',
    element: <PostsView posts={mockData} />,
  },
  {
    name: 'Friends',
    element: 'No friend haha',
  },
];

const UserPanel: FC<Props> = ({ userData }) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex gap-6">
        <img
          className="rounded-full flex-[0_0_auto] aspect-square bg-gray-500 size-24"
          src={
            userData.virtualProfileImage
              ? userData.virtualProfileImage
              : 'https://i.redd.it/if-anyones-free-could-you-draw-my-avatar-image-1-as-the-v0-5skwcoczrnid1.png?width=987&format=png&auto=webp&s=55af69fa5cfd555a06d947f54e9f69fabb4bebb2'
          }
          alt="User avatar"
        />
        <div className="flex flex-col justify-center items-start">
          <h1 className="text-4xl font-semibold">{userData.displayName}</h1>
          <p className="text-xl text-muted-foreground font-semibold">
            @{userData.username}
          </p>
        </div>
        <div className="flex justify-center items-center gap-2 ml-auto text-success">
          {true ? <BadgeCheck size={36} /> : <CircleSlash size={36} />}
          <span className="font-semibold text-xl">
            {true ? 'Active' : 'Banned'}
          </span>
        </div>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default UserPanel;
