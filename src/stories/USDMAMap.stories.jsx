import React from 'react';
import { USDMAMap } from '../components/D3/USMap/USDMAMap';
import { LayoutCard } from '../components/SharedComponents/LayoutCard/LayoutCard';
import { mapDma } from './assets/sampleData';

export default {
  component: USDMAMap,
  title: 'USDMAMap',
  //   tags: ['autodocs'],
};

const args = {
  data: mapDma,
  chart_title: 'DMA',
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
