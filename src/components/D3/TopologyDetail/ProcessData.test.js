/* eslint-disable */
import { badSimulatorData } from '../../../../testData/simulatorData/badSimulatorData';
import { onesSimulatorData } from '../../../../testData/simulatorData/onesSimulatorData';
import { topSimulatorData } from '../../../../testData/simulatorData/topologySimulatorData';
import { zeroesSimulatorData } from '../../../../testData/simulatorData/zeroesSimulatorData';
import { ProcessData } from './ProcessData';

// If we determine a good output based on a given input of ten "ones",
// we can test each calculation
test('ProcessedData output for Ones calculates investmentDif correctly', () => {
    const createdData = ProcessData(onesSimulatorData, '');
    expect(createdData[0].investmentDiff).toBe(0);
});
test('ProcessedData output for zeros calculates investmentDif correctly', () => {
    const createdData = ProcessData(zeroesSimulatorData, '');
    expect(createdData[0].investmentDiff).toBe(0);
});
test('ProcessedData output for valid data where optSpend = 0 calculates investmentDif correctly', () => {
    const createdData = ProcessData(topSimulatorData, '');
    expect(createdData[0].investmentDiff).toBe(-100);
});
test('ProcessedData output for bad data outputs NaN because there is no field to query', () => {
    const createdData = ProcessData(badSimulatorData, '');
    expect(createdData[0].investmentDiff).toBe(NaN);
});
test('ProcessedData output for Ones calculates bauInvestment correctly', () => {
    const createdData = ProcessData(onesSimulatorData, '');
    expect(createdData[0].bauInvestment).toBe(1);
});
test('ProcessedData output for Ones calculates optSpend correctly', () => {
    const createdData = ProcessData(onesSimulatorData, '');
    expect(createdData[0].optSpend).toBe(1);
});

