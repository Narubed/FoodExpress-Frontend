import * as React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Swal from 'sweetalert2';
import axios from 'axios';
import TakesOrderCheckStock from './TakesOrderCheckStock';
import TakesOrderCheckOrderDetail from './TakesOrderCheckOrderDetail';
import checkStatusOrder from '../../../utils/checkStatusOrder';

TakesOrderInputBarCode.propTypes = {
  orderList: PropTypes.array
};
export default function TakesOrderInputBarCode({ orderList }) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [valueBarcode, setValueBarcode] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleComfirm = async () => {
    const result = orderList.find((f) => f.id_order_rider_id === valueBarcode);
    if (!result) {
      Swal.fire(
        'เราหาเลขออเดอร์นี้ไม่เจอ !!',
        'กรุณาตรวจเช็คเลขบาร์โค๊ตของท่านว่าถูกต้องหรือไม่ ?',
        'info'
      );
      setOpen(false);
    } else {
      const createReportID =
        Date.now() + result.order_rider_member_userid + result.order_rider_product_id;
      await TakesOrderCheckStock({ result });

      const reportOrder = {
        report_order_id: createReportID,
        id_order_rider_id: result.id_order_rider_id,
        report_order_member_userid: result.order_rider_member_userid,
        report_order_product_id: result.order_rider_product_id,
        report_order_product_name: result.order_rider_product_name,
        report_order_product_amount_in: result.order_rider_Amount,
        report_order_product_amount_out: 0,
        report_order_status: 'รับเข้า'
      };
      await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/portReportOrderMember`, reportOrder);
      const data = {
        id_order_rider_id: parseInt(result.id_order_rider_id, 10),
        order_rider_status: 'ไรเดอร์จัดส่งของสำเร็จ'
      };

      await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putStatusOrderRider`, data);
      await TakesOrderCheckOrderDetail({ result });
      await checkStatusOrder();
      Swal.fire({
        icon: 'success',
        title: 'คุณได้รับออเดอร์นี้เเล้ว',
        showConfirmButton: false,
        timer: 1500
      });
      setTimeout(() => {
        navigate('/dashboard/BlogsReportOrderApp', { replace: true });
        // window.location.reload(false);
      }, 1500);

      setOpen(false);
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        startIcon={<Icon icon="iconoir:input-field" />}
        onClick={handleClickOpen}
      >
        กรอก Barcode
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Barcode</DialogTitle>
        <DialogContent>
          <DialogContentText>
            กรุณากรอกเลขบาร์โค๊ตที่ต้องการรับเข้าสู่ระบบด้วย !!{' '}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="BARCODE"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e) => setValueBarcode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ยกเลิก</Button>
          <Button onClick={handleComfirm}>ยืนยัน</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
