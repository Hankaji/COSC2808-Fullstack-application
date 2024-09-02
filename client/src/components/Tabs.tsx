import { useState, ReactNode, FC } from 'react';
import { mergeClassNames } from '../utils';

interface Props {
  tabs: Tab[];
  defaultTab?: number;
}

type Tab = {
  name: string;
  element: ReactNode;
};

const Tabs: FC<Props> = ({ tabs, defaultTab = 0 }) => {
  const [selected, setSelected] = useState<number>(defaultTab);

  return (
    <>
      <div className="flex w-full justify-center [&>*]:flex-grow">
        {tabs.map((tab, idx) => {
          return (
            <button
              key={idx}
              className={mergeClassNames(
                'text-center border-b-2 py-4 px-8 text-lg hover:bg-secondary transition-all',
                selected !== idx
                  ? 'border-b-transparent'
                  : 'border-b-primary text-primary font-bold truncate',
              )}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(idx);
              }}
            >
              {tab.name}
            </button>
          );
        })}
      </div>
      {tabs[selected].element}
    </>
  );
};

export type { Tab };
export default Tabs;
