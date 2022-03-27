import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import Swal from 'sweetalert2';
import axios from 'axios';
import Input from '@material-tailwind/react/Input';
// material
import { LoadingButton } from '@mui/lab';
import {
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
// companent
import Page from '../../../components/Page';
import DealerCompany from '../../../components/_admin/takesorder/CreateOrderRider/DealerCompany';
import DealerRider from '../../../components/_admin/takesorder/CreateOrderRider/DealerRider';
import ConsigneeMember from '../../../components/_admin/takesorder/CreateOrderRider/ConsigneeMember';
import ConsigneeCompany from '../../../components/_admin/takesorder/CreateOrderRider/ConsigneeCompany';
import ConsigneeRider from '../../../components/_admin/takesorder/CreateOrderRider/ConsigneeRider';
import postActionAdmin from '../../../utils/postActionAdmin';
// ----------------------------------------------------------------------

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function RegisterForm() {
  const dispatch = useDispatch();
  const [showModalSelectAddress, setModalSelectAddress] = useState(false);
  const [ProductType, setProductType] = useState([]);

  const [SelectProducts, setSelectProducts] = useState(null);

  const [Dealer, setDealer] = useState([]);
  const [SelectDealer, setSelectDealer] = useState(null);
  const [TextDealer, setTextDealer] = useState('');

  const [Consignee, setConsignee] = useState([]); // ทั้งหมด
  const [SelectConsignee, setSelectConsignee] = useState(null); // เลือกที่จะจัดส่งเเล้ว
  const [TextConsignee, setTextConsignee] = useState('');

  const [open, setOpen] = useState(true);
  const [IDCutArount, setIDCutArount] = useState();
  const [dataPostExpress, setPostExpress] = useState();

  const [RadioDealer, setRadioDealer] = useState([]);
  const [RadioConsignee, setRadioConsignee] = useState([]);

  dispatch({ type: 'OPEN' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const ProductType = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getJoinOrder_detail_cutarount`
    );
    setProductType(ProductType.data.data);
  }, []);
  dispatch({ type: 'TURNOFF' });
  const handleSubmits = async (e) => {
    let DealersName = null;
    let DealersTypes = null;
    const DealersID = [];
    const NoteDealer = [];
    let ConsigneeName = null;
    let ConsigneeType = null;
    const ConsigneeID = [];
    const NodeConsignee = [];
    if (RadioDealer === 'company') {
      DealersTypes = 'company';
      DealersName = SelectDealer.company_name;
      DealersID.push(SelectDealer.company_id);
      NoteDealer.push(SelectDealer.company_address);
    } else {
      DealersTypes = 'rider';
      DealersName = SelectDealer.rider_first_name;
      DealersID.push(SelectDealer.rider_id);
      NoteDealer.push(TextDealer);
    }
    // if ที่ 2
    if (RadioConsignee === 'company') {
      ConsigneeID.push(SelectConsignee.company_id);
      NodeConsignee.push(SelectConsignee.company_address);
      ConsigneeType = 'company';
      ConsigneeName = SelectConsignee.company_name;
    } else if (RadioConsignee === 'rider') {
      ConsigneeID.push(SelectConsignee.rider_id);
      NodeConsignee.push(TextConsignee);
      ConsigneeType = 'rider';
      ConsigneeName = SelectConsignee.rider_first_name;
    } else {
      ConsigneeID.push(SelectConsignee.userId);
      NodeConsignee.push(SelectConsignee.address);
      ConsigneeType = 'member';
      ConsigneeName = SelectConsignee.firstname;
    }
    const orderRiderId = Date.now() + localStorage.getItem('rider_id') + 12;
    // const filterProductID = ProductType.filter((f) => f.productName === SelectProducts.productName);
    const data = {
      id_order_rider_id: orderRiderId,
      order_rider_id: localStorage.getItem('rider_id'),
      order_rider_product_id: SelectProducts.order_product_id,
      order_rider_product_name: SelectProducts.order_product_name,
      order_rider_amount: SelectProducts.order_product_amoumt,
      order_rider_currency: SelectProducts.order_product_currency,
      order_rider_dealer_type: DealersTypes,
      order_rider_dealer_name: DealersName,
      order_rider_dealer_id: DealersID[0],
      order_rider_dealer_note: NoteDealer[0],
      order_rider_consignee_type: ConsigneeType,
      order_rider_consignee_name: ConsigneeName,
      order_rider_consignee_id: ConsigneeID[0],
      order_rider_consignee_note: NodeConsignee[0],
      order_rider_status: 'ไรเดอร์รับมอบหมายงานแล้ว',
      order_rider_cut_arount_id: parseInt(ProductType[0].cut_arount_id, 10),
      order_rider_date_cut_arount: ProductType[0].cut_arount_date,
      order_rider_province_cut_arount: ProductType[0].cut_arount_province
    };
    const dataReport = `ชื่อสินค้า ${data.order_rider_product_name} จำนวน ${data.order_rider_amount}
    ${data.order_rider_currency} ผู้นำจ่าย ${data.order_rider_consignee_type} ชื่อ${
      data.order_rider_consignee_name
    } ที่อยู่/note: ${data.order_rider_dealer_note}
    ผู้รับสินค้า ${data.order_rider_consignee_type} ชื่อ ${
      data.order_rider_consignee_name
    } ที่อยู่/note: ${data.order_rider_consignee_note} 
    ชื่อไรเดอร์ที่รับงาน${localStorage.getItem('rider_first_name')} ${localStorage.getItem(
      'rider_last_name'
    )}
    `;
    const postReportAdmin = {
      id_report_action_admin: data.id_order_rider_id + sessionStorage.getItem('user'),
      report_action_admin_id: sessionStorage.getItem('user'),
      report_action_order_id: data.id_order_rider_id,
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
        Swal.fire({
          icon: 'success',
          title: 'Confirm !',
          text: 'คุณได้เพิ่มงานให้ไรเดอร์เรียบร้อยเเล้ว.',
          timer: 2000,
          showConfirmButton: false
        });
        dispatch({ type: 'OPEN' });
        postActionAdmin(postReportAdmin);
        await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postRiderOrderExpress`, data);

        setTimeout(() => {
          dispatch({ type: 'TURNOFF' });
        }, 2000);
      }
    });
  };
  const formik = useFormik({
    onSubmit: (e) => handleSubmits(e)
  });

  const onChangeProduct = (e) => {
    setSelectProducts(e.target.value);
  };

  // const handleConfirmCutArountID = async () => {
  //   const getDataCutArountByID = await axios.get(
  //     `${process.env.REACT_APP_WEB_BACKEND}/getByOrderCutArountID/${IDCutArount}`
  //   );
  //   if (getDataCutArountByID.data.data.length !== 0) {
  //     const CutArountID = getDataCutArountByID.data.data;
  //     const DataExpress = {
  //       id_order_rider_id: dataPostExpress.id_order_rider_id,
  //       order_rider_id: dataPostExpress.order_rider_id,
  //       order_rider_product_id: dataPostExpress.order_rider_product_id,
  //       order_rider_product_name: dataPostExpress.order_rider_product_name,
  //       order_rider_amount: dataPostExpress.order_rider_amount,
  //       order_rider_currency: dataPostExpress.order_rider_currency,
  //       order_rider_dealer_type: dataPostExpress.order_rider_dealer_type,
  //       order_rider_dealer_name: dataPostExpress.order_rider_dealer_name,
  //       order_rider_dealer_id: dataPostExpress.order_rider_dealer_id,
  //       order_rider_dealer_note: dataPostExpress.order_rider_dealer_note,
  //       order_rider_consignee_type: dataPostExpress.order_rider_consignee_type,
  //       order_rider_consignee_name: dataPostExpress.order_rider_consignee_name,
  //       order_rider_consignee_id: dataPostExpress.order_rider_consignee_id,
  //       order_rider_consignee_note: dataPostExpress.order_rider_consignee_note,
  //       order_rider_status: dataPostExpress.order_rider_status,
  //       order_rider_cut_arount_id: parseInt(CutArountID[0].cut_arount_id, 10),
  //       order_rider_date_cut_arount: CutArountID[0].cut_arount_date,
  //       order_rider_province_cut_arount: CutArountID[0].cut_arount_province
  //     };
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Confirm !',
  //       text: 'คุณได้เพิ่มงานให้ไรเดอร์เรียบร้อยเเล้ว.',
  //       timer: 2000,
  //       showConfirmButton: false
  //     });
  //     dispatch({ type: 'OPEN' });
  //     await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postRiderOrderExpress`, DataExpress);

  //     setTimeout(() => {
  //       dispatch({ type: 'TURNOFF' });
  //     }, 2000);
  //   } else {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error !',
  //       text: 'ค้นหา รหัสที่ถูกตัดรอบนี้ไม่เจอ.',
  //       timer: 2000,
  //       showConfirmButton: false
  //     });
  //   }
  //   setOpen(false);
  // };
  const getProductByIDCutArount = async () => {
    const filterStatusOrder = ProductType.filter(
      (f) => f.order_company_status === 'ตัดรอบการจัดส่งแล้ว'
    );
    const filterCutArount = filterStatusOrder.filter((f) => f.cut_arount_id === IDCutArount);
    if (filterCutArount.length === 0) {
      setOpen(false);
      Swal.fire({
        icon: 'warning',
        title: 'ไม่มีเลขตัดรอบนี้',
        showConfirmButton: false,
        timer: 2000
      });
      setTimeout(() => {
        setOpen(true);
      }, 2000);
    } else {
      const filteredsCutArount = [];
      filterCutArount.forEach((element) => {
        const idx = filteredsCutArount.findIndex(
          (value) => value.order_product_id === element.order_product_id
        );
        if (idx !== -1) {
          filteredsCutArount[idx].order_product_amoumt += element.order_product_amoumt;
        } else if (idx === -1) {
          filteredsCutArount.push(element);
        }
      });
      setProductType(filteredsCutArount);
      setOpen(false);
      // setOpen(false); IDCutArount
    }
    // setOpen(false); IDCutArount
    // console.log(filterCutArount);
  };
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <>
      <Page title="เพิ่มงานให้ไรเดอร์ | FoodExpress">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              เพิ่มงานให้ไรเดอร์
            </Typography>
          </Stack>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmits}>
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
                    <TextField
                      id="outlined-select-currency"
                      select
                      label="ชื่อสินค้า"
                      value={SelectProducts}
                      onChange={(e) => onChangeProduct(e)}
                      // {...getFieldProps('product_name')}
                      error={Boolean(touched.product_name && errors.product_name)}
                      helperText={touched.product_name && errors.product_name}
                    >
                      {ProductType.map((value) => (
                        <MenuItem key={value.productid} value={value}>
                          {value.order_product_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  {/* <TextField
                    fullWidth
                    disabled
                    value={SelectProducts.order_product_amoumt}
                    label="จำนวนสินค้า"
                    {...getFieldProps('product_amount')}
                    error={Boolean(touched.product_amount && errors.product_amount)}
                    helperText={touched.product_amount && errors.product_amount}
                  /> */}
                  <Input
                    disabled
                    // color="pink"
                    size="Regular"
                    outline
                    placeholder="จำนวนสินค้า"
                    defaultValue={
                      SelectProducts === null ? '' : SelectProducts.order_product_amoumt
                    }
                  />
                  <Input
                    disabled
                    // color="pink"
                    size="Regular"
                    outline
                    placeholder="สกุลสินค้า"
                    defaultValue={
                      SelectProducts === null ? '' : SelectProducts.order_product_currency
                    }
                  />
                </Stack>
                <FormControl onChange={(e) => setRadioDealer(e.target.value)}>
                  <FormLabel id="demo-row-radio-buttons-group-label">ผู้นำจ่ายสินค้า</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel value="company" control={<Radio />} label="บริษัท" />
                    <FormControlLabel value="rider" control={<Radio />} label="ไรเดอร์" />
                    <FormControlLabel
                      value="disabled"
                      disabled
                      control={<Radio />}
                      label="ผู้ใช้"
                    />
                  </RadioGroup>
                </FormControl>
                {RadioDealer === 'company' ? (
                  <DealerCompany
                    Dealer={Dealer}
                    setDealer={setDealer}
                    SelectDealer={SelectDealer}
                    setSelectDealer={setSelectDealer}
                  />
                ) : (
                  <DealerRider
                    setTextDealer={setTextDealer}
                    Dealer={Dealer}
                    setDealer={setDealer}
                    SelectDealer={SelectDealer}
                    setSelectDealer={setSelectDealer}
                  />
                )}

                <FormControl onChange={(e) => setRadioConsignee(e.target.value)}>
                  <FormLabel id="demo-row-radio-buttons-group-label">ผู้รับสินค้า</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel value="member" control={<Radio />} label="ผู้ใช้" />
                    <FormControlLabel value="rider" control={<Radio />} label="ไรเดอร์" />
                    <FormControlLabel value="company" control={<Radio />} label="บริษัท" />
                  </RadioGroup>
                </FormControl>

                {/* ----------------------------------------------------------- */}
                {RadioConsignee === 'member' ? (
                  <ConsigneeMember
                    SelectConsignee={SelectConsignee}
                    setSelectConsignee={setSelectConsignee}
                    Consignee={Consignee}
                    setConsignee={setConsignee}
                    setModalSelectAddress={setModalSelectAddress}
                    showModalSelectAddress={showModalSelectAddress}
                  />
                ) : null}
                {RadioConsignee === 'company' ? (
                  <ConsigneeCompany
                    SelectConsignee={SelectConsignee}
                    setSelectConsignee={setSelectConsignee}
                    Consignee={Consignee}
                    setConsignee={setConsignee}
                  />
                ) : null}
                {RadioConsignee === 'rider' ? (
                  <ConsigneeRider
                    setTextConsignee={setTextConsignee}
                    SelectConsignee={SelectConsignee}
                    setSelectConsignee={setSelectConsignee}
                    Consignee={Consignee}
                    setConsignee={setConsignee}
                  />
                ) : null}

                {/* -------------------------------------------------------------------------------------------------------------------------- */}

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  ยืนยันการเพิ่มงาน
                </LoadingButton>
              </Stack>
            </Form>
          </FormikProvider>
        </Container>
      </Page>

      <Dialog open={open} TransitionComponent={Transition}>
        <DialogTitle>คุณต้องการเพิ่มงานให้ไรเดอร์หรือไม่</DialogTitle>
        <DialogContent>
          <DialogContentText>
            หากคุณต้องการเพิ่มงาน กรุณากรอกรหัสการตัดรอบเพื่อเก็บไว้ในรายการ
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="ID CutArount"
            type="number"
            fullWidth
            variant="standard"
            color="secondary"
            onChange={(e) => setIDCutArount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          {/* <Button color="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button> */}
          <Button onClick={() => getProductByIDCutArount()}>ยืนยัน</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
