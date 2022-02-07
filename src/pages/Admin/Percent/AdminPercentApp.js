import { useEffect, useState } from 'react';

// material
import { Box, Grid, Container, Typography } from '@mui/material';
import axios from 'axios';
// components
import Page from '../../../components/Page';
import {
  PercentCardSubdistrict,
  PercentCardDistrict,
  PercentCardProvice
} from '../../../components/_admin/percent';
// ----------------------------------------------------------------------
function AdminPercentApp() {
  const [Percent, setPercent] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getAllPrecent = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllPrecent`);
    setPercent(getAllPrecent.data.data);
  }, []);

  return (
    <Page title="เปอร์เซ็น | admin NBA-Express">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">เปอร์เซ็นที่ศูนย์จะได้รับ</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <PercentCardSubdistrict Percent={Percent} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <PercentCardDistrict Percent={Percent[1]} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <PercentCardProvice Percent={Percent[2]} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
export default AdminPercentApp;
