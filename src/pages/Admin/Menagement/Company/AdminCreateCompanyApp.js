import * as Yup from 'yup';
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

const BankName = [
  'ธนาคารแห่งประเทศไทย',
  'ธนาคารกรุงเทพ',
  'ธนาคารกสิกรไทย',
  'ธนาคารกรุงไทย',
  'ธนาคารทหารไทยธนชาต',
  'ธนาคารไทยพาณิชย์',
  'ธนาคารกรุงศรีอยุธยา',
  'ธนาคารเกียรตินาคินภัทร',
  'ธนาคารซีไอเอ็มบีไทย',
  'ธนาคารทิสโก้',
  'ธนาคารยูโอบี',
  'ธนาคารไทยเครดิตเพื่อรายย่อย',
  'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร',
  'ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย',
  'ธนาคารออมสิน',
  'ธนาคารอาคารสงเคราะห์',
  'ธนาคารอิสลามแห่งประเทศไทย'
];

export default function AdminCreateCompanyApp() {
  const dispatch = useDispatch();
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
      .required('Address name required'),
    company_login_id: Yup.string()
      .min(2, 'Too Short!')
      .max(100, 'Too Long!')
      .required('ID Login is  required'),
    company_login_pw: Yup.string()
      .min(2, 'Too Short!')
      .max(100, 'Too Long!')
      .required('password is  required'),
    company_taxpayer_number: Yup.string()
      .min(1, 'Too Short!')
      .max(100, 'Too Long!')
      .required('ถ้าไม่มีให้ใส่ - ได้'),
    company_line_id: Yup.string()
      .min(1, 'Too Short!')
      .max(100, 'Too Long!')
      .required('ถ้าไม่มีให้ใส่ - ได้')
  });
  const handleSubmits = async (e) => {
    console.log(e);
    const data = {
      company_name: e.company_name,
      company_tel: e.company_tel,
      book_name: e.book_name,
      book_number: e.book_number,
      company_address: e.company_address,
      company_login_id: e.company_login_id,
      company_login_pw: e.company_login_pw,
      company_taxpayer_number: e.company_taxpayer_number,
      company_line_id: e.company_line_id
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการเพิ่มบริษัทหรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'OPEN' });
        await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postCompany`, data);
        Swal.fire({
          icon: 'success',
          title: 'คุณได้เพิ่มบริษัทเรียบร้อยเเล้ว',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          dispatch({ type: 'TURNOFF' });
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
      company_address: '',
      company_login_id: '',
      company_login_pw: '',
      company_taxpayer_number: '',
      company_line_id: ''
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
                  label="ชื่อบริษัท"
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
              {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="ไอดีสำหรับเข้าสู่ระบบ"
                  {...getFieldProps('company_login_id')}
                  error={Boolean(touched.company_login_id && errors.company_login_id)}
                  helperText={touched.company_login_id && errors.company_login_id}
                />
                <TextField
                  fullWidth
                  autoComplete="company_login_pw"
                  label="รหัสผ่าน"
                  {...getFieldProps('company_login_pw')}
                  error={Boolean(touched.company_login_pw && errors.company_login_pw)}
                  helperText={touched.company_login_pw && errors.company_login_pw}
                />
              </Stack> */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  select
                  label="ชื่อบัญชีธนาคาร"
                  {...getFieldProps('book_name')}
                  error={Boolean(touched.book_name && errors.book_name)}
                  helperText={touched.book_name && errors.book_name}
                >
                  {BankName.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  autoComplete="book_number"
                  label="เลขบัญชีธนาคาร"
                  {...getFieldProps('book_number')}
                  error={Boolean(touched.book_number && errors.book_number)}
                  helperText={touched.book_number && errors.book_number}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="เลขประจำตัวผู้เสียภาษี"
                  {...getFieldProps('company_taxpayer_number')}
                  error={Boolean(touched.company_taxpayer_number && errors.company_taxpayer_number)}
                  helperText={touched.company_taxpayer_number && errors.company_taxpayer_number}
                />
                <TextField
                  fullWidth
                  autoComplete="company_line_id"
                  label="Line หรือ ช่องทางการติดต่อ"
                  {...getFieldProps('company_line_id')}
                  error={Boolean(touched.company_line_id && errors.company_line_id)}
                  helperText={touched.company_line_id && errors.company_line_id}
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
