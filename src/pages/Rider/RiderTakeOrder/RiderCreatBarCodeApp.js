/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { useEffect, useState, useRef, useReactToPrint } from 'react';
import ReactToPrint from 'react-to-print';
import { Icon } from '@iconify/react';
// material
import { Box, Grid, Container, Typography, Card, CardMedia, CardTitle } from '@mui/material';
import Button from '@material-tailwind/react/Button';
import { CalendarOutlined } from '@ant-design/icons';
import axios from 'axios';
import Barcode from 'react-barcode';
import Input from '@material-tailwind/react/Input';
// components
import { alpha, styled } from '@mui/material/styles';
import Page from '../../../components/Page';
// utils
import { fNumber } from '../../../utils/formatNumber';
import AppCardProvince from '../../../components/_admin/confirmexpress/AppCardProvince';
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: 'theme.palette.warning.darker',
  backgroundColor: '#F0FFFF',
  '&:hover': {
    background: '#F0F8FF',
    boxShadow: '10px 10px 4px #F0FFFF'
  },
  '&:last-child': {
    borderRight: 'solid 1px #cccccc'
  }
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  // width: theme.spacing(8),
  // height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3)
}));
function RiderCreatBarCodeApp() {
  const [Order, setOrder] = useState([]);
  let componentRef = useRef();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const rider = sessionStorage.getItem('user');
    const getOrderRider = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getAllRiderOrderExpressJoinMember`
    );
    const filterStatus = getOrderRider.data.data.filter(
      (f) => f.order_rider_status === 'ไรเดอร์รับมอบหมายงานแล้ว'
    );
    // eslint-disable-next-line camelcase
    const filterRider_id = filterStatus.filter((f) => f.order_rider_id === parseInt(rider, 10));
    setOrder(filterRider_id);
    console.log(filterRider_id);
  }, []);
  return (
    <Page title="RiderCreatBarCodeApp | admin NBA-Express">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">
            <div>RiderCreatBarCodeApp</div>
          </Typography>
          <ReactToPrint
            trigger={() => (
              <Button
                color="lightBlue"
                buttonType="link"
                size="regular"
                rounded
                block={false}
                iconOnly
                ripple="dark"
              >
                <Icon icon="flat-color-icons:print" width={32} height={32} />
              </Button>
            )}
            content={() => componentRef}
          />
        </Box>
        <div ref={(el) => (componentRef = el)}>
          <Grid container spacing={3}>
            {Order.map((m) => (
              <Grid key={m.id_order_rider_id} item xs={12} sm={6} md={3}>
                <RootStyle>
                  <IconWrapperStyle>
                    <Barcode value={m.id_order_rider_id} format="CODE128" />
                  </IconWrapperStyle>
                  <Typography variant="h3">{`${fNumber(m.order_rider_Amount)} KG`}</Typography>
                  <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                    {m.order_rider_product_name}
                  </Typography>
                </RootStyle>
              </Grid>
            ))}
          </Grid>
        </div>
      </Container>
    </Page>
  );
}
export default RiderCreatBarCodeApp;
