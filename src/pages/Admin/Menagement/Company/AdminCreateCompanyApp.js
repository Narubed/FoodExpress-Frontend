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

export default function AdminCreateCompanyApp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    company_name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Company name required'),
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
      company_name: e.company_name,
      company_tel: e.company_tel,
      book_name: e.book_name,
      book_number: e.book_number,
      company_address: e.company_address
    };
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
        await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postCompany`, data);
        Swal.fire('Success!', 'คุณได้เพิ่มบริษัทเรียบร้อยเเล้ว.', 'success');
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      }
    });
  };
  const formik = useFormik({
    initialValues: {
      company_name: '',
      company_tel: '',
      book_name: '',
      book_number: '',
      company_address: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (e) => handleSubmits(e)
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="เพิ่มบริษัทใหม่ | FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            เพิ่มบริษัทใหม่
          </Typography>
        </Stack>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Company name"
                  {...getFieldProps('company_name')}
                  error={Boolean(touched.company_name && errors.company_name)}
                  helperText={touched.company_name && errors.company_name}
                />
                <TextField
                  fullWidth
                  autoComplete="company_tel"
                  label="เบอร์โทรศัพท์"
                  {...getFieldProps('company_tel')}
                  error={Boolean(touched.company_tel && errors.company_tel)}
                  helperText={touched.company_tel && errors.company_tel}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
              />

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                ยืนยันการเพิ่มข้อมูล
              </LoadingButton>
            </Stack>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
