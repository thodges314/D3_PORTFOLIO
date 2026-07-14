import React from 'react';
import { DivergingIndexBarMultiDPA } from '../components/D3/IndexBarMultiDPA/DivergingIndexBarMultiDPA';
import { LayoutCard } from '../components/SharedComponents/LayoutCard/LayoutCard';
import { bar_3_dpa, bar_2_dpa, bar_1_dpa } from './assets/sampleData';

export default {
  component: DivergingIndexBarMultiDPA,
  title: 'Diverging Index Bar Multi DPA',
  //   tags: ['autodocs'],
};

const args = {
  title: 'Net Worth',
  subtitle: 'By Index',
  yAttr: 'dpa_main.label',
  xAttr: 'dpa_main.index',
};

export const size50with3dpa = {
  args: { ...args, data: bar_3_dpa },
  decorators: [
    (Story) => (
      <LayoutCard size="medium">
        <Story />
      </LayoutCard>
    ),
  ],
};

export const size50with2dpa = {
  args: { ...args, data: bar_2_dpa },
  decorators: [
    (Story) => (
      <LayoutCard size="medium">
        <Story />
      </LayoutCard>
    ),
  ],
};

export const size50with1dpa = {
  args: { ...args, data: bar_1_dpa },
  decorators: [
    (Story) => (
      <LayoutCard size="medium">
        <Story />
      </LayoutCard>
    ),
  ],
};

export const size66with3dpa = {
  args: { ...args, data: bar_3_dpa },
  decorators: [
    (Story) => (
      <LayoutCard size="medium2">
        <Story />
      </LayoutCard>
    ),
  ],
};

export const size66with2dpa = {
  args: { ...args, data: bar_2_dpa },
  decorators: [
    (Story) => (
      <LayoutCard size="medium2">
        <Story />
      </LayoutCard>
    ),
  ],
};

export const size66with1dpa = {
  args: { ...args, data: bar_1_dpa },
  decorators: [
    (Story) => (
      <LayoutCard size="medium2">
        <Story />
      </LayoutCard>
    ),
  ],
};
