/* eslint-disable */
import { SortDataTopologyDetail } from './SortDataTopologyDetail';
import { defaultSimulatorData } from './../../../../testData/simulatorData/defaultSimulatorData';
import { initialData4Viz } from '../../../../testData/components/relativeSpendScenarios/initialData4Viz';
import { validationData4VizL1L4 } from '../../../../testData/components/relativeSpendScenarios/validationData4VizL1L14';
import { validationData4VizL1 } from '../../../../testData/components/relativeSpendScenarios/validationData4VizL1';

test('Given expected input params for L1L4 Data, produces expected output ', () => {
  expect(SortDataTopologyDetail(defaultSimulatorData, initialData4Viz)).toEqual(
    validationData4VizL1L4
  );
});

const inputDataForL1 = [
  {
    'mta_sample.l1_l4': 'L1_6|L2_1|L3_1|L4_6',
    'mta_sample.topology_full': 'L1_6',
  },
];
test('Given expected input params for L1 Data, produces expected output ', () => {
  expect(SortDataTopologyDetail(inputDataForL1, initialData4Viz)).toEqual(
    validationData4VizL1
  );
});
