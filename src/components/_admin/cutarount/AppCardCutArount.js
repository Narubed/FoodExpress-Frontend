/* eslint-disable no-undef */
import { Icon } from '@iconify/react';
import { useEffect, useState, useRef, useReactToPrint } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import androidFilled from '@iconify/icons-ant-design/android-filled';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';
import { CheckCircleOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import ReactToPrint from 'react-to-print';
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
  const [DataFilterProductName, setDataFilterProductName] = useState([]);
  const [Orderlist, setOrderlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  let componentRef = useRef();
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current
  // });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const result = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getJoinOrder_Detail`);
    const filterOrderStatus = result.data.data.filter((f) => f.order_status === 'รอจัดส่ง');
    const filterCompanyStatus = filterOrderStatus.filter(
      (f) => f.order_company_status === 'ตัดรอบการจัดส่งแล้ว'
    );
    const filterProvince = filterCompanyStatus.filter(
      (f) => f.order_product_province === props.props.order_product_province
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
  }, [props.props.order_product_province]);

  const onClickCutArountOrder = () => {
    const filterOrderStatus = Orderlist.filter((f) => f.order_status === 'รอจัดส่ง');
    const filterCompanyStatus = filterOrderStatus.filter(
      (f) => f.order_company_status === 'ยังไม่ได้จัดส่ง'
    );
    const filterProvince = filterCompanyStatus.filter(
      (f) => f.order_product_province === props.props.order_product_province
    );
    const today = new Date();
    const date =
      today.getFullYear() +
      (today.getMonth() + 1) +
      today.getDate() +
      today.getTime() +
      sessionStorage.getItem('user');
    const dataCutAroundOrder = {
      cut_arount_id: date,
      cut_arount_province: props.props.order_product_province,
      cut_arount_status: 'ตัดรอบการจัดส่งแล้ว'
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการตัดรอบการส่งนี้หรือไหม ?!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cut arount it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.post('http://localhost:8000/CreateCutArount', dataCutAroundOrder);
        // console.log(dataCutAroundOrder);
        // eslint-disable-next-line array-callback-return
        await filterProvince.map(async (value) => {
          const dataPutOrderDetail = {
            order_detail_id: value.order_detail_id,
            cut_arount_id: dataCutAroundOrder.cut_arount_id,
            order_company_status: 'ตัดรอบการจัดส่งแล้ว'
          };
          await axios.put('http://localhost:8000/putCutArountStatus', dataPutOrderDetail);
          // console.log(dataPutOrderDetail);
        });
        Swal.fire('ยืนยัน!', 'ยืนยันการตัดรอบสินค้านี้แล้ว.', 'success');
        // setTimeout(() => {
        //   window.location.reload(false);
        // }, 1000);
      }
    });
  };

  return (
    <>
      <RootStyle onClick={() => setShowModal(true)}>
        <IconWrapperStyle>
          <CheckCircleOutlined style={{ fontSize: '28px' }} />
        </IconWrapperStyle>
        <Typography variant="h3">{props.props.order_product_province}</Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
          {props.props.cut_arount_date
            ? dayjs(props.props.cut_arount_date).locale('th').format('DD MMMM YYYY')
            : null}
          {/* {`${DataFilterProductName.reduce(
            (value, item) => value + item.order_product_amoumt * item.unitkg,
            0
          )} กิโลกรัม`} */}
        </Typography>
      </RootStyle>
      <Modal size="lg" active={showModal} toggler={() => setShowModal(false)}>
        <div ref={(el) => (componentRef = el)}>
          <div>
            <ModalHeader toggler={() => setShowModal(false)}>
              จังหวัด: {props.props.order_product_province}
            </ModalHeader>
          </div>
          <ModalBody>
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
                            จำนวนนับเป็นกิโล
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
                              <div className="text-sm text-gray-900">{data.order_product_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {data.order_product_amoumt * data.unitkg}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </div>
        <ModalFooter>
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
        </ModalFooter>
      </Modal>
    </>
  );
}
AppCardCutArount.propTypes = {
  props: PropTypes.array.isRequired
};
