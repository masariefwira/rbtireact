import { CircularProgress, Modal, Box, Typography } from '@mui/material';
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ open }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const styleMargin = {
    marginBottom: '10px',
  };

  return (
    <React.Fragment>
      {open ? (
        <Modal open={open}>
          <Box sx={style}>
            <Typography sx={styleMargin}>Loading...</Typography>
            <CircularProgress></CircularProgress>
          </Box>
        </Modal>
      ) : null}
    </React.Fragment>
  );
};

export default LoadingSpinner;
