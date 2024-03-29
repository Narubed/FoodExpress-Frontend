/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
// material
import { Box, Grid, Container, Typography } from '@mui/material';
import axios from 'axios';
import Input from '@material-tailwind/react/Input';
// components
import Page from '../../../components/Page';
import AppCardCutArount from '../../../components/_admin/cutarount/AppCardCutArount';
// ----------------------------------------------------------------------
function AdminCutArountApp() {
  const dispatch = useDispatch();
  const [Order, setOrder] = useState([]);
  const [Query, setQuery] = useState('');
  dispatch({ type: 'OPEN' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    // eslint-disable-next-line camelcase
    const JoinOrder_Detail = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getJoinOrder_detail_cutarount`
    );

    const filterOrderStatus = JoinOrder_Detail.data.data.filter(
      (f) => f.order_status === 'รอจัดส่ง'
    );
    const filterCompanyStatus = filterOrderStatus.filter(
      (f) => f.order_company_status === 'ตัดรอบการจัดส่งแล้ว'
    );
    const filetereds = [];
    filterCompanyStatus.forEach((element) => {
      const idx = filetereds.findIndex(
        (value) => value.cut_arount_date === element.cut_arount_date
      );
      if (idx === -1) {
        filetereds.push(element);
      }
    });
    setOrder(filetereds);
  }, []);
  dispatch({ type: 'TURNOFF' });
  return (
    <Page title="ตัดรอบสินค้า | admin NBA-Express">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">รายการสินค้าเเต่ละจังหวัดที่ถูกตัดรอบแล้ว</Typography>
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
              <AppCardCutArount props={m} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
export default AdminCutArountApp;
