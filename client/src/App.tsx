import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import { URL_BASE } from './config';
import AdminPage from './pages/admin';
import FriendsPage from './pages/friends';
import CreateGroupForm from './pages/groups/create_group';
import GroupPage from './pages/groups/group';
import HomePage from './pages/home';
import LoginRegisterForm from './pages/login_register';
import NotificationsPage from './pages/notifications';
import PostPage from './pages/posts/post';
import Search from './pages/search';
import UserPage from './pages/users/user';

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
    path: '/search',
    element: <Search />,
  },
  {
    path: '/posts/:postId',
    element: <PostPage />,
    loader: async ({ params }) => {
      const endpoint = `${URL_BASE}/posts/${params.postId}`;
      const res = await fetch(endpoint, {
        method: 'GET',
      });
      return res.json();
    },
  },
  {
    path: "/friends",
    element: <FriendsPage />,
  },
  {
    path: "/users/:userId",
    element: <UserPage />,
    loader: async ({ params }) => {
      const endpoint = `http://localhost:8080/users/${params.userId}`;
      const res = await fetch(endpoint, {
        method: "GET",
      });
      return res.json();
    },
  },
  {
    path: "groups",
    children: [
      {
        path: "create",
        element: <CreateGroupForm />,
      },
      {
        path: ":groupId",
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
