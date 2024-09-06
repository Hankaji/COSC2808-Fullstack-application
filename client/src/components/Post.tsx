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
  useEffect,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Posts,
  Comment,
  User,
  Reaction,
  ReactionTypes,
  parseBasicUser,
  parseComment,
} from '../types/post';
import { mergeClassNames } from '../utils';
import {
  DropDownItem,
  DropDownMenu,
  DropDownMenuContent,
} from './ui/DropDownMenu';
import PopupModal from './PopupModal';
import { ToastContext } from '../context/ToastProvider';
import { URL_BASE } from '../config';
import { isEditable } from '@testing-library/user-event/dist/utils';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: Posts;
}

interface ReactionsProps {
  reactions: Reaction[];
  context: 'post' | 'comment';
  postId: string;
  commentId?: string; // Optional, only needed for comments
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

  const { show, showAsync } = toastContext;

  // handle the Delete for post
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/posts/${data.id}`, {
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
      const response = await fetch(`http://localhost:8080/posts/${data.id}`, {
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
        <div className="flex flex-col justify-start items-start gap-2">
          <p>{data.content}</p>
          <PostImages imgData={data.images} />
        </div>
        {/* Post actions */}
        <div className="flex gap-4">
          <Reactions
            reactions={data.reactions}
            context="post"
            postId={data.id}
          />
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
            <div className="p-6 block-container flex-col text-foreground bg-background border-solid border-border border-2 rounded-lg shadow-lg">
              <h2>Are you sure you want to delete this post?</h2>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    console.log('Cancel button clicked');
                  }}
                  className="mr-2 px-4 py-2 bg-info hover:bg-secondary transition-colors rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Delete button clicked');
                    handleDelete();
                  }}
                  className="px-4 py-2 bg-danger hover:bg-secondary transition-colors rounded"
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
            <div className="p-6 block-container flex-col w-[500px] bg-background border-border border-2 border-solid text-foreground rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold">Edit Post</h2>
              <textarea
                className="w-full p-2 h-40 mt-2 border-solid border-border border-2 bg-background resize-none rounded"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                onClick={(e) => e.stopPropagation()} // Prevent click propagation
              />
              <button
                className="mt-2 px-4 py-2 bg-primary hover:bg-secondary transition-colors text-white rounded"
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
                    setIsEditPopup(false);
                  }}
                  className="mr-2 px-4 py-2 bg-info hover:bg-secondary transition-colors rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleEdit();
                  }}
                  className="px-4 py-2 bg-success hover:bg-secondary transition-colors text-white rounded"
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

  if (imgData === undefined) {
    return <></>;
  }

  const prev = () => {
    setCurrentIdx((curr) => (curr === 0 ? imgData.length - 1 : curr - 1));
  };

  const next = () => {
    setCurrentIdx((curr) => (curr === imgData.length - 1 ? 0 : curr + 1));
  };

  return (
    <div className="relative overflow-hidden rounded-lg w-full">
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
              alt={img}
            />
          </div>
        ))}
      </div>
      {imgData.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute top-1/2 z-10 -translate-y-1/2 left-2 p-1 rounded-full bg-secondary/50 hover:bg-secondary/75 transition-colors"
          >
            <ChevronLeft size={36} />
          </button>
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
                      currentIdx === idx ? 'p-2' : 'bg-opacity-50',
                    )}
                  ></div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const PostPopup: FC<{
  closePopup: any;
  data: Posts;
}> = ({ closePopup, data }) => {
  const [comment, setComment] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const userCommentRef = useRef<HTMLDivElement>(null);

  const toast = useToast();

  const [commentList, setCommentList] = useState<Comment[]>(data.comments);

  const addComment = (content: string) => {
    const addRequest = async () => {
      try {
        const endpoint = `${URL_BASE}/posts/${data.id}/comment`;
        const res = await fetch(endpoint, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            content: content,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(res);

        if (res.ok) {
          const data = await res.json();
          const comment = parseComment(data.comment);
          setCommentList((prev) => [comment, ...prev]);
        }
      } catch (error) { }
    };

    toast.showAsync(addRequest, {
      loading: {
        title: 'Posting comment...',
      },
      success: (_) => ({
        title: 'Comment posted',
      }),
      error: (_) => ({
        title: 'Couldnt post comment',
        description: 'Please try again later',
      }),
    });
  };

  const onCommentEditSuccess = (p_cmt: Comment) => {
    setCommentList((prev) =>
      prev.map((cmt) => {
        if (cmt.id === p_cmt.id) {
          return p_cmt;
        } else {
          return cmt;
        }
      }),
    );
  };
  const onCommentDeleteSuccess = (id: string) => {
    setCommentList((prev) => prev.filter((cmt) => cmt.id !== id));
  };

  return (
    <div
      onClick={() => {
        closePopup(false);
      }}
      className="z-50 fixed top-0 left-0 w-svw h-svh backdrop-blur-[2px] flex justify-center items-center px-[15%]"
    >
      {data.images && data.images.length > 0 && (
        <div className="flex items-center overflow-hidden z-[100] h-[80%] w-[60%] aspect-auto rounded-lg rounded-tr-none rounded-br-none">
          {/* <img */}
          {/*   className="object-cover w-full h-full" */}
          {/*   src="https://pbs.twimg.com/media/GUwiAFWagAAmQ5I?format=jpg&name=small" */}
          {/*   alt="" */}
          {/* /> */}
          <PostImages imgData={data.images} />
        </div>
      )}
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className={mergeClassNames(
          `flex flex-col z-[100] gap-4 w-full h-[80%]`,
          'p-4 my-4 border-border border-solid border-2 rounded-tr-lg  rounded-br-lg bg-card',
          !data.images && ' rounded-tl-lg rounded-bl-lg',
        )}
      >
        {/* Author */}
        <div className="flex gap-2">
          <AuthorPfp data={data.user} />
          <div className="flex ml-auto">
            <Edit className="text-primary" />
          </div>
        </div>
        {/* Content */}
        <div className="flex flex-col justify-start items-start gap-2">
          <p>{data.content}</p>
        </div>
        {/* Post actions */}
        <div className="flex gap-4">
          <Reactions
            reactions={data.reactions}
            context="post"
            postId={data.id}
          />
          <button className="flex transition-colors gap-1 p-2 hover:text-info hover:bg-info/25 rounded-full">
            <MessageCircle className="" />
            {data.comments.length}
          </button>
        </div>
        <div className="border-border border-solid border-2"></div>
        {/* Comment input textarea */}
        <div className=" relative flex items-center max-h-[999px] transition-all duration-500 justify-start gap-1 text-lg bg-background py-2 px-4 border-b-border border-b-2 border-solid focus-within:border-primary">
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onInput={() => {
              setIsEditing(true);
              setComment(userCommentRef.current?.textContent || '');
            }}
            onBlur={() => {
              setIsEditing(false);
            }}
            ref={userCommentRef}
            contentEditable
            className="w-full h-max p-0 text-wrap break-words break-all transition-all duration-500 resize-none bg-background text-lg rounded-lg outline-none"
          ></div>
          <span
            onClick={() => {
              userCommentRef.current?.focus();
            }}
            className="absolute left-0 pl-4 cursor-default select-none text-muted"
          >
            {comment.trim() === '' && !isEditing && 'Post a comments'}
          </span>
          <button
            onClick={() =>
              addComment(userCommentRef.current?.textContent || 'err')
            }
            className="py-1 px-4 rounded-lg bg-primary"
          >
            Post
          </button>
        </div>
        {/* Comments */}
        <CommentSection
          onCommentEditSuccess={onCommentEditSuccess}
          onCommentDeleteSuccess={onCommentDeleteSuccess}
          data={commentList}
          postId={data.id}
        />
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

interface CommentProp {
  data: Comment;
  postId: string;
  onCommentEditSuccess: (cmt: Comment) => void;
  onCommentDeleteSuccess: (id: string) => void;
}

const CommentComp: FC<CommentProp> = ({
  data,
  postId,
  onCommentEditSuccess,
  onCommentDeleteSuccess,
}) => {
  const { auth } = useAuth();
  const currUser = auth.user!;
  const toast = useToast();

  const [comment, setComment] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const userCommentRef = useRef<HTMLDivElement>(null);

  // If current user id match with comment's author_id, or is admin => Can edit/delete comment
  const isCurrentUserEditable: boolean =
    currUser.isAdmin || data.author_id.id === currUser.userId;

  const onCommentEdit = (cmt: string) => {
    const editRequest = async () => {
      try {
        const endpoint = `${URL_BASE}/posts/${postId}/comment/${data.id}`;
        const res = await fetch(endpoint, {
          method: 'PATCH',
          credentials: 'include',
          body: JSON.stringify({
            content: cmt,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(res);

        if (res.ok) {
          data.editHistory.push({
            content: data.content,
            createdAt: new Date(),
          });
          onCommentEditSuccess({
            ...data,
            content: cmt,
          });

          setIsEditing(false);
        }
      } catch (error) { }
    };

    toast.showAsync(editRequest, {
      loading: {
        title: 'Editing comment...',
      },
      success: (_) => ({
        title: 'Comment edited',
      }),
      error: (_) => ({
        title: 'Couldnt edit comment',
        description: 'Please try again later',
      }),
    });
  };

  const onCommentDelete = () => {
    const delRequest = async () => {
      try {
        const endpoint = `${URL_BASE}/posts/${postId}/comment/${data.id}`;
        const res = await fetch(endpoint, {
          method: 'DELETE',
          credentials: 'include',
        });

        console.log(res);
        if (res.ok) {
          onCommentDeleteSuccess(data.id);
        }
      } catch (error) { }
    };

    toast.showAsync(delRequest, {
      loading: {
        title: 'Editing comment...',
      },
      success: (_) => ({
        title: 'Comment edited',
      }),
      error: (_) => ({
        title: 'Couldnt edit comment',
        description: 'Please try again later',
      }),
    });
  };

  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <div className="flex gap-2">
        <AuthorPfp data={parseBasicUser(data.author_id)} />
      </div>
      {data.editHistory && data.editHistory.length > 0 && (
        <p className="font-bold italic text-muted text-sm">edited</p>
      )}
      <p className="truncate">{data.content}</p>
      {isEditing && (
        <div className="relative flex items-center w-full max-h-[999px] transition-all duration-500 justify-start gap-1 text-lg bg-background py-2 px-4 border-b-border border-b-2 border-solid focus-within:border-primary">
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onInput={() => {
              setIsEditing(true);
              setComment(userCommentRef.current?.textContent || '');
            }}
            ref={userCommentRef}
            contentEditable
            className="w-full h-max p-0 text-wrap break-words break-all transition-all duration-500 resize-none bg-background text-lg rounded-lg outline-none"
          ></div>
          {/* <span className="absolute left-0 pl-4 cursor-default select-none text-muted"> */}
          {/*   {comment.trim() === '' && !isEditing && 'Post a comments'} */}
          {/* </span> */}
          <button
            onClick={() => {
              setIsEditing(false);
            }}
            className="py-1 px-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onCommentEdit(userCommentRef.current?.textContent || 'err');
            }}
            className="py-1 px-4 rounded-lg bg-primary hover:bg-secondary transition-colors"
          >
            Edit
          </button>
        </div>
      )}
      {/* Comment actions */}
      <div className="flex gap-4 justify-start items-center">
        {/* Reactions */}
        <button className="flex transition-colors gap-1 rounded">
          <Reactions
            reactions={data.reactions}
            context="comment"
            postId={postId}
            commentId={data.id}
          />
        </button>
        {isCurrentUserEditable && (
          <>
            {/* Edit */}
            <button
              onClick={() => {
                setIsEditing(true);
              }}
              className="flex transition-colors px-2 hover:text-info hover:bg-info/25 rounded-lg"
            >
              Edit
            </button>
            {/* Delete */}
            <button
              onClick={onCommentDelete}
              className="flex transition-colors px-2 hover:text-danger hover:bg-danger/25 rounded-lg"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const CommentSection: FC<{
  data: Comment[];
  postId: string;
  onCommentEditSuccess: (cmt: Comment) => void;
  onCommentDeleteSuccess: (id: string) => void;
}> = ({ data, postId, onCommentDeleteSuccess, onCommentEditSuccess }) => {
  return (
    <div className="flex flex-col gap-4 overflow-y-scroll h-full w-full">
      {data.map((cmt) => {
        return (
          <CommentComp
            onCommentEditSuccess={onCommentEditSuccess}
            onCommentDeleteSuccess={onCommentDeleteSuccess}
            key={cmt.id}
            data={cmt}
            postId={postId}
          />
        );
      })}
    </div>
  );
};

const Reactions: FC<ReactionsProps> = ({
  reactions,
  context,
  postId,
  commentId,
}) => {
  const [reactedReaction, setReactedReaction] = useState<ReactionTypes>(
    ReactionTypes.NULL,
  );

  const [reactionCounts, setReactionCounts] = useState<
    Record<ReactionTypes, number>
  >({
    [ReactionTypes.LIKE]: 0,
    [ReactionTypes.LOVE]: 0,
    [ReactionTypes.HAHA]: 0,
    [ReactionTypes.ANGRY]: 0,
    [ReactionTypes.NULL]: 0,
  });

  let endpoint = '';
  const changeReaction = (to: ReactionTypes) => {
    if (context === 'post') {
      endpoint = `${URL_BASE}/posts/${postId}/reaction`;
    } else if (context === 'comment') {
      endpoint = `${URL_BASE}/posts/${postId}/comment/${commentId}/reaction`;
    }
    if (to === reactedReaction) {
      setReactionCounts((prev) => ({
        ...prev,
        [to]: prev[to] - 1,
      }));
      setReactedReaction(ReactionTypes.NULL);
      deleteReaction();
    } else {
      if (reactedReaction !== ReactionTypes.NULL) {
        setReactionCounts((prev) => ({
          ...prev,
          [reactedReaction]: prev[reactedReaction] - 1,
        }));
      }
      setReactionCounts((prev) => ({
        ...prev,
        [to]: prev[to] + 1,
      }));
      setReactedReaction(to);
      addReaction(to);
    }
  };
  // handle adding + editing reaction
  const addReaction = async (reactionType: ReactionTypes) => {
    try {
      const formattedType =
        reactionType.charAt(0).toUpperCase() +
        reactionType.slice(1).toLowerCase();
      const response = await fetch(`${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formattedType,
          // Add any other necessary data here
        }),
      });

      if (response.ok) {
        console.log('Reacted successfully');
      } else {
        console.error('Failed to react');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteReaction = async () => {
    try {
      const response = await fetch(`${endpoint}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Deleted successfully');
      } else {
        console.error('Failed to react');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const newCounts = {
      [ReactionTypes.LIKE]: 0,
      [ReactionTypes.LOVE]: 0,
      [ReactionTypes.HAHA]: 0,
      [ReactionTypes.ANGRY]: 0,
      [ReactionTypes.NULL]: 0,
    };

    reactions.forEach((reaction) => {
      const reactionType = reaction.type.toUpperCase() as ReactionTypes;
      if (reactionType in newCounts) {
        newCounts[reactionType]++;
      }
    });

    setReactionCounts(newCounts);
  }, [reactions]);
  return (
    <DropDownMenu
      content={
        <DropDownMenuContent layout="horizontal">
          <DropDownItem asChild>
            <ReactionButton
              isSelected={reactedReaction === ReactionTypes.LIKE}
              onClick={() => changeReaction(ReactionTypes.LIKE)}
              color="#7aa2f7"
              amount={reactionCounts[ReactionTypes.LIKE]}
              Icon={ThumbsUp}
            />
          </DropDownItem>
          <DropDownItem asChild>
            <ReactionButton
              isSelected={reactedReaction === ReactionTypes.LOVE}
              onClick={() => changeReaction(ReactionTypes.LOVE)}
              color="#f7768e"
              amount={reactionCounts[ReactionTypes.LOVE]}
              Icon={Heart}
            />
          </DropDownItem>
          <DropDownItem asChild>
            <ReactionButton
              isSelected={reactedReaction === ReactionTypes.HAHA}
              onClick={() => changeReaction(ReactionTypes.HAHA)}
              color="#e0af68"
              amount={reactionCounts[ReactionTypes.HAHA]}
              Icon={Laugh}
            />
          </DropDownItem>
          <DropDownItem asChild>
            <ReactionButton
              isSelected={reactedReaction === ReactionTypes.ANGRY}
              onClick={() => changeReaction(ReactionTypes.ANGRY)}
              color="#f7768e"
              amount={reactionCounts[ReactionTypes.ANGRY]}
              Icon={Angry}
            />
          </DropDownItem>
        </DropDownMenuContent>
      }
    >
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
      className={mergeClassNames(
        `flex justify-center items-center group gap-2 p-2 rounded-lg hover:bg-secondary`,
        className,
      )}
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

export {
  CommentSection,
  PostImages,
  AuthorPfp,
  FallBackPfp,
  CommentComp as Comment,
};
export type { Posts, User, Reaction };
const Post = PostComponent;
export default Post;
