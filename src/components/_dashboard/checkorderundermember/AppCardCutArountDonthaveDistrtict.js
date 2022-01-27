/* eslint-disable no-undef */
import { Icon } from '@iconify/react';
import { useEffect, useState, useRef, useReactToPrint } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from '@material-tailwind/react/Button';
import { CheckCircleOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import ReactToPrint from 'react-to-print';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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
  backgroundColor: theme.palette.error.lighter,
  '&:hover': {
    background: theme.palette.error.lighter,
    boxShadow: '10px 10px 4px red'
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
  color: theme.palette.error.dark,
  '&:hover': {
    background: theme.palette.error.lighter,
    boxShadow: '10px 10px 4px red'
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

export default function AppCardCutArountDonthaveDistrtict(props) {
  const [DataFilterProductName, setDataFilterProductName] = useState([]);
  const [Orderlist, setOrderlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  let componentRef = useRef();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const result = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getJoinOrder_Detail`);
    const filterOrderStatus = result.data.data.filter((f) => f.order_status === 'รอจัดส่ง');
    const filterCompanyStatus = filterOrderStatus.filter(
      (f) => f.order_company_status === 'ตัดรอบการจัดส่งแล้ว'
    );
    const filterProvince = filterCompanyStatus.filter(
      (f) => f.order_product_subdistrict === props.props.order_product_subdistrict
    );

    const filtereds = [];
    await filterProvince.forEach((item, index) => {
      const idx = filtereds.findIndex(
        (value) => value.order_product_name === item.order_product_name
      );
      if (idx !== -1) {
        // eslint-disable-next-line operator-assignment
        filtereds[idx].order_product_amoumt =
          filtereds[idx].order_product_amoumt + item.order_product_amoumt;
      } else {
        filtereds.push(item);
      }
    });
    setDataFilterProductName(filtereds);
    setOrderlist(result.data.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.props.order_product_subdistrict]);

  const CutArountOrderSubDistrict = async () => {
    const filterMyMemberIDME = props.GetAllMembers.filter(
      (f) => f.userId === sessionStorage.getItem('user')
    );
    const filterMySubDistrict = props.GetAllMembers.filter(
      (f) => f.subdistrict === props.props.order_product_subdistrict && f.level === 'subdistrict'
    );
    console.log(filterMySubDistrict);
    //
    //
    console.log('ตัดรอบออเดอร์ของตำบลนี้', props.props.order_product_subdistrict);
    const min = 1000;
    const max = 9999;
    const createReportID =
      85 +
      Date.now() +
      sessionStorage.getItem('user') +
      Math.floor(Math.random() * (max - min) + min);
    const setMemberDelivery = {
      member_delivery_id: createReportID,
      member_delivery_member_id: sessionStorage.getItem('user'),
      member_delivery_status: 'ตัดรอบแล้ว',
      member_delivery_province: filterMyMemberIDME[0].province,
      member_delivery_level: filterMyMemberIDME[0].level,
      receiver_delivery_member_id: filterMySubDistrict[0].userId
    };
    await axios.post(
      `${process.env.REACT_APP_WEB_BACKEND}/portDeliveryInProvice`,
      setMemberDelivery
    );

    const dataMemberDeliveryDetail = [];
    DataFilterProductName.forEach((value) => {
      const setMemberDeliveryDetail = {
        member_delivery_id: createReportID,
        receiver_delivery_detail_member_id: filterMySubDistrict[0].userId,
        member_delivery_detail_product_id: value.order_product_id,
        member_delivery_detail_product_name: value.order_product_name,
        member_delivery_detail_product_amoumt: value.order_product_amoumt,
        member_delivery_detail_product_currency: value.currency
      };
      dataMemberDeliveryDetail.push(setMemberDeliveryDetail);
    });
    dataMemberDeliveryDetail.map(
      async (value) =>
        // eslint-disable-next-line no-return-await
        await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/portDeliveryDetailInProvice`, value)
    );
    console.log(setMemberDelivery);
  };
  return (
    <>
      <RootStyle onClick={() => setShowModal(true)}>
        <IconWrapperStyle>
          <CheckCircleOutlined style={{ fontSize: '28px' }} />
        </IconWrapperStyle>
        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
          ตำบล
        </Typography>
        <Typography variant="h3">{props.props.order_product_subdistrict}</Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
          {/* {props.props.cut_arount_date
            ? dayjs(props.props.cut_arount_date).locale('th').format('DD MMMM YYYY')
            : null} */}
        </Typography>
      </RootStyle>
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div ref={(el) => (componentRef = el)}>
          <DialogTitle id="alert-dialog-title">
            ตำบล: {props.props.order_product_subdistrict}
            <div className="flex justify-end ...">
              <Button
                color="red"
                buttonType="outline"
                size="sm"
                rounded={false}
                block={false}
                iconOnly={false}
                ripple="dark"
                onClick={() => CutArountOrderSubDistrict()}
              >
                ตัดรอบออเดอร์ของตำบลนี้
              </Button>
            </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              ชื่อสินค้า
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              จำนวน
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              นับเป็น
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {/* คลิ๊ก */}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {DataFilterProductName.map((data) => (
                            <tr key={data.order_product_name}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {data.order_product_name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {data.order_product_amoumt}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{data.currency}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" />
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </div>
        <DialogActions>
          <Button
            color="red"
            buttonType="link"
            onClick={(e) => setShowModal(false)}
            ripple="dark"
            danger
          >
            ยกเลิก
          </Button>
          {/* <Button onClick={handlePrint}> oss</Button> */}
          <ReactToPrint
            trigger={() => (
              <Button
                color="lightBlue"
                buttonType="link"
                size="regular"
                rounded
                block={false}
                iconOnly
                ripple="dark"
              >
                <Icon icon="flat-color-icons:print" width={32} height={32} />
              </Button>
            )}
            content={() => componentRef}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}
AppCardCutArountDonthaveDistrtict.propTypes = {
  props: PropTypes.array.isRequired,
  GetAllMembers: PropTypes.array.isRequired
};
