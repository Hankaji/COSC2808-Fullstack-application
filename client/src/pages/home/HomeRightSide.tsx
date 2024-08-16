import { FC } from 'react';
import { Input } from '../../components/Input';
import { mergeClassNames } from '../../utils';

const HomeRightSide: FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={mergeClassNames(
        'flex flex-col w-full gap-4 justify-start items-start',
        className,
      )}
    >
      {/* Search bar */}
      <Input
        className="border-none bg-secondary text-2xl p-6"
        placeholder="Search"
      />
      {/* Premium features */}
      <div className="flex flex-col gap-4 items-start w-full p-4 border-2 border-solid border-border rounded-lg">
        <h1 className="text-4xl font-semibold">Premium features</h1>
        <h2 className="flex gap-2 text-2xl ">
          <span className="text-muted-foreground line-through">$27</span>
          <span>
            $21<span className="text-sm">/month</span>
          </span>
        </h2>
        <p className="text-xl">
          Subscribe now to get all the latest advanced features
        </p>
        <button className="px-6 py-3 bg-primary rounded-lg text-xl font-bold">
          Subscribe
        </button>
      </div>
      <h1 className="text-3xl font-semibold">Trending</h1>
      <div className="w-full p-4 border-2 border-solid border-border rounded-lg">
        Maybe posts go here?
      </div>
    </div>
  );
};

export default HomeRightSide;
