/* eslint-disable import/no-dynamic-require */
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import Label from '@material-tailwind/react/Label';
import Image from '@material-tailwind/react/Image';
import Input from '@material-tailwind/react/Input';

// material
import { LoadingButton } from '@mui/lab';
import {
  Box,
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
  ImageList,
  ImageListItem,
  MenuItem
} from '@mui/material';
// companent
import Page from '../../../../components/Page';
// ----------------------------------------------------------------------

export default function AdminCreateMemberApp() {
  const dispatch = useDispatch();
  const [fileUserId, setfileUserId] = useState([]);
  const [filepreviewUserId, setfilepreviewUserId] = useState(null);
  const [fileBook, setfileBook] = useState([]);
  const [filepreviewBook, setfilepreviewBook] = useState(localStorage.getItem('bookBankImg'));

  const [ApiThai, setApiThai] = useState([]);
  const [ApiProvinceId, setApiProvinceId] = useState([]);

  const [ApiThaiAmphure, setgetApiThaiAmphure] = useState([]);
  const [ApiAmphureId, setApiAmphureId] = useState([]);

  const [ApiThaiTombon, setApiThaiTombon] = useState([]);
  const [ApiTombonId, setApiTombonId] = useState([]);

  const [buttonAddress, setbuttonAddress] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const tokenKey = {
      tokenKey: process.env.REACT_APP_TOKEN_KEY
    };
    const getApi = await axios.post(`${process.env.REACT_APP_WEB_GEO}/provinces`, tokenKey);
    const getApiAmphure = await axios.post(`${process.env.REACT_APP_WEB_GEO}/amphures`, tokenKey);
    const getApitombon = await axios.post(`${process.env.REACT_APP_WEB_GEO}/districts`, tokenKey);
    setApiThai(getApi.data.data);
    setgetApiThaiAmphure(getApiAmphure.data.data);
    setApiThaiTombon(getApitombon.data.data);
    Swal.fire({
      icon: 'question',
      title: 'หากข้อมูลยังไม่ขึ้น กรุณากดปุ่มเรียกข้อมูล หรือ กด F5 ครับ',
      showConfirmButton: false,
      timer: 2000
    });
  }, []);
  const RegisterSchema = Yup.object().shape({
    // Typeid: Yup.number().required('product price is required'),
    userId: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('ID is required'),
    password: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('password is required'),
    email: Yup.string().required('Email is required'),
    firstname: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('firstname is required'),
    lastname: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('lastname is required'),
    tel: Yup.number().required('tel is required'),
    bookname: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('bookname is required'),
    booknumber: Yup.number().required('booknumber is required'),
    role: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('role is required'),
    address: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('address is required'),
    map: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('map is required'),
    status: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('status is required'),
    level: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('status is required')
  });
  const handleSubmits = async (e) => {
    let filterProvince = null;
    let filterDistrict = null;
    let filterSubdistrict = null;

    if (buttonAddress) {
      const a = ApiThai.filter((e) => e.province_id === ApiProvinceId);
      const b = ApiThaiAmphure.filter((e) => e.amphur_id === ApiAmphureId);
      const c = ApiThaiTombon.filter((e) => e.district_id === ApiTombonId);
      filterProvince = a[0].province_name;
      filterDistrict = b[0].amphur_name;
      filterSubdistrict = c[0].district_name;
    } else if (!buttonAddress) {
      filterProvince = localStorage.getItem('province-name');
      filterDistrict = localStorage.getItem('district-name');
      filterSubdistrict = localStorage.getItem('subdistrict-name');
    }
    if (fileBook.length === 0 && fileUserId.length === 0) {
      const data = {
        id: parseInt(e.id, 10),
        userId: e.userId,
        password: e.password,
        email: e.email,
        firstname: e.firstname,
        lastname: e.lastname,
        tel: e.tel,
        bookname: e.bookname,
        booknumber: e.booknumber,
        role: e.role,
        address: e.address,
        subdistrict: filterSubdistrict,
        district: filterDistrict,
        province: filterProvince,
        map: e.map,
        status: e.status,
        level: e.level
      };
      Swal.fire({
        title: 'Are you sure?',
        text: 'คุณต้องการแก้ไขผู้ใช้งานหรือไม่ !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, need it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch({ type: 'OPEN' });
          await axios
            .put(`${process.env.REACT_APP_WEB_BACKEND}/member`, data)
            .then((response) => {
              console.log('response: ', response);
              // do something about response
            })
            .catch((err) => {
              console.error(err);
            });
          dispatch({ type: 'TURNOFF' });
          Swal.fire('Success!', 'คุณได้แก้ไขผู้ใช้เรียบร้อยเเล้ว.', 'success');
        }
      });
    } else if (fileBook.length === 0 && fileUserId.length !== 0) {
      const formdata = new FormData();
      formdata.append('cardImg', fileUserId);
      formdata.append('bookBankImg', e.bookBankImg);
      formdata.append('userId', e.userId);
      formdata.append('password', e.password);
      formdata.append('email', e.email);
      formdata.append('firstname', e.firstname);
      formdata.append('lastname', e.lastname);
      formdata.append('tel', e.tel);
      formdata.append('bookname', e.bookname);
      formdata.append('booknumber', e.booknumber);
      formdata.append('role', e.role);
      formdata.append('address', e.address);
      formdata.append('subdistrict', filterSubdistrict);
      formdata.append('district', filterDistrict);
      formdata.append('province', filterProvince);
      formdata.append('map', e.map);
      formdata.append('status', e.status);
      formdata.append('level', e.level);
      Swal.fire({
        title: 'Are you sure?',
        text: 'คุณต้องการแก้ไขผู้ใช้งานหรือไม่ !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่ ฉันต้องการเเก้ไข!',
        cancelButtonText: 'ยกเลิก!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch({ type: 'OPEN' });
          await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postMemberCardImg`, formdata);
          await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/memberId/${e.id}`);
          await axios.delete(
            `${process.env.REACT_APP_WEB_BACKEND}/deleteimage/${localStorage.getItem('cardImg')}`
          );
          Swal.fire('Success!', 'คุณได้แก้ไขผู้ใช้เรียบร้อยเเล้ว.', 'success');
          setTimeout(() => {
            dispatch({ type: 'TURNOFF' });
            window.localStorage.clear();
            window.history.back();
          }, 1500);
        }
      });
    } else if (fileBook.length !== 0 && fileUserId.length === 0) {
      const formdata = new FormData();
      formdata.append('cardImg', e.cardImg);
      formdata.append('bookBankImg', fileBook);
      formdata.append('userId', e.userId);
      formdata.append('password', e.password);
      formdata.append('email', e.email);
      formdata.append('firstname', e.firstname);
      formdata.append('lastname', e.lastname);
      formdata.append('tel', e.tel);
      formdata.append('bookname', e.bookname);
      formdata.append('booknumber', e.booknumber);
      formdata.append('role', e.role);
      formdata.append('address', e.address);
      formdata.append('subdistrict', filterSubdistrict);
      formdata.append('district', filterDistrict);
      formdata.append('province', filterProvince);
      formdata.append('map', e.map);
      formdata.append('status', e.status);
      formdata.append('level', e.level);
      Swal.fire({
        title: 'Are you sure?',
        text: 'คุณต้องการแก้ไขผู้ใช้งานหรือไม่ !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch({ type: 'OPEN' });
          await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postMemberBookBankImg`, formdata);
          await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/memberId/${e.id}`);
          await axios.delete(
            `${process.env.REACT_APP_WEB_BACKEND}/deleteimage/${localStorage.getItem(
              'bookBankImg'
            )}`
          );
          Swal.fire({
            icon: 'success',
            title: 'คุณได้แก้ไขผู้ใช้เรียบร้อยเเล้ว',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => {
            dispatch({ type: 'TURNOFF' });
            window.localStorage.clear();
            window.history.back();
          }, 1500);
        }
      });
    } else {
      const formdata = new FormData();
      formdata.append('cardImg', fileUserId);
      formdata.append('bookBankImg', fileBook);
      formdata.append('userId', e.userId);
      formdata.append('password', e.password);
      formdata.append('email', e.email);
      formdata.append('firstname', e.firstname);
      formdata.append('lastname', e.lastname);
      formdata.append('tel', e.tel);
      formdata.append('bookname', e.bookname);
      formdata.append('booknumber', e.booknumber);
      formdata.append('role', e.role);
      formdata.append('address', e.address);
      formdata.append('subdistrict', filterSubdistrict);
      formdata.append('district', filterDistrict);
      formdata.append('province', filterProvince);
      formdata.append('map', e.map);
      formdata.append('status', e.status);
      formdata.append('level', e.level);
      Swal.fire({
        title: 'Are you sure?',
        text: 'คุณต้องการแก้ไขผู้ใช้งานหรือไม่ !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่ ฉันต้องการเเก้ไข!',
        cancelButtonText: 'ยกเลิก!'
      }).then(async (result) => {
        if (fileUserId.length === 0 || fileBook.length === 0) {
          Swal.fire(
            'เราคิดว่าคุณกรอกข้อมูลไม่ครบ?',
            'ลองเช็คที่ไฟล์รูปภาพ หรือ ที่อยู่ ของคุณอีกครั้ง?',
            'question'
          );
        } else if (result.isConfirmed) {
          dispatch({ type: 'OPEN' });
          await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/member`, formdata);
          await axios.delete(`${process.env.REACT_APP_WEB_BACKEND}/memberId/${e.id}`);
          await axios.delete(
            `${process.env.REACT_APP_WEB_BACKEND}/deleteimage/${localStorage.getItem('cardImg')}`
          );
          await axios.delete(
            `${process.env.REACT_APP_WEB_BACKEND}/deleteimage/${localStorage.getItem(
              'bookBankImg'
            )}`
          );
          Swal.fire({
            icon: 'success',
            title: 'คุณได้แก้ไขผู้ใช้เรียบร้อยเเล้ว',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => {
            dispatch({ type: 'TURNOFF' });
            window.localStorage.clear();
            window.history.back();
          }, 1500);
        }
      });
    }
  };
  const formik = useFormik({
    initialValues: {
      id: localStorage.getItem('id'),
      password: localStorage.getItem('password'),
      email: localStorage.getItem('email'),
      firstname: localStorage.getItem('firstname'),
      lastname: localStorage.getItem('lastname'),
      tel: localStorage.getItem('tel'),
      bookname: localStorage.getItem('bookname'),
      booknumber: localStorage.getItem('booknumber'),
      role: localStorage.getItem('role'),
      address: localStorage.getItem('address'),
      subdistrict: localStorage.getItem('subdistrict'),
      district: localStorage.getItem('district'),
      province: localStorage.getItem('province'),
      map: localStorage.getItem('map'),
      userId: localStorage.getItem('userId'),
      status: localStorage.getItem('status'),
      bookBankImg: localStorage.getItem('bookBankImg'), // img
      cardImg: localStorage.getItem('cardImg'), // img
      level: localStorage.getItem('level')
    },
    validationSchema: RegisterSchema,
    onSubmit: (e) => handleSubmits(e)
  });
  const handleInputChangeUserId = async (event) => {
    setfileUserId(event.target.files[0] ? event.target.files[0] : []);
    setfilepreviewUserId(event.target.files[0] ? URL.createObjectURL(event.target.files[0]) : null);
  };
  const handleInputChangeBook = async (event) => {
    setfileBook(event.target.files[0] ? event.target.files[0] : []);
    setfilepreviewBook(event.target.files[0] ? URL.createObjectURL(event.target.files[0]) : null);
  };
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="แก้ไขผู้ใช้ | FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            แก้ไขผู้ใช้
          </Typography>
          <Button onClick={() => window.location.reload(false)}>เรียกช้อมูล</Button>
        </Stack>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="บัตรประจำตัวประชาชน"
                  {...getFieldProps('userId')}
                  error={Boolean(touched.userId && errors.userId)}
                  helperText={touched.userId && errors.userId}
                  disabled
                />
                <TextField
                  fullWidth
                  autoComplete="password"
                  label="Password"
                  {...getFieldProps('password')}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="ชื่อ"
                  {...getFieldProps('firstname')}
                  error={Boolean(touched.firstname && errors.firstname)}
                  helperText={touched.firstname && errors.firstname}
                />
                <TextField
                  fullWidth
                  autoComplete="lastname"
                  label="นามสกุล"
                  {...getFieldProps('lastname')}
                  error={Boolean(touched.lastname && errors.lastname)}
                  helperText={touched.lastname && errors.lastname}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="email"
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  fullWidth
                  autoComplete="tel"
                  label="เบอร์โทรศัพท์"
                  {...getFieldProps('tel')}
                  error={Boolean(touched.tel && errors.tel)}
                  helperText={touched.tel && errors.tel}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="ชื่อบัญชีธนาคาร"
                  {...getFieldProps('bookname')}
                  error={Boolean(touched.bookname && errors.bookname)}
                  helperText={touched.bookname && errors.bookname}
                />
                <TextField
                  fullWidth
                  autoComplete="booknumber"
                  label="เลขบัญชีธนาคาร"
                  {...getFieldProps('booknumber')}
                  error={Boolean(touched.booknumber && errors.booknumber)}
                  helperText={touched.booknumber && errors.booknumber}
                />
              </Stack>
              {/* // ----------------------------------- */}
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
                    // size="xl"
                    label="role"
                    // onChange={handleChange}
                    {...getFieldProps('role')}
                    error={Boolean(touched.role && errors.role)}
                    helperText={touched.role && errors.role}
                  >
                    <MenuItem key={2} value="Member">
                      Member
                    </MenuItem>
                    <MenuItem key={1} value="Admin" disabled>
                      Admin
                    </MenuItem>

                    <MenuItem key={3} value="Rider" disabled>
                      Rider
                    </MenuItem>
                  </TextField>
                </Box>
                <TextField
                  fullWidth
                  autoComplete="address"
                  label="address"
                  {...getFieldProps('address')}
                  error={Boolean(touched.address && errors.address)}
                  helperText={touched.address && errors.address}
                />
              </Stack>{' '}
              <Label color="blueGray">
                {buttonAddress ? (
                  <Button onClick={() => setbuttonAddress(false)}>ยกเลิกแก้ไขที่อยู่</Button>
                ) : (
                  <Button onClick={() => setbuttonAddress(true)}>แก้ไขที่อยู่</Button>
                )}
              </Label>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { mr: 20, width: '100%' }
                  }}
                  noValidate
                  autoComplete="off"
                >
                  {buttonAddress ? (
                    <TextField
                      id="outlined-select-currency"
                      select
                      label="จังหวัด"
                      value={ApiProvinceId}
                      onChange={(e) => setApiProvinceId(e.target.value)}
                    >
                      {ApiThai.map((option) => (
                        <MenuItem key={option.province_id} value={option.province_id}>
                          {option.province_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <Input
                      class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="text"
                      placeholder="จังหวัด"
                      aria-label="Full name"
                      defaultValue={localStorage.getItem('province-name')}
                      disabled
                    />
                  )}
                </Box>

                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { mr: 20, width: '100%' }
                  }}
                  noValidate
                  autoComplete="off"
                >
                  {buttonAddress ? (
                    <TextField
                      id="outlined-select-currency"
                      select
                      // size="xl"
                      label="อำเภอ"
                      value={ApiAmphureId}
                      onChange={(e) => setApiAmphureId(e.target.value)}
                    >
                      {ApiThaiAmphure.filter((value) => value.province_id === ApiProvinceId).map(
                        (option) => (
                          <MenuItem key={option.amphur_id} value={option.amphur_id}>
                            {option.amphur_name}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  ) : (
                    <Input
                      class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="text"
                      placeholder="อำเภอ"
                      aria-label="Full name"
                      defaultValue={localStorage.getItem('district-name')}
                      disabled
                    />
                  )}
                </Box>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { mr: 20, width: '100%' }
                  }}
                  noValidate
                  autoComplete="off"
                >
                  {buttonAddress ? (
                    <TextField
                      id="outlined-select-currency"
                      select
                      // size="xl"
                      label="ตำบล"
                      value={ApiTombonId}
                      onChange={(e) => setApiTombonId(e.target.value)}
                    >
                      {ApiThaiTombon.filter((value) => value.amphur_id === ApiAmphureId).map(
                        (option) => (
                          <MenuItem key={option.district_id} value={option.district_id}>
                            {option.district_name}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  ) : (
                    <Input
                      class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="text"
                      placeholder="ตำบล"
                      aria-label="Full name"
                      defaultValue={localStorage.getItem('subdistrict-name')}
                      disabled
                    />
                  )}
                </Box>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { mr: 30, width: '100%' }
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="outlined-select-currency"
                    select
                    // size="xl"
                    label="สถานะ"
                    {...getFieldProps('status')}
                    error={Boolean(touched.status && errors.status)}
                    helperText={touched.status && errors.status}
                  >
                    <MenuItem key={1} value="Active">
                      Active
                    </MenuItem>
                    <MenuItem key={2} value="Offline">
                      Offline
                    </MenuItem>
                    <MenuItem key={3} value="Inactive" disabled>
                      Inactive
                    </MenuItem>
                  </TextField>
                </Box>
                <TextField
                  fullWidth
                  autoComplete="map"
                  label="แผนที่"
                  {...getFieldProps('map')}
                  error={Boolean(touched.map && errors.map)}
                  helperText={touched.map && errors.map}
                />
              </Stack>
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { mr: 30, width: '100%' }
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-select-currency"
                  select
                  label="ระดับของผู้ใช้งาน"
                  {...getFieldProps('level')}
                  error={Boolean(touched.level && errors.level)}
                  helperText={touched.level && errors.level}
                >
                  <MenuItem key={1} value="subdistrict">
                    ระดับตำบล
                  </MenuItem>
                  <MenuItem key={2} value="district">
                    ระดับอำเภอ
                  </MenuItem>
                  <MenuItem key={3} value="province">
                    ระดับจังหวัด
                  </MenuItem>
                </TextField>
              </Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Label color="red">**รูปบัตรประจำตัวประชาชน** </Label>
                <TextField
                  type="file"
                  className="form-control"
                  autoComplete="fileUserId"
                  name="upload_file"
                  onChange={handleInputChangeUserId}
                  error={Boolean(touched.fileUserId && errors.fileUserId)}
                  helperText={touched.fileUserId && errors.fileUserId}
                />
                <Label color="blue">**รูปบัญชีธนาคาร** </Label>
                <TextField
                  type="file"
                  className="form-control"
                  autoComplete="fileBook"
                  name="upload_file"
                  onChange={handleInputChangeBook}
                  error={Boolean(touched.fileBook && errors.fileBook)}
                  helperText={touched.fileBook && errors.fileBook}
                />
              </Stack>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                ยืนยันการเพิ่มข้อมูล
              </LoadingButton>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {fileUserId.length !== 0 ? (
                  <ImageList sx={{ width: 1080, height: 450 }} cols={1} rowHeight={164}>
                    <Image className="previewimg" src={filepreviewUserId} alt="UploadImage" />
                  </ImageList>
                ) : (
                  <ImageList sx={{ width: 1080, height: 450 }} cols={1} rowHeight={164}>
                    <Image
                      className="previewimg"
                      src={
                        localStorage.getItem('cardImg')
                          ? `${process.env.REACT_APP_DRIVE_SELECT_IMAGE}${localStorage.getItem(
                              'cardImg'
                            )}`
                          : null
                        // eslint-disable-next-line global-require
                        // require(`../../../../assets/img/${localStorage.getItem('cardImg')}`)
                        //   .default
                      }
                      alt="UploadImage"
                    />
                  </ImageList>
                )}
                {fileBook.length !== 0 ? (
                  <ImageList sx={{ width: 1080, height: 450 }} cols={1} rowHeight={164}>
                    <Image className="previewimg" src={filepreviewBook} alt="UploadImage" />
                  </ImageList>
                ) : (
                  <ImageList sx={{ width: 1080, height: 450 }} cols={1} rowHeight={164}>
                    <Image
                      className="previewimg"
                      src={
                        localStorage.getItem('bookBankImg')
                          ? `${process.env.REACT_APP_DRIVE_SELECT_IMAGE}${localStorage.getItem(
                              'bookBankImg'
                            )}`
                          : // eslint-disable-next-line global-require
                            // require(`../../../../assets/img/${localStorage.getItem('bookBankImg')}`)
                            //   .default
                            null
                      }
                      alt="UploadImage"
                    />
                  </ImageList>
                )}
              </Stack>
            </Stack>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
