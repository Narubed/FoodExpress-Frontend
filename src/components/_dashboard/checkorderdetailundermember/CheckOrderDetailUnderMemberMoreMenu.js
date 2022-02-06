/* eslint-disable camelcase */
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import numeral from 'numeral';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
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

import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';

import Scrollbar from '../../Scrollbar';
// ----------------------------------------------------------------------
CheckOrderDetailUnderMemberMoreMenu.propTypes = {
  order_id: PropTypes.number,
  order_product_total: PropTypes.number,
  order_status: PropTypes.string,
  row: PropTypes.object
};
export default function CheckOrderDetailUnderMemberMoreMenu(props) {
  // eslint-disable-next-line camelcase
  const { order_id, Orderlist, row, order_product_total, order_status, order_member_id } = props;
  const [showModal, setShowModal] = useState(false);
  const [showModalMember, setShowModalMember] = useState(false);

  const [orderDetail, setOrderDetail] = useState([]);
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  console.log(row);
  const detailOrder = async () => {
    const data = await axios.get(
      // eslint-disable-next-line camelcase
      `${process.env.REACT_APP_WEB_BACKEND}/getByOrderDetail_id/${order_id}`
    );
    setOrderDetail(data.data.data);
    setShowModal(true);
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
              <Icon icon="flat-color-icons:view-details" width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="รายระเอียดสินค้า"
              primaryTypographyProps={{ variant: 'body2' }}
              onClick={() => detailOrder()}
            />
          </MenuItem>
          <MenuItem sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon="flat-color-icons:voice-presentation" width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="รายระเอียดผู้สั่งซื้อ"
              primaryTypographyProps={{ variant: 'body2' }}
              onClick={() => setShowModalMember(true)}
            />
          </MenuItem>
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

        <Modal size="lg" active={showModalMember} toggler={() => setShowModalMember(false)}>
          <ModalHeader toggler={() => setShowModalMember(false)}>รายระเอียดออเดอร์</ModalHeader>
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
                              ชื่อ
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              นามสกุล
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              email
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              เบอร์โทรศัพท์
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              ที่อยู่
                            </th>

                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr key={row.order_id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{row.firstname}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="text-sm text-gray-500">{row.lastname}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{row.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {row.tel}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {row.address}
                              {/* {numeral(person.order_product_price).format()} */}
                            </td>
                          </tr>
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
              onClick={(e) => setShowModalMember(false)}
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
