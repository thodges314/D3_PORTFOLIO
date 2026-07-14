import React, { useContext, useEffect } from 'react';

import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ToolTipContext from '../../../context/ToolTipContext';
import { dataFieldsByColumn } from '../../../utils/constants.js';

import clsx from 'clsx';

import { ShowMoreDialog } from '../../SharedComponents/ShowMoreDialog/ShowMoreDialog';
import './ListViz2.scss';

const useStyles = makeStyles(() => ({
  ellipsis: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  table: {
    tableLayout: 'fixed',
  },
  title: {
    fontSize: '10px',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontWeight: 'bold',
    userSelect: 'none',
    cursor: 'default',
  },
  data: {
    fontSize: '12px',
    fontFamily: 'Helvetica, Arial, sans-serif',
    paddingTop: 0,
    paddingBottom: 0,
    margin: 0,
    border: 'none',
    userSelect: 'none',
  },
  tableRow: {
    height: 20,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 16,
    cursor: 'pointer',
  },
  cell: {
    paddingTop: 0,
    paddingBottom: 0,
    margin: 0,
    border: 'none',
    height: 20,
    lineHeight: 1,
  },
}));

const makeId = (title, subtitle) =>
  `${title}${subtitle}`.replace(/[^A-Za-z0-9]/g, '');

const numberAsPercent = (num) => `${(num * 100).toFixed(2)}%`;

export const ListViz2 = ({
  data,
  title,
  subtitle,
  yAttr,
  xAttr,
  lookFilter,
  lookId,
}) => {
  const classes = useStyles();
  const toolTipRef = useContext(ToolTipContext);

  const tableBodyId = makeId(title, subtitle);

  const uniqueKey = (row) =>
    `${row[yAttr]}${row[xAttr]}`.replace(/[^A-Za-z0-9]/g, '');

  const displayTitle =
    title === 'DMA' || title === 'Designated Marketing Area (DMA)'
      ? `${title}®`
      : title;

  const moveToolTip = (e, inputData) => {
    const position = { x: e.pageX, y: e.pageY };
    const textArray = [
      `${inputData[dataFieldsByColumn.element]} (${
        inputData[dataFieldsByColumn.elementCode]
      })`,
      inputData[dataFieldsByColumn.value],
      // DEFINITION STRING HERE,
      [
        'Target Percentage',
        numberAsPercent(inputData[dataFieldsByColumn.clientPercentage]),
      ],
      [
        'Reference Percentage',
        numberAsPercent(inputData[dataFieldsByColumn.targetPercentage]),
      ],
    ];
    toolTipRef.current.moveToolTip(textArray, position);
  };

  const hideToolTip = () => toolTipRef.current.hideToolTip();

  const makeTableRowMouseovers = () => {
    const table = document.getElementById(`table-container-${tableBodyId}`);
    const rows = table ? table.getElementsByTagName('tr') : [];

    Array.from(rows).forEach((row, index) => {
      row.addEventListener('click', (e) => moveToolTip(e, data[index]));
    });
    document
      .getElementById('table-container')
      .addEventListener('mouseleave', hideToolTip);
  };

  ////UNCOMMENT THIS NEXT LINE TO ACTIVATE TOOLTIPS
  // useEffect(() => makeTableRowMouseovers(), [data]);

  return (
    <TableContainer
      component={Paper}
      id={`table-container-${tableBodyId}`}
      style={{ position: 'relative', paddingBottom: '40px', height: '100%' }}
    >
      <h3 className="text-primary" id="viz-title">
        {displayTitle}
      </h3>
      <p className="text-primary" id="viz-subtitle">
        {subtitle}
      </p>
      <Table className={classes.table}>
        <TableBody component="tbody" id={`table-body-${tableBodyId}`}>
          {data.map((row) => (
            <TableRow hover key={uniqueKey(row)} className={classes.tableRow}>
              <TableCell align="left" className={classes.cell}>
                <Typography
                  className={clsx(classes.data, classes.ellipsis, 'text-gray')}
                >
                  {row[yAttr]}
                </Typography>
              </TableCell>

              <TableCell align="right" className={classes.cell}>
                <Typography
                  className={clsx(
                    classes.data,
                    classes.ellipsis,
                    'text-primary'
                  )}
                >
                  {Number(row[xAttr]).toFixed(0)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ShowMoreDialog lookFilter={lookFilter} lookId={lookId} />
    </TableContainer>
  );
};
