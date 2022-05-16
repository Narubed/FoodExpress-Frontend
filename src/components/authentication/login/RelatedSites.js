import React, { useRef } from 'react';
// material
import { Box, Grid, Card, Paper, Typography, CardHeader, CardContent } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Image from '@material-tailwind/react/Image';
import Tooltips from '@material-tailwind/react/Tooltips';
import TooltipsContent from '@material-tailwind/react/TooltipsContent';
import Button from '@material-tailwind/react/Button';
// ----------------------------------------------------------------------
const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.error.dark,
  '&:hover': {
    background: theme.palette.error.lighter,
    boxShadow: '5px 5px 4px red'
  },
  '&:last-child': {
    borderRight: 'solid 1px #cccccc'
  },
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0)} 0%, ${alpha(
    theme.palette.error.dark,
    0.24
  )} 100%)`
}));

export default function RelatedSites() {
  const buttonRef = useRef();
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Box sx={{ mb: 0.5 }} ref={buttonRef}>
            <IconWrapperStyle
              onClick={() => window.open('https://nbadigitalworlds.com/2021/index.html', '_blank')}
            >
              <Image
                // eslint-disable-next-line global-require
                src={require('../../../assets/img/NBA1.jpg').default}
                rounded
                raised={false}
                alt="Image"
              />
            </IconWrapperStyle>
          </Box>
        </Grid>
        <Tooltips placement="top" ref={buttonRef}>
          <TooltipsContent>NBA Digital Worlds</TooltipsContent>
        </Tooltips>

        <Grid item xs={2}>
          <Box sx={{ mb: 0.5 }} ref={buttonRef}>
            <IconWrapperStyle
              onClick={() => window.open('https://e-branch2.nbadigitalworlds.com/', '_blank')}
            >
              <Image
                // eslint-disable-next-line global-require
                src={require('../../../assets/img/NBA2.png').default}
                rounded
                raised={false}
                alt="Image"
              />
            </IconWrapperStyle>
          </Box>
        </Grid>
        <Tooltips placement="top" ref={buttonRef}>
          <TooltipsContent>E-Branch</TooltipsContent>
        </Tooltips>
        {/* <Grid item xs={2} ref={buttonRef}>
          <IconWrapperStyle
            onClick={() => window.open('https://e-transfer.nbadigitalworlds.com/', '_blank')}
          >
            <Image
              // eslint-disable-next-line global-require
              src={require('../../../assets/img/NBA3.png').default}
              rounded
              raised={false}
              alt="Image"
            />
          </IconWrapperStyle>
        </Grid>
        <Tooltips placement="top" ref={buttonRef}>
          <TooltipsContent>E-Transfer</TooltipsContent>
        </Tooltips> */}
        {/* <Grid item xs={2} ref={buttonRef}>
          <IconWrapperStyle
            onClick={() => window.open('https://www.shipmileservice.com/', '_blank')}
          >
            <Image
              src="https://www.shipsmileservices.com/wp-content/uploads/2021/08/logo-%E0%B8%8A%E0%B8%B4%E0%B8%9B%E0%B8%9B%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%A1%E0%B8%A5%E0%B9%8C-%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A7%E0%B8%B4%E0%B8%AA-new-verion-Final-create-01.jpg"
              rounded
              raised={false}
              alt="Image"
            />
          </IconWrapperStyle>
        </Grid>
        <Tooltips placement="top" ref={buttonRef}>
          <TooltipsContent>ShipSmile Service</TooltipsContent>
        </Tooltips> */}
      </Grid>
    </>
  );
}
