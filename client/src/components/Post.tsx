import {
  Angry,
  Edit,
  Ellipsis,
  Heart,
  Laugh,
  LucideIcon,
  MessageCircle,
  SmilePlus,
  ThumbsUp,
  User,
} from 'lucide-react';
import {
  ButtonHTMLAttributes,
  CSSProperties,
  FC,
  HTMLAttributes,
  useState,
} from 'react';
import {
  DropDownItem,
  DropDownMenu,
  DropDownMenuContent,
} from './ui/DropDownMenu';

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

type Comment = {
  id: string;
  author: Author;
  content: string;
  currentReaction: Reaction;
  reactions: Reaction[];
};

type Author = {
  avatar: string;
  username: string;
  displayName: string;
};

type Reaction = {
  author: Author;
  type: ReactionTypes;
};

const enum ReactionTypes {
  NULL,
  LIKE,
  LOVE,
  HAHA,
  ANGRY,
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  data: Post;
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
          {data.images && <PostImages imgData={data.images} />}
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
    </>
  );
};

const PostImages: FC<{ imgData: string[] }> = ({ imgData }) => {
  return (
    <div className="overflow-hidden aspect-auto rounded-lg">
      {imgData.map((img) => (
        <img className="size-full object-cover" src={img} />
      ))}
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
  data: Author;
  extraInfo?: string;
}

const AuthorPfp: FC<AuthorPfpProps> = ({ data, extraInfo }) => {
  return (
    <div className="flex gap-2">
      {data.avatar ? (
        <img
          className="rounded-full bg-gray-500 size-12"
          src={data.avatar}
          alt="User avatar"
        />
      ) : (
        <div className="rounded-full bg-gray-500 min-size-12 flex justify-center items-center p-2">
          <User />
        </div>
      )}
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

const CommentSection: FC<{ data: Comment[] }> = ({ data }) => {
  return (
    <div className="overflow-y-scroll h-full w-full">
      {data.map((cmt) => {
        return <Comment key={cmt.id} data={cmt} />;
      })}
    </div>
  );
};

const Comment: FC<{ data: Comment }> = ({ data }) => {
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
      triggerType="hover"
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

export { CommentSection, PostImages, AuthorPfp };
export type { Post, Author, Reaction, Comment };
export default Post;
