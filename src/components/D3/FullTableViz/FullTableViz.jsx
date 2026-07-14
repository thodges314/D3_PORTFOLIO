import React, { useContext, useEffect, useState } from 'react';

import * as d3 from 'd3';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import TableFooter from '@material-ui/core/TableFooter';
import { makeStyles } from '@material-ui/core/styles';

import clsx from 'clsx';
import { FullTableHeader } from './FullTableHeader/FullTableHeader';
import { BarChart } from './Chart/BarChart2';
import { dataFieldsByColumn } from '../../../utils/constants.js';
import ToolTipContext from '../../../context/ToolTipContext';
import TablePaginationOptions from './TablePaginationOptions/TablePaginationOptions';

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

const numberAsPercent = (num) => `${(num * 100).toFixed(2)}%`;

const definitions = {
  'Z-Score':
    'A measure of statistical significance comparing two proportions that considers both quantity and percentage. A z-score beyond ±3 is deemed significant.',
  Index:
    'A measure comparing the proportions of characteristics between two datasets. An index above 100 indicates over-representation, below 100 indicates under-representation.',
};

export const FullTableViz = ({ data }) => {
  const [tableData, setTableData] = useState(data);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [sortingValueSelected, setSortingValueSelected] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [elementsPerPage, setElementsPerPage] = useState(15);
  let currentData;
  const xScale = d3.scaleLinear().domain([0, 400 * 1.2]);
  const toolTipRef = useContext(ToolTipContext);

  const classes = useStyles();

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
        numberAsPercent(inputData[dataFieldsByColumn.targetPercentage]),
      ],
      [
        'Reference Percentage',
        numberAsPercent(inputData[dataFieldsByColumn.referencePercentage]),
      ],
    ];
    toolTipRef.current.moveToolTip(textArray, position);
  };

  ////////////////////////////////////////////////////////////////
  // FOR TOOLTIP HEADER, UNCOMMENT THIS SECTION AND THE EVENT   //
  // LISTENERS IN THE TABLECELLS IN THE HEADER                  //
  ////////////////////////////////////////////////////////////////

  const moveToolTipHeader = (e, item) => {
    const position = { x: e.pageX, y: e.pageY };
    const textArray = [item, definitions[item]];
    toolTipRef.current.moveToolTip(textArray, position, true);
  };

  const hideToolTip = () => toolTipRef.current.hideToolTip();

  const makeTableRowMouseovers = () => {
    const table = document.getElementById('table-body');
    const rows = table ? table.getElementsByTagName('tr') : [];

    Array.from(rows).forEach((row, index) => {
      row.addEventListener('click', (e) =>
        moveToolTip(e, currentPageData[index])
      );
    });
    document
      .getElementById('table-container')
      .addEventListener('mouseleave', hideToolTip);
  };

  // natural sort by default (first by element the by value within elements)
  useEffect(() => {
    const viewportHeight = window.innerHeight;
    if (viewportHeight > 700) setElementsPerPage(30);
    const naturalSortedData = tableData.sort((a, b) => {
      if (a[dataFieldsByColumn.category] === b[dataFieldsByColumn.category]) {
        if (
          a[dataFieldsByColumn.elementCode] ===
          b[dataFieldsByColumn.elementCode]
        ) {
          return a['dpa_main.value'].localeCompare(b['dpa_main.value'], 'en', {
            numeric: true,
          });
        }
        return a[dataFieldsByColumn.elementCode] <
          b[dataFieldsByColumn.elementCode]
          ? -1
          : 1;
      }
      return a[dataFieldsByColumn.category] < b[dataFieldsByColumn.category]
        ? -1
        : 1;
    });
    setTableData(naturalSortedData);
  }, [data]);

  // For pagination: Calculates number of pages, position of the
  // current page, and slices the data for current page
  useEffect(() => {
    const indexOfFirstPost = currentPage * elementsPerPage;
    const indexOfLastPost = indexOfFirstPost + elementsPerPage;
    currentData = tableData.slice(indexOfFirstPost, indexOfLastPost);
    setCurrentPageData(currentData);
  }, [currentPage, tableData, elementsPerPage, sortingValueSelected]);

  useEffect(() => makeTableRowMouseovers(), [currentPageData]);

  return (
    <>
      <FullTableHeader
        data={data}
        tableData={tableData}
        setTableData={setTableData}
        sortingValueSelected={sortingValueSelected}
        setSortingValueSelected={setSortingValueSelected}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        setCurrentPage={setCurrentPage}
      />
      <TableContainer component={Paper} id="table-container">
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                className={classes.titleCell}
                style={{ width: '24%' }}
              >
                <Typography className={clsx(classes.title, 'text-gray')}>
                  ELEMENT
                </Typography>
              </TableCell>
              <TableCell
                align="left"
                className={classes.titleCell}
                style={{ width: '16%' }}
              >
                <Typography className={clsx(classes.title, 'text-gray')}>
                  VALUE
                </Typography>
              </TableCell>
              <TableCell
                align="left"
                className={classes.titleCell}
                style={{ width: '16%' }}
              >
                <Typography className={clsx(classes.title, 'text-gray')}>
                  CATEGORY
                </Typography>
              </TableCell>
              <TableCell
                align="left"
                className={classes.titleCell}
                style={{ width: '8%' }}
              >
                <Typography className={clsx(classes.title, 'text-gray')}>
                  TARGET PERCENTAGE
                </Typography>
              </TableCell>
              <TableCell
                align="left"
                className={classes.titleCell}
                style={{ width: '8%' }}
              >
                <Typography className={clsx(classes.title, 'text-gray')}>
                  REFERENCE PERCENTAGE
                </Typography>
              </TableCell>
              <TableCell
                align="left"
                className={classes.titleCell}
                style={{ width: '8%' }}
                onMouseEnter={(e) => moveToolTipHeader(e, 'Z-Score')}
                onMouseLeave={hideToolTip}
              >
                <Typography
                  className={clsx(
                    classes.title,
                    sortingValueSelected !== 'dpa_main.zscore' && 'text-gray'
                  )}
                  style={{
                    fontSize:
                      sortingValueSelected === 'dpa_main.zscore'
                        ? '12px'
                        : '10px',
                  }}
                >
                  Z-SCORE
                </Typography>
              </TableCell>
              <TableCell
                align="left"
                style={{ width: '20%' }}
                className={classes.titleCell}
                onMouseEnter={(e) => moveToolTipHeader(e, 'Index')}
                onMouseLeave={hideToolTip}
              >
                <Typography
                  className={clsx(
                    classes.title,
                    sortingValueSelected !== 'dpa_main.index' && 'text-gray'
                  )}
                  style={{
                    fontSize:
                      sortingValueSelected === 'dpa_main.index'
                        ? '12px'
                        : '10px',
                  }}
                >
                  INDEX
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody component="tbody" id="table-body">
            {currentPageData.map((row) => (
              <TableRow hover key={uniqueKey(row)} className={classes.tableRow}>
                <TableCell align="left" className={classes.cell}>
                  <Typography
                    className={clsx(
                      classes.data,
                      classes.ellipsis,
                      'text-gray'
                    )}
                  >
                    {row[dataFieldsByColumn.element]}
                  </Typography>
                </TableCell>
                <TableCell align="left" className={classes.cell}>
                  <Typography
                    className={clsx(
                      classes.data,
                      classes.ellipsis,
                      'text-gray'
                    )}
                  >
                    {row[dataFieldsByColumn.value]}
                  </Typography>
                </TableCell>
                <TableCell align="left" className={classes.cell}>
                  <Typography
                    className={clsx(
                      classes.data,
                      classes.ellipsis,
                      'text-gray'
                    )}
                  >
                    {row[dataFieldsByColumn.category]}
                  </Typography>
                </TableCell>

                <TableCell align="left" className={classes.cell}>
                  <Typography
                    className={clsx(
                      classes.data,
                      classes.ellipsis,
                      'text-gray'
                    )}
                  >
                    {numberAsPercent(row[dataFieldsByColumn.targetPercentage])}
                  </Typography>
                </TableCell>
                <TableCell align="left" className={classes.cell}>
                  <Typography
                    className={clsx(
                      classes.data,
                      classes.ellipsis,
                      'text-gray'
                    )}
                  >
                    {numberAsPercent(
                      row[dataFieldsByColumn.referencePercentage]
                    )}
                  </Typography>
                </TableCell>

                <TableCell align="left" className={classes.cell}>
                  <Typography
                    className={clsx(
                      classes.data,
                      classes.ellipsis,
                      'text-gray'
                    )}
                  >
                    {Number(row[dataFieldsByColumn.statRelevance]).toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="left" className={classes.cell}>
                  <BarChart
                    value={Number(row[dataFieldsByColumn.index]).toFixed(0)}
                    xScale={xScale}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[15, 30, 50, 100]}
                count={tableData.length}
                rowsPerPage={elementsPerPage}
                page={currentPage}
                onPageChange={(_, newPage) => setCurrentPage(newPage)}
                onRowsPerPageChange={(evt) => {
                  setElementsPerPage(parseInt(evt.target.value, 10));
                  setCurrentPage(0);
                }}
                ActionsComponent={TablePaginationOptions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};
