import * as React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TakesOrderInProvinceCheckStock from './TakesOrderInProvinceCheckStock';
import TakesOrderInProvinceCheckOrderDetail from './TakesOrderInProvinceCheckOrderDetail';
import checkStatusOrder from '../../../utils/checkStatusOrder';

TakesOrderInputBarCode.propTypes = {
  DeliveryList: PropTypes.array
};
export default function TakesOrderInputBarCode({ DeliveryList }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [valueBarcode, setValueBarcode] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleComfirm = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2500);
    const result = DeliveryList.find((f) => f.member_delivery_id === valueBarcode);
    if (!result) {
      Swal.fire(
        'เราหาเลขออเดอร์นี้ไม่เจอ !!',
        'กรุณาตรวจเช็คเลขบาร์โค๊ตของท่านว่าถูกต้องหรือไม่ ?',
        'info'
      );
      setOpen(false);
    } else {
      const getDeliveryDetail = await axios.get(
        `${process.env.REACT_APP_WEB_BACKEND}/getDeliveryDetailByDeliveryID/${result.member_delivery_id}`
      );
      TakesOrderInProvinceCheckStock({ result, getDeliveryDetail });
      const DeliveryDetail = getDeliveryDetail.data.data;

      DeliveryDetail.forEach(async (value, index) => {
        let random = new Array(1000).fill(1);
        random = random.map((x, i) => i);
        random = random.sort(() => 2 * Math.random() - 1);
        const ID = Date.now() + value.report_delivery_detail_id + random[index];
        const dataReportMember = {
          report_order_id: ID,
          id_order_rider_id: ID,
          report_order_member_userid: parseInt(sessionStorage.getItem('user'), 10),
          report_order_product_id: parseInt(value.member_delivery_detail_product_id, 10),
          report_order_product_name: value.member_delivery_detail_product_name,
          report_order_product_amount_in: parseInt(value.member_delivery_detail_product_amoumt, 10),
          report_order_product_amount_out: 0,
          report_order_status: 'รับเข้า'
        };
        // ยิง --------
        dispatch({ type: 'OPEN' });
        await axios.post(
          `${process.env.REACT_APP_WEB_BACKEND}/portReportOrderMember`,
          dataReportMember
        );
      });
      const dataPutStatusDelivery = {
        member_delivery_id: result.member_delivery_id,
        member_delivery_status: 'จัดส่งสำเร็จ'
      };
      await axios.put(
        `${process.env.REACT_APP_WEB_BACKEND}/putStatusDeliveryProvice`,
        dataPutStatusDelivery
      );
      await TakesOrderInProvinceCheckOrderDetail({ result });
      await checkStatusOrder();
      Swal.fire({
        icon: 'success',
        title: 'คุณได้รับออเดอร์นี้เเล้ว',
        showConfirmButton: false,
        timer: 1500
      });
      setTimeout(() => {
        dispatch({ type: 'TURNOFF' });
        navigate('/dashboard/BlogsReportOrderApp', { replace: true });
      }, 1500);

      setOpen(false);
    }
  };

  return (
    <div>
      <Button
        sx={{ color: 'purple' }}
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
          <Button color="error" onClick={handleClose}>
            ยกเลิก
          </Button>
          <LoadingButton
            onClick={(e) => handleComfirm(e)}
            loading={loading}
            loadingIndicator="Loading..."
            variant="outlined"
          >
            ยืนยัน
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
