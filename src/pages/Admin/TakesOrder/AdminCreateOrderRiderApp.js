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
  Slide
} from '@mui/material';
// companent
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
// ----------------------------------------------------------------------

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function RegisterForm() {
  const dispatch = useDispatch();
  const [showModalSelectAddress, setModalSelectAddress] = useState(false);
  const [ProductType, setProductType] = useState([]);
  const [Company, setCompany] = useState([]);
  const [SelectCompany, setSelectCompany] = useState(null);

  const [Members, setMembers] = useState([]); // ทั้งหมด
  const [SelectMembers, setSelectMembers] = useState(null); // เลือกที่จะจัดส่งเเล้ว
  const [AllProvinceMember, setAllProvinceMember] = useState([]); // จังหวัดทั้งหมด
  const [provinceMember, setprovinceMember] = useState([]); // จังหวัดทั้งหมด
  const [SelectprovinceMember, setSelectprovinceMember] = useState([]); // ค่าที่ถูก Select แล้ว

  const [open, setOpen] = useState(false);
  const [IDCutArount, setIDCutArount] = useState();
  const [dataPostExpress, setPostExpress] = useState();
  const RegisterSchema = Yup.object().shape({
    product_name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('product_name is required'),
    product_amount: Yup.number().required('product_amount is required')
  });
  dispatch({ type: 'OPEN' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const ProductType = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getJoinProductType`);
    const Company = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllCompany`);
    const Members = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/members`);
    const filteredsProvinceMember = [];
    Members.data.data.forEach((item) => {
      const idx = filteredsProvinceMember.findIndex((value) => value.province === item.province);
      if (idx === -1) {
        filteredsProvinceMember.push(item);
      }
    });
    setAllProvinceMember(filteredsProvinceMember);
    setProductType(ProductType.data.data);
    setCompany(Company.data.data);
    setMembers(Members.data.data);
  }, []);
  dispatch({ type: 'TURNOFF' });
  const handleSubmits = async (e) => {
    const orderRiderId = Date.now() + localStorage.getItem('rider_id') + SelectCompany.company_id;
    const filterProductID = ProductType.filter((f) => f.productName === e.product_name);
    const data = {
      id_order_rider_id: orderRiderId,
      order_rider_id: localStorage.getItem('rider_id'),
      order_rider_product_id: filterProductID[0].productid,
      order_rider_product_name: e.product_name,
      order_rider_Amount: e.product_amount,
      order_rider_company_name: SelectCompany.company_name,
      order_rider_company_company_address: SelectCompany.company_address,
      order_rider_member_userid: SelectMembers.userId,
      order_rider_member_address: SelectMembers.address,
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

  const onChangeCompany = (e) => {
    setSelectCompany(e.target.value);
  };
  const onChangeProvinceMember = (e) => {
    const filterProvinceMembers = Members.filter((f) => f.province === e.target.value);
    setprovinceMember(e.target.value);
    setSelectprovinceMember(filterProvinceMembers);
  };
  const confirmMemberAddress = (data) => {
    setSelectMembers(data);
    setModalSelectAddress(false);
  };

  const handleConfirmCutArountID = async () => {
    dispatch({ type: 'OPEN' });
    const getDataCutArountByID = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getByOrderCutArountID/${IDCutArount}`
    );
    dispatch({ type: 'TURNOFF' });
    if (getDataCutArountByID.data.data.length !== 0) {
      const CutArountID = getDataCutArountByID.data.data;
      const DataExpress = {
        id_order_rider_id: dataPostExpress.id_order_rider_id,
        order_rider_id: dataPostExpress.order_rider_id,
        order_rider_product_id: dataPostExpress.order_rider_product_id,
        order_rider_product_name: dataPostExpress.order_rider_product_name,
        order_rider_Amount: dataPostExpress.order_rider_Amount,
        order_rider_company_name: dataPostExpress.order_rider_company_name,
        order_rider_company_company_address: dataPostExpress.order_rider_company_company_address,
        order_rider_member_userid: dataPostExpress.order_rider_member_userid,
        order_rider_member_address: dataPostExpress.order_rider_member_address,
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
                      {...getFieldProps('product_name')}
                      error={Boolean(touched.product_name && errors.product_name)}
                      helperText={touched.product_name && errors.product_name}
                    >
                      {ProductType.map((value) => (
                        <MenuItem key={value.productid} value={value.productName}>
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
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Box
                    component="form"
                    sx={{
                      '& .MuiTextField-root': { mr: 40, width: '100%' }
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField
                      id="outlined-select-currency"
                      select
                      label="ค้นหาบริษัท"
                      value={SelectCompany}
                      // {...getFieldProps('company_name')}
                      // onChange={(e) => setSelectCompany(e.target.value)}
                      onChange={(e) => onChangeCompany(e)}
                      error={Boolean(touched.company_name && errors.company_name)}
                      helperText={touched.company_name && errors.company_name}
                    >
                      {Company.map((value) => (
                        <MenuItem key={value.productid} value={value}>
                          {value.company_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                  <Input
                    disabled
                    // color="pink"
                    size="Regular"
                    outline
                    placeholder="ที่อยู่บริษัท"
                    defaultValue={SelectCompany === null ? '' : SelectCompany.company_address}
                  />
                </Stack>
                {/* ----------------------------------------------------------- */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Box
                    component="form"
                    sx={{
                      '& .MuiTextField-root': { mr: 40, width: '100%' }
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <Button onClick={() => setModalSelectAddress(true)}>
                      เลือกที่อยู่ที่จะจัดส่ง
                    </Button>
                  </Box>

                  <Input
                    disabled
                    color="pink"
                    size="lg"
                    outline
                    placeholder="ที่อยู่ที่จะถูกจัดส่ง"
                    defaultValue={
                      SelectMembers === null
                        ? ''
                        : `นาย ${SelectMembers.firstname} นามสกุล ${SelectMembers.lastname} เบอร์โทรศัพท์ ${SelectMembers.tel} ที่อยู่ ${SelectMembers.address}`
                    }
                  />
                </Stack>

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

      <Dialog
        fullWidth="fullWidth"
        maxWidth="md"
        open={showModalSelectAddress}
        onClose={() => setModalSelectAddress(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>คุณต้องการเพิ่มงานให้ไรเดอร์หรือไม่</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <br />
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { mr: 40, width: '100%' }
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-select-currency"
                select
                label="ค้นหาจังหวัด"
                value={provinceMember}
                // onChange={(e) => WTFsetprovinceMember(e.target.value)}
                onChange={(e) => onChangeProvinceMember(e)}
              >
                {AllProvinceMember.map((value) => (
                  <MenuItem key={value.province} value={value.province}>
                    {value.province}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContentText>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ระดับ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ชื่อ
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ที่อยู่
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ยืนยันที่อยู่
                </th>

                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(SelectprovinceMember.length === 0 ? Members : SelectprovinceMember).map((data) => (
                <tr key={data.firstname}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {data.level === 'subdistrict' ? (
                      <Label color="lightBlue">ระดับตำบล </Label>
                    ) : null}

                    {data.level === 'district' ? <Label color="green">ระดับอำเภอ</Label> : null}

                    {data.level === 'province' ? <Label color="red">ระดับจังหวัด</Label> : null}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{data.firstname}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs">{data.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button onClick={() => confirmMemberAddress(data)}>
                      <Icon icon="mdi:truck-delivery" width={38} height={38} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setModalSelectAddress(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

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
