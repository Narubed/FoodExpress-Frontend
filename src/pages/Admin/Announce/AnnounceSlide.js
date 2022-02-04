import * as Yup from 'yup';
import { useEffect, useState } from 'react';
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
import Page from '../../../components/Page';
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [Announce, setAnnounce] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getAnnounceSlide = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getAnnounceSlide`
    );
    console.log(getAnnounceSlide.data.data);
    setAnnounce(getAnnounceSlide.data.data[0].announce_slide_data);
  }, []);

  const handleSubmits = async () => {
    const data = {
      announve_slide_id: 1,
      announce_slide_data: Announce
    };
    Swal.fire({
      title: 'คุณยืนยันจะเเก้ไขข่าวสารนี้ หรือไม่ ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่ ฉันต้องการเเก้ไข!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putAnnounceSlide`, data);
        Swal.fire('Success!', 'คุณได้แก้ไขประกาศเรียบร้อยเเล้ว.', 'success');
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      }
    });
  };

  return (
    <Page title="ประกาศ | FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            แก้ไขประกาศ
          </Typography>
        </Stack>

        <TextField
          fullWidth
          autoComplete="announve"
          type="text"
          label="ประกาศ !!"
          value={Announce}
          onChange={(e) => setAnnounce(e.target.value)}
        />
        <br />
        <br />

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={() => handleSubmits()}
        >
          แก้ไข
        </Button>
      </Container>
    </Page>
  );
}
