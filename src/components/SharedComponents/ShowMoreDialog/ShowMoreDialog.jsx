import React, { useState } from 'react';
import { Dialog, Button } from '@material-ui/core';
import './ShowMoreDialog.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { EmbedLookBasic } from '../EmbedLook/EmbedLookBasic';

// show more dialog, parent need to have position: relative
// for it to work correctly
export const ShowMoreDialog = ({ lookFilter, lookId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="show-more">
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="xl"
      >
        <FontAwesomeIcon
          icon={faXmark}
          className="close-icon"
          onClick={() => setIsDialogOpen(false)}
        />
        <EmbedLookBasic lookIdNum={lookId} filterData={lookFilter} />
      </Dialog>
      <div>
        <Button
          variant="text"
          color="primary"
          size="small"
          onClick={() => setIsDialogOpen(true)}
        >
          Show more
        </Button>
      </div>
    </div>
  );
};
