/* eslint-disable react/prop-types */
import React, { useState } from 'react';
// material
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';

export default function EditAmountOrder({ person, confirmEditAmountOrderDetail }) {
  const [open, setOpen] = useState(false);
  const [valueAmount, setValueAmount] = useState(person.order_product_amoumt);

  const confirmPutData = async () => {
    const data = {
      order_detail_id: person.order_detail_id,
      order_product_amoumt: valueAmount
    };
    const dataReport = `ได้ทำการแก้ไขจำนวนสินค้าหมายเลขรายละเอียดออเดอร์ที่ ${person.order_detail_id}  จาก ${person.order_product_amoumt} เป็นจำนวน ${valueAmount}`;
    const postReportAdmin = {
      id_report_action_admin: Date.now().toString() + person.order_id,
      report_action_admin_id: sessionStorage.getItem('user'),
      report_action_order_id: person.order_id,
      report_action_admin_value: dataReport,
      report_action_admin_date: new Date()
    };
    confirmEditAmountOrderDetail({ data, postReportAdmin });
    setOpen(false);
  };
  //   putAmountOrderDetail
  return (
    <>
      <Button color="error" buttonType="link" onClick={() => setOpen(true)} ripple="dark">
        แก้ไข
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>การเเก้ไขจำนวนการสั่งซื้อ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            **คำเตือน** หากท่านแก้ไขข้อมูลชุดนี้
            รายระเอียดรายการจะถูกเปลี่ยนค่ารวมถึงการคำนวนเปอร์เซ็นจะถูกเปลี่ยนด้วย
            เเต่จำนวนสินค้าโดยรวมเเละการทำงานจะเป็นไปตามขั้นตอนปกติ จำนวนเก่าคือ{' '}
            {person.order_product_amoumt} {person.order_product_currency}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="กรุณากรอกจำนวนที่ต้องการเเก้ไข"
            type="number"
            fullWidth
            variant="standard"
            defaultValue={valueAmount}
            onChange={(e) => setValueAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpen(false)}>
            ยกเลิก
          </Button>
          <Button onClick={() => confirmPutData()}>ยืนยัน</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
