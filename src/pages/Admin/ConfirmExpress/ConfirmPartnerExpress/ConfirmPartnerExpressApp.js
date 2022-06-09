/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
// material
import { Box, Grid, Container, Typography } from '@mui/material';
import axios from 'axios';
import Input from '@material-tailwind/react/Input';
// components
import Page from '../../../../components/Page';
import AppCardPartner from '../../../../components/_admin/confirmexpress/confirmpartnerexpress';
// ----------------------------------------------------------------------
function AdminConfirmExpressApp() {
  const dispatch = useDispatch();
  dispatch({ type: 'OPEN' });
  const [Order, setOrder] = useState([]);
  const [valueDetail, setValueDetail] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    // eslint-disable-next-line camelcase
    const Order_Detail = await axios.get(`${process.env.REACT_APP_PARTNER_API}/order_detail`);
    const Orders = await axios.get(`${process.env.REACT_APP_PARTNER_API}/order`);
    const Partner = await axios.get(`${process.env.REACT_APP_API_OFFICE}/partner`);
    const getGEO = await axios.post(`${process.env.REACT_APP_API_GEO}/nba-geo`, {
      tokenKey: '*NBADigital9111*'
    });
    const getZone = await axios.post(`${process.env.REACT_APP_API_GEO}/zone`, {
      tokenKey: '*NBADigital9111*'
    });
    const filterPartnerGEO = [];
    Partner.data.data.forEach((element) => {
      if (element.partner_level === 'ระดับภาค') {
        const valueFind = getGEO.data.data.find(
          (item) => item.nba_geo_id === parseInt(element.partner_sublevel, 10)
        );
        filterPartnerGEO.push({ ...element, partner_sublevel_name: valueFind.nba_geo_name });
      } else if (element.partner_level === 'ระดับเขต') {
        const valueFind = getZone.data.data.find(
          (item) => item.nba_zone === parseInt(element.partner_sublevel, 10)
        );
        filterPartnerGEO.push({ ...element, partner_sublevel_name: valueFind.zone_name });
      }
    });

    const newOrderDetail = [];
    Order_Detail.data.data.forEach((element, index) => {
      const value = Orders.data.data.find((item) => item._id === element.odd_order_id);
      if (value) {
        newOrderDetail.push({
          ...element,
          order_partner_status: value.order_partner_status,
          order_partner_total: value.order_partner_total
        });
      }
    });
    const addPartnerLevel = [];
    newOrderDetail.forEach((element) => {
      const value = filterPartnerGEO.find((item) => item._id === element.odd_partner_id);
      if (value) {
        addPartnerLevel.push({
          ...element,
          partner_level: value.partner_level,
          partner_sublevel_name: value.partner_sublevel_name
        });
      }
    });
    const filterOrderStatus = addPartnerLevel.filter(
      (f) => f.order_partner_status === 'รอจัดส่ง' && f.odd_status === 'ยังไม่ได้จัดส่ง'
    );
    setValueDetail(filterOrderStatus);
    const filtereds = [];
    filterOrderStatus.forEach((item, index) => {
      const idx = filtereds.findIndex(
        (value) => value.partner_sublevel_name === item.partner_sublevel_name
      );
      if (idx === -1) {
        filtereds.push(item);
      }
    });
    setOrder(filtereds);
  }, []);
  dispatch({ type: 'TURNOFF' });
  return (
    <Page title="รวมยอดสินค้า | admin NBA-Express">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">รวมยอดรายการสินค้าแต่ละ เขต / ภาค</Typography>
        </Box>
        <br />
        <Grid container spacing={3}>
          {Order?.map((item) => (
            // eslint-disable-next-line react/jsx-key
            <Grid item xs={12} sm={6} md={3}>
              <AppCardPartner props={item} valueDetail={valueDetail} />
              {/* <PercentCardSubdistrict Percent={Percent} /> */}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
export default AdminConfirmExpressApp;
