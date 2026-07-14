import React from 'react';
import { DivergingIndexBar } from '../components/D3/IndexBar/DivergingIndexBar2';
import { LayoutCard } from '../components/SharedComponents/LayoutCard/LayoutCard';
import { bar } from './assets/sampleData';

export default {
  component: DivergingIndexBar,
  title: 'Diverging Index Bar',
  //   tags: ['autodocs'],
};

const args = {
  data: bar,
  title: 'Net Worth',
  subtitle: 'By Index',
  yAttr: 'dpa_main.label',
  xAttr: 'dpa_main.index',
};

export const size33 = {
  args: { ...args },
  decorators: [
    (Story) => (
      <LayoutCard size="small2">
        <Story />
      </LayoutCard>
    ),
  ],
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

export const size66 = {
  args: { ...args },
  decorators: [
    (Story) => (
      <LayoutCard size="medium2">
        <Story />
      </LayoutCard>
    ),
  ],
};
