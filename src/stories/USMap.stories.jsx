import React from 'react';
import { USStateMap } from '../components/D3/USMap/USMap';
import { LayoutCard } from '../components/SharedComponents/LayoutCard/LayoutCard';
import { mapStates } from './assets/sampleData';

export default {
  component: USStateMap,
  title: 'USStateMap',
  //   tags: ['autodocs'],
};

const args = {
  data: mapStates,
  chart_title: 'State',
  chart_subtitle: 'By Index',
};

export const size50 = {
  args: { ...args },
  decorators: [
    (Story) => (
      <LayoutCard size="medium">
        <Story />
      </LayoutCard>
    ),
  ],
};

export const full = {
  args: { ...args },
  decorators: [
    (Story) => (
      <LayoutCard size="large">
        <Story />
      </LayoutCard>
    ),
  ],
};
