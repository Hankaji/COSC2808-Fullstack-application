import {
  Angry,
  ChevronLeft,
  ChevronRight,
  Edit,
  Ellipsis,
  Heart,
  Laugh,
  LucideIcon,
  MessageCircle,
  SmilePlus,
  ThumbsUp,
} from 'lucide-react';
import {
  ButtonHTMLAttributes,
  CSSProperties,
  FC,
  HTMLAttributes,
  useState,
  useRef,
  useContext,
  Suspense,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Posts, Comment, User, Reaction, ReactionTypes } from '../types/post';
import { mergeClassNames } from '../utils';
import {
  DropDownItem,
  DropDownMenu,
  DropDownMenuContent,
} from './ui/DropDownMenu';
import PopupModal from './PopupModal';
import { ToastContext } from '../context/ToastProvider';

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: Posts;
}

const PostComponent: FC<Props> = ({ className, data }) => {
  const [isPopup, setIsPopup] = useState<boolean>(false);
  const [isEditPopup, setIsEditPopup] = useState<boolean>(false); // State for edit modal
  const [postContent, setPostContent] = useState<string>(data.content); // State for post content
  const [postVisibility, setPostVisibility] = useState<'Public' | 'Friend'>(
    data.visibility as 'Public' | 'Friend',
  ); // State for post visibility
  const openModalButtonRef = useRef<HTMLButtonElement>(null); // Ref for the "Open Modal" button
  const openModalButtonEditRef = useRef<HTMLButtonElement>(null); // Ref for the "Open Modal" button for editing
  const toastContext = useContext(ToastContext);
  const navigate = useNavigate();
  const location = useLocation();

  // error handler for toast
  if (!toastContext) {
    throw new Error('ToastContext must be used within a ToastProvider');
  }

  const handlePostClick = () => {
    setIsPopup(true);
  };

  const { show } = toastContext;

  // handle the Delete for post
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/posts/${data._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Post deleted successfully');
        show({
          title: 'Success',
          description: 'Post deleted successfully',
          type: 'success',
        });

        // Check if the current URL matches /posts/:postId
        const postIdPattern = /^\/posts\/[a-zA-Z0-9]+$/;
        if (postIdPattern.test(location.pathname)) {
          navigate('/'); // Navigate to the home page
        } else {
          window.location.reload(); // Refresh the page
        }
      } else {
        console.error('Failed to delete the post');
        show({
          title: 'Error',
          description: 'Failed to delete the post',
          type: 'error',
        });
      }
    } catch (error) {
      console.error(error);
      show({
        title: 'Error',
        description: 'An error occurred while deleting the post',
        type: 'error',
      });
    }
  };

  // handle the Edit for post
  const handleEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/posts/${data._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: postContent,
          visibility: postVisibility,
        }),
      });

      if (response.ok) {
        console.log('Post edited successfully');
        show({
          title: 'Success',
          description: 'Post edited successfully',
          type: 'success',
        });
        window.location.reload(); // Refresh the page to show updated content
      } else {
        console.error('Failed to edit the post');
        show({
          title: 'Error',
          description: 'Failed to edit the post',
          type: 'error',
        });
      }
    } catch (error) {
      console.error(error);
      show({
        title: 'Error',
        description: 'An error occurred while editing the post',
        type: 'error',
      });
    }
  };

  return (
    <>
      <div
        onClick={handlePostClick}
        className={`flex flex-col gap-4 w-full h-fit p-4 my-4 border-border border-solid border-2 rounded-lg bg-card hover:bg-secondary/25 hover:cursor-pointer ${className}`}
      >
        {/* Author */}
        <div className="flex gap-2 items-center">
          <AuthorPfp data={data.user} />
          <div className="flex ml-auto">
            {/* <Edit className="text-primary" /> */}
            <DropDownMenu
              content={
                <DropDownMenuContent className="-translate-x-1/2">
                  <DropDownItem
                    onClick={() => {
                      openModalButtonEditRef.current?.click(); // Trigger the "Open Modal" button click for editing
                    }}
                  >
                    Edit post
                  </DropDownItem>
                  <DropDownItem
                    onClick={() => {
                      openModalButtonRef.current?.click(); // Trigger the "Open Modal" button click
                    }}
                  >
                    Delete
                  </DropDownItem>
                  <DropDownItem>History</DropDownItem>
                </DropDownMenuContent>
              }
            >
              <Ellipsis />
            </DropDownMenu>
          </div>
        </div>
        {/* Content */}
        {/* TODO: Change placeholder */}
        <div className="flex flex-col justify-start items-start gap-2">
          <p>{data.content}</p>
          <PostImages imgData={data.images} />
        </div>
        {/* Post actions */}
        <div className="flex gap-4">
          <Reactions reactions={data.reactions} />
          <button className="flex transition-colors gap-1 p-2 hover:text-info hover:bg-info/25 rounded-full">
            <MessageCircle className="" />
            {data.comments.length}
          </button>
        </div>
      </div>
      {isPopup && <PostPopup closePopup={setIsPopup} data={data} />}
      {/* popup for delete confirmation */}
      <PopupModal
        widthPercent={0.5}
        heightPercent={0.5}
        className="custom-class"
        backdropBlur={5}
        modelRender={
          // Style for modal
          <div className="fixed inset-0 flex items-center justify-center bg-transparent">
            <div className="p-4 bg-white rounded shadow-lg">
              <h2 className="text-black">
                Are you sure you want to delete this post?
              </h2>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    console.log('Cancel button clicked');
                  }}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Delete button clicked');
                    handleDelete();
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        }
      >
        {/* This button is hidden and is used to trigger the modal by external components */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          ref={openModalButtonRef}
          style={{ display: 'none' }} // Make the button invisible
        >
          Open Modal
        </button>
      </PopupModal>
      {/* popup for edit configuration */}
      <PopupModal
        widthPercent={0.5}
        heightPercent={0.5}
        className="custom-class"
        backdropBlur={5}
        modelRender={
          // Style for modal
          <div className="fixed inset-0 flex items-center justify-center bg-transparent">
            <div className="p-4 bg-white rounded shadow-lg">
              <h2 className="text-black">Edit Post</h2>
              <textarea
                className="w-full p-2 mt-2 border border-gray-300 rounded text-black"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                onClick={(e) => e.stopPropagation()} // Prevent click propagation
              />
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click propagation
                  setPostVisibility(
                    postVisibility === 'Public' ? 'Friend' : 'Public',
                  );
                }}
              >
                {postVisibility === 'Public'
                  ? 'Change to Friend'
                  : 'Change to Public'}
              </button>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    console.log('Cancel button clicked');
                    setIsEditPopup(false);
                  }}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Confirm button clicked');
                    handleEdit();
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        }
      >
        {/* This button is hidden and is used to trigger the modal by external components */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          ref={openModalButtonEditRef}
          style={{ display: 'none' }} // Make the button invisible
        >
          Open Modal
        </button>
      </PopupModal>
    </>
  );
};

const PostImages: FC<{ imgData: string[] | undefined }> = ({ imgData }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  if (imgData == undefined) {
    return <></>;
  }

  const prev = () => {
    setCurrentIdx((curr) => (curr == 0 ? imgData.length - 1 : curr - 1));
  };

  const next = () => {
    setCurrentIdx((curr) => (curr == imgData.length - 1 ? 0 : curr + 1));
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        className="absolute top-1/2 z-10 -translate-y-1/2 left-2 p-1 rounded-full bg-secondary/50 hover:bg-secondary/75 transition-colors"
      >
        <ChevronLeft size={36} />
      </button>
      <div
        style={{
          transform: `translateX(-${currentIdx * 100}%)`,
        }}
        className="flex transition-transform ease-in-out"
      >
        {imgData.map((img, idx) => (
          <div
            key={idx}
            className="min-w-full flex justify-center items-center aspect-auto object-cover bg-center rounded-lg"
          >
            <img
              className="min-w-full aspect-auto object-cover bg-center rounded-lg"
              src={img}
            />
          </div>
        ))}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        className="absolute top-1/2 z-10 -translate-y-1/2 right-2 p-1 rounded-full bg-secondary/50 hover:bg-secondary/75 transition-colors"
      >
        <ChevronRight size={36} />
      </button>
      {/* Navigation */}
      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex justify-center items-center gap-2">
          {imgData.map((_, idx) => {
            return (
              <div
                key={idx}
                className={mergeClassNames(
                  'transition-all size-3 bg-white rounded-full',
                  currentIdx == idx ? 'p-2' : 'bg-opacity-50',
                )}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PostPopup: FC<{ closePopup: any; data: Posts }> = ({
  closePopup,
  data,
}) => {
  return (
    <div
      onClick={() => {
        closePopup(false);
      }}
      className="fixed top-0 left-0 w-svw h-svh backdrop-blur-[2px] flex justify-center items-center px-[15%]"
    >
      <div className="overflow-hidden z-[100] h-[80%] w-[60%] aspect-auto rounded-lg rounded-tr-none rounded-br-none">
        <img
          className="object-cover w-full h-full"
          src="https://pbs.twimg.com/media/GUwiAFWagAAmQ5I?format=jpg&name=small"
        />
      </div>
      <div
        className={`flex flex-col gap-4 w-full h-[80%] rounded-tl-none rounded-bl-none p-4 my-4 border-border border-solid border-2 rounded-lg bg-card`}
      >
        {/* Author */}
        <div className="flex gap-2">
          <AuthorPfp data={data.user} />
          <div className="flex ml-auto">
            <Edit className="text-primary" />
          </div>
        </div>
        {/* Content */}
        {/* TODO: Change placeholder */}
        <div className="flex flex-col justify-start items-start gap-2">
          <p>New artwork Heheheh</p>
        </div>
        {/* Post actions */}
        <div className="flex gap-4">
          <Reactions reactions={data.reactions} />
          <button className="flex transition-colors gap-1 p-2 hover:text-info hover:bg-info/25 rounded-full">
            <MessageCircle className="" />
            817
          </button>
        </div>
        <div className="border-border border-solid border-2"></div>
        {/* Comments */}
        <CommentSection data={data.comments} />
      </div>
    </div>
  );
};

interface AuthorPfpProps {
  data: User;
  extraInfo?: string;
  currentUser?: boolean;
}

const AuthorPfp: FC<AuthorPfpProps> = ({ data, extraInfo, currentUser }) => {
  return (
    <div className="flex gap-2">
      <img
        className="rounded-full flex-[0_0_auto] aspect-square bg-gray-500 size-12"
        src={
          data.profileImage
            ? data.profileImage
            : 'https://i.redd.it/if-anyones-free-could-you-draw-my-avatar-image-1-as-the-v0-5skwcoczrnid1.png?width=987&format=png&auto=webp&s=55af69fa5cfd555a06d947f54e9f69fabb4bebb2'
        }
        alt="User avatar"
      />
      {!currentUser ? (
        <div className="flex flex-col justify-center items-start">
          <h1 className="text-xl font-semibold">
            {data.displayName}
            {extraInfo && (
              <span className="text-muted-foreground">extraInfo</span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground font-semibold">
            @{data.username}
          </p>
        </div>
      ) : (
        <p className="self-center text-lg font-bold">Current User</p>
      )}
    </div>
  );
};

const FallBackPfp = () => {
  return (
    <div className="flex gap-2 w-full">
      <div className="rounded-full flex-[0_0_auto] aspect-square bg-gray-500 animate-pulse size-12"></div>
      <div className="flex flex-col w-full gap-2 justify-center items-start">
        <div className="w-full h-4 bg-gray-500 animate-pulse rounded-full"></div>
        <div className="w-1/2 h-4 bg-gray-500 animate-pulse rounded-full"></div>
      </div>
    </div>
  );
};

const CommentSection: FC<{ data: Comment[] }> = ({ data }) => {
  return (
    <div className="overflow-y-scroll h-full w-full">
      {data.map((cmt) => {
        return <CommentComp key={cmt._id} data={cmt} />;
      })}
    </div>
  );
};

const CommentComp: FC<{ data: Comment }> = ({ data }) => {
  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <div className="flex gap-2">
        {/* TODO fix image */}
        <img
          className="rounded-full bg-gray-500 size-12"
          src="https://pbs.twimg.com/profile_images/1581014308397502464/NPogKMyk_400x400.jpg"
          alt="User avatar"
        />
        <div className="flex flex-col justify-center items-start">
          <h1 className="text-xl font-semibold">
            Greg
            <span className="text-muted-foreground"> • 23m</span>
          </h1>
          <p className="text-sm text-muted-foreground font-semibold">
            @TheRealGreg
          </p>
        </div>
      </div>
      <p>Love the art, such a masterpiece!</p>
      {/* Comment actions */}
      <div className="flex gap-4">
        <button className="flex transition-colors gap-1 p-2 hover:text-danger hover:bg-danger/25 rounded-full">
          <Heart className="" />
          87
        </button>
      </div>
    </div>
  );
};

const Reactions: FC<{ reactions: Reaction[] }> = ({ reactions }) => {
  const [reactedReaction, setReactedReaction] = useState<ReactionTypes>(
    ReactionTypes.NULL,
  );

  const changeReaction = (to: ReactionTypes) => {
    if (to === reactedReaction) setReactedReaction(ReactionTypes.NULL);
    else setReactedReaction(to);
  };

  return (
    <DropDownMenu
      hoverable
      content={
        <DropDownMenuContent layout="horizontal">
          <DropDownItem asChild>
            <ReactionButton
              isSelected={reactedReaction === ReactionTypes.LIKE}
              onClick={() => {
                changeReaction(ReactionTypes.LIKE);
              }}
              color="#7aa2f7"
              amount={2496}
              Icon={ThumbsUp}
            />
          </DropDownItem>
          <DropDownItem asChild>
            <ReactionButton
              isSelected={reactedReaction === ReactionTypes.LOVE}
              onClick={() => {
                changeReaction(ReactionTypes.LOVE);
              }}
              color="#f7768e"
              amount={5070}
              Icon={Heart}
            />
          </DropDownItem>
          <DropDownItem asChild>
            <ReactionButton
              isSelected={reactedReaction === ReactionTypes.HAHA}
              onClick={() => {
                changeReaction(ReactionTypes.HAHA);
              }}
              color="#e0af68"
              amount={156}
              Icon={Laugh}
            />
          </DropDownItem>
          <DropDownItem asChild>
            <ReactionButton
              isSelected={reactedReaction === ReactionTypes.ANGRY}
              onClick={() => {
                changeReaction(ReactionTypes.ANGRY);
              }}
              color="#f7768e"
              amount={78}
              Icon={Angry}
            />
          </DropDownItem>
        </DropDownMenuContent>
      }
    >
      {/* <ReactionButton color="#7aa2f7" amount={27} Icon={ThumbsUp} /> */}
      <SmilePlus />
      {reactions.length}
    </DropDownMenu>
  );
};

interface ReactionBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
  color: string;
  amount: number;
  Icon: LucideIcon;
}

const ReactionButton: FC<ReactionBtnProps> = ({
  isSelected = false,
  color,
  amount,
  onClick,
  Icon,
  className,
  ...props
}) => {
  let baseStyle = {
    fill: 'transparent',
    color: 'white',
  } as CSSProperties;

  let activeStyle = isSelected
    ? ({
      fill: color,
    } as CSSProperties)
    : {};

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(e);
      }}
      {...props}
      className={`flex justify-center items-center group gap-2 p-2 rounded-lg hover:bg-secondary ${className}`}
    >
      <Icon
        style={{
          ...baseStyle,
          ...activeStyle,
        }}
        className={`transition-all group-active:animate-scale`}
      />
      {amount}
    </button>
  );
};

export { CommentSection, PostImages, AuthorPfp, FallBackPfp };
export type { Posts, User, Reaction, CommentComp as Comment };
const Post = PostComponent;
export default Post;
