/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
// material
import { Box, Grid, Container, Typography } from '@mui/material';
import axios from 'axios';
import Input from '@material-tailwind/react/Input';
// components
import Page from '../../../../components/Page';
import AppCardCutArountAllPartner from '../../../../components/_admin/cutarountall/AppCardCutArountAllPartner';
// ----------------------------------------------------------------------
function AdminCutArountPartnerAllApp() {
  const dispatch = useDispatch();
  const [CutArount, setCutArount] = useState([]);
  const [Query, setQuery] = useState('');
  dispatch({ type: 'OPEN' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    // eslint-disable-next-line camelcase
    const getAllCutArount = await axios.get(
      `${process.env.REACT_APP_PARTNER_API}/cut_arount_order`
    );
    const reverseData = getAllCutArount.data.data.reverse();
    setCutArount(reverseData);
  }, []);
  dispatch({ type: 'TURNOFF' });
  return (
    <Page title="ตัดรอบสินค้าทั้งหมด | admin NBA-Express">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">รายการสินค้าที่ถูกตัดรอบไปเเล้วทั้งหมด (เขต/ภาค)</Typography>
        </Box>
        <Input placeholder="ค้นหาตามชื่อศูนย์" onChange={(event) => setQuery(event.target.value)} />
        <br />
        <Grid container spacing={3}>
          {CutArount?.filter((post) => {
            if (Query === '') {
              return post.cao_level_name;
            }
            if (
              post.cao_level_name.toLowerCase().includes(Query.toLowerCase()) ||
              post.cao_level_name.toLowerCase().includes(Query.toLowerCase())
            ) {
              return post;
            }
          }).map((m) => (
            // eslint-disable-next-line react/jsx-key
            <Grid item xs={12} sm={6} md={3}>
              <AppCardCutArountAllPartner props={m} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
export default AdminCutArountPartnerAllApp;
