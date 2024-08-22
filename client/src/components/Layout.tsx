import { FC, PropsWithChildren } from 'react';
import Sidebar from './Sidebar';
import SearchAndAddFriend from './SearchAndAddFriend';
import SuggestionsAccList from './SuggestionAccList';

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
          <aside className="flex-[1] h-screen">
            {stickyRightSideCmp ?? <DefaultStickyRightSide />}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Layout;

const DefaultStickyRightSide: FC = () => {
  return (
    <div className="space-y-4">
      <SearchAndAddFriend />
      <SuggestionsAccList />
    </div>
  );
};
