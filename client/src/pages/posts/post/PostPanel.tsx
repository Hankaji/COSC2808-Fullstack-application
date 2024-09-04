import { useLoaderData } from "react-router";
import Post from "../../../components/Post";
import { Posts as RealPost } from "../../../types/post";

const PostPanel = () => {
  const postData = useLoaderData() as RealPost;

  return <Post data={postData} />;
};

export default PostPanel;
