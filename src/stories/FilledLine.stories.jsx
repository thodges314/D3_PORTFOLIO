import React from 'react';
import { FilledLineChart } from '../components/D3/FilledLineChart/FilledLineChart';
import { LayoutCard } from '../components/SharedComponents/LayoutCard/LayoutCard';
import { filled_line } from './assets/sampleData';

export default {
  component: FilledLineChart,
  title: 'Filled Line',
  //   tags: ['autodocs'],
};

const args = {
  data: filled_line,
  title: 'Economic Stability Indicator',
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
