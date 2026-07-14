import React from 'react';
import { Scatterplot } from '../components/D3/Scatterplot/Scatterplot';
import { LayoutCard } from '../components/SharedComponents/LayoutCard/LayoutCard';
import {
  scatterplot_lifestage_5,
  scatterplot_prime_3,
} from './assets/sampleData';

export default {
  component: Scatterplot,
  title: 'Scatterplot',
  //   tags: ['autodocs'],
};

const args = {
  chartSubtitle: 'All Clusters',
};

export const Lifestage_5 = {
  args: {
    data: scatterplot_lifestage_5,
    chartTitle: 'Lifestage Clusters',
    ...args,
  },
  decorators: [
    (Story) => (
      <LayoutCard size="medium2" height="500px">
        <Story />
      </LayoutCard>
    ),
  ],
};

export const Prime_3 = {
  args: {
    data: scatterplot_prime_3,
    chartTitle: 'Prime Clusters',
    ...args,
  },
  decorators: [
    (Story) => (
      <LayoutCard size="medium2" height="500px">
        <Story />
      </LayoutCard>
    ),
  ],
};
