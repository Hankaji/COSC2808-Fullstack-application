import React, { ReactNode, useState } from 'react';
import Tabs, { Tab } from '../../components/Tabs';

const SearchPanel = () => {
  return (
    <div>
      <TabSections />
    </div>
  );
};

const TabSections = () => {
  const tabs: Tab[] = [
    {
      name: 'All',
      element: 'All people and groups',
    },
    {
      name: 'People',
      element: 'Only People here',
    },
    {
      name: 'Groups',
      element: 'Only groups here',
    },
  ];

  return (
    <>
      <Tabs tabs={tabs} />
    </>
  );
};

export default SearchPanel;
