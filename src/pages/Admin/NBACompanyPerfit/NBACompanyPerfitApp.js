/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
// material
import { Box, Grid, Container, Typography } from '@mui/material';
import axios from 'axios';
import Input from '@material-tailwind/react/Input';
import numeral from 'numeral';
// components
import Page from '../../../components/Page';
import CardNBACompanyPerfitApp from '../../../components/_admin/cardNBAcompanyperfit/CardNBACompanyPerfitApp';
// ----------------------------------------------------------------------
function AdminCutArountAllApp() {
  const dispatch = useDispatch();
  const [Order, setOrder] = useState([]);
  const [Query, setQuery] = useState('');
  const [PercentNBA, setPercentNBA] = useState(0);
  dispatch({ type: 'OPEN' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    // eslint-disable-next-line camelcase
    const getAllOrder = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getJoinOrder_Member`);
    const filterStatusOrder = getAllOrder.data.data.filter(
      (f) => f.order_status === 'จัดส่งสำเร็จ'
    );
    const filetereds = [];
    filterStatusOrder.forEach((element) => {
      const idx = filetereds.findIndex((value) => value.province === element.province);
      if (idx === -1) {
        filetereds.push(element);
      } else if (idx !== -1) {
        filetereds[idx].order_percent_nba += element.order_percent_nba;
      }
    });
    setOrder(filetereds);
    const Percent = filetereds.reduce((sum, data) => sum + data.order_percent_nba, 0);
    setPercentNBA(Percent);
  }, []);
  dispatch({ type: 'TURNOFF' });
  return (
    <Page title="ตัดรอบสินค้าทั้งหมด | admin NBA-Express">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">รายได้ของบริษัททั้งหมด (กำไร)</Typography>
          <Typography variant="h4">{numeral(PercentNBA).format()} บาท</Typography>
        </Box>
        <Input placeholder="ค้นหาตามจังหวัด" onChange={(event) => setQuery(event.target.value)} />
        <br />
        <Grid container spacing={3}>
          {Order?.filter((post) => {
            if (Query === '') {
              return post.province;
            }
            if (
              post.province.toLowerCase().includes(Query.toLowerCase()) ||
              post.province.toLowerCase().includes(Query.toLowerCase())
            ) {
              return post;
            }
          }).map((m) => (
            // eslint-disable-next-line react/jsx-key
            <Grid item xs={12} sm={6} md={3}>
              <CardNBACompanyPerfitApp props={m} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
export default AdminCutArountAllApp;
