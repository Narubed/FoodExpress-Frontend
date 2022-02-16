/* eslint-disable jsx-a11y/img-redundant-alt */
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components
import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function Page404() {
  console.log(process.env);
  return (
    <RootStyle title="404 Page Not Found | NBA-Express">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                เว็ปนี้ไม่มีหน้าที่คุณต้องการค้นหา
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              หน้าที่ท่านต้องการค้นหานั้นไม่มีอยู่ใน เว็ปของเรา
              กรุณาติดต่อทางบริษัทหรือตัวเเทนในเรื่องนี้เพื่อสอบถามข้อมูลเพิ่มเติม
            </Typography>

            <motion.div variants={varBounceIn}>
              <Box
                component="img"
                // src="/static/illustrations/illustration_404.svg"
                // src="https://nbadigitalworlds.com/2021/assets/img/phone.png"
                src="https://drive.google.com/uc?export=view&id=1QQ_bX-oOShGSBQu2gAda0Mix6sCrcmQ_"
                // src={`${process.env.GOOGLE_DRIVE_SELECT_IMAGE}1QQ_bX-oOShGSBQu2gAda0Mix6sCrcmQ_`}
                sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
              />
            </motion.div>

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              กลับสู่หน้าหลัก
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
