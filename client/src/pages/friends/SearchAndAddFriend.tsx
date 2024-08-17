import { Check, Plus, UserRoundCheck } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';
import SearchBar from '../../components/SearchBar';
import { Account } from '../../types';

const list: Account[] = [
  {
    id: 'alice_on_chain',
    name: 'Alice',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
  },
  {
    id: 'its_bob',
    name: 'Bob',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
  },
  {
    id: 'charliexcx',
    name: 'Charlie',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
  },
];

const SearchAndAddFriend: FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<null | Account[]>(null);

  const searchDropdown = useRef<HTMLDivElement>(null);

  // Hide search results dropdown when clicked outside
  useEffect(() => {
    document.addEventListener('mousedown', (e) => {
      if (
        searchDropdown.current &&
        !searchDropdown.current.contains(e.target as Node)
      ) {
        setSearchResults(null);
      }
    });
  }, []);

  return (
    <div className="relative">
      <SearchBar
        value={searchValue}
        onChange={setSearchValue}
        onSearch={() => {
          setSearchResults(list);
        }}
      />

      {searchResults && (
        // TODO: add slide animation
        <div
          className="z-10 space-y-4 bg-background absolute w-full -bottom-[372px] p-4 border-2 border-border rounded-xl"
          ref={searchDropdown}
        >
          <p className="text-slate-300">Results for "{searchValue}"</p>
          <div className="space-y-4 h-[280px] overflow-y-auto pr-3">
            {searchResults.length > 0 ? (
              [...searchResults].map((acc) => (
                <AccountSearchResult
                  key={acc.id}
                  data={acc}
                  status="none"
                  onAddFriend={() => {}}
                />
              ))
            ) : (
              <p className="font-bold text-lg">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndAddFriend;

interface AccountSearchResultProps {
  data: Account;
  onAddFriend?: () => void;
  status: 'friend' | 'requestSent' | 'none';
}

const AccountSearchResult: FC<AccountSearchResultProps> = ({
  data: { id, name, imgUrl },
  onAddFriend,
  status,
}) => {
  const actionButton = (() => {
    switch (status) {
      case 'friend':
        return (
          <button className="rounded-full p-1.5 bg-green-100">
            <UserRoundCheck size={12} className="stroke-green-900" />
          </button>
        );
      case 'requestSent':
        return (
          <button className="rounded-full p-1.5 bg-gray-100">
            <Check size={12} className="stroke-gray-900" />
          </button>
        );
      case 'none':
        return (
          <button
            onClick={onAddFriend}
            className="rounded-full p-1.5 bg-blue-100 hover:bg-blue-200"
          >
            <Plus size={12} className="stroke-blue-900" />
          </button>
        );
    }
  })();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img
          src={imgUrl}
          className="rounded-full bg-gray-500 size-12"
          alt={name}
        />
        <div>
          <p className="text-base">{name}</p>
          <p className="text-sm text-gray-500">@{id}</p>
        </div>
      </div>
      {actionButton}
    </div>
  );
};
