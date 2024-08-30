import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Globe, ChevronDown, Image, X } from 'lucide-react';

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

  const handleRemoveImage = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent the default button action
    e.stopPropagation(); // Stop the event from bubbling up to the form
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handlePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Attempting to create post...');

    if (!content.trim() && images.length === 0) {
      alert('Please add some content or images before posting.');
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

    try {
      const response = await fetch('http://localhost:8080/posts', {
        method: 'POST',
        body: postData,
        credentials: 'include'
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Post created successfully:', responseData);
        alert('Post created successfully!');
        // Clear the form after successful post
        setContent('');
        setImages([]);
      } else {
        const errorData = await response.text();
        console.error('Failed to create post:', errorData);
        alert(`Failed to create post: ${errorData}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert(`Network error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  return (
    <form onSubmit={handlePost} className="flex flex-col justify-start items-start border-border border-2 border-solid rounded-lg p-4 gap-4 w-full bg-card">
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
        <button className="ml-auto py-1 px-4 bg-primary rounded-lg" type='submit'>
          Post
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