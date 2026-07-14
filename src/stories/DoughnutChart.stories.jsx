import React from 'react';
import { DoughnutChart } from '../components/D3/DoughnutChart/DoughnutChart';
import { LayoutCard } from '../components/SharedComponents/LayoutCard/LayoutCard';
import { doughnut } from './assets/sampleData';

export default {
  component: DoughnutChart,
  title: 'Doughnut Chart',
  //   tags: ['autodocs'],
};

const args = {
  data: doughnut,
  title: 'Travel Activities',
  subtitle: 'By Index',
  yAttr: 'dpa_main.marketing_name',
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
