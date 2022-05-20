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
                  onClick={() => window.open('https://nbadigitalservice.com/', '_blank')}
                >
                  <Image
                    // eslint-disable-next-line global-require
                    src={require('../../../assets/img/NBA1.jpg').default}
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
                    // eslint-disable-next-line global-require
                    src={require('../../../assets/img/NBA2.png').default}
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
                  // eslint-disable-next-line global-require
                  src={require('../../../assets/img/NBA3.png').default}
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
                onClick={() => window.open('https://nba-express.nbadigitalworlds.com/', '_blank')}
              >
                <Image
                  // eslint-disable-next-line global-require
                  src={require('../../../assets/img/nbaexpress02.png').default}
                  rounded
                  raised={false}
                  alt="Image"
                />
              </IconWrapperStyle>
              <Typography variant="h5">NBA Express</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                เว็บขนส่งของเรา
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
