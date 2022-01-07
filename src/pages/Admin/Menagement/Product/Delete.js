import * as Yup from 'yup';
import { useState } from 'react';
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
  TablePagination
} from '@mui/material';
// companent
import Page from '../../../../components/Page';
// ----------------------------------------------------------------------

export default function AdminCreateProductApp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [file, setfile] = useState([]);
  const [filepreview, setfilepreview] = useState(null);

  const RegisterSchema = Yup.object().shape({
    productName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('product name required'),
    productPrice: Yup.number().required('product price is required'),
    company_tel: Yup.number().required('company tel is required'),
    book_name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Book name required'),
    book_number: Yup.number().required('book number is required'),
    company_address: Yup.string()
      .min(2, 'Too Short!')
      .max(100, 'Too Long!')
      .required('Address name required')
  });
  const handleSubmits = async (e) => {
    const data = {
      productName: e.productName,
      productPrice: e.productPrice,
      productCost: e.productCost,
      productStetus: e.productStetus,
      productImg: e.productImg,
      productTypes: e.productTypes,
      selectTypeId: e.selectTypeId,
      file,
      filepreview,
      success: e.success,
      unitkg: e.unitkg,
      currency: e.currency
    };
    console.log(e);
    console.log(data);
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'คุณต้องการเพิ่มบริษัทหรือไม่ !',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes, need it!'
    // }).then(async (result) => {
    //   if (result.isConfirmed) {
    //     console.log(data);
    //     await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postCompany`, data);
    //     Swal.fire('Success!', 'คุณได้เพิ่มบริษัทเรียบร้อยเเล้ว.', 'success');
    //     setTimeout(() => {
    //       window.location.reload(false);
    //     }, 1500);
    //   }
    // });
  };
  const formik = useFormik({
    initialValues: {
      productName: '',
      productPrice: '',
      productCost: '',
      productStetus: null,
      productImg: '',
      productTypes: [],
      selectTypeId: null,
      // filemik: [],
      // filepreviewmik: null,
      success: null,
      unitkg: '',
      currency: ''
    },
    validationSchema: RegisterSchema,
    // onSubmit: (e) => console.log(e)
    onSubmit: (e) => handleSubmits(e)
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  return (
    <Page title="Product | FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Create Product FoodExpress
          </Typography>
        </Stack>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="ชื่อสินค้า"
                  {...getFieldProps('productName')}
                  error={Boolean(touched.productName && errors.productName)}
                  helperText={touched.productName && errors.productName}
                />
                {/* <TextField
                  fullWidth
                  autoComplete="productPrice"
                  label="ราคาสินค้า"
                  {...getFieldProps('productPrice')}
                  error={Boolean(touched.productPrice && errors.productPrice)}
                  helperText={touched.productPrice && errors.productPrice}
                /> */}
              </Stack>
              {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="ชื่อบัญชีธนาคาร"
                  {...getFieldProps('book_name')}
                  error={Boolean(touched.book_name && errors.book_name)}
                  helperText={touched.book_name && errors.book_name}
                />
                <TextField
                  fullWidth
                  autoComplete="book_number"
                  label="เลขบัญชีธนาคาร"
                  {...getFieldProps('book_number')}
                  error={Boolean(touched.book_number && errors.book_number)}
                  helperText={touched.book_number && errors.book_number}
                />
              </Stack>
              <TextField
                fullWidth
                autoComplete="company_address"
                label="ที่อยู่"
                {...getFieldProps('company_address')}
                error={Boolean(touched.company_address && errors.company_address)}
                helperText={touched.company_address && errors.company_address}
              /> */}

              {/* <TextField
                type="file"
                className="form-control"
                autoComplete="filemik"
                name="upload_file"
                onChange={handleInputChange}
                error={Boolean(touched.file && errors.file)}
                helperText={touched.file && errors.file}
              /> */}

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                ยืนยันการเพิ่มข้อมูล
              </LoadingButton>
              {/* {filepreview !== null ? (
                <img className="previewimg" src={filepreview} alt="UploadImage" />
              ) : null} */}
            </Stack>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
