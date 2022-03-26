import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useDispatch } from 'react-redux';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import Swal from 'sweetalert2';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
// material
import { LoadingButton } from '@mui/lab';
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Container,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
// companent
import Page from '../../../components/Page';
// ----------------------------------------------------------------------
const ColorButton = styled(LoadingButton)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700]
  }
}));

export default function RegisterForm() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [radioLevel, setRadioLevel] = useState('GeneralAdmin');

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    adminid: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Last adminid required'),
    password: Yup.string().required('Password is required')
  });
  const handleSubmits = async (e) => {
    const data = {
      admin_id_login: e.adminid,
      admin_pw_login: e.password,
      admin_first_name: e.firstName,
      admin_last_name: e.lastName,
      admin_level: radioLevel
    };
    console.log(radioLevel);
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการเพิ่มผู้ดูแลระบบหรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'OPEN' });
        await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postAdmin`, data);
        Swal.fire({
          icon: 'success',
          title: 'คุณได้เพิ่มผู้ดูแลระบบเรียบร้อยเเล้ว',
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
      password: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (e) => handleSubmits(e)
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="เพิ่มผู้ดูแลระบบ | FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            เพิ่มผู้ดูแลระบบ
          </Typography>
        </Stack>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <FormControl color="secondary">
              <FormLabel id="demo-row-radio-buttons-group-label">
                กรูณาเลือกระดับของผู้ดูแลระบบ
              </FormLabel>
              <RadioGroup
                onChange={(e) => setRadioLevel(e.target.value)}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="GeneralAdmin"
                  control={
                    <Radio
                      sx={{
                        '&, &.Mui-checked': {
                          color: purple[500]
                        }
                      }}
                    />
                  }
                  label="GeneralAdmin (ทั่วไป)"
                />
                <FormControlLabel
                  value="ManagerAdmin"
                  control={
                    <Radio
                      sx={{
                        '&, &.Mui-checked': {
                          color: purple[500]
                        }
                      }}
                    />
                  }
                  label="ManagerAdmin (ขั้นสูง)"
                />
              </RadioGroup>
            </FormControl>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="ชื่อ"
                  {...getFieldProps('firstName')}
                  error={Boolean(touched.firstName && errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />

                <TextField
                  fullWidth
                  label="นามสกุล"
                  {...getFieldProps('lastName')}
                  error={Boolean(touched.lastName && errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
              </Stack>

              <TextField
                fullWidth
                autoComplete="username"
                label="ID"
                {...getFieldProps('adminid')}
                error={Boolean(touched.adminid && errors.adminid)}
                helperText={touched.adminid && errors.adminid}
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

              <ColorButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                ยืนยันการเพิ่มผู้ดูแล
              </ColorButton>
            </Stack>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
