import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import swal from 'sweetalert';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------
async function loginUser(credentials) {
  return fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then((data) => data.json());
}
async function loginRider(credentials) {
  return fetch('http://localhost:8000/loginRider', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }).then((data) => data.json());
}
export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('id is reqired'),
    password: Yup.string().required('Password is required')
  });
  const handleSubmits = async (e) => {
    const setUserNames = e.username;
    const setPasswords = e.password;
    console.log(setUserNames);
    let response = await loginUser({
      setUserNames,
      setPasswords
    });
    if ('accessToken' in response) {
      swal('Success', response.message, 'success', {
        buttons: false,
        timer: 2000
      }).then((value) => {
        sessionStorage.setItem('accessToken', response.accessToken);
        sessionStorage.setItem('user', response.data.userId);
        sessionStorage.setItem('role', response.data.role);
        sessionStorage.setItem('level', response.data.level);
        // navigate('/dashboard', { replace: true });
        window.location.href = '/';
      });
    } else {
      response = await loginRider({
        setUserNames,
        setPasswords
      });
      if ('accessToken' in response) {
        swal('Success', response.message, 'success', {
          buttons: false,
          timer: 2000
        }).then((value) => {
          sessionStorage.setItem('accessToken', response.accessToken);
          sessionStorage.setItem('user', response.data.rider_id);
          sessionStorage.setItem('role', 'Rider');
          sessionStorage.setItem('level', 'Rider');
          navigate('/dashboard', { replace: true });
          // window.location.href = '/';
        });
      } else {
        swal('ไม่สามารถเช้าสู่ระบบได้', 'ID หรือ Password ผิดพลาด', 'error');
      }
    }
  };
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: (e) => handleSubmits(e)
    //  {
    //   navigate('/dashboard', { replace: true });
    // }
  });
  console.log(formik);
  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="text"
            label="รหัสบัตรประจำตัวประชาชน"
            {...getFieldProps('username')}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
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
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
