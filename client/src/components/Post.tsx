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
} from "lucide-react";
import {
  ButtonHTMLAttributes,
  CSSProperties,
  FC,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { URL_BASE } from "../config";
import useAuth from "../hooks/useAuth";
import { Comment } from "../types/post";
import { mergeClassNames, formatRelativeTime } from "../utils";
import {
  DropDownItem,
  DropDownMenu,
  DropDownMenuContent,
} from "./ui/DropDownMenu";
type Post = {
  id: string;
  author: {
    avatar: string;
    username: string;
    displayName: string;
  };
  content: string;
  images?: string[];
  currentReaction?: Reaction;
  reactions: Reaction[];
  comments: Comment[];
  editHistories: string[];
};

type Author = {
  avatar: string;
  username: string;
  displayName: string;
};

type Reaction = {
  author: Author;
  type: string;
};

enum ReactionTypes {
  LIKE = "LIKE",
  LOVE = "LOVE",
  HAHA = "HAHA",
  ANGRY = "ANGRY",
  NULL = "NULL",
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: Post;
}

interface ReactionsProps {
  reactions: Reaction[];
  context: "post" | "comment";
  postId: string;
  commentId?: string; // Optional, only needed for comments
}

const Post: FC<Props> = ({ className, data }) => {
  const [isPopup, setIsPopup] = useState<boolean>(false);

  const handlePostClick = () => {
    setIsPopup(true);
  };

  return (
    <>
      <div
        onClick={handlePostClick}
        className={`flex flex-col gap-4 w-full h-fit p-4 my-4 border-border border-solid border-2 rounded-lg bg-card hover:bg-secondary/25 hover:cursor-pointer ${className}`}
      >
        {/* Author */}
        <div className="flex gap-2 items-center">
          <AuthorPfp data={data.author} />
          <div className="flex ml-auto">
            {/* <Edit className="text-primary" /> */}
            <DropDownMenu
              content={
                <DropDownMenuContent className="-translate-x-1/2">
                  <DropDownItem>Edit post</DropDownItem>
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
                  "transition-all size-3 bg-white rounded-full",
                  currentIdx == idx ? "p-2" : "bg-opacity-50",
                )}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PostPopup: FC<{ closePopup: any; data: Post }> = ({
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
          <AuthorPfp data={data.author} />
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
        {/* Comments */}
        <CommentSection data={data.comments} postId={data.id} />
      </div>
    </div>
  );
};

interface AuthorPfpProps {
  data: Author;
  extraInfo?: string;
}

const AuthorPfp: FC<AuthorPfpProps> = ({ data, extraInfo }) => {
  return (
    <div className="flex gap-2">
      <img
        className="rounded-full flex-[0_0_auto] aspect-square bg-gray-500 size-12"
        src={
          data.avatar
            ? data.avatar
            : "https://i.redd.it/if-anyones-free-could-you-draw-my-avatar-image-1-as-the-v0-5skwcoczrnid1.png?width=987&format=png&auto=webp&s=55af69fa5cfd555a06d947f54e9f69fabb4bebb2"
        }
        alt="User avatar"
      />
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
    </div>
  );
};

const CommentSection: FC<{ data: Comment[]; postId: string }> = ({
  data,
  postId,
}) => {
  return (
    <div className="overflow-y-scroll h-full w-full">
      {data.map((cmt) => {
        return <CommentComp key={cmt._id} data={cmt} postId={postId} />;
      })}
    </div>
  );
};

interface CommentProp {
  data: Comment;
  postId: string;
}

const CommentComp: FC<CommentProp> = ({ data, postId }) => {
  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <div className="flex gap-2">
        {/* TODO fix image */}
        <img
          className="rounded-full bg-gray-500 size-12"
          src={
            data.author_id.virtualProfileImage
              ? data.author_id.virtualProfileImage
              : "https://i.redd.it/if-anyones-free-could-you-draw-my-avatar-image-1-as-the-v0-5skwcoczrnid1.png?width=987&format=png&auto=webp&s=55af69fa5cfd555a06d947f54e9f69fabb4bebb2"
          }
          alt="User avatar"
        />
        <div className="flex flex-col justify-center items-start">
          <h1 className="text-xl font-semibold">
            {data.author_id.displayName}
            <span className="text-muted-foreground">
              {" "}
              • {formatRelativeTime(new Date(data.createdAt))}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground font-semibold">
            @{data.author_id.username}
          </p>
        </div>
      </div>
      <p>{data.content}</p>
      {/* Comment actions */}
      <div className="flex gap-4">
        <button className="flex transition-colors gap-1 p-2 hover:text-danger hover:bg-danger/25 rounded-full">
          <Reactions
            reactions={data.reactions}
            context="comment"
            postId={postId}
            commentId={data._id}
          />
        </button>
      </div>
    </div>
  );
};

const Reactions: FC<ReactionsProps> = ({
  reactions,
  context,
  postId,
  commentId,
}) => {
  const { auth } = useAuth();
  const user = auth.user;
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

  const changeReaction = (to: ReactionTypes) => {
    let endpoint = "";
    if (context === "post") {
      endpoint = `${URL_BASE}/posts/${postId}/reactions`;
    } else if (context === "comment") {
      endpoint = `${URL_BASE}/posts/${postId}/comment/${commentId}/reactions`;
    }
    if (to === reactedReaction) {
      setReactionCounts((prev) => ({
        ...prev,
        [to]: prev[to] - 1,
      }));
      setReactedReaction(ReactionTypes.NULL);
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
      hoverable
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
    fill: "transparent",
    color: "white",
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

export { CommentSection, PostImages, AuthorPfp };
export type { Post, Author, Reaction, CommentComp as Comment };
export default Post;
