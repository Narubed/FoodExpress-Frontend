import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import Swal from 'sweetalert2';
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showMember, setMember] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const user = sessionStorage.getItem('user');
    const getUser = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/member/${user}`);
    setMember(getUser.data.data);
  }, []);
  const RegisterSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('กรุณากรอกอีเมลของท่านด้วย'),
    tel: Yup.string()
      .min(10, 'เบอร์โทรไม่ถึง 10 หลัก!')
      .max(50, 'Too Long!')
      .required('First name required'),
    password: Yup.string()
      .min(1, 'รหัสผ่านของท่านสั้นเกินไป!') // กลับมาเปลี่ยนเ้วย
      .max(50, 'Too Long!')
      .required('Password is required'),
    newpassword: Yup.string()
      .min(1, 'รหัสผ่านของท่านสั้นเกินไป!')
      .max(50, 'Too Long!')
      .required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      tel: '',
      password: '',
      newpassword: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (e) => {
      confirmPassword(e);
    }
  });
  const confirmPassword = async (e) => {
    if (e.email !== showMember.email) {
      Swal.fire('ท่านกรอกอีเมลผิดหรือไม่ ?', 'กรุณาตรวจสอบอีเมลของท่านอีกครั้ง !?', 'question');
    } else if (e.tel !== showMember.tel) {
      Swal.fire(
        'ท่านกรอกเบอร์โทรศัพท์ผิด ?',
        'กรุณาตรวจสอบเบอร์โทรศัพของท่านอีกครั้ง !?',
        'question'
      );
    } else if (e.password !== showMember.password) {
      Swal.fire('ท่านกรอกรหัสเดิมผิดหรือไม่ ?', 'กรุณาตรวจสอบรหัสเดิมอีกครั้ง !?', 'question');
    } else {
      const data = {
        userId: sessionStorage.getItem('user'),
        password: e.newpassword
      };
      await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putChangePassword`, data);
      Swal.fire({
        icon: 'success',
        title: 'ยืนยันการเปลี่ยนรหัสผ่านแล้ว !',
        showConfirmButton: false,
        timer: 2000
      });
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 2000);
    }
  };
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              autoComplete="username"
              type="email"
              label="Email address"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              label="เบอร์โทรศัพท์"
              {...getFieldProps('tel')}
              error={Boolean(touched.tel && errors.tel)}
              helperText={touched.tel && errors.tel}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="รหัสผ่านเดิม"
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
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="รหัสผ่านใหม่"
            {...getFieldProps('newpassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.newpassword && errors.newpassword)}
            helperText={touched.newpassword && errors.newpassword}
          />

          <LoadingButton
            // color="secondary"
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            // loading={isSubmitting}
          >
            เปลี่ยนรหัสผ่าน
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
