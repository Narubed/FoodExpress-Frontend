import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import androidFilled from '@iconify/icons-ant-design/android-filled';
import { BankOutlined } from '@ant-design/icons';
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
  color: theme.palette.error.darker,
  backgroundColor: theme.palette.error.lighter
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
  color: theme.palette.error.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0)} 0%, ${alpha(
    theme.palette.error.dark,
    0.24
  )} 100%)`
}));
// ----------------------------------------------------------------------

// eslint-disable-next-line react/prop-types
export default function AppTotalIncome(props) {
  // eslint-disable-next-line react/prop-types
  const filterStatus = props.props.filter((f) => f.order_status === 'จัดส่งสำเร็จ');
  const reduceOrder = filterStatus.reduce((sum, red) => sum + red.order_product_total, 0);
  return (
    <RootStyle>
      <IconWrapperStyle>
        {/* <Icon icon={androidFilled} width={24} height={24} /> */}
        <BankOutlined style={{ fontSize: '28px' }} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(reduceOrder)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        รายได้ทั้งหมดของเว็บไซต์
      </Typography>
    </RootStyle>
  );
}
AppTotalIncome.propTypes = {
  props: PropTypes.array.isRequired
};
