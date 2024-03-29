/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-dynamic-require */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';

// material
import { LoadingButton } from '@mui/lab';
import { Stack, TextField, Container, Typography } from '@mui/material';
// companent
import Page from '../../../components/Page';

// ----------------------------------------------------------------------
export default function AdminEditProductApp() {
  const dispatch = useDispatch();
  const [file, setfile] = useState([]);
  const [filepreview, setfilepreview] = useState(null);
  const [AnnounceAdverts, setAnnounceAdvert] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const AnnounceAdverts = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getAnnounceAdvert`
    );
    setAnnounceAdvert(AnnounceAdverts.data.data[0].announve_advert_image);
  }, []);
  const handleInputChange = async (event) => {
    setfile(event.target.files[0] ? event.target.files[0] : []);
    setfilepreview(event.target.files[0] ? URL.createObjectURL(event.target.files[0]) : null);
  };
  const handleSubmit = async () => {
    if (file.length !== 0) {
      const formdata = new FormData();
      formdata.append('avatar', file);
      formdata.append('announve_advert_id', 1);
      Swal.fire({
        title: 'คุณต้องการบันทึกรูปนี้หรือไม่ ?',
        text: 'หลังจากคุณบันทึกภาพที่แสดงหน้าแรกของผู้ใช้จะกลายเป็นภายนี้แทน !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยันการเปลี่ยนแปลงภาพ!',
        cancelButtonText: 'ยกเลิกการเปลี่ยนแปลง!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch({ type: 'OPEN' });
          await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putAnnounceAdvert`, formdata);

          Swal.fire({
            position: '',
            icon: 'success',
            title: 'คุณได้ทำการยืนยันการเปลี่ยนภาพโฆษณาเเล้ว ',
            showConfirmButton: false,
            timer: 1500
          });

          setTimeout(() => {
            dispatch({ type: 'TURNOFF' });
          }, 1500);
        }
      });
    } else {
      Swal.fire('คุณลืมเพิ่มรูปภาพ ?', 'กรุณาเลือกไฟล์ภาพสำหรับแสดงหน้าของผู้ใช้ด้วย?', 'question');
    }
  };
  return (
    <Page title="โฆษณา | FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            <div>แก้ไขภาพโฆษณา</div>
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
            onClick={() => handleSubmit()}
          >
            <div>ยืนยันการเพิ่มข้อมูล</div>
          </LoadingButton>
          {filepreview !== null ? (
            <img className="previewimg" src={filepreview} alt="UploadImage" />
          ) : AnnounceAdverts !== null ? (
            <img
              className="previewimg"
              src={
                `${process.env.REACT_APP_DRIVE_SELECT_IMAGE}${AnnounceAdverts}`
                // require(`../../../assets/img/${AnnounceAdverts}`).default
              }
              alt="UploadImage"
            />
          ) : null}
        </Stack>
      </Container>
    </Page>
  );
}
