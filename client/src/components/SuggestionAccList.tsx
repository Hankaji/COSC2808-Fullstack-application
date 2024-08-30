import { FC } from 'react';
import AccInfoWithAction from './AccInfoWithAction';
import { Account } from '../types';

const list: Account[] = [
  {
    id: 'alice_on_chain',
    username: 'alice_on_chain',
    displayName: 'Alice',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
  },
  {
    id: 'its_bob',
    username: 'its_bob',
    displayName: 'Bob',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
  },
  {
    id: 'charliexcx',
    username: 'charliexcx',
    displayName: 'Charlie',
    imgUrl:
      'https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6',
  },
];

const SuggestionsAccList: FC = () => {
  return (
    <div className="border-2 border-border rounded-xl p-4">
      <h3 className="text-xl font-bold pb-3 border-b-2 border-border">
        Friend Suggestions
      </h3>
      <div className="h-[300px] overflow-y-auto space-y-4 py-4 pr-2">
        {[...list].map((acc) => (
          <AccInfoWithAction
            key={acc.id}
            data={acc}
            status="none"
            actionFn={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestionsAccList;
