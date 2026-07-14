import React from 'react';
import { SpiderChart } from '../components/D3/SpiderChart/SpiderChart';
import { LayoutCard } from '../components/SharedComponents/LayoutCard/LayoutCard';
import { spider } from './assets/sampleData';

export default {
  component: SpiderChart,
  title: 'Spider Chart',
  //   tags: ['autodocs'],
};

const args = {
  data: spider,
  title: 'Property Type',
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
