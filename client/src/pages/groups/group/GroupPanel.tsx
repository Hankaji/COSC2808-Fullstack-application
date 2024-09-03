import { useParams } from 'react-router';
import PostCreationPanel from '../../../components/PostCreationPanel';
import { mergeClassNames } from '../../../utils';
import PostsView from '../../../components/PostsView';

const GroupPanel = () => {
  const params = useParams();
  const groupId = params.groupId;

  console.log(groupId);

  return (
    <div className="flex flex-col gap-4">
      {groupId}
      <GroupHeader />
      <PostCreationPanel />
      {/* <PostsView posts={null} /> */}
    </div>
  );
};

const GroupHeader = () => {
  return (
    <div className="w-full">
      <img
        className="w-full object-cover rounded-lg h-40"
        src="https://styles.redditmedia.com/t5_2sx2i/styles/bannerBackgroundImage_qhzusrmg7cl61.png?width=2176&frame=1&auto=webp&s=62cf20f42cbf8d32f8e4b9500fbf9cba08b1e3a8"
        alt="group cover image"
      />
      <div className="relative flex gap-2 p-2">
        {/* Avatar img container */}
        <div className="h-0 min-w-fit">
          <img
            className={mergeClassNames(
              'relative aspect-square rounded-full size-24 -translate-y-1/2',
              'border-background border-solid border-4',
            )}
            src="https://styles.redditmedia.com/t5_2sx2i/styles/communityIcon_7fixeonxbxd41.png"
            alt="group avatar"
          />
        </div>
        {/* Group info */}
        <div className="flex gap-2 w-full items-center">
          <h1 className="font-bold text-2xl">g/Punixorn</h1>
          <button className="px-4 py-2 ml-auto border-border border-solid border-2 rounded-lg bg-background hover:bg-secondary">
            Joined
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupPanel;
