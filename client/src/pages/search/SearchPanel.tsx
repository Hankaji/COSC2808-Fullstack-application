import React, { ReactNode, useState } from 'react';

const SearchPanel = () => {
  return (
    <div>
      <TabSections />
    </div>
  );
};

const TabSections = () => {
  const [selected, setSelected] = useState<number>(0);

  const sectionName: string[] = ['All', 'People', 'Groups'];
  const sectionNodes: ReactNode[] = ['n', 'i', 'a'];

  return (
    <>
      <div className="flex [&>*]:w-full"></div>
    </>
  );
};

export default SearchPanel;
