import { BadgeCheck, CircleSlash } from 'lucide-react';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import Post, { Author, AuthorPfp } from '../../../components/Post';
import PostsView from '../../../components/PostsView';
import { User } from '../../../types/user';
import { mergeClassNames } from '../../../utils';

const mockData: Post[] = [
  {
    id: '1',
    author: {
      avatar:
        'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
      username: 'UngaBunga',
      displayName: 'Anonymous',
    },
    content: 'Check out my new artwork',
    images: [
      'https://pbs.twimg.com/media/GUwiAFWagAAmQ5I?format=jpg&name=small',
      'https://preview.redd.it/i3-finally-satisfied-with-setup-v0-5fouwyfh6nkd1.png?width=1080&crop=smart&auto=webp&s=b83b79be87bc34ddf1936d057d9efd58bfad8a91',
      'https://i.redd.it/dklk2v9wktkd1.png',
    ],
    reactions: [],
    comments: [],
    editHistories: [],
  },
];

interface Props {
  userData: User;
}

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
      <Tabs />
    </div>
  );
};

const Tabs = () => {
  const [selected, setSelected] = useState<number>(0);

  const sections: string[] = ['Posts', 'Friends'];

  const components: ReactNode[] = [
    <PostsView posts={mockData} />,
    'No friends haha',
  ];

  return (
    <>
      <div className="flex w-full justify-center [&>*]:flex-grow">
        {sections.map((name, idx) => {
          return (
            <button
              key={idx}
              className={mergeClassNames(
                'text-center py-4 px-8 hover:bg-secondary',
                selected == idx && 'border-b-border border-b-2',
              )}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(idx);
              }}
            >
              {name}
            </button>
          );
        })}
      </div>
      {components[selected]}
    </>
  );
};

export default UserPanel;
