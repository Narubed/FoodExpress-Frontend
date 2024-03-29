import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../../../components/Page';
import { BlogPostCard } from '../../../components/_dashboard/stockproduct';

// ----------------------------------------------------------------------

export default function StockProductApp() {
  const dispatch = useDispatch();
  dispatch({ type: 'OPEN' });
  const [Stock, setStock] = useState([]);
  const user = sessionStorage.getItem('user');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const ReportOrders = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getStockMemberJoinProduct`
    );
    const filterUserID = ReportOrders.data.data.filter(
      (value) => value.stock_product_member_userid === user
    );
    setStock(filterUserID.reverse());
  }, []);
  dispatch({ type: 'TURNOFF' });
  return (
    <Page title="สต๊อกสินค้า | NBA-FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            <div>สต๊อกสินค้า</div>
          </Typography>
        </Stack>
        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between" />
        <Grid container spacing={3}>
          {Stock.map((stock, index) => (
            <BlogPostCard key={stock.id_stock_product_member_id} stock={stock} index={index} />
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
