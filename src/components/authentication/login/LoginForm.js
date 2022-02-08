import * as Yup from 'yup';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
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
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .min(1, 'เลขบัตรของท่านสั้นเกินไป!') // มาเปลี่ยนด้วย
      .max(50, 'Too Long!')
      .required('id is reqired'),
    password: Yup.string()
      .min(1, 'รหัสของท่านสั้นเกินไป!')
      .max(50, 'Too Long!')
      .required('Password is required')
  });
  const handleSubmits = async (e) => {
    const setUserNames = e.username;
    const setPasswords = e.password;
    // console.log(setUserNames);
    dispatch({ type: 'OPEN' });
    let response = await loginUser({
      setUserNames,
      setPasswords
    });
    dispatch({ type: 'TURNOFF' });
    if ('accessToken' in response) {
      if (response.data.status !== 'Active') {
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถเข้าสู่ระบบได้ ณ ขนาดนี้',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        swal('ข้อมูลถูกต้อง', 'ยินดีต้อนรับเข้าสู่ระบบการซื้อขาย', 'success', {
          buttons: false,
          timer: 2000
        }).then(() => {
          sessionStorage.setItem('accessToken', response.accessToken);
          sessionStorage.setItem('user', response.data.userId);
          sessionStorage.setItem('role', response.data.role);
          sessionStorage.setItem('level', response.data.level);
          sessionStorage.setItem('firstname', response.data.firstname);
          sessionStorage.setItem('lastname', response.data.lastname);
          // navigate('/dashboard', { replace: true });
          window.location.href = '/';
        });
      }
    } else {
      dispatch({ type: 'OPEN' });
      response = await loginRider({
        setUserNames,
        setPasswords
      });
      dispatch({ type: 'TURNOFF' });
      if ('accessToken' in response) {
        swal('ข้อมูลถูกต้อง', 'ยินดีต้อนรับเข้าสู่ระบบการซื้อขาย', 'success', {
          buttons: false,
          timer: 2000
        }).then(() => {
          sessionStorage.setItem('accessToken', response.accessToken);
          sessionStorage.setItem('user', response.data.rider_id);
          sessionStorage.setItem('firstname', response.data.rider_first_name);
          sessionStorage.setItem('lastname', response.data.rider_last_name);
          sessionStorage.setItem('role', 'Rider');
          sessionStorage.setItem('level', 'Rider');
          // navigate('/dashboard', { replace: true });
          window.location.href = '/';
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
  });
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
