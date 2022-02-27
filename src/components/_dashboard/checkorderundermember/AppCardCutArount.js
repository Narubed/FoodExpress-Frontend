/* eslint-disable no-return-await */
/* eslint-disable no-undef */
import { Icon } from '@iconify/react';
import { useEffect, useState, useRef, useReactToPrint } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from '@material-tailwind/react/Button';
import Input from '@material-tailwind/react/Input';
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

export default function AppCardCutArount(props) {
  const dispatch = useDispatch();
  dispatch({ type: 'OPEN' });
  const navigate = useNavigate();
  const [DataFilterProductName, setDataFilterProductName] = useState([]);
  const [Orderlist, setOrderlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlertNoProductINStock, setAlertNoProductINStock] = useState(false);
  const [showalertValueNOTEnough, setalertValueNOTEnough] = useState(false);
  const [showNoProductINStock, setNoProductINStock] = useState([]);
  const [showValueNOTEnough, setValueNOTEnough] = useState([]);

  let componentRef = useRef();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const result = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getJoinOrder_Detail`);
    const filterOrderStatus = result.data.data.filter((f) => f.order_status === 'รอจัดส่ง');
    const filterCompanyStatus = filterOrderStatus.filter(
      (f) => f.order_company_status === 'ตัดรอบการจัดส่งแล้ว'
    );
    const filterStatusINProvince = filterCompanyStatus.filter(
      (f) => f.order_status_in_province === 'จังหวัดยังไม่ได้จัดส่ง'
    );

    const filterDeleteOrderMe = filterStatusINProvince.filter(
      (f) => f.order_member_id !== sessionStorage.getItem('user')
    );
    const filterDistrict = filterDeleteOrderMe.filter(
      (f) => f.order_product_district === props.props.order_product_district
    );
    setOrderlist(filterDistrict);
    const filtereds = [];
    await filterDistrict.forEach((item, index) => {
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
  }, [props.props.order_product_district]);

  const confirmAppCardCutArount = async () => {
    setShowModal(false);
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการตัดรอบสินค้านี้หรือไม่!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await CheckProductStock();
      }
    });
  };
  const CheckProductStock = async () => {
    const GetStockMe = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getStockProductMemberByUserID/${sessionStorage.getItem(
        'user'
      )}`
    );

    const alertNoProductINStock = [];
    const alertValueNOTEnough = [];
    const valuesPutStockMember = [];
    const valueReportMember = [];
    DataFilterProductName.forEach((value, index) => {
      const filterINStock = GetStockMe.data.data.filter(
        (f) => f.stock_product_id === parseInt(value.order_product_id, 10)
      );
      if (filterINStock.length === 0) {
        alertNoProductINStock.push(value);
      } else if (filterINStock[0].stock_product_amount < value.order_product_amoumt) {
        alertValueNOTEnough.push(value);
      } else {
        valueReportMember.push(value);
        valuesPutStockMember.push({
          id_stock_product_member_id: filterINStock[0].id_stock_product_member_id,
          stock_product_amount: filterINStock[0].stock_product_amount - value.order_product_amoumt
        });
      }
    });
    setNoProductINStock(alertNoProductINStock);
    setValueNOTEnough(alertValueNOTEnough);
    if (alertNoProductINStock.length > 0) {
      setAlertNoProductINStock(true);
      setShowModal(false);
    }
    if (alertValueNOTEnough.length > 0) {
      setalertValueNOTEnough(true);
      setShowModal(false);
    }
    if (alertNoProductINStock.length === 0 && alertValueNOTEnough.length === 0) {
      valueReportMember.forEach(async (value, index) => {
        const ID = Date.now() + value.order_member_id + index;
        const dataReportMember = {
          report_order_id: ID,
          id_order_rider_id: ID,
          report_order_member_userid: parseInt(sessionStorage.getItem('user'), 10),
          report_order_product_id: parseInt(value.order_product_id, 10),
          report_order_product_name: value.order_product_name,
          report_order_product_amount_in: 0,
          report_order_product_amount_out: parseInt(value.order_product_amoumt, 10),
          report_order_status: 'จ่ายออก'
        };
        // ยิง --------
        dispatch({ type: 'OPEN' });
        await axios.post(
          `${process.env.REACT_APP_WEB_BACKEND}/portReportOrderMember`,
          dataReportMember
        );
        //-----
      });

      valuesPutStockMember.map(
        async (value) =>
          await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putAmountStockProductMember`, value)
      );

      Orderlist.map(async (value) => {
        const dataChangeOrderDetail = {
          // เปลี่ยนเป็นยิงใน status จังหวัดแทน
          order_detail_id: value.order_detail_id,
          order_status_in_province: 'จังหวัดตัดรอบการจัดส่งแล้ว'
        };
        await axios.put(
          `${process.env.REACT_APP_WEB_BACKEND}/putStatusOrderDetail_inProvince`,
          dataChangeOrderDetail
        );
      });
      dispatch({ type: 'TURNOFF' });
      await CutArountOrderDistrict();
    }
  };
  const CutArountOrderDistrict = async () => {
    const filterMyMemberIDME = props.GetAllMembers.filter(
      (f) => f.userId === sessionStorage.getItem('user')
    );
    const filterMyDistrict = props.GetAllMembers.filter(
      (f) => f.district === props.props.order_product_district && f.level === 'district'
    );
    dispatch({ type: 'OPEN' });
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
      receiver_delivery_member_id: filterMyDistrict[0].userId
    };
    await axios.post(
      `${process.env.REACT_APP_WEB_BACKEND}/portDeliveryInProvice`,
      setMemberDelivery
    );
    const dataMemberDeliveryDetail = [];
    await DataFilterProductName.forEach(async (value) => {
      const setMemberDeliveryDetail = await {
        member_delivery_id: createReportID,
        member_delivery_detail_product_id: parseInt(value.order_product_id, 10),
        member_delivery_detail_product_name: value.order_product_name,
        member_delivery_detail_product_amoumt: value.order_product_amoumt,
        member_delivery_detail_product_currency: value.currency
      };

      dataMemberDeliveryDetail.push(setMemberDeliveryDetail);
    });
    dataMemberDeliveryDetail.forEach(async (value) => {
      await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/portDeliveryDetailInProvice`, value);
    });

    Swal.fire({
      position: '',
      icon: 'success',
      title: 'คุณได้ทำการยืนยันการตัดรอบแล้ว ',
      showConfirmButton: false,
      timer: 2500
    });
    setTimeout(() => {
      dispatch({ type: 'TURNOFF' });
      navigate('/dashboard/CheckOrderUnderMemberApp/CheckOrderMemberCreatBarCodeApp', {
        replace: true
      });
    }, 2500);
  };
  dispatch({ type: 'TURNOFF' });
  return (
    <>
      <RootStyle onClick={() => setShowModal(true)}>
        <IconWrapperStyle>
          <CheckCircleOutlined style={{ fontSize: '28px' }} />
        </IconWrapperStyle>
        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
          อำเภอ
        </Typography>
        <Typography variant="h3">{props.props.order_product_district}</Typography>
      </RootStyle>
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div ref={(el) => (componentRef = el)}>
          <DialogTitle id="alert-dialog-title">
            อำเภอ: {props.props.order_product_district}
            <div className="flex justify-end ...">
              <Button
                color="lightBlue"
                buttonType="outline"
                size="sm"
                rounded={false}
                block={false}
                iconOnly={false}
                ripple="dark"
                onClick={() => confirmAppCardCutArount()}
              >
                ตัดรอบออเดอร์ของอำเภอนี้
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
      <Dialog
        maxWidth="sm"
        fullWidth
        open={showAlertNoProductINStock}
        onClose={() => setAlertNoProductINStock(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title"> {`ไม่มีสินค้าชิ้นนี้ในสต๊อก  `}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {showNoProductINStock.map((m) => (
              <>
                <br />
                <Input
                  disabled
                  type="text"
                  color="lightBlue"
                  size="regular"
                  outline={false}
                  placeholder="ชื่อสินค้า"
                  defaultValue={m.order_product_name}
                />
              </>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="pink" onClick={() => setAlertNoProductINStock(false)}>
            ออก
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={showalertValueNOTEnough}
        onClose={() => setalertValueNOTEnough(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {' '}
          {`สินค้าในสต๊อกมีไม่เพียงพอต่อการจำหน่าย  `}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {showValueNOTEnough.map((m) => (
              <>
                <br />
                <Input
                  disabled
                  type="text"
                  color="lightBlue"
                  size="regular"
                  outline={false}
                  placeholder="ชื่อสินค้า"
                  defaultValue={m.order_product_name}
                />
              </>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="pink" onClick={() => setalertValueNOTEnough(false)}>
            ออก
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
AppCardCutArount.propTypes = {
  props: PropTypes.array.isRequired,
  GetAllMembers: PropTypes.array.isRequired
};
