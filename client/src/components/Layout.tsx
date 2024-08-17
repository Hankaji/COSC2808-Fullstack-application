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
      <div className="flex-1 h-screen overflow-hidden scrollbar-hide p-10">
        <div className="flex gap-10 mx-auto max-w-[1000px] h-screen overflow-hidden pb-20">
          <main className="flex-[2] overflow-y-auto pr-4">{children}</main>
          {stickyRightSideCmp && (
            <aside className="flex-[1] h-screen">{stickyRightSideCmp}</aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
