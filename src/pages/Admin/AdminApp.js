import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
// material
import { Box, Grid, Container, Typography } from '@mui/material';
import axios from 'axios';
// components
import Page from '../../components/Page';
import AppWaitingforDelivery from '../../components/_admin/app/AppWaitingforDelivery';
import AppSuccessfulDelivery from '../../components/_admin/app/AppSuccessfulDelivery';
import AppLastMonthIncome from '../../components/_admin/app/AppLastMonthIncome';
import AppTotalIncome from '../../components/_admin/app/AppTotalIncome';
import AppWebsiteVisits from '../../components/_admin/app/AppWebsiteVisits';
import AppCurrentVisits from '../../components/_admin/app/AppCurrentVisits';
// ----------------------------------------------------------------------
function DashboardApp() {
  const dispatch = useDispatch();
  const [Total, setTotal] = useState([]);
  dispatch({ type: 'OPEN' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getAllOrder = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllOrder`);
    setTotal(getAllOrder.data.data);
  }, []);
  dispatch({ type: 'TURNOFF' });
  return (
    <Page title="หน้าหลัก | admin NBA-Express">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">ยินดีต้อนรับสู่ระบบซื้อขาย</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWaitingforDelivery props={Total} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppSuccessfulDelivery props={Total} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppLastMonthIncome props={Total} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppTotalIncome props={Total} />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
export default DashboardApp;
