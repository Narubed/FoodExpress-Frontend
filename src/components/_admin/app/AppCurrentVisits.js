import { useEffect, useState } from 'react';
import { merge, parseInt } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
import Avatar from '@mui/material/Avatar';
// material-tailwind
import '@material-tailwind/react/tailwind.css';
import Button from '@material-tailwind/react/Button';

// utils
import axios from 'axios';
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

export default function AppCurrentVisits() {
  const [waitExpress, setwaitExpress] = useState(0);
  const [waitBuy, setwaitBuy] = useState(0);
  const [pending, setpending] = useState(0);
  const [succeed, setsucceed] = useState(0);
  const [userCancel, setuserCancel] = useState(0);
  const [adminCancel, setadminCancel] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getOrder = await axios.get('http://localhost:8000/getAllOrder');
    let getAllOrder = getOrder.data.data;
    const roleMember = sessionStorage.getItem('role');
    if (roleMember === 'Member') {
      getAllOrder = getOrder.data.data.filter(
        (f) => f.order_member_id === sessionStorage.getItem('user')
      );
    }

    const waitExpress = getAllOrder.filter((f) => f.order_status === 'รอจัดส่ง');
    setwaitExpress(
      waitExpress.length === 0 ? 0 : new Intl.NumberFormat().format(waitExpress.length)
    );
    const waitBuy = getAllOrder.filter((f) => f.order_status === 'รอชำระเงิน');
    setwaitBuy(waitBuy.length === 0 ? 0 : new Intl.NumberFormat().format(waitBuy.length));
    const waitpending = getAllOrder.filter((f) => f.order_status === 'รอตรวจสอบ');
    setpending(waitpending.length === 0 ? 0 : new Intl.NumberFormat().format(waitpending.length));
    const succeed = getAllOrder.filter((f) => f.order_status === 'จัดส่งสำเร็จ');
    setsucceed(succeed.length === 0 ? 0 : new Intl.NumberFormat().format(succeed.length));
    const userCancel = getAllOrder.filter((f) => f.order_status === 'ผู้ใช้ยกเลิก');
    setuserCancel(userCancel.length === 0 ? 0 : new Intl.NumberFormat().format(userCancel.length));
    const adminCancel = getAllOrder.filter((f) => f.order_status === 'ผู้ดูแลระบบยกเลิก');
    setadminCancel(
      adminCancel.length === 0 ? 0 : new Intl.NumberFormat().format(adminCancel.length)
    );
  }, []);
  const theme = useTheme();
  const CHART_DATA = [
    parseInt(waitExpress),
    parseInt(waitBuy),
    parseInt(pending),
    parseInt(succeed),
    parseInt(userCancel),
    parseInt(adminCancel)
  ];
  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.error.main
    ],
    labels: [
      'รอจัดส่ง',
      'รอชำระเงิน',
      'รอตรวจสอบ',
      'จัดส่งสำเร็จ',
      'ผู้ใช้ยกเลิก',
      'ผู้ดูแลระบบยกเลิก'
    ],
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } }
    }
  });

  return (
    <Card>
      <CardHeader
        avatar={
          // eslint-disable-next-line no-undef
          <Avatar sx={{ bgcolor: '#76ff03' }} aria-label="recipe">
            NBA
          </Avatar>
        }
        color="orange"
        contentPosition="left"
        title="Overviews"
      />

      <ChartWrapperStyle dir="ltr">
        {' '}
        <Button color="lightBlue" ripple="light">
          Button
        </Button>
        <ReactApexChart type="pie" series={CHART_DATA} options={chartOptions} height={280} />
      </ChartWrapperStyle>
    </Card>
  );
}
