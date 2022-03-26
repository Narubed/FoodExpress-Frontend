/* eslint-disable camelcase */
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import numeral from 'numeral';
import { Link as RouterLink } from 'react-router-dom';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import PropTypes from 'prop-types';
import ReactToPrint from 'react-to-print';
// material-tailwind
import '@material-tailwind/react/tailwind.css';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

import Button from '@material-tailwind/react/Button';

import CheckProductStock from './CheckProductStock';
// ----------------------------------------------------------------------
CheckOrderMemberMoreMenu.propTypes = {
  order_id: PropTypes.number,
  order_product_total: PropTypes.number,
  order_status: PropTypes.string
};
export default function CheckOrderMemberMoreMenu(props) {
  const dispatch = useDispatch();
  let componentRef = useRef();
  dispatch({ type: 'OPEN' });
  // eslint-disable-next-line camelcase
  const { order_id, Orderlist, row, order_product_total, order_status } = props;
  const [showModal, setShowModal] = useState(false);
  const [orderDetail, setOrderDetail] = useState([]);
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmExpress, setconfirmExpress] = useState(true);
  const detailOrder = async () => {
    const data = await axios.get(
      // eslint-disable-next-line camelcase
      `${process.env.REACT_APP_WEB_BACKEND}/getByOrderDetail_id/${order_id}`
    );
    console.log(data.data.data);
    setconfirmExpress(true);
    data.data.data.forEach((element) => {
      if (order_status !== 'รอจัดส่ง') {
        setconfirmExpress(false);
      }
      if (element.order_company_status === 'ตัดรอบการจัดส่งแล้ว') {
        setconfirmExpress(false);
      }
      if (element.order_company_status === 'ยังไม่ได้จัดส่ง') {
        setconfirmExpress(false);
      }
    });
    setOrderDetail(data.data.data);
    setShowModal(true);
  };
  const deleteOrderByMember = async () => {
    const data = {
      order_id,
      order_status: 'ผู้ใช้ยกเลิก'
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการยกเลิกออเดอร์นี้หรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'OPEN' });
        await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putStatusOrder`, data);
        Swal.fire({
          position: '',
          icon: 'success',
          title: 'คุณได้ยืนยันการยกเลิกออเดอร์นี้เเล้ว ',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          dispatch({ type: 'TURNOFF' });
        }, 1500);
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire('Cancelled', 'คุณทำการออกจากการยกเลิกออเดอร์ :)', 'error');
      }
    });
  };
  const confirmDelivery = async (req, res) => {
    await CheckProductStock(req);
    setShowModal(false);
  };
  const confirmExpressStatus = () => {
    setShowModal(false);
    const dataConfirmExpress = {
      order_id,
      order_status: 'จัดส่งสำเร็จ'
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณได้รับสินค้าทั้งหมดเเล้วใช่หรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ฉันได้รับสินค้าเเล้ว!',
      cancelButtonText: 'ยกเลิก!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'OPEN' });
        await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putStatusOrder`, dataConfirmExpress);
        Swal.fire({
          icon: 'success',
          title: 'ยืนยันการรับส่งสินค้าทั้งหมดแล้ว ',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          dispatch({ type: 'TURNOFF' });
        }, 1500);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'คุณได้ทำการยกเลิกการยืนยันสินค้าเเล้ว :)', 'error');
      }
    });
  };
  dispatch({ type: 'TURNOFF' });
  return (
    <>
      <>
        <IconButton ref={ref} onClick={() => setIsOpen(true)}>
          <Icon icon={moreVerticalFill} width={20} height={20} />
        </IconButton>

        <Menu
          open={isOpen}
          anchorEl={ref.current}
          onClose={() => setIsOpen(false)}
          PaperProps={{
            sx: { width: 200, maxWidth: '100%' }
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon="icon-park-outline:view-grid-detail" width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="รายระเอียด"
              primaryTypographyProps={{ variant: 'body2' }}
              onClick={() => detailOrder()}
            />
          </MenuItem>

          {order_status === 'รอตรวจสอบ' ? (
            <>
              <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
                <ListItemIcon>
                  <Icon icon="flat-color-icons:delete-database" width={24} height={24} />
                </ListItemIcon>
                <ListItemText
                  primary="ยกเลิกรายการนี้"
                  primaryTypographyProps={{ variant: 'body2' }}
                  onClick={() => deleteOrderByMember()}
                />
              </MenuItem>
            </>
          ) : null}
          {order_status === 'รอชำระเงิน' ? (
            <>
              <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
                <ListItemIcon>
                  <Icon icon="flat-color-icons:delete-database" width={24} height={24} />
                </ListItemIcon>
                <ListItemText
                  primary="ยกเลิกรายการนี้"
                  primaryTypographyProps={{ variant: 'body2' }}
                  onClick={() => deleteOrderByMember()}
                />
              </MenuItem>
            </>
          ) : null}
        </Menu>
        <Dialog
          open={showModal}
          onClose={() => setShowModal(false)}
          maxWidth="xl"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">รายระเอียดออเดอร์</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="px-6 py-3 text-left text-sm font-medium text-gray-1300 uppercase tracking-wider">
                ราคาสินค้าทั้งหมด {numeral(order_product_total).format()} บาท
              </div>{' '}
              {confirmExpress === true ? (
                <div className="grid grid-cols-2 gap-4 place-content-end h-48">
                  <Button
                    color="lightBlue"
                    buttonType="outline"
                    size="regular"
                    rounded={false}
                    block={false}
                    iconOnly={false}
                    ripple="dark"
                    onClick={() => confirmExpressStatus()}
                  >
                    ยืนยันการจัดส่งสำเร็จทั้งหมด
                  </Button>
                </div>
              ) : null}
              <div ref={(el) => (componentRef = el)}>
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
                                รหัสสินค้า
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                ชื่อประเภทสินค้า
                              </th>
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
                                จำนวนสินค้า
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                ราคาสินค้าต่อชิ้น
                              </th>

                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                สถานะสินค้า
                              </th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Edit</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {orderDetail.map((person) => (
                              <tr key={person.order_product_id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {person.order_product_id}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="ml-4">
                                      <div className="text-sm text-gray-500">
                                        {person.order_product_type_name}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {person.order_product_name}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {person.order_product_amoumt} {person.order_product_currency}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {/* {person.order_product_price} */}
                                  {numeral(person.order_product_price).format()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {person.order_company_status}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {person.order_company_status === 'ตัดรอบการจัดส่งแล้ว' ? (
                                    <Button
                                      color="purple"
                                      buttonType="outline"
                                      size="regular"
                                      rounded
                                      block={false}
                                      iconOnly={false}
                                      ripple="dark"
                                      onClick={() => confirmDelivery(person)}
                                    >
                                      ได้รับสินค้าชิ้นนี้เเล้ว
                                    </Button>
                                  ) : null}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="red"
              buttonType="link"
              onClick={() => setShowModal(false)}
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
    </>
  );
}
