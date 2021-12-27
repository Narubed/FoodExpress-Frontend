import { useEffect } from 'react';
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import Chart from 'chart.js';
import axios from 'axios';
// material
import { Card, CardHeader, Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

export default function AppWebsiteVisits() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const a = await axios.get('http://localhost:8000/getAllOrder');
    let filterStatusOld = a.data.data.filter((f) => f.order_status === 'จัดส่งสำเร็จ');
    const roleMember = sessionStorage.getItem('role');
    if (roleMember === 'Member') {
      const c = a.data.data.filter((f) => f.order_member_id === sessionStorage.getItem('user'));
      filterStatusOld = c.filter((f) => f.order_status === 'จัดส่งสำเร็จ');
    }

    const filterStatus = filterStatusOld;
    const Order = filterStatus.filter(
      (f) => new Date(f.order_product_date).getYear() === new Date().getYear()
    );
    const OldOrder = filterStatus.filter(
      (f) => new Date(f.order_product_date).getYear() === new Date().getYear() - 1
    );
    // ----------------------------------------------------------------------------
    const setMonth1 = new Date();
    setMonth1.setMonth(1);
    const January = Order.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth1.getMonth()
    );
    const ReduceJanuary = January.reduce((sum, b) => sum + b.order_product_total, 0);

    const setMonth2 = new Date();
    setMonth2.setMonth(2);
    const February = Order.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth2.getMonth()
    );
    const ReduceFebruary = February.reduce((sum, b) => sum + b.order_product_total, 0);

    const setMonth3 = new Date();
    setMonth3.setMonth(3);
    const March = Order.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth3.getMonth()
    );
    const ReduceMarch = March.reduce((sum, b) => sum + b.order_product_total, 0);

    const setMonth4 = new Date();
    setMonth4.setMonth(4);
    const April = Order.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth4.getMonth()
    );
    const ReduceApril = April.reduce((sum, b) => sum + b.order_product_total, 0);

    const setMonth5 = new Date();
    setMonth5.setMonth(5);
    const May = Order.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth5.getMonth()
    );
    const ReduceMay = May.reduce((sum, b) => sum + b.order_product_total, 0);

    const setMonth6 = new Date();
    setMonth6.setMonth(6);
    const June = Order.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth6.getMonth()
    );
    const ReduceJune = June.reduce((sum, b) => sum + b.order_product_total, 0);

    const setMonth7 = new Date();
    setMonth7.setMonth(7);
    const July = Order.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth7.getMonth()
    );
    const ReduceJuly = July.reduce((sum, b) => sum + b.order_product_total, 0);

    const setMonth8 = new Date();
    setMonth8.setMonth(8);
    const August = Order.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth8.getMonth()
    );
    const ReduceAugust = August.reduce((sum, b) => sum + b.order_product_total, 0);

    const setMonth9 = new Date();
    setMonth9.setMonth(9);
    const September = Order.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth9.getMonth()
    );
    const ReduceSeptember = September.reduce((sum, b) => sum + b.order_product_total, 0);

    const setMonth10 = new Date();
    setMonth10.setMonth(10);
    const October = Order.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth10.getMonth()
    );
    const ReduceOctober = October.reduce((sum, b) => sum + b.order_product_total, 0);

    const setMonth11 = new Date();
    setMonth11.setMonth(11);
    const November = Order.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth11.getMonth()
    );
    const ReduceNovember = November.reduce((sum, b) => sum + b.order_product_total, 0);

    const setMonth12 = new Date();
    setMonth12.setMonth(12);
    const December = Order.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth12.getMonth()
    );
    const ReduceDecember = December.reduce((sum, b) => sum + b.order_product_total, 0);
    // ------------------------------------------------------------------------------------------------

    const January2 = OldOrder.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth1.getMonth()
    );
    const ReduceJanuary2 = January2.reduce((sum, b) => sum + b.order_product_total, 0);

    const February2 = OldOrder.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth2.getMonth()
    );
    const ReduceFebruary2 = February2.reduce((sum, b) => sum + b.order_product_total, 0);

    const March2 = OldOrder.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth3.getMonth()
    );
    const ReduceMarch2 = March2.reduce((sum, b) => sum + b.order_product_total, 0);

    const April2 = OldOrder.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth4.getMonth()
    );
    const ReduceApril2 = April2.reduce((sum, b) => sum + b.order_product_total, 0);

    const May2 = OldOrder.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth5.getMonth()
    );
    const ReduceMay2 = May2.reduce((sum, b) => sum + b.order_product_total, 0);

    const June2 = OldOrder.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth6.getMonth()
    );
    const ReduceJune2 = June2.reduce((sum, b) => sum + b.order_product_total, 0);

    const July2 = OldOrder.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth7.getMonth()
    );
    const ReduceJuly2 = July2.reduce((sum, b) => sum + b.order_product_total, 0);

    const August2 = OldOrder.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth8.getMonth()
    );
    const ReduceAugust2 = August2.reduce((sum, b) => sum + b.order_product_total, 0);

    const September2 = OldOrder.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth9.getMonth()
    );
    const ReduceSeptember2 = September2.reduce((sum, b) => sum + b.order_product_total, 0);

    const October2 = OldOrder.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth10.getMonth()
    );
    const ReduceOctober2 = October2.reduce((sum, b) => sum + b.order_product_total, 0);

    const November2 = OldOrder.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth11.getMonth()
    );
    const ReduceNovember2 = November2.reduce((sum, b) => sum + b.order_product_total, 0);

    const December2 = OldOrder.filter(
      (f) => new Date(f.order_product_date).getUTCMonth() === setMonth12.getMonth()
    );
    const ReduceDecember2 = December2.reduce((sum, b) => sum + b.order_product_total, 0);
    // ------------------------------------------------------------------------------------------------
    const config = {
      type: 'line',
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ],
        datasets: [
          {
            label: new Date().getFullYear(),
            backgroundColor: '#03a9f4',
            borderColor: '#03a9f4',
            data: [
              ReduceJanuary,
              ReduceFebruary,
              ReduceMarch,
              ReduceApril,
              ReduceMay,
              ReduceJune,
              ReduceJuly,
              ReduceAugust,
              ReduceSeptember,
              ReduceOctober,
              ReduceNovember,
              ReduceDecember
            ],
            fill: false
          },
          {
            label: new Date().getFullYear() - 1,
            fill: false,
            backgroundColor: '#ff9800',
            borderColor: '#ff9800',
            data: [
              ReduceJanuary2,
              ReduceFebruary2,
              ReduceMarch2,
              ReduceApril2,
              ReduceMay2,
              ReduceJune2,
              ReduceJuly2,
              ReduceAugust2,
              ReduceSeptember2,
              ReduceOctober2,
              ReduceNovember2,
              ReduceDecember2
            ]
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: 'Sales Charts',
          fontColor: 'white'
        },
        legend: {
          labels: {
            fontColor: 'black'
          },
          align: 'end',
          position: 'bottom'
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: 'rgba(17,17,17,.7)'
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: 'Month',
                fontColor: 'white'
              },
              gridLines: {
                display: false,
                borderDash: [2],
                borderDashOffset: [2],
                color: 'rgba(33, 37, 41, 0.3)',
                zeroLineColor: 'rgba(0, 0, 0, 0)',
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2]
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                fontColor: 'rgba(17,17,17,.7)'
              },
              display: true,
              scaleLabel: {
                display: false,
                labelString: 'Value',
                fontColor: 'white'
              },
              gridLines: {
                borderDash: [3],
                borderDashOffset: [3],
                drawBorder: false,
                color: 'rgba(17, 17, 17, 0.15)',
                zeroLineColor: 'rgba(33, 37, 41, 0)',
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2]
              }
            }
          ]
        }
      }
    };
    const ctx = document.getElementById('line-chart').getContext('2d');
    window.myLine = new Chart(ctx, config);
  }, []);
  return (
    <Card>
      <CardHeader
        avatar={
          // eslint-disable-next-line no-undef
          <Avatar sx={{ bgcolor: 'blue' }} aria-label="recipe">
            NBA
          </Avatar>
        }
        color="orange"
        contentPosition="left"
        title="Overviews"
      />
      <br />
      <Box sx={{ width: 1, height: 360 }} dir="ltr">
        <canvas id="line-chart" />
      </Box>
    </Card>
  );
}
