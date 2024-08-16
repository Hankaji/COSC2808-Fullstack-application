import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import LoginRegisterForm from './LoginRegisterForm';
import HomePage from './pages/home/Home';
import FriendsPage from './pages/Friends';

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
    path: '/group',
    children: [
      {
        path: '/group/:groupId',
      },
    ],
  },
]);

function App() {
  return (
    <div className="App text-foreground bg-background min-h-svh">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
