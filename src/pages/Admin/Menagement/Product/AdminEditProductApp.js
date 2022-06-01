/* eslint-disable import/no-dynamic-require */
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik, Form, FormikProvider } from 'formik';
import Swal from 'sweetalert2';
import axios from 'axios';
// material
import { LoadingButton } from '@mui/lab';
import { Stack, TextField, Container, Typography, MenuItem } from '@mui/material';
// companent
import Page from '../../../../components/Page';
// ----------------------------------------------------------------------

export default function AdminEditProductApp() {
  const dispatch = useDispatch();
  const [file, setfile] = useState([]);
  const [filepreview, setfilepreview] = useState(null);
  const [ProductType, setProductType] = useState([]);
  const [onProductPrice, setonProductPrice] = useState(localStorage.getItem('productPrice'));
  const [onProductCost, setonProductCost] = useState(localStorage.getItem('productCost'));

  dispatch({ type: 'OPEN' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const ProductType = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/producttypes`);
    setProductType(ProductType.data.data);
  }, []);
  dispatch({ type: 'TURNOFF' });
  const RegisterSchema = Yup.object().shape({
    Typeid: Yup.number().required('product price is required'),
    productName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('product name required'),
    // productPrice: Yup.number().required('product price is required'),
    currency: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('product name required'),
    unitkg: Yup.number().required('product price is required'),
    // productCost: Yup.number().required('product price is required'),
    productStetus: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('product name required'),
    percent_NBA: Yup.number().required('กำหนดเปอร์เซ็นใหม่ด้วย')
  });
  const handleSubmits = async (e) => {
    const data = {
      productid: parseInt(e.productid, 10),
      productName: e.productName,
      productPrice: onProductPrice,
      productCost: onProductCost,
      productStetus: e.productStetus,
      typeid: parseInt(e.Typeid, 10),
      unitkg: e.unitkg,
      currency: e.currency,
      percent_service: ((onProductPrice * 100) / 107 - onProductCost - e.percent_NBA).toFixed(3),
      percent_NBA: e.percent_NBA
    };

    const formdata = new FormData();
    formdata.append('avatar', file);
    formdata.append('productid', parseInt(e.productid, 10));
    formdata.append('productName', e.productName);
    formdata.append('productPrice', onProductPrice);
    formdata.append('productCost', onProductCost);
    formdata.append('productStetus', e.productStetus);
    formdata.append('typeid', e.Typeid);
    formdata.append('unitkg', e.unitkg);
    formdata.append('currency', e.currency);
    formdata.append(
      'percent_service',
      ((onProductPrice * 100) / 107 - onProductCost - e.percent_NBA).toFixed(3)
    );
    formdata.append('percent_NBA', e.percent_NBA);

    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการแก้ไขสินค้าหรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (file.length === 0) {
          dispatch({ type: 'OPEN' });
          await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/product`, data);
          dispatch({ type: 'TURNOFF' });
          Swal.fire({
            icon: 'success',
            title: 'คุณได้แก้ไขสินค้าเรียบร้อยเเล้ว',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => {
            window.localStorage.clear();
            window.history.back();
          }, 1500);
        } else {
          dispatch({ type: 'OPEN' });
          await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putImageProduct`, formdata);
          // await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/imageupload`, formdata);
          await axios.delete(
            `${process.env.REACT_APP_WEB_BACKEND}/deleteimage/${localStorage.getItem('productImg')}`
          );
          // await axios.delete(
          //   `${process.env.REACT_APP_WEB_BACKEND}/product/${localStorage.getItem('productid')}`
          // );
          dispatch({ type: 'TURNOFF' });
          Swal.fire({
            icon: 'success',
            title: 'คุณได้แก้ไขสินค้าเรียบร้อยเเล้ว',
            showConfirmButton: false,
            timer: 1500
          });
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
      currency: localStorage.getItem('currency'),
      percent_NBA: localStorage.getItem('percent_NBA')
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
              <TextField
                fullWidth
                label="ชื่อสินค้า"
                {...getFieldProps('productName')}
                error={Boolean(touched.productName && errors.productName)}
                helperText={touched.productName && errors.productName}
              />
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
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  autoComplete="productPrice"
                  label="ราคาสินค้า(ราคาขาย)"
                  value={onProductPrice}
                  onChange={(e) => setonProductPrice(e.target.value)}
                  // {...getFieldProps('productPrice')}
                />
                <TextField
                  fullWidth
                  autoComplete="productCost"
                  label="ราคาต้นทุนของสินค้า"
                  value={onProductCost}
                  onChange={(e) => setonProductCost(e.target.value)}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <TextField
                  disabled
                  fullWidth
                  label="VAT"
                  value={((onProductPrice * 7) / 107).toFixed(3)}
                />
                <TextField
                  disabled
                  fullWidth
                  label="ราคาถอด VAT"
                  value={((onProductPrice * 100) / 107).toFixed(3)}
                />
                <TextField
                  disabled
                  fullWidth
                  label="กำไรทั้งหมด (PF-VAT)"
                  value={((onProductPrice * 100) / 107 - onProductCost).toFixed(3)}
                />
              </Stack>
              <TextField
                fullWidth
                type="number"
                label="จำนวนเงินที่บริษัทจะรับ (เปอร์เซ็นของบริษัท)"
                {...getFieldProps('percent_NBA')}
                error={Boolean(touched.percent_NBA && errors.percent_NBA)}
                helperText={touched.percent_NBA && errors.percent_NBA}
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
                  src={`${process.env.REACT_APP_DRIVE_SELECT_IMAGE}${localStorage.getItem(
                    'productImg'
                  )}`}
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
