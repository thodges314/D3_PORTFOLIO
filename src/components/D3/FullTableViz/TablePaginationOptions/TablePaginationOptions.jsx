import React from 'react';
import './TablePaginationOptions.scss';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import {
  FirstPage,
  LastPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@styled-icons/material';

const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const TablePaginationOptions = ({ count, page, rowsPerPage, onPageChange }) => {
  const classes = useStyles();
  const theme = useTheme();
  const handleFirstPageButtonClick = (evt) => onPageChange(evt, 0);
  const handleBackButtonClick = (evt) => onPageChange(evt, page - 1);
  const handleNextButtonClick = (evt) => onPageChange(evt, page + 1);
  const handleLastPageButtonClick = (evt) =>
    onPageChange(evt, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? (
          <LastPage className="icon-button" />
        ) : (
          <FirstPage className="icon-button" />
        )}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight className="icon-button" />
        ) : (
          <KeyboardArrowLeft className="icon-button" />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft className="icon-button" />
        ) : (
          <KeyboardArrowRight className="icon-button" />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? (
          <FirstPage className="icon-button" />
        ) : (
          <LastPage className="icon-button" />
        )}
      </IconButton>
    </div>
  );
};

export default TablePaginationOptions;
