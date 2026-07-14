import React from 'react';
import { FullTableViz } from '../components/D3/FullTableViz/FullTableViz';
import { LayoutCard } from '../components/SharedComponents/LayoutCard/LayoutCard';
import { fullTableViz } from './assets/sampleData';

export default {
  component: FullTableViz,
  title: 'FullTableViz',
  //   tags: ['autodocs'],
};

const args = {
  data: fullTableViz,
};

export const Default = {
  args: { ...args },
  decorators: [
    (Story) => (
      <LayoutCard size="large">
        <Story />
      </LayoutCard>
    ),
  ],
};
