import { DEFAULT_CONVERSION_LIMITER } from './constants';
import {
  createCumulativeFields,
  createCumulativeTotals,
} from '../components/Pages/Simulator/utils/createCumulativeFields';

export const getAggData = (data) => {
  const optimalInvestmentArr = data.filter(
    (item) =>
      Number(item['mta_sample.channel_optimal_bucket_level']) ===
      Number(item['mta_sample.bucket_control_level'])
  );
  const optimalInvestmentCumulativeArr = data.filter(
    (item) =>
      Number(item['mta_sample.channel_optimal_bucket_level']) >
      Number(item['mta_sample.bucket_control_level'])
  );
  const optimalCumulativeAggregated = createCumulativeFields(
    optimalInvestmentCumulativeArr,
    DEFAULT_CONVERSION_LIMITER
  );
  const optimalWithTotals = createCumulativeTotals(
    optimalInvestmentArr,
    optimalCumulativeAggregated,
    DEFAULT_CONVERSION_LIMITER
  );
  return optimalWithTotals;
};
