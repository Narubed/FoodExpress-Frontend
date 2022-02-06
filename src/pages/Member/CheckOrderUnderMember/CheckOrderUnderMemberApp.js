/* eslint-disable react/jsx-key */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { useEffect, useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Icon } from '@iconify/react';
import { Box, Grid, Container, Typography, Button, Stack } from '@mui/material';
import axios from 'axios';
import Input from '@material-tailwind/react/Input';
// components
import Page from '../../../components/Page';
import AppCardCutArount from '../../../components/_dashboard/checkorderundermember/AppCardCutArount';
import AppCardCutArountDonthaveDistrtict from '../../../components/_dashboard/checkorderundermember/AppCardCutArountDonthaveDistrtict';
import AppCardCutArountDistrtict from '../../../components/_dashboard/checkorderundermember/AppCardCutArountDistrtict';

// ----------------------------------------------------------------------
function CheckOrderUnderMemberApp() {
  const [Order, setOrder] = useState([]);
  const [OrderDontHaveDistrict, setOrderDontHaveDistrict] = useState([]);
  const [Query, setQuery] = useState('');
  const [MyMemberMe, setMyMemberMe] = useState([]);
  const [GetAllMembers, setGetAllMembers] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const userid = sessionStorage.getItem('user');
    const MyMember = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/member/${userid}`);
    const GetAllMember = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/members`);
    setGetAllMembers(GetAllMember.data.data);
    // eslint-disable-next-line camelcase
    const JoinOrder_Detail = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getJoinOrder_detail_cutarount`
    );

    const filterOrderStatus = JoinOrder_Detail.data.data.filter(
      (f) => f.order_status === 'รอจัดส่ง'
    );
    const filterCompanyStatus = filterOrderStatus.filter(
      (f) => f.order_company_status === 'ตัดรอบการจัดส่งแล้ว'
    );
    const filterStatusINProvince = filterCompanyStatus.filter(
      (f) => f.order_status_in_province === 'จังหวัดยังไม่ได้จัดส่ง'
    );
    const filterProvinceMember = filterStatusINProvince.filter(
      (f) => f.order_product_province === MyMember.data.data.province
    );
    const filterCheckMemberID = filterProvinceMember.filter(
      (f) => f.order_member_id !== MyMember.data.data.userId
    );

    if (MyMember.data.data.level === 'province') {
      const fileterDistrict = [];
      filterCheckMemberID.forEach((element) => {
        const idx = fileterDistrict.findIndex(
          (value) => value.order_product_district === element.order_product_district
        );
        if (idx === -1) {
          fileterDistrict.push(element);
        }
      });
      const filterDistrict2 = [];
      const dontHaveDistrict = [];
      fileterDistrict.forEach((element) => {
        const a = GetAllMember.data.data.filter(
          (f) => f.district === element.order_product_district && f.level === 'district'
        );
        if (a.length > 0) {
          filterDistrict2.push(element);
        } else {
          const value = filterCheckMemberID.filter(
            (f) => f.order_product_district === element.order_product_district
          );
          dontHaveDistrict.push(value);
        }
      });
      if (dontHaveDistrict.length > 0) {
        if (dontHaveDistrict[0].length > 0) {
          const fileterDontHaveDistrict = [];
          dontHaveDistrict[0].forEach((element) => {
            const idx = fileterDontHaveDistrict.findIndex(
              (value) => value.order_product_subdistrict === element.order_product_subdistrict
            );
            if (idx === -1) {
              fileterDontHaveDistrict.push(element);
            }
          });
          console.log(fileterDontHaveDistrict);
          setOrderDontHaveDistrict(fileterDontHaveDistrict);
        }
      }
      setOrder(filterDistrict2);

      setMyMemberMe(MyMember.data.data);
    } else if (MyMember.data.data.level === 'district') {
      const filterProvinceMember = filterCompanyStatus.filter(
        (f) => f.order_product_province === MyMember.data.data.province
      );
      const filterDistrictMember = filterProvinceMember.filter(
        (f) => f.order_product_district === MyMember.data.data.district
      );
      const filterUnStatusINProvince = filterDistrictMember.filter(
        (f) => f.order_status_in_province !== 'อำเภอตัดรอบการจัดส่งแล้ว'
      );
      const filterCheckMemberID = filterUnStatusINProvince.filter(
        (f) => f.order_member_id !== MyMember.data.data.userId
      );
      console.log(filterCheckMemberID);
      const fileterSubDistrict = [];
      filterCheckMemberID.forEach((element) => {
        const idx = fileterSubDistrict.findIndex(
          (value) => value.order_product_subdistrict === element.order_product_subdistrict
        );
        if (idx === -1) {
          fileterSubDistrict.push(element);
        }
      });
      const filterSubDistrict2 = [];
      fileterSubDistrict.forEach((element) => {
        const a = GetAllMember.data.data.filter(
          (f) => f.subdistrict === element.order_product_subdistrict && f.level === 'subdistrict'
        );
        if (a.length > 0) {
          filterSubDistrict2.push(element);
        }
      });
      setOrder(filterSubDistrict2);
      setMyMemberMe(MyMember.data.data);
    }
  }, []);
  return (
    <Page title="ออเดอร์ที่รอจัดส่ง | NBA-Express">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            <div> ออเดอร์ที่รอจัดส่ง</div>
          </Typography>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/dashboard/CheckOrderUnderMemberApp/CheckOrderMemberCreatBarCodeApp"
            startIcon={<Icon icon="iconoir:input-field" />}
          >
            สร้าง Barcode
          </Button>
        </Stack>
        <Input placeholder="ค้นหาตามอำเภอ" onChange={(event) => setQuery(event.target.value)} />
        <br />
        <Grid container spacing={3}>
          {Order?.filter((post) => {
            if (Query === '') {
              return post.order_product_district;
            }
            if (
              post.order_product_district.toLowerCase().includes(Query.toLowerCase()) ||
              post.order_product_district.toLowerCase().includes(Query.toLowerCase())
            ) {
              return post;
            }
          }).map((m) => (
            // eslint-disable-next-line react/jsx-key
            <Grid item xs={12} sm={6} md={3}>
              {/* {m.order_product_district}  */}
              {/* ต้องส่ง filterCheckMemberID เป็นออเดอร์ในจังหวัดทั้งหมด ยกเวินของตัวเองไปด้วย   */}
              {MyMemberMe.level === 'province' ? (
                <AppCardCutArount key={m.order_detail_id} props={m} GetAllMembers={GetAllMembers} />
              ) : null}
              {MyMemberMe.level === 'district' ? (
                <AppCardCutArountDistrtict
                  key={m.order_detail_id}
                  props={m}
                  GetAllMembers={GetAllMembers}
                />
              ) : null}
            </Grid>
          ))}
          {OrderDontHaveDistrict.map((m) => (
            <Grid item xs={12} sm={6} md={3}>
              <AppCardCutArountDonthaveDistrtict
                key={m.order_detail_id}
                props={m}
                GetAllMembers={GetAllMembers}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
export default CheckOrderUnderMemberApp;
