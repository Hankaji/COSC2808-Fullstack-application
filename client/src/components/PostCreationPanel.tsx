import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Globe, ChevronDown, Image, X } from 'lucide-react';

// Helper function to get a cookie value by name
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

const PostCreationPanel = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [visibility, setVisibility] = useState('Public');
  const [images, setImages] = useState<File[]>([]);
  const [content, setContent] = useState('');

  const handleVisibilityChange = () => {
    setVisibility((prev) => (prev === 'Public' ? 'Friend' : 'Public'));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setImages((prevImages) => [...prevImages, ...files]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    const userId = getCookie('user_id'); // Get userId from cookie
    console.log(userId);
    if (!userId) {
      console.error('User ID is required');
      return;
    }

    const postData = new FormData();
    postData.append('user_id', userId); // Use userId from cookie
    postData.append('group_id', groupId || 'null'); // Use groupId from params or null
    postData.append('content', content);
    postData.append('visibility', visibility);
    postData.append('reactions', JSON.stringify([]));
    postData.append('comments', JSON.stringify([]));
    postData.append('editHistory', JSON.stringify([]));
    images.forEach((image, index) => {
      postData.append(`images[${index}]`, image);
    });

    try {
      const response = await fetch('http://localhost:8080/posts', {
        method: 'POST',
        body: postData
      });

      if (response.ok) {
        console.log('Post created successfully');
        // Handle successful post creation (e.g., clear form, show success message)
      } else {
        console.error('Failed to create post');
        // Handle error response
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network or other errors
    }
  };

  return (
    <div className="flex flex-col justify-start items-start border-border border-2 border-solid rounded-lg p-4 gap-4 w-full bg-card">
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
        <button className="ml-auto py-1 px-4 bg-primary rounded-lg" onClick={handlePost}>
          Post
        </button>
      </div>
      <div className="border-border border-2 border-solid w-full "></div>
      <ul>
        <label className="rounded-lg p-2 cursor-pointer">
          <Image className="text-primary" />
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
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              onClick={() => handleRemoveImage(index)}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCreationPanel;