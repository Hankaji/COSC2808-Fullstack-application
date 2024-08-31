import { FC, PropsWithChildren } from 'react';
import Sidebar from './Sidebar';
import SearchAndAddFriend from './SearchAndAddFriend';
import SuggestionsAccList from './SuggestionAccList';
import { mergeClassNames } from '../utils';
import useToast from '../hooks/useToast';
import { ToastDetail } from '../context/ToastProvider';

const Layout: FC<
  PropsWithChildren & {
    stickyRightSideCmp?: React.ReactNode;
    mainClassName?: string;
  }
> = ({ children, stickyRightSideCmp, mainClassName }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-screen overflow-hidden scrollbar-hide p-10">
        <div className="flex gap-10 mx-auto w-screen max-w-[60vw] h-screen overflow-hidden pb-20">
          <main
            className={mergeClassNames(
              'max-w-[60%] flex-auto overflow-y-auto overflow-x-clip pr-4',
              mainClassName,
            )}
          >
            {children}
          </main>
          <aside className="w-[40%] max-w-[300px] h-screen">
            {stickyRightSideCmp !== undefined ? (
              stickyRightSideCmp
            ) : (
              <DefaultStickyRightSide />
            )}
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
