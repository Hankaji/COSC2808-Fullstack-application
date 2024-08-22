import { RouterProvider, createBrowserRouter, json } from 'react-router-dom';
import './App.css';
import FriendsPage from './pages/friends';
import GroupPage from './pages/groups/group';
import HomePage from './pages/home';
import LoginRegisterForm from './pages/login_register';
import NotificationsPage from './pages/notifications';
import PostPage from './pages/posts/post';
import UserPage from './pages/users/user';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/notifications',
    element: <NotificationsPage />,
  },
  {
    path: '/login',
    element: <LoginRegisterForm />,
  },
  {
    path: '/register',
    // element: <LoginRegisterForm />,
  },
  {
    path: '/posts/:postId',
    element: <PostPage />,
  },
  {
    path: '/friends',
    element: <FriendsPage />,
  },
  {
    path: '/users/:userId',
    element: <UserPage />,
    loader: async ({ params }) => {
      return json(
        {
          id: params.userId,
          a: 'test',
        },
        { status: 200 },
      );
    },
  },
  {
    path: '/group',
    children: [
      {
        path: '/groups/:groupId',
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
