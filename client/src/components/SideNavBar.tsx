import {
  Bell,
  Earth,
  Home,
  LogOut,
  LucideIcon,
  Settings,
  SquarePlus,
} from 'lucide-react';
import { ButtonHTMLAttributes, FC, useState } from 'react';

export type SideBarItem = {
  Logo: LucideIcon;
  name: string;
  onClick?: () => void; // TODO: replace this with href
};

const items: SideBarItem[] = [
  {
    Logo: Home,
    name: 'Home',
  },
  {
    Logo: Earth,
    name: 'Explore',
  },
  {
    Logo: Bell,
    name: 'Notifications',
  },
  {
    Logo: SquarePlus,
    name: 'Create post',
  },
];

const bottomActions: SideBarItem[] = [
  {
    Logo: LogOut,
    name: 'Logout',
  },
  {
    Logo: Settings,
    name: 'Settings',
  },
];

const SideNavBar = () => {
  const [selected, setSelected] = useState<number>(0);

  return (
    <nav className="flex flex-col p-10 gap-8 border-r-2 border-border">
      {/* Logo */}
      <div className="flex items-center gap-5">
        <img
          className="size-10 object-cover mx-auto"
          style={{ maskSize: 'cover', WebkitMaskSize: 'cover' }}
          src="/logo.svg"
          alt="SnapMate logo"
        />
        <span className="font-bold text-3xl">SnapMate</span>
      </div>

      {/* Navigation items */}
      <ul className="flex flex-col gap-3 w-full">
        {items.map((item, idx) => {
          return (
            <li key={idx}>
              <SideBarButton
                className={selected === idx ? 'bg-secondary' : ''}
                data={item}
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
                <SideBarButton data={item} />
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

interface SideBarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  data: SideBarItem;
}

const SideBarButton: FC<SideBarButtonProps> = ({
  data: { name, Logo },
  ...props
}) => {
  return (
    <button
      {...props}
      className={
        'flex justify-start items-center gap-4 hover:bg-secondary py-3 px-4 w-full rounded-lg transition-all' +
        ` ${props.className}`
      }
    >
      <Logo size={28} />
      <span className="text-lg">{name}</span>
    </button>
  );
};

export default SideNavBar;
