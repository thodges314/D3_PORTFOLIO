import React from 'react';
import { ListViz2 } from '../components/D3/ListViz2/ListViz2';
import { LayoutCard } from '../components/SharedComponents/LayoutCard/LayoutCard';
import { list } from './assets/sampleData';

export default {
  component: ListViz2,
  title: 'ListViz',
  //   tags: ['autodocs'],
};

const args = {
  data: list,
  title: 'Occupation',
  subtitle: 'Top 10 by Highest Index',
  yAttr: 'dpa_main.label',
  xAttr: 'dpa_main.index',
  lookFilter: {
    'dpa_main.job_select_param': 'acbd0e042a',
    'dpa_main.reference_select_param': 'National Reference (05/2023)',
    'dpa_main.target_select_param': 'Camping',
    'dpa_main.page': 'InfoBase',
    'dpa_main.subpage': 'Core Demographics',
    'dpa_main.element': '8637',
  },
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
