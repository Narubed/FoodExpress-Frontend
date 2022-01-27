import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../../../components/Page';
import {
  BlogPostCard,
  BlogPostsSearch
} from '../../../components/_dashboard/blogreportordermember';

// ----------------------------------------------------------------------

export default function BlogsReportOrderApp() {
  const [ReportOrder, setReportOrder] = useState([]);
  const user = sessionStorage.getItem('user');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const ReportOrders = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getReportOrderMemberJoinProduct`
    );
    const filterUserID = ReportOrders.data.data.filter(
      (value) => value.report_order_member_userid === parseInt(user, 10)
    );
    const a = filterUserID.reverse();
    console.log(a);
    setReportOrder(filterUserID);
  }, []);
  return (
    <Page title="Blog | NBA-Express">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            รายงานออเดอร์รับเข้าและส่งออก
          </Typography>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          {/* <BlogPostsSearch posts={POSTS} /> */}
          {/* <BlogPostsSort options={SORT_OPTIONS} /> */}
        </Stack>

        <Grid container spacing={3}>
          {ReportOrder.map((report, index) => (
            <BlogPostCard key={report.report_order_id} report={report} index={index} />
          ))}
        </Grid>
      </Container>
    </Page>
  );
}