// material
import { Box, Grid, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
// components
import Page from '../../../components/Page';
import {
  AppWaitingforDelivery,
  AppSuccessfulDelivery,
  AppLastMonthIncome,
  AppTotalIncome,
  AppWebsiteVisitsMember,
  AppCurrentVisitsMember,
  AppTrafficBySite
} from '../../../components/_dashboard/walletmember';
import MemberWalletApp from './MemberWalletApp';
// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [Total, setTotal] = useState([]);
  const user = sessionStorage.getItem('user');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getAllOrder = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getByOrderMember_id/${user}`
    );
    setTotal(getAllOrder.data.data);
  }, []);
  return (
    <Page title="Wallet | NBA-Express">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
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
            <AppWebsiteVisitsMember />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisitsMember />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <MemberWalletApp />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid>

          {/*  <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
