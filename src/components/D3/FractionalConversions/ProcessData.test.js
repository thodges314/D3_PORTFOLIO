/* eslint-disable */
import { defaultSimulatorData } from '../../../../testData/simulatorData/defaultSimulatorData';
import { onesSimulatorData } from '../../../../testData/simulatorData/onesSimulatorData';
import { zeroesSimulatorData } from '../../../../testData/simulatorData/zeroesSimulatorData';
import { fractionalConversionsData4Viz } from '../../../../testData/components/fractionalConversionChart/fractionalConversionsData4Viz';
import { ProcessData } from './ProcessData';

// If we determine a good output based on a given input of ten "ones",
// we can test each calculation
test('ProcessedData output for Ones calculates totalSum correctly', () => {
  const createdData = ProcessData(onesSimulatorData, '');
  expect(createdData[0].totalSum).toBe(10);
});
test('ProcessedData output for Ones calculates percent correctly', () => {
  const createdData = ProcessData(onesSimulatorData, '');
  expect(createdData[0].percent).toBe(100);
});

// If we determine a good output based on a given input of ten "zeroes",
// we can test each calculation
test('ProcessedData output for zeroes calculates totalSum correctly', () => {
  const createdData = ProcessData(zeroesSimulatorData, '');
  expect(createdData[0].totalSum).toBe(0);
});
