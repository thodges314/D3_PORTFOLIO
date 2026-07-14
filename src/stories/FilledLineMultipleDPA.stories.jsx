import React from 'react';
import { FilledLineChartMultipleDPA } from '../components/D3/FilledLineChartMultipleDPA/FilledLineChartMultipleDPA';
import { LayoutCard } from '../components/SharedComponents/LayoutCard/LayoutCard';
import {
  filled_line,
  filled_line_multiple_dpa_3,
  filled_line_multiple_dpa_2,
  filled_line_multiple_dpa_1,
} from './assets/sampleData';

export default {
  component: FilledLineChartMultipleDPA,
  title: 'Filled Line Multiple DPA',
  //   tags: ['autodocs'],
};

const args = {
  // data: filled_line,
  title: 'Economic Stability Indicator',
  subtitle: 'By Index',
  yAttr: 'dpa_main.label',
  xAttr: 'dpa_main.index',
};

export const size33with3dpa = {
  args: { ...args, data: filled_line_multiple_dpa_3 },
  decorators: [
    (Story) => (
      <LayoutCard size="small2">
        <Story />
      </LayoutCard>
    ),
  ],
};

export const size50with3dpa = {
  args: { ...args, data: filled_line_multiple_dpa_3 },
  decorators: [
    (Story) => (
      <LayoutCard size="medium">
        <Story />
      </LayoutCard>
    ),
  ],
};

export const size66with3dpa = {
  args: { ...args, data: filled_line_multiple_dpa_3 },
  decorators: [
    (Story) => (
      <LayoutCard size="medium2">
        <Story />
      </LayoutCard>
    ),
  ],
};

export const size33with2dpa = {
  args: { ...args, data: filled_line_multiple_dpa_2 },
  decorators: [
    (Story) => (
      <LayoutCard size="small2">
        <Story />
      </LayoutCard>
    ),
  ],
};

export const size50with2dpa = {
  args: { ...args, data: filled_line_multiple_dpa_2 },
  decorators: [
    (Story) => (
      <LayoutCard size="medium">
        <Story />
      </LayoutCard>
    ),
  ],
};

export const size66with2dpa = {
  args: { ...args, data: filled_line_multiple_dpa_2 },
  decorators: [
    (Story) => (
      <LayoutCard size="medium2">
        <Story />
      </LayoutCard>
    ),
  ],
};

export const size33with1dpa = {
  args: { ...args, data: filled_line_multiple_dpa_1 },
  decorators: [
    (Story) => (
      <LayoutCard size="small2">
        <Story />
      </LayoutCard>
    ),
  ],
};

export const size50with1dpa = {
  args: { ...args, data: filled_line_multiple_dpa_1 },
  decorators: [
    (Story) => (
      <LayoutCard size="medium">
        <Story />
      </LayoutCard>
    ),
  ],
};

export const size66with1dpa = {
  args: { ...args, data: filled_line_multiple_dpa_1 },
  decorators: [
    (Story) => (
      <LayoutCard size="medium2">
        <Story />
      </LayoutCard>
    ),
  ],
};
