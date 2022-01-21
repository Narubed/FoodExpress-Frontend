import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import androidFilled from '@iconify/icons-ant-design/android-filled';
import { HourglassOutlined } from '@ant-design/icons';
// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.info.darker,
  backgroundColor: theme.palette.info.lighter,
  '&:hover': {
    background: theme.palette.info.lighter,
    boxShadow: '10px 10px 4px blue'
  },
  '&:last-child': {
    borderRight: 'solid 1px #cccccc'
  }
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.info.dark,

  '&:hover': {
    background: theme.palette.info.lighter,
    boxShadow: '10px 10px 4px blue'
  },
  '&:last-child': {
    borderRight: 'solid 1px #cccccc'
  },
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.info.dark, 0)} 0%, ${alpha(
    theme.palette.info.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

// eslint-disable-next-line react/prop-types
export default function AppWaitingforDelivery(props) {
  // eslint-disable-next-line react/prop-types
  const filterStatus = props.props.filter((f) => f.order_status === 'รอจัดส่ง');
  return (
    <RootStyle>
      <IconWrapperStyle>
        {/* <Icon icon={androidFilled} width={24} height={24} /> */}
        <HourglassOutlined style={{ fontSize: '28px' }} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(filterStatus.length)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        จำนวนออเดอร์ที่รอจัดส่ง
      </Typography>
    </RootStyle>
  );
}
AppWaitingforDelivery.propTypes = {
  props: PropTypes.array.isRequired
};
