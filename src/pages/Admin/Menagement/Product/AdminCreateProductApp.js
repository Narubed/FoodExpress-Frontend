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

export default function AdminCreateProductApp() {
  const dispatch = useDispatch();
  const [file, setfile] = useState([]);
  const [filepreview, setfilepreview] = useState(null);
  const [ProductType, setProductType] = useState([]);
  const [onProductPrice, setonProductPrice] = useState([]);
  const [onProductCost, setonProductCost] = useState([]);

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
    percentNBA: Yup.number().required('กำหนดเปอร์เซ็นใหม่ด้วย')
  });

  const handleSubmits = async (e) => {
    console.log(e);
    if ((e.productPrice * 100) / 107 - e.productCost - e.percentNBA <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'กรุณาตรวจสอบเปอร์เซ็นอีกครั้ง',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      // console.log((e.productPrice * 100) / 107 - e.productCost - e.percentNBA);
      const formdata = new FormData();
      formdata.append('avatar', file);
      formdata.append('productName', e.productName);
      formdata.append('productPrice', onProductPrice);
      formdata.append('productCost', onProductCost);
      formdata.append('productStetus', e.productStetus);
      formdata.append('typeid', e.Typeid);
      formdata.append('unitkg', e.unitkg);
      formdata.append('currency', e.currency);
      formdata.append(
        'percent_service',
        ((onProductPrice * 100) / 107 - onProductCost - e.percentNBA).toFixed(3)
      );
      formdata.append('percent_NBA', e.percentNBA);
      Swal.fire({
        title: 'Are you sure?',
        text: 'คุณต้องการเพิ่มสินค้าหรือไม่ !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน!',
        cancelButtonText: 'ยกเลิก!'
      }).then(async (result) => {
        if (file.length === 0) {
          Swal.fire(
            'เราคิดว่าคุณกรอกข้อมูลไม่ครบ?',
            'ลองเช็คที่ไฟล์รูปภาพของคุณอีกครั้ง?',
            'question'
          );
        } else if (result.isConfirmed) {
          dispatch({ type: 'OPEN' });
          await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/imageupload`, formdata);
          Swal.fire({
            icon: 'success',
            title: 'คุณได้เพิ่มสินค้าเรียบร้อยเเล้ว',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => {
            dispatch({ type: 'TURNOFF' });
          }, 1500);
        }
      });
    }
  };
  const formik = useFormik({
    initialValues: {
      productName: '',
      // productPrice: '',
      // productCost: '',
      productStetus: null,
      productImg: '',
      productTypes: [],
      Typeid: null,
      unitkg: '',
      currency: '',
      percentNBA: ''
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
    <Page title="เพิ่มสินค้าใหม่ | FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            เพิ่มสินค้าใหม่
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
                  onChange={(e) => setonProductPrice(e.target.value)}
                  // {...getFieldProps('productPrice')}
                />
                <TextField
                  fullWidth
                  autoComplete="productCost"
                  label="ราคาต้นทุนของสินค้า"
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
                  autoComplete="book_number"
                  label="กำไรทั้งหมด (PF-VAT)"
                  value={((onProductPrice * 100) / 107 - onProductCost).toFixed(3)}
                />
              </Stack>
              <TextField
                fullWidth
                type="number"
                label="จำนวนเงินที่บริษัทจะรับ (เปอร์เซ็นของบริษัท)"
                {...getFieldProps('percentNBA')}
                error={Boolean(touched.percentNBA && errors.percentNBA)}
                helperText={touched.percentNBA && errors.percentNBA}
              />
              <TextField
                id="outlined-select-currency"
                select
                label="สถานะสินค้า"
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
              ) : null}
            </Stack>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
