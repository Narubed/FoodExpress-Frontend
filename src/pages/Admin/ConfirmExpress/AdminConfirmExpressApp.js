/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';
// material
import { Box, Grid, Container, Typography } from '@mui/material';
import axios from 'axios';
import Input from '@material-tailwind/react/Input';
// components
import Page from '../../../components/Page';
import AppCardProvince from '../../../components/_admin/confirmexpress/AppCardProvince';
// ----------------------------------------------------------------------
function AdminConfirmExpressApp() {
  const [Order, setOrder] = useState([]);
  const [Query, setQuery] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    // eslint-disable-next-line camelcase
    const JoinOrder_Detail = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getJoinOrder_Detail`
    );

    const filterOrderStatus = JoinOrder_Detail.data.data.filter(
      (f) => f.order_status === 'รอจัดส่ง'
    );
    const filterCompanyStatus = filterOrderStatus.filter(
      (f) => f.order_company_status === 'ยังไม่ได้จัดส่ง'
    );
    const filtereds = [];
    await filterCompanyStatus.forEach((item, index) => {
      const idx = filtereds.findIndex(
        (value) => value.order_product_province === item.order_product_province
      );
      if (idx === -1) {
        filtereds.push(item);
      }
    });
    setOrder(filtereds);
    console.log(filtereds);
  }, []);
  return (
    <Page title="Confirm | admin NBA-Express">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">ConfirmExpress</Typography>
        </Box>
        <Input placeholder="ค้นหาตามจังหวัด" onChange={(event) => setQuery(event.target.value)} />
        <br />
        <Grid container spacing={3}>
          {Order?.filter((post) => {
            if (Query === '') {
              return post.order_product_province;
            }
            if (
              post.order_product_province.toLowerCase().includes(Query.toLowerCase()) ||
              post.order_product_province.toLowerCase().includes(Query.toLowerCase())
            ) {
              return post;
            }
          }).map((m) => (
            // eslint-disable-next-line react/jsx-key
            <Grid item xs={12} sm={6} md={3}>
              <AppCardProvince props={m} />
              {/* <PercentCardSubdistrict Percent={Percent} /> */}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
export default AdminConfirmExpressApp;
