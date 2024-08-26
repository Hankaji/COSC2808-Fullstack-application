import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import LoginRegisterForm from "./pages/login_register";
import HomePage from "./pages/home";
import FriendsPage from "./pages/friends";
import NotificationsPage from "./pages/notifications";
import GroupPage from "./pages/groups/group";
import PostPage from "./pages/posts/post";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/notifications",
    element: <NotificationsPage />,
  },
  {
    path: "/login",
    element: <LoginRegisterForm />,
  },
  {
    path: "/register",
    // element: <LoginRegisterForm />,
  },
  {
    path: "/posts/:postId",
    element: <PostPage />,
  },
  {
    path: "/friends",
    element: <FriendsPage />,
  },
  {
    path: "/group",
    children: [
      {
        path: "/groups/:groupId",
        element: <GroupPage />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="flex App text-foreground bg-background min-h-svh">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
