import { Globe, ChevronDown, Image } from 'lucide-react';

const PostCreationPanel = () => {
  return (
    <div className="flex flex-col justify-start items-start border-border border-2 border-solid rounded-lg p-4 gap-4 w-full bg-card">
      <div className="flex gap-4">
        {/* TODO fix image */}
        <img
          className="rounded-full bg-gray-500 size-16"
          src="https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6"
          alt="User avatar"
        />
        <textarea
          className="w-full resize-none bg-background text-2xl p-4 rounded-lg focus:outline-none focus:ring-0 focus:ring-offset-0"
          placeholder="Post something"
        />
      </div>
      {/* Actions */}
      <div className="flex w-full">
        <div className="flex gap-2 items-center">
          Visibility:
          <button className="py-1 px-4 bg-secondary rounded-sm flex gap-1 items-center">
            <Globe size={16} />
            Public
            <ChevronDown size={16} />
          </button>
        </div>
        <button className="ml-auto py-1 px-4 bg-primary rounded-lg">
          Post
        </button>
      </div>
      <div className="border-border border-2 border-solid w-full "></div>
      <ul>
        <button className="rounded-lg hover:bg-secondary p-2">
          <Image className="text-primary" />
        </button>
      </ul>
    </div>
  );
};

export default PostCreationPanel;
