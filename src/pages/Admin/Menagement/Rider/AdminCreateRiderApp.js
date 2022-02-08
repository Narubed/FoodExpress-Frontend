import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useDispatch } from 'react-redux';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import Swal from 'sweetalert2';
import axios from 'axios';
// material
import { LoadingButton } from '@mui/lab';
import { Stack, TextField, IconButton, InputAdornment, Container, Typography } from '@mui/material';
// companent
import Page from '../../../../components/Page';
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    riderid: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Last riderid required'),
    password: Yup.string().required('Password is required'),
    tel: Yup.number().required('tel is required')
  });
  const handleSubmits = async (e) => {
    const data = {
      rider_id_login: e.riderid,
      rider_pw_login: e.password,
      rider_first_name: e.firstName,
      rider_last_name: e.lastName,
      rider_tel: e.tel
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการเพิ่มไรเดอร์คนใหม่หรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'OPEN' });
        await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postRider`, data);
        Swal.fire({
          icon: 'success',
          title: 'คุณได้เพิ่มไรเดอร์คนใหม่เรียบร้อยเเล้ว',
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
      firstName: '',
      lastName: '',
      riderid: '',
      password: '',
      tel: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (e) => handleSubmits(e)
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="เพิ่มไรเดอร์คนใหม่ | FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            เพิ่มไรเดอร์คนใหม่
          </Typography>
        </Stack>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="First name"
                  {...getFieldProps('firstName')}
                  error={Boolean(touched.firstName && errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />

                <TextField
                  fullWidth
                  label="Last name"
                  {...getFieldProps('lastName')}
                  error={Boolean(touched.lastName && errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
              </Stack>

              <TextField
                fullWidth
                autoComplete="username"
                label="ID"
                {...getFieldProps('riderid')}
                error={Boolean(touched.riderid && errors.riderid)}
                helperText={touched.riderid && errors.riderid}
              />

              <TextField
                fullWidth
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                {...getFieldProps('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                        <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
              <TextField
                fullWidth
                autoComplete="tel"
                type="number"
                label="เบอร์โทรศัพท์"
                {...getFieldProps('tel')}
                error={Boolean(touched.tel && errors.tel)}
                helperText={touched.tel && errors.tel}
              />

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Register
              </LoadingButton>
            </Stack>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
