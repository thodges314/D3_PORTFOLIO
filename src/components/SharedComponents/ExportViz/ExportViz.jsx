import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
  exportPDF,
  exportFullPDF,
  exportPNG,
} from '../../../utils/exportChart';
import './ExportViz.scss';

// the 'element' prop must be a ref
// full means 'fullscreen' and is used for full page exports
export const ExportViz = ({
  element,
  full,
  runValue,
  refAudValue,
  tgtAudValue,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [headerContent, setHeaderContent] = useState({});

  useEffect(() => {
    setHeaderContent({
      dpaName: runValue.label,
      audienceName: tgtAudValue.value,
      referenceName: refAudValue.value,
    });
  }, [tgtAudValue, refAudValue]);

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePDF = () => {
    if (full) exportFullPDF(element, headerContent);
    else exportPDF(element, headerContent);
    handleClose();
  };

  const handlePNG = () => {
    exportPNG(element);
    handleClose();
  };

  return (
    <>
      <Button
        className="btn-download"
        onClick={(e) => {
          handleOpen(e);
        }}
      >
        <FontAwesomeIcon icon={faDownload} className="download-icon" />
      </Button>
      <Menu
        id="download-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handlePDF}>Download PDF</MenuItem>
        <MenuItem onClick={handlePNG}>Download PNG</MenuItem>
      </Menu>
    </>
  );
};
