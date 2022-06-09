/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Input from '@material-tailwind/react/Input';
import Textarea from '@material-tailwind/react/Textarea';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import {
  Autocomplete,
  Stack,
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import axios from 'axios';

import Page from '../../../../components/Page';
import setProductCenter from './setProductCenter';
import setProductPartner from './setProductPartner';
import setDealerRider from './setDealerRider';
import setDealerCompany from './setDealerCompany';

import setConsigneeCompany from './setConsigneeCompany';
import setConsigneeRider from './setConsigneeRider';
import setConsigneePartner from './setConsigneePartner';
import ConsigneeMember from './ConsigneeMember';
import postActionAdmin from '../../../../utils/postActionAdmin';

export default function ComboBox() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [newDataProduct, setDataProduct] = React.useState([]);
  const [seleteProduct, setSeleteProduct] = React.useState(null);

  const [newDealer, setNewDealer] = React.useState([]);
  const [seleteDealer, setSeleteDealer] = React.useState(null);
  const [newNoteDealer, setNewNoteDealer] = React.useState('');

  const [newConsignee, setNewConsignee] = React.useState([]);
  const [seleteConsignee, setSeleteConsignee] = React.useState(null);
  const [newNoteConsignee, setNewNoteConsignee] = React.useState('');

  React.useEffect(async () => {
    const id = location.state._id;
    if (location.state.cao_level === 'ระดับเขต' || location.state.cao_level === 'ระดับภาค') {
      await setProductPartner({ setDataProduct, id });
    } else {
      await setProductCenter({ setDataProduct, id });
    }
    if (location.state.dealer === 'บริษัท') {
      await setDealerCompany({ setNewDealer });
    } else if (location.state.dealer === 'ไรเดอร์') {
      await setDealerRider({ setNewDealer });
    }
    if (location.state.consignee === 'ศูนย์ (เขต/ภาค)') {
      setConsigneePartner({ setNewConsignee });
    } else if (location.state.consignee === 'บริษัท') {
      setConsigneeCompany({ setNewConsignee });
    } else if (location.state.consignee === 'ไรเดอร์') {
      setConsigneeRider({ setNewConsignee });
    }
  }, [location]);

  const filterProductAmount = (item) => {
    if (!item) {
      setSeleteProduct(null);
    } else {
      const findProductName = newDataProduct.find((value) => value.product_name === item);
      setSeleteProduct(findProductName);
    }
  };
  const filterDealer = (item) => {
    if (!item) {
      setSeleteDealer(null);
      setNewNoteDealer('');
    } else {
      const findDealerName = newDealer.find((value) => value.dealer_name === item);
      setNewNoteDealer(findDealerName.dealer_note);
      setSeleteDealer(findDealerName);
    }
  };
  const filterConsignee = (item) => {
    if (!item) {
      setSeleteConsignee(null);
      setNewNoteConsignee('');
    } else {
      const findConsigneeName = newConsignee.find((value) => value.consignee_name === item);
      setNewNoteConsignee(findConsigneeName.consignee_note);
      setSeleteConsignee(findConsigneeName);
    }
  };
  const confirmTakesOrder = () => {
    const orderRiderId = Date.now() + localStorage.getItem('rider_id') + seleteProduct.product_id;
    const dataPost = {
      id_order_rider_id: orderRiderId,
      order_rider_id: localStorage.getItem('rider_id'),
      order_rider_product_id: seleteProduct.product_id,
      order_rider_product_name: seleteProduct.product_name,
      order_rider_amount: seleteProduct.product_amoumt,
      order_rider_currency: seleteProduct.product_currency,
      order_rider_dealer_type: seleteDealer.dealer_type,
      order_rider_dealer_name: seleteDealer.dealer_name,
      order_rider_dealer_id: seleteDealer.dealer_id,
      order_rider_dealer_note: newNoteDealer,
      order_rider_consignee_type: seleteConsignee.consignee_type,
      order_rider_consignee_name: seleteConsignee.consignee_name,
      order_rider_consignee_id: seleteConsignee.consignee_id,
      order_rider_consignee_note: newNoteConsignee,
      order_rider_status: 'ไรเดอร์รับมอบหมายงานแล้ว',
      order_rider_cut_arount_id: location.state._id,
      order_rider_date_cut_arount: location.state.cao_timestamp,
      order_rider_province_cut_arount: location.state.cao_level_name
    };
    // console.log(orderRiderId);
    // console.log(seleteProduct);
    // console.log(seleteDealer);
    // console.log(newNoteDealer);
    // console.log(seleteConsignee);
    // console.log(newNoteConsignee);
    const dataReport = `ชื่อสินค้า ${dataPost.order_rider_product_name} จำนวน ${
      dataPost.order_rider_amount
    }
    ${dataPost.order_rider_currency} ผู้นำจ่าย ${dataPost.order_rider_consignee_type} ชื่อ${
      dataPost.order_rider_consignee_name
    } ที่อยู่/note: ${dataPost.order_rider_dealer_note}
    ผู้รับสินค้า ${dataPost.order_rider_consignee_type} ชื่อ ${
      dataPost.order_rider_consignee_name
    } ที่อยู่/note: ${dataPost.order_rider_consignee_note} 
    ชื่อไรเดอร์ที่รับงาน${localStorage.getItem('rider_first_name')} ${localStorage.getItem(
      'rider_last_name'
    )}
    `;
    const postReportAdmin = {
      id_report_action_admin: dataPost.id_order_rider_id + sessionStorage.getItem('user'),
      report_action_admin_id: sessionStorage.getItem('user'),
      report_action_order_id: dataPost.id_order_rider_id,
      report_action_admin_value: dataReport,
      report_action_admin_date: new Date()
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการเพิ่มงานให้ไรเดอร์หรือไม่!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ตกลง!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'OPEN' });
        postActionAdmin(postReportAdmin);
        await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postRiderOrderExpress`, dataPost);
        dispatch({ type: 'TURNOFF' });
        Swal.fire({
          icon: 'success',
          title: 'Confirm !',
          text: 'คุณได้เพิ่มงานให้ไรเดอร์เรียบร้อยเเล้ว.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };
  return (
    <Page title="เพิ่มงานให้ไรเดอร์ | FoodExpress">
      <Container>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { mr: 50, width: '100%' }
              }}
              noValidate
              autoComplete="off"
            >
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={newDataProduct}
                getOptionLabel={(option) => option.product_name}
                onInputChange={(e, newValue) => {
                  filterProductAmount(newValue);
                }}
                sx={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField {...params} label="กรุณาเลือกสินค้าที่ต้องการจัดส่ง" />
                )}
              />
            </Box>
            <Input
              disabled
              // color="pink"
              size="Regular"
              outline
              placeholder="จำนวนสินค้า"
              defaultValue={seleteProduct === null ? '' : seleteProduct.product_amoumt}
            />
            <Input
              disabled
              // color="pink"
              size="Regular"
              outline
              placeholder="สกุลสินค้า"
              defaultValue={seleteProduct === null ? '' : seleteProduct.product_currency}
            />
          </Stack>
        </Stack>
        <Stack spacing={2} sx={{ mt: 5 }}>
          {location.state.dealer}
          <br />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { mr: 50, width: '100%' }
              }}
              noValidate
              autoComplete="off"
            >
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={newDealer}
                getOptionLabel={(option) => option.dealer_name}
                onInputChange={(e, newValue) => {
                  filterDealer(newValue);
                }}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="กรุณาเลือกจุดรับสินค้า" />}
              />
            </Box>
            <Textarea
              // disabled
              color="purple"
              size="Regular"
              outline
              placeholder="NOTE"
              defaultValue={seleteDealer === null ? '' : seleteDealer.dealer_note}
              value={newNoteDealer}
              onChange={(e) => setNewNoteDealer(e.target.value)}
            />
          </Stack>
        </Stack>
        {location.state.consignee === 'ศูนย์จังหวัด' ? (
          <Stack spacing={2} sx={{ mt: 5 }}>
            {location.state.consignee}
            <br />
            <ConsigneeMember
              setSeleteConsignee={setSeleteConsignee}
              setNewNoteConsignee={setNewNoteConsignee}
            />
            <Textarea
              // disabled
              color="purple"
              size="Regular"
              outline
              placeholder="NOTE"
              defaultValue={seleteConsignee === null ? '' : seleteConsignee.dealer_note}
              value={newNoteConsignee}
              onChange={(e) => setNewNoteConsignee(e.target.value)}
            />
          </Stack>
        ) : (
          <Stack spacing={2} sx={{ mt: 5 }}>
            {location.state.consignee}
            <br />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { mr: 50, width: '100%' }
                }}
                noValidate
                autoComplete="off"
              >
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={newConsignee}
                  getOptionLabel={(option) => option.consignee_name}
                  onInputChange={(e, newValue) => {
                    filterConsignee(newValue);
                  }}
                  sx={{ width: '100%' }}
                  renderInput={(params) => <TextField {...params} label="กรุณาเลือกจุดส่งสินค้า" />}
                />
              </Box>
              <Textarea
                // disabled
                color="purple"
                size="Regular"
                outline
                placeholder="NOTE"
                defaultValue={seleteConsignee === null ? '' : seleteConsignee.dealer_note}
                value={newNoteConsignee}
                onChange={(e) => setNewNoteConsignee(e.target.value)}
              />
            </Stack>
          </Stack>
        )}
        <Stack spacing={2} sx={{ mt: 5 }}>
          <Button onClick={() => confirmTakesOrder()}>ยืนยันการเพิ่มงาน</Button>
        </Stack>
      </Container>
    </Page>
  );
}
