import React, { useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { PointSpreadLoading } from 'react-loadingg';

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
  const [open, setOpen] = useState(false);

  return (
    <RootStyle>
      <PointSpreadLoading type="cylon" color="#FF00FF" height={50} width={50} />
    </RootStyle>
  );
}
