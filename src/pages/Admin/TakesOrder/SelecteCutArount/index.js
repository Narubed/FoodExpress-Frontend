/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Swal from 'sweetalert2';

export default function index() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dealer, setDealer] = useState('บริษัท');
  const [consignee, setConsignee] = useState('ศูนย์จังหวัด');
  const [ownerCutArount, setOwnerCutArount] = useState('ศูนย์จังหวัด');
  const [cutarountID, setCutarountID] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const setDefault = () => {
    setDealer('บริษัท');
    setConsignee('ศูนย์จังหวัด');
    setOwnerCutArount('ศูนย์จังหวัด');
    setCutarountID('');
  };

  const handleClick = async () => {
    setOpen(false);
    if (ownerCutArount === 'ศูนย์ (เขต/ภาค)') {
      console.log('ศูนย์ (เขต/ภาค)');
      let getCutarountid = null;
      await axios
        .get(`${process.env.REACT_APP_PARTNER_API}/cut_arount_order/${cutarountID}`)
        .then((req) => (getCutarountid = req.data.data))
        .catch((error) => {
          setDefault();
          Swal.fire({
            icon: 'error',
            title: 'กรุณาเช็ครหัสการตัดรอบอีกครั้ง !',
            showConfirmButton: false,
            timer: 1500
          });
        });
      if (getCutarountid) {
        setDefault();
        Swal.fire({
          icon: 'success',
          title: 'ตรวจสอบรหัสถูกต้อง !',
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/admin/AdminTakesOrderApp/AdminTakesOrderDetail/AdminCreateOrderRiderApp', {
          state: { ...getCutarountid, dealer, consignee }
        });
      }
    } else {
      const getCutarountid = await axios
        .get(`${process.env.REACT_APP_WEB_BACKEND}/getByOrderCutArountID/${cutarountID}`)
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'กรุณาเช็ครหัสการตัดรอบอีกครั้ง !',
            showConfirmButton: false,
            timer: 1500
          });
        });
      if (!getCutarountid || getCutarountid.data.data.length === 0) {
        setDefault();
        Swal.fire({
          icon: 'error',
          title: 'กรุณาเช็ครหัสการตัดรอบอีกครั้ง !',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        setDefault();
        Swal.fire({
          icon: 'success',
          title: 'ตรวจสอบรหัสถูกต้อง !',
          showConfirmButton: false,
          timer: 1500
        });
        const data = [];
        getCutarountid.data.data.forEach((element) => {
          data.push({
            _id: element.cut_arount_id,
            cao_first_date: element.cut_arount_first_date,
            cao_last_data: element.cut_arount_last_date,
            cao_level: 'ศูนย์จังหวัด',
            cao_level_name: element.cut_arount_province,
            cao_status: element.cut_arount_status,
            cao_timestamp: element.cut_arount_date,
            dealer,
            consignee
          });
        });
        navigate('/admin/AdminTakesOrderApp/AdminTakesOrderDetail/AdminCreateOrderRiderApp', {
          state: data[0]
        });
      }
    }
  };

  return (
    <>
      <Button
        sx={{ color: 'purple' }}
        color="info"
        variant="outlined"
        onClick={() => handleClickOpen()}
        //   component={RouterLink}
        //   to="/admin/AdminTakesOrderApp/CheckRemainingOrders"
        startIcon={<Icon icon="fluent:delete-arrow-back-16-regular" width="22" height="22" />}
      >
        เพิ่มงานให้ไรเดอร์
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth="fullWidth" maxWidth="sm">
        <DialogTitle>กรุณากรอกรายละเอียดให้ครบ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">ผู้นำจ่าย</FormLabel>
              <RadioGroup
                onChange={(e) => setDealer(e.target.value)}
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="บริษัท"
                name="radio-buttons-group"
              >
                <FormControlLabel value="บริษัท" control={<Radio />} label="บริษัท (คลั่งสินค้า)" />
                <FormControlLabel value="ไรเดอร์" control={<Radio />} label="ไรเดอร์" />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">เจ้าของสินค้า</FormLabel>
              <RadioGroup
                onChange={(e) => setOwnerCutArount(e.target.value)}
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="ศูนย์จังหวัด"
                name="radio-buttons-group"
              >
                <FormControlLabel value="ศูนย์จังหวัด" control={<Radio />} label="ศูนย์จังหวัด" />
                <FormControlLabel
                  value="ศูนย์ (เขต/ภาค)"
                  control={<Radio />}
                  label="ศูนย์ (เขต/ภาค)"
                />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">ผู้รับสินค้า</FormLabel>
              <RadioGroup
                onChange={(e) => setConsignee(e.target.value)}
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="ศูนย์จังหวัด"
                name="radio-buttons-group"
              >
                <FormControlLabel value="ศูนย์จังหวัด" control={<Radio />} label="ศูนย์จังหวัด" />
                <FormControlLabel
                  value="ศูนย์ (เขต/ภาค)"
                  control={<Radio />}
                  label="ศูนย์ (เขต/ภาค)"
                />
                <FormControlLabel value="บริษัท" control={<Radio />} label="บริษัท (คลั่งสินค้า)" />
                <FormControlLabel value="ไรเดอร์" control={<Radio />} label="ไรเดอร์" />
              </RadioGroup>
            </FormControl>
          </DialogContentText>
          <TextField
            onChange={(e) => setCutarountID(e.target.value)}
            autoFocus
            margin="dense"
            id="id"
            label="รหัสการตัดรอบ"
            type="string"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            ยกเลิก
          </Button>
          <Button onClick={handleClick}>ยืนยันการเพิ่มงาน</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
