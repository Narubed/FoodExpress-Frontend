import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import androidFilled from '@iconify/icons-ant-design/android-filled';
import { CalendarOutlined } from '@ant-design/icons';
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
  color: theme.palette.warning.darker,
  backgroundColor: theme.palette.warning.lighter,
  '&:hover': {
    background: theme.palette.warning.lighter,
    boxShadow: '10px 10px 4px #DEB887'
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
  color: theme.palette.warning.dark,
  '&:hover': {
    background: theme.palette.warning.lighter,
    boxShadow: '10px 10px 4px #DEB887'
  },
  '&:last-child': {
    borderRight: 'solid 1px #cccccc'
  },
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.warning.dark, 0)} 0%, ${alpha(
    theme.palette.warning.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

// eslint-disable-next-line react/prop-types
export default function AppLastMonthIncome(props) {
  // eslint-disable-next-line react/prop-types
  const filterStatus = props.props.filter((f) => f.order_status === 'จัดส่งสำเร็จ');
  const lastMonthOrder = filterStatus.filter(
    (f) => new Date(f.order_product_date).getMonth() === new Date().getMonth() - 1
  );
  const reduceLastMonthOrder = lastMonthOrder.reduce(
    (sum, red) => sum + red.order_product_total,
    0
  );
  return (
    <RootStyle>
      <IconWrapperStyle>
        {/* <Icon icon={androidFilled} width={24} height={24} /> */}
        <CalendarOutlined style={{ fontSize: '28px' }} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(reduceLastMonthOrder)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        ยอดขายของเดือนที่ผ่านมา
      </Typography>
    </RootStyle>
  );
}
AppLastMonthIncome.propTypes = {
  props: PropTypes.array.isRequired
};
