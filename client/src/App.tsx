import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import RequireAuth from './components/RequireAuth';
import { URL_BASE } from './config';
import { AuthProvider } from './context/AuthProvider';
import ToastProvider from './context/ToastProvider';
import useAuth from './hooks/useAuth';
import AdminPage from './pages/admin';
import Error from './pages/error';
import FriendsPage from './pages/friends';
import JoinedGroups from './pages/groups';
import CreateGroupForm from './pages/groups/create_group';
import GroupPage from './pages/groups/group';
import HomePage from './pages/home';
import LoginRegisterForm, { formState } from './pages/login_register';
import NotificationsPage from './pages/notifications';
import PostPage from './pages/posts/post';
import Search from './pages/search';
import Unauthorized from './pages/unauthorized';
import UserPage from './pages/users/user';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginRegisterForm />,
  },
  {
    path: '/register',
    element: <LoginRegisterForm initialState={formState.SIGNUP} />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/notifications',
        element: <NotificationsPage />,
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
        path: '/friends',
        element: <FriendsPage />,
      },
      {
        path: '/users/:userId',
        element: <UserPage />,
        loader: async ({ params }) => {
          const endpoint = `http://localhost:8080/users/${params.userId}`;
          const res = await fetch(endpoint, {
            method: 'GET',
          });
          return res.json();
        },
      },
      {
        path: 'groups',
        children: [
          {
            path: '',
            element: <JoinedGroups />,
          },
          {
            path: 'create',
            element: <CreateGroupForm />,
          },
          {
            path: ':groupId',
            element: <GroupPage />,
          },
        ],
      },
    ],
  },
  {
    element: <RequireAuth requireAdminAccess />,
    children: [
      {
        path: 'admin',
        element: <AdminPage />,
        loader: async () => {
          try {
            const groupCreationRequestEndpoint = `${URL_BASE}/requests/group_creation_requests`;
            const groupCreationReqRes = await fetch(
              groupCreationRequestEndpoint,
              {
                method: 'GET',
                credentials: 'include',
              },
            );

            const groupCreationRequestData = await groupCreationReqRes.json();

            return JSON.stringify({
              groupCreationReqs: groupCreationRequestData,
            });
          } catch (error: any) {
            console.error(error);
          }
        },
      },
    ],
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '*',
    element: <Error />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="flex App text-foreground bg-background min-h-svh">
          <RouterProvider router={router} />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
