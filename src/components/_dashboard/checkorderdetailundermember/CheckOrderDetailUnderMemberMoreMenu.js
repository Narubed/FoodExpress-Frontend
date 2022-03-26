/* eslint-disable camelcase */
import { Icon } from '@iconify/react';
import React, { useRef, useState } from 'react';
import numeral from 'numeral';
import { Link as RouterLink } from 'react-router-dom';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import PropTypes from 'prop-types';
import ReactToPrint from 'react-to-print';
import 'dayjs/locale/th';
// material-tailwind
import '@material-tailwind/react/tailwind.css';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  TableContainer,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@mui/material';
import axios from 'axios';

import Button from '@material-tailwind/react/Button';

// ----------------------------------------------------------------------
CheckOrderDetailUnderMemberMoreMenu.propTypes = {
  order_id: PropTypes.number,
  order_product_total: PropTypes.number,
  row: PropTypes.object
};
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function CheckOrderDetailUnderMemberMoreMenu(props) {
  let componentRef = useRef();
  let componentRef2 = useRef();
  // eslint-disable-next-line camelcase
  const { order_id, row, order_product_total } = props;
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

        <Dialog
          fullWidth="fullWidth"
          maxWidth="md"
          open={showModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setShowModal(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle> ราคาสินค้าทั้งหมด {numeral(order_product_total).format()} บาท</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <TableContainer sx={{ minWidth: 200 }}>
                <div ref={(el) => (componentRef2 = el)}>
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
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TableContainer>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="red" buttonType="link" onClick={() => setShowModal(false)} ripple="dark">
              Close
            </Button>
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
              content={() => componentRef2}
            />
          </DialogActions>
        </Dialog>

        <Dialog
          fullWidth="fullWidth"
          maxWidth="md"
          open={showModalMember}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setShowModalMember(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>รายระเอียดออเดอร์</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <div className="px-6 py-3 text-left text-sm font-medium text-gray-900 uppercase tracking-wider">
                ราคาสินค้าทั้งหมด {numeral(order_product_total).format()} บาท
              </div>{' '}
              <TableContainer sx={{ minWidth: 200 }}>
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
                </div>
              </TableContainer>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="red"
              buttonType="link"
              onClick={() => setShowModalMember(false)}
              ripple="dark"
            >
              Close
            </Button>
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
