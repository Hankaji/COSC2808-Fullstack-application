import {
  Bell,
  ChartNoAxesGantt,
  Home,
  LogOut,
  LucideIcon,
  Search,
  SquarePlus,
  User,
} from 'lucide-react';
import { FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { mergeClassNames } from '../utils';

type SidebarItemBase = {
  Logo: LucideIcon;
  name: string;
  requireAdmin?: boolean;
};

type SidebarInternalLinkItem = SidebarItemBase & {
  path: string;
};

type SidebarActionItem = SidebarItemBase & {
  onClick: () => void;
};

const internalLinkItems: SidebarInternalLinkItem[] = [
  {
    Logo: Home,
    name: 'Home',
    path: '/',
  },
  {
    Logo: Bell,
    name: 'Notifications',
    path: '/notifications',
  },
  {
    Logo: Search,
    name: 'Search',
    path: '/search',
  },
  {
    Logo: User,
    name: 'Friends',
    path: '/friends',
  },
  {
    Logo: SquarePlus,
    name: 'Create group',
    path: '/groups/create',
  },
  {
    Logo: ChartNoAxesGantt,
    name: 'Admin',
    path: '/admin',
    requireAdmin: true,
  },
];

const Sidebar = () => {
  const { auth, setAuth } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const bottomActions: SidebarActionItem[] = [
    {
      Logo: LogOut,
      name: 'Logout',
      onClick: () => {
        console.log('Clicked');
        setAuth({});
        navigate('/login');
      },
    },
  ];

  return (
    <nav className="flex flex-col p-10 gap-8 border-r-2 border-border">
      {/* Logo */}
      <Link to="/" className="cursor-pointer flex items-center gap-3">
        <img
          className="size-10 object-cover mx-auto"
          style={{ maskSize: 'cover', WebkitMaskSize: 'cover' }}
          src="/logo.svg"
          alt="SnapMate logo"
        />
        <span className="font-bold text-3xl">SnapMate</span>
      </Link>

      {/* Navigation items */}
      <ul className="flex flex-col gap-3 w-full">
        {internalLinkItems.map((item, idx) => {
          if (item.requireAdmin) {
            if (!auth.user?.isAdmin) {
              return null;
            }
          }
          return (
            <li key={idx}>
              <SidebarButton
                isActive={location.pathname === item.path}
                data={item}
                href={item.path}
              />
            </li>
          );
        })}
      </ul>
      {/* Bottom actions */}
      <div className="flex flex-col justify-end h-full w-full">
        <ul className="flex flex-col gap-3">
          {bottomActions.map((item, idx) => {
            return (
              <li key={idx}>
                <SidebarButton onClick={item.onClick} data={item} />
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

interface SidebarButtonProps {
  data: SidebarItemBase;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
}

const SidebarButton: FC<SidebarButtonProps> = ({
  data: { name, Logo },
  isActive,
  href,
  onClick,
}) => {
  if (href) {
    return (
      <Link
        to={href}
        className={mergeClassNames(
          'flex justify-start items-center gap-4 hover:bg-secondary py-3 px-4 w-full rounded-lg transition-all',
          isActive ? 'bg-secondary' : '',
        )}
      >
        <Logo size={28} />
        <span className="text-lg">{name}</span>
      </Link>
    );
  }

  return (
    <button
      className={mergeClassNames(
        'flex justify-start items-center gap-4 hover:bg-secondary py-3 px-4 w-full rounded-lg transition-all',
        isActive ? 'bg-secondary' : '',
      )}
      onClick={(e) => {
        e.preventDefault();
        console.log(onClick);
        onClick && onClick();
      }}
    >
      <Logo size={28} />
      <span className="text-lg">{name}</span>
    </button>
  );
};

export default Sidebar;
