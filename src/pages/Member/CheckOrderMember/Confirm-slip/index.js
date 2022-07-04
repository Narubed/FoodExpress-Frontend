/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable global-require */
/* eslint-disable camelcase */
/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
// ** MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';

// ** Icons Imports
import { auto } from '@popperjs/core';

const ImgStyled = styled('img')(({ theme }) => ({
  width: '25%',
  height: '25%',
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}));

const ImgAccout = styled('img')(({ theme }) => ({
  width: '50%',
  height: '50%',
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}));

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}));

const TabAccount = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  // ** State
  const [imgSrc, setImgSrc] = useState(
    require('../../../../assets/checksilp/no-image-icon-15.png').default
  );
  const [file, setfile] = useState([]);

  const [orderID] = useState(data.order_id);
  const [totalOrder] = useState(data.order_product_total);
  const onChange = (file) => {
    const reader = new FileReader();
    const { files } = file.target;
    if (files && files.length !== 0) {
      setfile(files[0]);
      reader.onload = () => setImgSrc(reader.result);
      reader.readAsDataURL(files[0]);
    }
  };

  const resetImage = async () => {
    setfile([]);
    setImgSrc(require('../../../../assets/checksilp/no-image-icon-15.png').default);
  };

  const confirmSlip = async () => {
    if (file.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'กรุณาเช็คไฟล์รูปภาพอีกครั้ง',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      const getUSER = await axios.get(
        `${process.env.REACT_APP_WEB_BACKEND}/member/${sessionStorage.getItem('user')}`
      );
      const USER = getUSER.data.data;
      let levelUSER = '';
      if (USER.level === 'subdistrict') {
        levelUSER = 'ศูนย์ระดับตำบล';
      } else if (USER.level === 'district') {
        levelUSER = 'ศูนย์ระดับอำเภอ';
      } else {
        levelUSER = 'ศูนย์ระดับจังหวัด';
      }
      Swal.fire({
        title: 'ยืนยันข้อมูล !',
        text: 'คุณต้องการยืนยันการทำรายการหรือไม่ ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก'
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch({ type: 'OPEN' });
          const formdata = new FormData();
          formdata.append('avatar', file);
          formdata.append('order_id', orderID);
          formdata.append('order_status', 'รอตรวจสอบ');
          const messages = {
            token: '2VvNMnpRFjgeYY49HwvGEkt9SNG6CSOPUwU3ZoVqm6Z',
            message: `จาก ${getUSER.data.data.firstname} ${getUSER.data.data.lastname} ${levelUSER} ที่อยู่: ต.${USER.subdistrict}อ.${USER.district}จ.${USER.province}
            ยอดโอนรวม: ${data.order_product_total}
            ตรวจสอบได้ที่ : ${process.env.REACT_APP_NAME_WEP} `
          };

          await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putSlip`, formdata);
          await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postLineNotify`, messages);
          dispatch({ type: 'TURNOFF' });

          Swal.fire({
            icon: 'success',
            title: 'ยืนยันการโอนเงินเรียบร้อยเเล้ว',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => {
            navigate('/dashboard/CheckOrderMemberApp');
          }, 1500);
        }
      });
    }
  };

  return (
    <CardContent>
      <Container>
        <form>
          <Grid container spacing={7}>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              หมายเลขทำการ : {orderID}
              <br />
              ยอดเงิน : {totalOrder.toLocaleString()}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imgSrc} alt="Profile Pic" />
                <Box>
                  <ButtonStyled
                    sx={{ bgcolor: 'purple' }}
                    component="label"
                    variant="contained"
                    htmlFor="account-settings-upload-image"
                  >
                    เพิ่มหลักฐานการโอนเงิน
                    <input
                      hidden
                      type="file"
                      onChange={onChange}
                      accept="image/png, image/jpeg"
                      id="account-settings-upload-image"
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color="error" variant="outlined" onClick={() => resetImage()}>
                    Reset
                  </ResetButtonStyled>
                  <Typography variant="body2" sx={{ marginTop: 5 }}>
                    แนะนำให้เป็นไฟล์ png หรือ jpeg ขนาดไม่เกิน 800K.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{ marginRight: 3.5, bgcolor: 'purple' }}
                onClick={() => confirmSlip()}
              >
                ยืนยันการเพิ่มข้อมูลการโอนเงิน
              </Button>
              <Button
                type="reset"
                variant="outlined"
                color="error"
                onClick={() => {
                  navigate('/dashboard/CheckOrderMemberApp');
                }}
              >
                ย้อนกลับ
              </Button>
            </Grid>
          </Grid>
        </form>
        <br />
        <Grid item xs={12}>
          <Grid container spacing={5}>
            <ImgAccout
              sx={{ mr: 'auto', ml: 'auto', mt: 12 }}
              src={require('../../../../assets/checksilp/accout.jpg').default}
            />
          </Grid>
        </Grid>
      </Container>
    </CardContent>
  );
};

export default TabAccount;
