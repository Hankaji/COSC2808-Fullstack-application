import { FormEvent, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Globe, ChevronDown, Image, X } from 'lucide-react';
import { ToastContext } from '../context/ToastProvider';

const PostCreationPanel = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [visibility, setVisibility] = useState('Public');
  const [images, setImages] = useState<File[]>([]);
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const toast = useContext(ToastContext);

  const handleVisibilityChange = () => {
    setVisibility((prev) => (prev === 'Public' ? 'Friend' : 'Public'));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setImages((prevImages) => [...prevImages, ...files]);
    }
  };

  const handleRemoveImage = (
    index: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault(); // Prevent the default button action
    e.stopPropagation(); // Stop the event from bubbling up to the form
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handlePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Attempting to create post...');

    if (!content.trim() && images.length === 0) {
      toast?.show({
        title: 'Empty Post',
        description: 'Please add some content or images before posting.',
        type: 'warning',
      });
      return;
    }

    const postData = new FormData();
    postData.append('content', content);
    postData.append('visibility', visibility);
    images.forEach((image) => {
      postData.append('images', image);
    });
    if (groupId) {
      postData.append('group_id', groupId);
    }

    toast?.showAsync(
      async () => {
        setIsPosting(true);
        const response = await fetch('http://localhost:8080/posts', {
          method: 'POST',
          body: postData,
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData);
        }

        return await response.json();
      },
      {
        loading: {
          title: 'Creating Post',
          description: 'Please wait while we create your post...',
        },
        success: (data) => {
          setContent('');
          setImages([]);
          setIsPosting(false);
          return {
            title: 'Post Created',
            description: 'Your post has been created successfully!',
          };
        },
        error: (error) => ({
          title: 'Post Creation Failed',
          description: error.message || 'An unknown error occurred',
        }),
      },
    );
  };

  return (
    <form
      onSubmit={handlePost}
      className="flex flex-col justify-start items-start border-border border-2 border-solid rounded-lg p-4 gap-4 w-full bg-card"
    >
      <div className="flex gap-4 w-full">
        {/* TODO fix image */}
        <img
          className="rounded-full bg-gray-500 size-16"
          src="https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6"
          alt="User avatar"
        />
        <textarea
          className="w-full resize-none bg-background text-2xl p-4 rounded-lg focus:outline-none focus:ring-0 focus:ring-offset-0"
          placeholder="Post something"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {/* Actions */}
      <div className="flex w-full">
        <div className="flex gap-2 items-center">
          Visibility:
          <button
            className="py-1 px-4 bg-secondary rounded-sm flex gap-1 items-center"
            onClick={handleVisibilityChange}
          >
            <Globe size={16} />
            {visibility}
            <ChevronDown size={16} />
          </button>
        </div>
        <button
          type="submit"
          className="ml-auto py-1 px-4 bg-primary rounded-lg"
          disabled={isPosting}
        >
          {isPosting ? 'Posting...' : 'Post'}
        </button>
      </div>
      <div className="border-border border-2 border-solid w-full "></div>
      <ul>
        <label className="rounded-lg p-2 cursor-pointer">
          <Image className="text-primary" />
          {/* image upload here */}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </ul>
      {/* Image Previews */}
      <div className="flex gap-2 mt-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(image)}
              alt={`Preview ${index}`}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <button
              type="button" // Explicitly set the type to "button"
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              onClick={(e) => handleRemoveImage(index, e)}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </form>
  );
};

export default PostCreationPanel;
