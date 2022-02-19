import faker from 'faker';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import googleFill from '@iconify/icons-eva/google-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
import { alpha, styled } from '@mui/material/styles';
import Image from '@material-tailwind/react/Image';
// material
import { Box, Grid, Card, Paper, Typography, CardHeader, CardContent } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.error.dark,
  '&:hover': {
    background: theme.palette.error.lighter,
    boxShadow: '5px 5px 4px red'
  },
  '&:last-child': {
    borderRight: 'solid 1px #cccccc'
  },
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0)} 0%, ${alpha(
    theme.palette.error.dark,
    0.24
  )} 100%)`
}));
// ----------------------------------------------------------------------

export default function AppTrafficBySite() {
  return (
    <Card>
      <CardHeader title="เว็บแนะนำจากเรา" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
              <Box sx={{ mb: 0.5 }}>
                <IconWrapperStyle
                  onClick={() =>
                    window.open('https://nbadigitalworlds.com/2021/index.html', '_blank')
                  }
                >
                  <Image
                    src="https://pbs.twimg.com/profile_images/1322478404625600513/Nv3hd_Dr_400x400.jpg"
                    rounded
                    raised={false}
                    alt="Image"
                  />
                </IconWrapperStyle>
              </Box>

              <Typography variant="h6">NBA Digital Worlds</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                เว็บไซต์หลักของเรา
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
              <Box sx={{ mb: 0.5 }}>
                <IconWrapperStyle
                  onClick={() => window.open('https://e-branch2.nbadigitalworlds.com/', '_blank')}
                >
                  <Image
                    src="https://scontent.fcnx2-1.fna.fbcdn.net/v/t1.6435-9/124823904_134675811738789_1925878336350011621_n.png?_nc_cat=104&ccb=1-5&_nc_sid=174925&_nc_eui2=AeG6o8kTpsVBbFMNWUGtCgHkPFCBLS2fxIs8UIEtLZ_Ei0igB_kUMl6bVDubn8fpPMGWB54HtSt9DuyBjMqFBQmH&_nc_ohc=vyXyeUR6SHsAX-CHG2I&_nc_ht=scontent.fcnx2-1.fna&oh=00_AT_qjqCvZVtsc5xdEEuI9llHxjEKWiPdnmZ9PYdZkvRxvA&oe=62299117"
                    rounded
                    raised={false}
                    alt="Image"
                  />
                </IconWrapperStyle>
              </Box>
              <Typography variant="h5">E-Branch</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                สำหรับตัวแทนศูนย์ชุมชน
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
              <IconWrapperStyle
                onClick={() => window.open('https://e-transfer.nbadigitalworlds.com/', '_blank')}
              >
                <Image
                  src="https://scontent.fcnx2-1.fna.fbcdn.net/v/t1.6435-9/120018763_101101201762917_3238496539064837074_n.png?_nc_cat=110&ccb=1-5&_nc_sid=174925&_nc_eui2=AeH6te0pt9UuEl0LtUAHAOQZSPfFIlU6KX9I98UiVTopf9VVABc1klm1grBvG8hLAUuEahtghANNvfbC0KaD-9v1&_nc_ohc=6wRi0OZNqugAX-syYmt&_nc_ht=scontent.fcnx2-1.fna&oh=00_AT9gfT0939QpocmUMHoumOJnXk-BKePy8K8woIxXVZPPQg&oe=6225FF46"
                  rounded
                  raised={false}
                  alt="Image"
                />
              </IconWrapperStyle>
              <Typography variant="h5">E-TRANFFR</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                บริษัท เอ็นบีเอ ดิจิตอล บิสซิเนส เซ็นเตอร์
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
              <IconWrapperStyle
                onClick={() => window.open('https://www.shipmileservice.com/', '_blank')}
              >
                <Image
                  src="https://www.shipsmileservices.com/wp-content/uploads/2021/08/logo-%E0%B8%8A%E0%B8%B4%E0%B8%9B%E0%B8%9B%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%A1%E0%B8%A5%E0%B9%8C-%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A7%E0%B8%B4%E0%B8%AA-new-verion-Final-create-01.jpg"
                  rounded
                  raised={false}
                  alt="Image"
                />
              </IconWrapperStyle>
              <Typography variant="h5">ShipSmile</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                SERVICES
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
