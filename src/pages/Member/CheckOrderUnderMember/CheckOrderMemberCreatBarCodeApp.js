/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import ReactToPrint from 'react-to-print';
import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
// material
import {
  Box,
  Grid,
  Container,
  Typography,
  Card,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import Button from '@material-tailwind/react/Button';
import axios from 'axios';
import Barcode from 'react-barcode';
import { styled } from '@mui/material/styles';
import Page from '../../../components/Page';
// utils
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

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function CheckOrderMemberCreatBarCodeApp() {
  const dispatch = useDispatch();
  dispatch({ type: 'OPEN' });
  const [Order, setOrder] = useState([]);
  const [showDeliveryDetail, setDeliveryDetail] = useState([]);
  const [open, setOpen] = useState(false);

  let componentRef = useRef();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const userID = sessionStorage.getItem('user');
    const getDeliverUser = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getJoinDeliveryProviceAndMemberReceiver`
    );
    const filterStatus = getDeliverUser.data.data.filter(
      (f) => f.member_delivery_status === 'ตัดรอบแล้ว'
    );
    // eslint-disable-next-line camelcase
    const filterRider_id = filterStatus.filter((f) => f.member_delivery_member_id === userID);
    setOrder(filterRider_id);
    console.log(getDeliverUser);
  }, []);

  const showModalDetail = async (req, res) => {
    const getDeliverDetail = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getDeliveryDetailByDeliveryID/${req.member_delivery_id}`
    );
    console.log(getDeliverDetail.data.data);
    setDeliveryDetail(getDeliverDetail.data.data);
    setOpen(true);
  };
  dispatch({ type: 'TURNOFF' });
  return (
    <>
      <Page title="RiderCreatBarCodeApp | admin NBA-Express">
        <Container maxWidth="xl">
          <Box sx={{ pb: 5 }}>
            <Typography variant="h4">
              <div>สร้างบาร์โค๊ตออเดอร์ที่ถูกตัดรอบแล้ว</div>
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
                <Grid
                  key={m.member_delivery_id}
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  onClick={() => showModalDetail(m)}
                >
                  <RootStyle>
                    <IconWrapperStyle>
                      <Barcode value={m.member_delivery_id} format="CODE128" />
                    </IconWrapperStyle>
                    <Typography variant="h3">
                      {m.level === 'province' ? 'ระดับจังหวัด' : null}
                      {m.level === 'district' ? 'ระดับอำเภอ' : null}
                      {m.level === 'subdistrict' ? 'ระดับตำบล' : null}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                      {m.subdistrict}
                      {m.district}
                      {m.province}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                      {dayjs(m.member_delivery_date).locale('th').format('DD MMMM YYYY')}
                    </Typography>
                  </RootStyle>
                </Grid>
              ))}
            </Grid>
          </div>
        </Container>
      </Page>
      <Dialog
        // fullWidth={fullWidth}
        maxWidth="xl"
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>รายระเอียดสินค้า</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            รหัสสินค้า
                          </th>

                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ชื่อสินค้า
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            จำนวนสินค้า
                          </th>

                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {showDeliveryDetail.map((person) => (
                          <tr key={person.report_delivery_detail_id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {person.report_delivery_detail_id}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="text-sm text-gray-500">
                                    {person.member_delivery_detail_product_name}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              {person.member_delivery_detail_product_amoumt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {person.member_delivery_detail_product_currency}
                              {/* {numeral(person.order_product_price).format()} */}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {person.order_company_status}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {person.order_company_status === 'ตัดรอบการจัดส่งแล้ว' ? (
                                <Button
                                  color="purple"
                                  buttonType="outline"
                                  size="regular"
                                  rounded
                                  block={false}
                                  iconOnly={false}
                                  ripple="dark"
                                  // onClick={() => confirmDelivery(person)}
                                >
                                  ได้รับสินค้าชิ้นนี้เเล้ว
                                </Button>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="red"
            buttonType="outline"
            size="regular"
            rounded={false}
            block={false}
            iconOnly={false}
            ripple="dark"
            onClick={() => setOpen(false)}
          >
            ออก
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default CheckOrderMemberCreatBarCodeApp;
