/* eslint-disable global-require */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import ReactLoading from 'react-loading';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

const RootStyle = styled('div')({
  margin: '0',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) '
});

// ----------------------------------------------------------------------

export default function PageLoader() {
  const counter = useSelector((state) => state);
  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={counter}
      // fullWidth="fullWidth"
      maxWidth="xs"
    >
      <DialogContent dividers>
        loading...
        <br />
        <img
          src={require('../../assets/img/GIF/loading3.gif').default}
          frameBorder="0"
          allowFullScreen
          width="100%"
          height="1px"
        />
      </DialogContent>
    </Dialog>
    // <RootStyle>
    //   <ReactLoading type="spinningBubbles" color="#FF00FF" height={50} width={50} />
    // </RootStyle>
  );
}
