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
                'text-center py-4 px-8 hover:bg-secondary',
                selected == idx &&
                'border-b-primary border-b-2 text-primary font-bold text-xl truncate',
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
