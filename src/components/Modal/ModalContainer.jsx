import { Box, Modal } from '@mui/material';
import React from 'react';

const ModalContainer = (props) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Box sx={style}>{React.cloneElement(props.children, { ...props })}</Box>
    </Modal>
  );
};

export default ModalContainer;
