import { FC, useEffect, useRef, useState } from 'react';
import SearchBar from './ui/SearchBar';
import { Account } from '../types';
import AccInfoWithAction from './AccInfoWithAction';

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
          className="shadow-md shadow-slate-700 z-10 space-y-4 bg-background absolute w-full -bottom-[378px] p-4 border-2 border-border rounded-xl"
          ref={searchDropdown}
        >
          <p className="pb-2 border-b-2 border-border text-slate-300">
            Results for "
            <span className="text-white font-bold">{searchValue}</span>"
          </p>
          <div className="space-y-4 h-[280px] overflow-y-auto pr-3">
            {searchResults.length > 0 ? (
              [...searchResults].map((acc) => (
                <AccInfoWithAction
                  key={acc.id}
                  data={acc}
                  status="none"
                  actionFn={() => {}}
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
