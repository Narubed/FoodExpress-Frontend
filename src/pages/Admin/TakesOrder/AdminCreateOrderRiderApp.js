import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import Input from '@material-tailwind/react/Input';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import ButtonT from '@material-tailwind/react/Button';
import Label from '@material-tailwind/react/Label';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';

// material
import { LoadingButton } from '@mui/lab';
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Card,
  Table,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
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
import Scrollbar from '../../../components/Scrollbar';
import DealerCompany from '../../../components/_admin/takesorder/CreateOrderRider/DealerCompany';
import DealerRider from '../../../components/_admin/takesorder/CreateOrderRider/DealerRider';
import ConsigneeMember from '../../../components/_admin/takesorder/CreateOrderRider/ConsigneeMember';
import ConsigneeCompany from '../../../components/_admin/takesorder/CreateOrderRider/ConsigneeCompany';
import ConsigneeRider from '../../../components/_admin/takesorder/CreateOrderRider/ConsigneeRider';
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

  const [open, setOpen] = useState(false);
  const [IDCutArount, setIDCutArount] = useState();
  const [dataPostExpress, setPostExpress] = useState();

  const [RadioDealer, setRadioDealer] = useState([]);
  const [RadioConsignee, setRadioConsignee] = useState([]);

  const RegisterSchema = Yup.object().shape({
    product_amount: Yup.number().required('product_amount is required')
  });
  dispatch({ type: 'OPEN' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const ProductType = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getJoinProductType`);
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
    const filterProductID = ProductType.filter((f) => f.productName === SelectProducts.productName);
    const data = {
      id_order_rider_id: orderRiderId,
      order_rider_id: localStorage.getItem('rider_id'),
      order_rider_product_id: filterProductID[0].productid,
      order_rider_product_name: SelectProducts.productName,
      order_rider_amount: parseInt(e.product_amount, 10),
      order_rider_currency: SelectProducts.currency,
      order_rider_dealer_type: DealersTypes,
      order_rider_dealer_name: DealersName,
      order_rider_dealer_id: DealersID[0],
      order_rider_dealer_note: NoteDealer[0],
      order_rider_consignee_type: ConsigneeType,
      order_rider_consignee_name: ConsigneeName,
      order_rider_consignee_id: ConsigneeID[0],
      order_rider_consignee_note: NodeConsignee[0],
      order_rider_status: 'ไรเดอร์รับมอบหมายงานแล้ว'
    };
    setPostExpress(data);
    setOpen(true);
  };
  const formik = useFormik({
    initialValues: {
      product_name: '',
      product_amount: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (e) => handleSubmits(e)
  });

  const onChangeProduct = (e) => {
    setSelectProducts(e.target.value);
  };

  const handleConfirmCutArountID = async () => {
    const getDataCutArountByID = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getByOrderCutArountID/${IDCutArount}`
    );
    if (getDataCutArountByID.data.data.length !== 0) {
      const CutArountID = getDataCutArountByID.data.data;
      const DataExpress = {
        id_order_rider_id: dataPostExpress.id_order_rider_id,
        order_rider_id: dataPostExpress.order_rider_id,
        order_rider_product_id: dataPostExpress.order_rider_product_id,
        order_rider_product_name: dataPostExpress.order_rider_product_name,
        order_rider_amount: dataPostExpress.order_rider_amount,
        order_rider_currency: dataPostExpress.order_rider_currency,
        order_rider_dealer_type: dataPostExpress.order_rider_dealer_type,
        order_rider_dealer_name: dataPostExpress.order_rider_dealer_name,
        order_rider_dealer_id: dataPostExpress.order_rider_dealer_id,
        order_rider_dealer_note: dataPostExpress.order_rider_dealer_note,
        order_rider_consignee_type: dataPostExpress.order_rider_consignee_type,
        order_rider_consignee_name: dataPostExpress.order_rider_consignee_name,
        order_rider_consignee_id: dataPostExpress.order_rider_consignee_id,
        order_rider_consignee_note: dataPostExpress.order_rider_consignee_note,
        order_rider_status: dataPostExpress.order_rider_status,
        order_rider_cut_arount_id: parseInt(CutArountID[0].cut_arount_id, 10),
        order_rider_date_cut_arount: CutArountID[0].cut_arount_date,
        order_rider_province_cut_arount: CutArountID[0].cut_arount_province
      };
      Swal.fire({
        icon: 'success',
        title: 'Confirm !',
        text: 'คุณได้เพิ่มงานให้ไรเดอร์เรียบร้อยเเล้ว.',
        timer: 2000,
        showConfirmButton: false
      });
      dispatch({ type: 'OPEN' });
      await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postRiderOrderExpress`, DataExpress);

      setTimeout(() => {
        dispatch({ type: 'TURNOFF' });
      }, 2000);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error !',
        text: 'ค้นหา รหัสที่ถูกตัดรอบนี้ไม่เจอ.',
        timer: 2000,
        showConfirmButton: false
      });
    }
    setOpen(false);
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
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
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
                          {value.productName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <TextField
                    fullWidth
                    label="จำนวนสินค้า"
                    {...getFieldProps('product_amount')}
                    error={Boolean(touched.product_amount && errors.product_amount)}
                    helperText={touched.product_amount && errors.product_amount}
                  />
                  <Input
                    disabled
                    // color="pink"
                    size="Regular"
                    outline
                    placeholder="สกุลสินค้า"
                    defaultValue={SelectProducts === null ? '' : SelectProducts.currency}
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

      <Dialog open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}>
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
          <Button color="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="secondary" onClick={() => handleConfirmCutArountID()}>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
