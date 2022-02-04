/* eslint-disable import/no-dynamic-require */
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
  TablePagination,
  MenuItem
} from '@mui/material';
// companent
import Page from '../../../components/Page';
// ----------------------------------------------------------------------

export default function AdminEditProductApp() {
  const [file, setfile] = useState([]);
  const [filepreview, setfilepreview] = useState(null);
  const [ProductType, setProductType] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const ProductType = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/producttypes`);
    setProductType(ProductType.data.data);
  }, []);
  const handleInputChange = async (event) => {
    console.log(event);
    setfile(event.target.files[0] ? event.target.files[0] : []);
    setfilepreview(event.target.files[0] ? URL.createObjectURL(event.target.files[0]) : null);
  };
  return (
    <Page title="Product | FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            แก้ไขภาพโฆษณา
          </Typography>
        </Stack>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              type="file"
              className="form-control"
              autoComplete="filemik"
              name="upload_file"
              onChange={handleInputChange}
            />
          </Stack>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            // loading={isSubmitting}
            onClick={() => console.log('เพิ่มรูปปปปปปปปปปปปปปปป')}
          >
            ยืนยันการเพิ่มข้อมูล
          </LoadingButton>
          {
            filepreview !== null ? (
              <img className="previewimg" src={filepreview} alt="UploadImage" />
            ) : null

            /* <img
                  className="previewimg"
                  src={
                    // eslint-disable-next-line global-require
                    require(`../../../../assets/img/${localStorage.getItem('productImg')}`).default
                  }
                  alt="UploadImage"
                /> */
          }
        </Stack>
      </Container>
    </Page>
  );
}
