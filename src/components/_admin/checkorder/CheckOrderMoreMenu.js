/* eslint-disable camelcase */
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import numeral from 'numeral';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import PropTypes from 'prop-types';
// material-tailwind
import '@material-tailwind/react/tailwind.css';
import Input from '@material-tailwind/react/Input';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  TableContainer,
  Table
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';

import Scrollbar from '../../Scrollbar';
// ----------------------------------------------------------------------
RiderMoreMenu.propTypes = {
  order_id: PropTypes.number,
  order_product_total: PropTypes.number,
  order_status: PropTypes.string
};
export default function RiderMoreMenu(props) {
  // eslint-disable-next-line camelcase
  const { order_id, Orderlist, row, order_product_total, order_status, order_member_id } = props;
  const [showModal, setShowModal] = useState(false);
  const [orderDetail, setOrderDetail] = useState([]);
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const detailOrder = async () => {
    const data = await axios.get(
      // eslint-disable-next-line camelcase
      `${process.env.REACT_APP_WEB_BACKEND}/getByOrderDetail_id/${order_id}`
    );
    setOrderDetail(data.data.data);
    console.log(data.data.data);
    setShowModal(true);
  };
  const deleteOrderByAdmin = async () => {
    console.log('ยืนยัน');
    const data = {
      order_id,
      order_status: 'ผู้ดูแลระบบยกเลิก'
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการยกเลิกออเดอร์นี้หรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, need it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putStatusOrder`, data);
        Swal.fire({
          position: '',
          icon: 'success',
          title: 'คุณได้ยืนยันการยกเลิกออเดอร์นี้เเล้ว ',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire('Cancelled', 'คุณทำการออกจากการยกเลิกออเดอร์ :)', 'error');
      }
    });
  };
  const confirmSlipOrder = async () => {
    console.log('ยืนยัน');
    const data = {
      order_id,
      order_status: 'รอจัดส่ง'
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการยืนยันการโอนเงินของออเดอร์นี้หรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, need it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putStatusOrder`, data);
        Swal.fire({
          position: '',
          icon: 'success',
          title: 'คุณได้ยืนยันการโอนเงินของออเดอร์นี้เเล้ว ',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire('Cancelled', 'คุณทำการยกเลิกการยืนยันการโอนเงิน :)', 'error');
      }
    });
  };
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
                  <Icon icon="line-md:confirm-circle-twotone" width={24} height={24} />
                </ListItemIcon>
                <ListItemText
                  primary="ยืนยันการโอน"
                  primaryTypographyProps={{ variant: 'body2' }}
                  onClick={() => confirmSlipOrder()}
                />
              </MenuItem>
              <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
                <ListItemIcon>
                  <Icon icon="flat-color-icons:delete-database" width={24} height={24} />
                </ListItemIcon>
                <ListItemText
                  primary="ยกเลิกรายการนี้"
                  primaryTypographyProps={{ variant: 'body2' }}
                  onClick={() => deleteOrderByAdmin()}
                />
              </MenuItem>
            </>
          ) : null}
        </Menu>
        <Modal size="lg" active={showModal} toggler={() => setShowModal(false)}>
          <ModalHeader toggler={() => setShowModal(false)}>รายระเอียดออเดอร์</ModalHeader>
          <ModalBody>
            <div className="px-6 py-3 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
              ราคาสินค้าทั้งหมด {numeral(order_product_total).format()} บาท
            </div>{' '}
            {/* <Scrollbar> */}
            <TableContainer sx={{ minWidth: 200 }}>
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
                                  {person.order_product_amoumt}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {/* {person.order_product_price} */}
                                {numeral(person.order_product_price).format()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {person.order_company_status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </TableContainer>
            {/* </Scrollbar> */}
          </ModalBody>
          <ModalFooter>
            <Button
              color="red"
              buttonType="link"
              onClick={(e) => setShowModal(false)}
              ripple="dark"
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </>
    </>
  );
}
