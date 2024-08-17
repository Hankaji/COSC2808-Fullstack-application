import { FC, PropsWithChildren } from 'react';
import Sidebar from './Sidebar';

const Layout: FC<
  PropsWithChildren & {
    stickyRightSideCmp?: React.ReactNode;
  }
> = ({ children, stickyRightSideCmp }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex gap-10 h-screen overflow-hidden scrollbar-hide p-10 pb-0">
        <main className="flex-[2] overflow-y-auto scrollbar-hide">
          {children}
        </main>
        {stickyRightSideCmp && (
          <aside className="flex-[1] h-screen">{stickyRightSideCmp}</aside>
        )}
      </div>
    </div>
  );
};

export default Layout;
