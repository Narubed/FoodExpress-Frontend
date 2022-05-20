import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------
const ColorButton = styled(LoadingButton)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700]
  }
}));

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showMember, setMember] = useState([]);
  const [loading, setloading] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getUser = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/members`);
    setMember(getUser.data.data);
  }, []);

  const RegisterSchema = Yup.object().shape({
    userId: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('userId  required'),
    tel: Yup.string()
      .min(10, 'เบอร์โทรไม่ถึง 10 หลัก!')
      .max(50, 'Too Long!')
      .required('tel required'),
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('กรุณากรอกอีเมลของท่านด้วย'),
    password: Yup.string().min(8, 'รหัสผ่านของท่านสั้นเกินไป!').required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      userId: '',
      tel: '',
      email: '',
      password: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (e) => {
      confirmPassword(e);
    }
  });
  const confirmPassword = async (e) => {
    setloading(true);
    console.log(e);
    const filterUserID = showMember.filter((f) => f.userId === e.userId);
    if (filterUserID.length !== 0) {
      console.log(filterUserID[0]);
      if (filterUserID[0].tel !== e.tel) {
        Swal.fire({
          icon: 'error',
          title: 'เบอร์โทรศัพท์ไม่ถูกต้อง',
          showConfirmButton: false,
          timer: 1500
        });
      } else if (filterUserID[0].email !== e.email) {
        Swal.fire({
          icon: 'error',
          title: 'อีเมลไม่ถูกต้อง',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        const data = {
          userId: e.userId,
          password: e.password
        };
        console.log(data);
        dispatch({ type: 'OPEN' });
        await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putChangePassword`, data);
        Swal.fire({
          icon: 'success',
          title: 'ยืนยันการเปลี่ยนรหัสผ่านแล้ว !',
          showConfirmButton: false,
          timer: 2000
        });
        setTimeout(() => {
          dispatch({ type: 'TURNOFF' });
          navigate('/login', { replace: true });
        }, 2000);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'ไม่มีเลขบัตรนี้อยู่ในระบบ',
        showConfirmButton: false,
        timer: 1500
      });
    }
    setloading(false);
  };
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="รหัสบัตรประจำตัวประชาชน"
              {...getFieldProps('userId')}
              error={Boolean(touched.userId && errors.userId)}
              helperText={touched.userId && errors.userId}
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
            autoComplete="username"
            type="email"
            label="อีเมล"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="รหัสผ่านใหม่"
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

          <ColorButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
            เปลี่ยนรหัสผ่าน
          </ColorButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
