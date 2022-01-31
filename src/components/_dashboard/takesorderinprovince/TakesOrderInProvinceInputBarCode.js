import * as React from 'react';
import PropTypes from 'prop-types';
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
import { now } from 'lodash';

TakesOrderInputBarCode.propTypes = {
  DeliveryList: PropTypes.array
};
export default function TakesOrderInputBarCode({ DeliveryList }) {
  console.log(DeliveryList);
  const [open, setOpen] = React.useState(false);
  const [valueBarcode, setValueBarcode] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleComfirm = async () => {
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
      checkStockMember({ result, getDeliveryDetail });
      const DeliveryDetail = getDeliveryDetail.data.data;
      DeliveryDetail.forEach(async (value, index) => {
        const ID = Date.now() + value.report_delivery_detail_id + index;
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

      Swal.fire({
        icon: 'success',
        title: 'คุณได้รับออเดอร์นี้เเล้ว',
        showConfirmButton: false,
        timer: 1500
      });
      setTimeout(() => {
        window.location.reload(false);
      }, 1500);

      setOpen(false);
    }
  };

  const checkStockMember = async ({ result, getDeliveryDetail }) => {
    const getStockMember = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getStockProductMemberByUserID/${result.receiver_delivery_member_id}`
    );
    getDeliveryDetail.data.data.forEach(async (value, index) => {
      const filterStockOrderByProductID = getStockMember.data.data.filter(
        (filtervalue) => filtervalue.stock_product_id === value.member_delivery_detail_product_id
      );
      if (filterStockOrderByProductID.length === 0) {
        const createStockID = Date.now() + result.receiver_delivery_member_id + index;
        const stockOrder = {
          id_stock_product_member_id: createStockID,
          stock_product_member_userid: result.receiver_delivery_member_id,
          stock_product_id: value.member_delivery_detail_product_id,
          stock_product_name: value.member_delivery_detail_product_name,
          stock_product_amount: value.member_delivery_detail_product_amoumt
        };
        await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postStockProductMember`, stockOrder);
      } else {
        const putStockOrder = {
          id_stock_product_member_id: filterStockOrderByProductID[0].id_stock_product_member_id,
          stock_product_amount:
            parseInt(filterStockOrderByProductID[0].stock_product_amount, 10) +
            parseInt(value.member_delivery_detail_product_amoumt, 10)
        };
        await axios.put(
          `${process.env.REACT_APP_WEB_BACKEND}/putAmountStockProductMember`,
          putStockOrder
        );
      }
    });
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
