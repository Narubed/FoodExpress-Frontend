/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import { Icon } from '@iconify/react';
// import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

// material-tailwind

// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  TableContainer,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Slide,
  Paper,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Grid
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import CheckPercentPartner from './CheckPercentPartner';

// import CheckWalletMember from './CheckWalletMember';
// import EditAmountOrder from './EditAmountOrder';
// import postActionAdmin from '../../../utils/postActionAdmin';

// ----------------------------------------------------------------------
CheckOrderMoreMenu.propTypes = {
  id: PropTypes.string,
  order_partner_total: PropTypes.number,
  order_partner_status: PropTypes.string
};
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function CheckOrderMoreMenu(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  // eslint-disable-next-line camelcase
  const { id, Orderlist, row, order_partner_status, order_partner_total } = props;
  const [showModal, setShowModal] = useState(false);
  const [orderDetail, setOrderDetail] = useState([]);
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const detailOrder = async () => {
    setIsOpen(false);

    const data = await axios.get(
      `${process.env.REACT_APP_PARTNER_API}/order_detail/order_id/${id}`
    );
    setOrderDetail(data.data.data);
    setShowModal(true);
  };

  const deleteOrder = async () => {
    setIsOpen(false);
    Swal.fire({
      title: 'ยืนยันการยกเลิกออเดอร์ !',
      text: 'คุณต้องการยืนยันการยกเลิกออเดอร์หรือไม่ ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'OPEN' });
        const putData = {
          order_partner_status: 'ผู้ดูแลระบบยกเลิก'
        };
        await axios.put(`${process.env.REACT_APP_PARTNER_API}/order/${id}`, putData);
        dispatch({ type: 'TURNOFF' });
        Swal.fire({
          icon: 'success',
          title: 'ยืนยันการยกเลิกออเดอร์เเล้ว',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          setIsOpen(false);
        }, 1500);
      }
    });
  };
  const confirmOrders = async () => {
    setIsOpen(false);
    Swal.fire({
      title: 'ยืนยันการโอนเงิน !',
      text: 'คุณต้องการยืนยันการโอนเงินหรือไม่ ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'OPEN' });
        const putData = {
          order_partner_status: 'รอจัดส่ง'
        };
        await CheckPercentPartner(props);
        await axios.put(`${process.env.REACT_APP_PARTNER_API}/order/${id}`, putData);
        dispatch({ type: 'TURNOFF' });
        Swal.fire({
          icon: 'success',
          title: 'ยืนยันการโอนเงินเเล้ว',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          setIsOpen(false);
        }, 1500);
      }
    });
  };
  return (
    <>
      <>
        <IconButton ref={ref} onClick={() => setIsOpen(true)}>
          <Icon icon="ic:round-filter-list" />
        </IconButton>

        <Menu
          open={isOpen}
          anchorEl={ref.current}
          onClose={() => setIsOpen(false)}
          PaperProps={{
            sx: { width: 200, maxWidth: '100%' }
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => detailOrder()}>
            <ListItemIcon>
              <Icon icon="icon-park-outline:view-grid-detail" width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="รายระเอียด" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
          {order_partner_status === 'รอตรวจสอบ' ? (
            <>
              <MenuItem sx={{ color: 'text.secondary' }}>
                <ListItemIcon>
                  <Icon icon="line-md:confirm-circle-twotone" width={24} height={24} />
                </ListItemIcon>
                <ListItemText
                  primary="ยืนยันการโอนเงิน"
                  primaryTypographyProps={{ variant: 'body2' }}
                  onClick={() => confirmOrders()}
                />
              </MenuItem>
            </>
          ) : null}
          {order_partner_status === 'รอตรวจสอบ' || order_partner_status === 'รอชำระเงิน' ? (
            <>
              <MenuItem sx={{ color: 'text.secondary' }}>
                <ListItemIcon>
                  <Icon icon="flat-color-icons:delete-database" width={24} height={24} />
                </ListItemIcon>
                <ListItemText
                  primary="ยกเลิกรายการนี้"
                  primaryTypographyProps={{ variant: 'body2' }}
                  onClick={() => deleteOrder()}
                />
              </MenuItem>
            </>
          ) : null}
        </Menu>

        <Dialog
          fullWidth="fullWidth"
          maxWidth="md"
          open={showModal}
          onClose={() => setShowModal(false)}
          TransitionComponent={Transition}
        >
          <DialogTitle>รายละเอียดออเดอร์</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ไอดี</TableCell>
                    <TableCell align="right">ชื่อสินค้า</TableCell>
                    <TableCell align="right">จำนวนสินค้า</TableCell>
                    <TableCell align="right">ราคารวม</TableCell>
                    <TableCell align="right">สถานะ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderDetail.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{
                        '&:last-of-type td, &:last-of-type th': {
                          border: 0
                        }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.odd_product_id}
                      </TableCell>
                      <TableCell align="right">{row.odd_product_name}</TableCell>
                      <TableCell align="right">
                        {row.odd_product_amount} {row.odd_product_currency}
                      </TableCell>
                      <TableCell align="right">
                        {(row.odd_product_price * row.odd_product_amount).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">{row.odd_status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Grid align="right" item xs={12} sx={{ mt: 3 }}>
                <Grid item sx={{ textAlign: 'right' }}>
                  {`${orderDetail
                    .reduce(
                      (previousValue, currentValue) =>
                        previousValue +
                        currentValue.odd_product_price * currentValue.odd_product_amount,
                      0
                    )
                    .toLocaleString()} บาท`}
                </Grid>
              </Grid>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)}>ออก</Button>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
}
