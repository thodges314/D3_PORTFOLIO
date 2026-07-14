import React from 'react';
import { RadialScatter } from '../components/D3/RadialScatter/RadialScatter';
import { LayoutCard } from '../components/SharedComponents/LayoutCard/LayoutCard';
import { radialScatter } from './assets/sampleData';

export default {
  component: RadialScatter,
  title: 'RadialScatter',
  //   tags: ['autodocs'],
};

const args = {
  data: radialScatter,
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
