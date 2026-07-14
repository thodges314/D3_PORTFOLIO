import React, { useContext, useEffect } from 'react';

import * as d3 from 'd3';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ShowMoreDialog } from '../../SharedComponents/ShowMoreDialog/ShowMoreDialog';

import clsx from 'clsx';
import { BarChart } from '../FullTableViz/Chart/BarChart2';
import { dataFieldsByColumn } from '../../../utils/constants.js';
import './DivergingIndexBar2.scss';
import ToolTipContext from '../../../context/ToolTipContext';

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
  titleCell: {
    border: 'none',
  },
}));

const uniqueKey = (row) =>
  `${row[dataFieldsByColumn.elementCode]}${row[dataFieldsByColumn.value]}${
    row[dataFieldsByColumn.category]
  }${row[dataFieldsByColumn.statRelevance]}${
    row[dataFieldsByColumn.index]
  }`.replace(/[^A-Za-z0-9]/g, '');

const roundDown10 = (num) => parseInt(num / 10, 10) * 10;

const numberAsPercent = (num) => `${(num * 100).toFixed(2)}%`;

const makeId = (title, subtitle) =>
  `${title}${subtitle}`.replace(/[^A-Za-z0-9]/g, '');

export const DivergingIndexBar = ({
  data,
  title,
  subtitle,
  lookFilter,
  yAttr,
  xAttr,
  lookId,
}) => {
  const classes = useStyles();
  const xScale = d3.scaleLinear().domain([0, 400 * 1.2]);
  const toolTipRef = useContext(ToolTipContext);
  const tableBodyId = makeId(title, subtitle);

  const moveToolTip = (e, inputData) => {
    const position = { x: e.pageX, y: roundDown10(e.pageY) };
    const textArray = [
      `${inputData[dataFieldsByColumn.element]} (${
        inputData[dataFieldsByColumn.elementCode]
      })`,
      inputData[dataFieldsByColumn.value],
      // DEFINITION STRING HERE,
      ['Z-Score', inputData[dataFieldsByColumn.zscore].toFixed(2)],
      [
        'Target Percentage',
        numberAsPercent(inputData[dataFieldsByColumn.targetPercentage]),
      ],
      [
        'Reference Percentage',
        numberAsPercent(inputData[dataFieldsByColumn.referencePercentage]),
      ],
    ];
    toolTipRef.current.moveToolTip(textArray, position);
  };

  const hideToolTip = () => toolTipRef.current.hideToolTip();

  const makeTableRowMouseovers = () => {
    const table = document.getElementById(`table-body-${tableBodyId}`);
    const rows = table ? table.getElementsByTagName('tr') : [];

    Array.from(rows).forEach((row, index) => {
      row.addEventListener('click', (e) => moveToolTip(e, data[index]));
    });
    document
      .getElementById(`table-container-${tableBodyId}`)
      .addEventListener('mouseleave', hideToolTip);
  };
  //
  useEffect(() => makeTableRowMouseovers(), [data]);

  return (
    <TableContainer
      component={Paper}
      id={`table-container-${tableBodyId}`}
      style={{ position: 'relative', paddingBottom: '40px', height: '100%' }}
    >
      <div>
        <h3 className="text-primary" id="viz-title">
          {title}
        </h3>
        <p className="text-primary" id="viz-subtitle">
          {subtitle}
        </p>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                className={classes.titleCell}
                style={{ width: '50%' }}
              >
                <Typography className={clsx(classes.title, 'text-gray')}>
                  VALUE
                </Typography>
              </TableCell>
              <TableCell
                align="left"
                className={classes.titleCell}
                style={{ width: '50%' }}
              >
                <Typography className={clsx(classes.title, 'text-gray')}>
                  INDEX
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody component="tbody" id={`table-body-${tableBodyId}`}>
            {data.map((row) => (
              <TableRow hover key={uniqueKey(row)} className={classes.tableRow}>
                <TableCell align="left" className={classes.cell}>
                  <Typography
                    className={clsx(
                      classes.data,
                      classes.ellipsis,
                      'text-gray'
                    )}
                  >
                    {row[yAttr]}
                  </Typography>
                </TableCell>
                <TableCell className={classes.cell}>
                  <BarChart
                    value={Number(row[xAttr]).toFixed(0)}
                    xScale={xScale}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ShowMoreDialog lookFilter={lookFilter} lookId={lookId} />
    </TableContainer>
  );
};
