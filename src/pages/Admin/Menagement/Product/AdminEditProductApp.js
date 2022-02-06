/* eslint-disable import/no-dynamic-require */
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
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
  MenuItem
} from '@mui/material';
// companent
import Page from '../../../../components/Page';
// ----------------------------------------------------------------------

export default function AdminEditProductApp() {
  const [file, setfile] = useState([]);
  const [filepreview, setfilepreview] = useState(null);
  const [ProductType, setProductType] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const ProductType = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/producttypes`);
    setProductType(ProductType.data.data);
  }, []);
  const RegisterSchema = Yup.object().shape({
    Typeid: Yup.number().required('product price is required'),
    productName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('product name required'),
    productPrice: Yup.number().required('product price is required'),
    currency: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('product name required'),
    unitkg: Yup.number().required('product price is required'),
    productCost: Yup.number().required('product price is required'),
    productStetus: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('product name required')
  });
  const handleSubmits = async (e) => {
    const data = {
      productid: parseInt(e.productid, 10),
      productName: e.productName,
      productPrice: parseInt(e.productPrice, 10),
      productCost: parseInt(e.productCost, 10),
      productStetus: e.productStetus,
      typeid: parseInt(e.Typeid, 10),
      unitkg: parseInt(e.unitkg, 10),
      currency: e.currency
    };

    const formdata = new FormData();
    formdata.append('avatar', file);
    formdata.append('productName', e.productName);
    formdata.append('productPrice', e.productPrice);
    formdata.append('productCost', e.productCost);
    formdata.append('productStetus', e.productStetus);
    formdata.append('typeid', e.Typeid);
    formdata.append('unitkg', e.unitkg);
    formdata.append('currency', e.currency);
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการเพิ่มบริษัทหรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, need it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (file.length === 0) {
          const a = await axios
            .put(`${process.env.REACT_APP_WEB_BACKEND}/product`, data)
            .then((response) => {
              console.log('response: ', response);
              // do something about response
            })
            .catch((err) => {
              console.error(err);
            });
          Swal.fire('Success!', 'คุณได้แก้ไขสินค้าเรียบร้อยเเล้ว.', 'success');
          setTimeout(() => {
            window.localStorage.clear();
            window.history.back();
          }, 1500);
        } else {
          await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/imageupload`, formdata);
          await axios.delete(
            `${process.env.REACT_APP_WEB_BACKEND}/deleteimage/${localStorage.getItem('productImg')}`
          );
          await axios.delete(
            `${process.env.REACT_APP_WEB_BACKEND}/product/${localStorage.getItem('productid')}`
          );
          Swal.fire('Success!', 'คุณได้แก้ไขสินค้าเรียบร้อยเเล้ว.', 'success');
          setTimeout(() => {
            window.localStorage.clear();
            window.history.back();
          }, 1500);
        }
      }
    });
  };
  const formik = useFormik({
    initialValues: {
      productid: localStorage.getItem('productid'),
      productName: localStorage.getItem('productName'),
      productPrice: localStorage.getItem('productPrice'),
      productCost: localStorage.getItem('productCost'),
      productStetus: localStorage.getItem('productStetus'),
      productImg: localStorage.getItem('productImg'),
      productTypes: [],
      Typeid: localStorage.getItem('id'),
      unitkg: localStorage.getItem('unitkg'),
      currency: localStorage.getItem('currency')
    },
    validationSchema: RegisterSchema,
    onSubmit: (e) => handleSubmits(e)
  });
  const handleInputChange = async (event) => {
    setfile(event.target.files[0] ? event.target.files[0] : []);
    setfilepreview(event.target.files[0] ? URL.createObjectURL(event.target.files[0]) : null);
  };
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="แก้ไขข้อมูลสินค้า | FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            แก้ไขข้อมูลสินค้า
          </Typography>
        </Stack>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {' '}
              <TextField
                id="outlined-select-currency"
                select
                label="ประเภทของสินค้า"
                // defaultValue="cdcd"
                // onChange={handleChange}
                {...getFieldProps('Typeid')}
                error={Boolean(touched.Typeid && errors.Typeid)}
                helperText={touched.Typeid && errors.Typeid}
              >
                {ProductType.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.nameproducttype}
                  </MenuItem>
                ))}
              </TextField>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="ชื่อสินค้า"
                  {...getFieldProps('productName')}
                  error={Boolean(touched.productName && errors.productName)}
                  helperText={touched.productName && errors.productName}
                />
                <TextField
                  fullWidth
                  autoComplete="productPrice"
                  label="ราคาสินค้า"
                  {...getFieldProps('productPrice')}
                  error={Boolean(touched.productPrice && errors.productPrice)}
                  helperText={touched.productPrice && errors.productPrice}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="หน่วยต่อ/สกุลสินค้า (กิโลกรัม แพ็ค เซต)"
                  {...getFieldProps('currency')}
                  error={Boolean(touched.currency && errors.currency)}
                  helperText={touched.currency && errors.currency}
                />
                <TextField
                  fullWidth
                  autoComplete="book_number"
                  label="หน่วยต่อหนึ่งกิโลกรัม(แพ็ค3กิโล ให้ใส่3)"
                  {...getFieldProps('unitkg')}
                  error={Boolean(touched.unitkg && errors.unitkg)}
                  helperText={touched.unitkg && errors.unitkg}
                />
              </Stack>
              <TextField
                fullWidth
                autoComplete="productCost"
                label="ราคาต้นทุนของสินค้า"
                {...getFieldProps('productCost')}
                error={Boolean(touched.productCost && errors.productCost)}
                helperText={touched.productCost && errors.productCost}
              />
              <TextField
                id="outlined-select-currency"
                select
                label="สถานะสินค้า"
                // value={selectTypeId}
                // onChange={handleChange}
                {...getFieldProps('productStetus')}
                error={Boolean(touched.productStetus && errors.productStetus)}
                helperText={touched.productStetus && errors.productStetus}
              >
                <MenuItem key={1} value="สินค้าพร้อมจำหน่าย">
                  สินค้าพร้อมจำหน่าย
                </MenuItem>
                <MenuItem key={2} value="สินค้ายังไม่พร้อมจำหน่าย">
                  สินค้ายังไม่พร้อมจำหน่าย
                </MenuItem>
                <MenuItem key={3} value="สินค้ามีไม่พอจำหน่าย" disabled>
                  สินค้ามีไม่พอจำหน่าย
                </MenuItem>
              </TextField>
              {/*  <TextField
                fullWidth
                autoComplete="company_address"
                label="ที่อยู่"
                {...getFieldProps('company_address')}
                error={Boolean(touched.company_address && errors.company_address)}
                helperText={touched.company_address && errors.company_address}
              /> */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  type="file"
                  className="form-control"
                  autoComplete="filemik"
                  name="upload_file"
                  onChange={handleInputChange}
                  error={Boolean(touched.file && errors.file)}
                  helperText={touched.file && errors.file}
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
              {filepreview !== null ? (
                <img className="previewimg" src={filepreview} alt="UploadImage" />
              ) : (
                <img
                  className="previewimg"
                  src={
                    // eslint-disable-next-line global-require
                    require(`../../../../assets/img/${localStorage.getItem('productImg')}`).default
                  }
                  alt="UploadImage"
                />
              )}
            </Stack>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
