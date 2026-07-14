import React, { useEffect, useState, useContext } from 'react';
import './HighlightsViz.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import ToolTipContext from '../../../context/ToolTipContext';
import { dataFieldsByColumn } from '../../../utils/constants';

const useStyles = makeStyles(() => ({
  scrollButtons: {
    '& > *': {
      fontSize: '2.5rem',
    },
  },
  flexContainerSpace: {
    gap: '5px',
    justifyContent: 'space-between',
  },
  flexContainerStart: {
    gap: '5px',
    justifyContent: 'flex-start',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  flexStart: {
    justifyContent: 'flex-start',
  },
  labelIcon: {
    textTransform: 'none',
    '& svg': {
      fontSize: '4rem',
      margin: '20px 0 !important',
    },
    '& span p': {
      fontSize: '1rem',
      margin: '0',
      '&:first-child': {
        fontSize: '1.2rem',
        fontWeight: 'bold',
      },
    },
  },
  tabRoot: {
    padding: '0',
    minWidth: 'unset',
    opacity: '1 !important',
  },
}));

const roundDown10 = (num) => parseInt(num / 10, 10) * 10;

const numberAsPercent = (num) => `${(num * 100).toFixed(2)}%`;

const HighlightsViz = ({ data, elements }) => {
  const classes = useStyles();
  const [highlightElements, setHighlightElements] = useState([]);
  const toolTipRef = useContext(ToolTipContext);

  const moveToolTip = (e, inputData) => {
    const position = { x: e.pageX, y: roundDown10(e.pageY) };
    const textArray = [
      `${inputData[dataFieldsByColumn.element]} (${
        inputData[dataFieldsByColumn.elementCode]
      })`,
      // DEFINITION STRING HERE,
      ['Value', inputData[dataFieldsByColumn.value]],
      ['Index', Number(inputData[dataFieldsByColumn.index]).toFixed(0)],
      ['Z-Score', Number(inputData[dataFieldsByColumn.zscore]).toFixed(2)],
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

  const findHighestIndex = () => {
    setHighlightElements([]);
    elements.forEach((el) => {
      let arr = [];
      if (Array.isArray(el)) {
        el.forEach((item) => {
          arr = [
            ...arr,
            ...data.filter(
              (row) => row[dataFieldsByColumn.elementCode] === item
            ),
          ];
        });
      } else {
        arr = data.filter((row) => row[dataFieldsByColumn.elementCode] === el);
      }
      if (arr.length) {
        const highestValue = arr.reduce((prev, current) =>
          Number(
            prev[dataFieldsByColumn.zscore] * prev[dataFieldsByColumn.index]
          ) >
          Number(
            current[dataFieldsByColumn.zscore] *
              current[dataFieldsByColumn.index]
          )
            ? prev
            : current
        );
        if (
          !(
            highestValue[dataFieldsByColumn.zscore] >= -3 &&
            highestValue[dataFieldsByColumn.zscore] <= 3 &&
            highestValue[dataFieldsByColumn.index] >= 95 &&
            highestValue[dataFieldsByColumn.index] <= 105
          )
        )
          setHighlightElements((prevState) => [...prevState, highestValue]);
      }
    });
  };

  const makeHighlightMouseovers = () => {
    const theButtons = document
      .getElementById('highlight-tabs')
      .getElementsByClassName('MuiTabs-scroller')[0]
      .querySelectorAll('[role="tablist"]')[0]
      .getElementsByTagName('button');
    Array.from(theButtons).forEach((tab, idx) => {
      tab.addEventListener('click', (e) => {
        moveToolTip(e, highlightElements[idx]);
      });
    });
    document
      .getElementById('highlight-tabs')
      .getElementsByClassName('MuiTabs-scroller')[0]
      .addEventListener('mouseleave', hideToolTip);
  };

  useEffect(() => {
    if (data && data.length > 0) findHighestIndex();
  }, [data]);

  useEffect(() => makeHighlightMouseovers(), [highlightElements]);

  return (
    <div className="highlights-scroll">
      <div className="highlight-header">
        <p className="highlight-title text-primary">Highlights</p>
        <p className="highlight-subtitle text-primary">By Highest Index</p>
      </div>
      <div className="highlights-content">
        <Tabs
          value={false}
          variant="scrollable"
          scrollButtons="auto"
          classes={{
            scrollButtons: classes.scrollButtons,
            flexContainer:
              highlightElements.length > 5
                ? classes.flexContainerSpace
                : classes.flexContainerStart,
          }}
          id="highlight-tabs"
        >
          {highlightElements.map((el) => (
            <Tab
              key={el['dpa_main.element']}
              className="highlight-item-wrapper"
              label={
                <div className="highlight-item border-color-light MuiPaper-root MuiPaper-elevation3">
                  <h6 className="highlight-item-label text-gray">
                    {el['dpa_main.marketing_name']}
                  </h6>

                  <div className="highlight-item-icon bg-primary">
                    <FontAwesomeIcon
                      className="highlight-icon text-contrast"
                      icon={el['dpa_main.svg_icons']}
                    />
                  </div>

                  <div className="highlight-item-value">
                    <h3>{el['dpa_main.label']}</h3>
                    <p className="highlight-item-index">
                      <span className="label text-gray-light">Index:</span>
                      <span
                        className={
                          el['dpa_main.index'] > 99
                            ? 'text-success'
                            : 'text-warning'
                        }
                      >
                        {el['dpa_main.index'].toFixed(0)}
                      </span>
                    </p>
                  </div>
                </div>
              }
              disableRipple
            />
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default HighlightsViz;
