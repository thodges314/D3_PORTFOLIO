import React from 'react';
import { ProcessData } from '../ProcessData';
import { numberWithCommas } from '../../../../utils/formatCommas';
import './RelativeSpendTable.scss';

export const RelativeSpendTable = ({
  bauData,
  optData,
  simulatorData,
  topologyDetailLevel,
}) => {
  if (simulatorData && bauData && optData && topologyDetailLevel) {
    // Process Data
    const processedBauDataInitial = ProcessData(
      bauData,
      'mta_sample.chan_tot_cost',
      topologyDetailLevel
    );
    // Adds a unique id for use as a key in the jsx
    const processedBauData = processedBauDataInitial.map((obj, i) => ({
      ...obj,
      id: i,
    }));
    const processedOptData = ProcessData(
      optData,
      'mta_sample.total_investment',
      topologyDetailLevel
    );

    const selectionData = ProcessData(
      simulatorData,
      'mta_sample.total_investment',
      topologyDetailLevel
    );

    return (
      <table className="relative-spend-table">
        <tbody>
          <tr>
            <th colSpan="3">Business as Usual</th>
            <th colSpan="3">Optimized for Scenario</th>
            <th colSpan="3">With your Selections</th>
          </tr>
          <tr className="secondary-headers">
            <th>Channel</th>
            <th>Total</th>
            <th>Percent</th>
            <th>Channel</th>
            <th>Total</th>
            <th>Percent</th>
            <th>Channel</th>
            <th>Total</th>
            <th>Percent</th>
          </tr>
          {processedBauData.map((bauObj, i) => (
            <tr key={bauObj.id}>
              <td className="channel-name" style={{ background: bauObj.color }}>
                {bauObj.channelName}
              </td>
              <td style={{ background: bauObj.color }}>
                {`$${numberWithCommas(bauObj.totalSum.toFixed(2))}`}
              </td>
              <td className="thick-border" style={{ background: bauObj.color }}>
                {bauObj.percent.toFixed(2)}%
              </td>
              {processedOptData[i] !== undefined && (
                <>
                  <td
                    className="channel-name"
                    style={{ background: processedOptData[i].color }}
                  >
                    {processedOptData[i].channelName}
                  </td>
                  <td style={{ background: processedOptData[i].color }}>
                    {`$${numberWithCommas(
                      processedOptData[i].totalSum.toFixed(2)
                    )}`}
                  </td>
                  <td
                    className="thick-border"
                    style={{ background: processedOptData[i].color }}
                  >
                    {processedOptData[i].percent.toFixed(2)}%
                  </td>
                </>
              )}
              {selectionData[i] !== undefined && (
                <>
                  <td
                    className="channel-name"
                    style={{ background: selectionData[i].color }}
                  >
                    {selectionData[i].channelName}
                  </td>
                  <td style={{ background: selectionData[i].color }}>
                    {`$${numberWithCommas(
                      selectionData[i].totalSum.toFixed(2)
                    )}`}
                  </td>
                  <td style={{ background: selectionData[i].color }}>
                    {selectionData[i].percent.toFixed(2)}%
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return null;
};
