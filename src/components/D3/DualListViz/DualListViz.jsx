import React, { useContext, useEffect, useState } from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import clsx from 'clsx';

import { dataFieldsByColumn } from '../../../utils/constants';
import ToolTipContext from '../../../context/ToolTipContext';
import { ShowMoreDialog } from '../../SharedComponents/ShowMoreDialog/ShowMoreDialog';
import './DualListViz.scss';

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

export const DualListViz = ({
  data,
  title,
  subtitle,
  yAttr,
  xAttr,
  lookFilter,
  lookId,
}) => {
  const [highestChecked, setHighestChecked] = useState(true);
  const classes = useStyles();
  const toolTipRef = useContext(ToolTipContext);
  useEffect(() => {
    if (highestChecked) {
      data.sort(
        (a, b) => a[dataFieldsByColumn.index] - b[dataFieldsByColumn.index]
      );
    } else {
      data.sort(
        (a, b) => b[dataFieldsByColumn.index] - a[dataFieldsByColumn.index]
      );
    }
  }, [highestChecked]);
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
      <div className="checkbox-group viz-subtitle text-primary">
        <FormControl
          size="small"
          sx={{ m: 0 }}
          component="fieldset"
          variant="standard"
        >
          <FormGroup style={{ display: 'flex', flexDirection: 'row' }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={highestChecked}
                  onChange={() => setHighestChecked(true)}
                  name="highest"
                />
              }
              labelPlacement="right"
              label={<div>By Highest Index</div>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={!highestChecked}
                  onChange={() => setHighestChecked(false)}
                  name="lowest"
                />
              }
              labelPlacement="right"
              label={<div>By Lowest Index</div>}
            />
          </FormGroup>
        </FormControl>
      </div>
      <Table className={classes.table}>
        <TableBody component="tbody" id={`table-body-${tableBodyId}`}>
          {data.slice(0, 15).map((row) => (
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
