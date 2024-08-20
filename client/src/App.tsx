import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import LoginRegisterForm from './pages/login_register';
import HomePage from './pages/home';
import FriendsPage from './pages/friends';
import GroupPage from './pages/groups/group';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
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
    path: '/friends',
    element: <FriendsPage />,
  },
  {
    path: '/profile', // TODO: remove this page
    children: [
      {
        // Show people profile through this link
        path: '/profile/:userId',
      },
    ],
  },
  {
    path: '/groups',
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
