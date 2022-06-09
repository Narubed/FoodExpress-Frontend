/* eslint-disable operator-assignment */
import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from '@material-tailwind/react/Button';
import { CheckCircleOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
// material
import { alpha, styled } from '@mui/material/styles';
import {
  Card,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@mui/material';
// utils
import postActionAdmin from '../../../../utils/postActionAdmin';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter,
  '&:hover': {
    background: '#7FFFD4',
    boxShadow: '10px 10px 4px green'
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
  color: theme.palette.primary.dark,
  '&:hover': {
    background: '#7FFFD4',
    boxShadow: '5px 5px 2px green'
  },
  '&:last-child': {
    borderRight: 'solid 1px #cccccc'
  },
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
// ----------------------------------------------------------------------

export default function AppCardProvince(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [DataFilterProductName, setDataFilterProductName] = useState([]);
  const [OrderPartner, setOrderPartner] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const filerPartner = props.valueDetail.filter(
      (item) => item.odd_partner_id === props.props.odd_partner_id
    );
    setOrderPartner(filerPartner);
    const filtereds = [];
    await filerPartner.forEach((item, index) => {
      const idx = filtereds.findIndex((value) => value.odd_product_name === item.odd_product_name);
      if (idx !== -1) {
        filtereds[idx].odd_product_amount =
          filtereds[idx].odd_product_amount + item.odd_product_amount;
      } else {
        filtereds.push(item);
      }
    });
    setDataFilterProductName(filtereds);
    // setOrderlist(result.data.data);
  }, [props.props.odd_partner_id]);

  const onClickCutArountOrder = () => {
    setShowModal(false);
    const findDate = OrderPartner.map((m) => m.odd_timestamp);
    findDate.sort((a, b) => new Date(a) - new Date(b));
    const firstDateOrder = findDate.shift();
    const lastDateOrder = findDate.pop();
    const dataCutAroundOrder = {
      // postCutArount
      cao_partner_id: props.props.odd_partner_id,
      cao_level: props.props.partner_level,
      cao_level_name: props.props.partner_sublevel_name,
      cao_status: 'ตัดรอบการจัดส่งแล้ว',
      cao_first_date: firstDateOrder,
      cao_last_data: lastDateOrder === undefined ? firstDateOrder : lastDateOrder
    };

    const data = `ตัดรอบของ ${props.props.partner_sublevel_name} ออเดอร์ตั้งเเต่วันที่${dataCutAroundOrder.cao_first_date} - วันที่ ${dataCutAroundOrder.cao_last_data} `;
    const postReportAdmin = {
      id_report_action_admin: Date.now().toString() + data[0].order_id,
      report_action_admin_id: sessionStorage.getItem('user'),
      report_action_order_id: dataCutAroundOrder.cut_arount_id,
      report_action_admin_value: data,
      report_action_admin_date: new Date()
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการตัดรอบการส่งนี้หรือไหม ?!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'OPEN' });
        let cutarountid = '';

        await axios
          .post(`${process.env.REACT_APP_PARTNER_API}/cut_arount_order`, dataCutAroundOrder)
          .then((res) => {
            cutarountid = res.data.cutArount_id;
          })
          .catch((error) => {
            console.log(error);
          });
        postActionAdmin(postReportAdmin);
        // eslint-disable-next-line array-callback-return
        OrderPartner.map(async (value) => {
          const dataPutOrderDetail = {
            odd_cutarount_id: cutarountid,
            odd_status: 'ตัดรอบการจัดส่งแล้ว'
          };
          await axios.put(
            `${process.env.REACT_APP_PARTNER_API}/order_detail/${value._id}`,
            dataPutOrderDetail
          );
        });
        dispatch({ type: 'TURNOFF' });
        Swal.fire({
          icon: 'success',
          title: 'ยืนยันการตัดรอบสินค้านี้แล้ว',
          showConfirmButton: false,
          timer: 2500
        });

        setTimeout(() => {
          navigate('/admin/AdminCutArountPartnerApp', {
            replace: true
          });
        }, 2500);
      }
    });
  };

  return (
    <>
      <RootStyle onClick={() => setShowModal(true)}>
        <IconWrapperStyle>
          <CheckCircleOutlined style={{ fontSize: '28px' }} />
        </IconWrapperStyle>
        <Typography variant="h3">{props.props.partner_sublevel_name}</Typography>
      </RootStyle>

      <Dialog
        open={showModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setShowModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {' '}
          {props.props.partner_level}: {props.props.partner_sublevel_name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
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
                            {/* คลิ๊ก */}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {DataFilterProductName.map((data) => (
                          <tr key={data.odd_product_name}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{data.odd_product_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {data.odd_product_amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {data.odd_product_currency}
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
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="purple"
            buttonType="outline"
            size="sm"
            rounded
            block={false}
            iconOnly={false}
            ripple="dark"
            onClick={() => onClickCutArountOrder()}
          >
            ยืนยันการตัดออเดอร์นี้
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
AppCardProvince.propTypes = {
  props: PropTypes.array.isRequired
};
