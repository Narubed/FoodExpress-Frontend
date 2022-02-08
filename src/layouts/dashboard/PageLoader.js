import React, { useState } from 'react';
import ReactLoading from 'react-loading';
import { styled } from '@mui/material/styles';

const RootStyle = styled('div')({
  margin: '0',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) '
});

// ----------------------------------------------------------------------

export default function PageLoader() {
  return (
    <RootStyle>
      <ReactLoading type="spinningBubbles" color="#FF00FF" height={50} width={50} />
    </RootStyle>
  );
}
