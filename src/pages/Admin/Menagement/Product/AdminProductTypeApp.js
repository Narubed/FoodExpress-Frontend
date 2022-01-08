import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FolderAddOutlined, AppstoreAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
// material tailwind
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';
import Input from '@material-tailwind/react/Input';
import 'animate.css';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Badge
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Scrollbar from '../../../../components/Scrollbar';
// ----------------------------------------------------------------------
const people = [
  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    department: 'Optimization',
    role: 'Admin',
    email: 'jane.cooper@example.com',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
  }
];
export default function AdminProductTypeApp() {
  const [showModal, setShowModal] = useState(false);
  const [ProductType, setProductType] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [onChangeType, setonChangeType] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const ProductType = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/producttypes`);
    setProductType(ProductType.data.data);
  }, []);

  const onClickNewType = (e) => {
    Swal.fire({
      title: 'Are you sure?',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      text: 'คุณต้องการเพิ่มประเภทสินค้าใหม่หรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, need it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (onChangeType === null) {
          Swal.fire({
            title: 'กรุณาตรวจสอบรายการที่ต้องเพิ่มอีกครั้ง',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          });
        } else {
          await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/producttype`, {
            name: onChangeType
          });
          Swal.fire('success!', 'คุณได้ทำการเพิ่มประเภทสินค้าใหม่เรียบร้อยเเล้ว.', 'success');
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        }
      }
    });

    console.log(e);
    setShowModal(false);
  };
  const editProductType = async (e) => {
    console.log(e);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - ProductType.length) : 0;
  const isUserNotFound = ProductType.length === 0;
  return (
    <>
      <Button
        color="lightBlue"
        buttonType="link"
        size="regular"
        rounded={false}
        block={false}
        iconOnly={false}
        ripple="dark"
        onClick={(e) => setShowModal(true)}
      >
        <AppstoreAddOutlined
          style={{ fontSize: '250%', color: '#08c' }}
          twoToneColor="#eb2f96"
          size=""
        />
        เพิ่ม-ลบ-แก้ไขประเภทสินค้า
      </Button>

      <Modal size="regular" active={showModal} toggler={() => setShowModal(false)}>
        <ModalHeader toggler={() => setShowModal(false)}>ประเภทสินค้า</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            color="lightBlue"
            size="regular"
            outline={false}
            placeholder=" กรุณาเพิ่มสถานะของสินค้าใหม่"
            defaultValue={onChangeType}
            onChange={(e) => setonChangeType(e.target.value)}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
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
                                ชื่อประเภทสินค้า
                              </th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Edit</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {ProductType.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            ).map((type) => (
                              <tr key={type.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {type.nameproducttype}
                                      </div>
                                      {/* <div className="text-sm text-gray-500">{type.email}</div> */}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    <Button
                                      color="lightBlue"
                                      buttonType="link"
                                      size="regular"
                                      rounded={false}
                                      block={false}
                                      iconOnly={false}
                                      ripple="dark"
                                      onClick={() => editProductType(type.id)}
                                    >
                                      เเก้ไข
                                    </Button>
                                  </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    <Button
                                      color="pink"
                                      buttonType="link"
                                      size="regular"
                                      rounded={false}
                                      block={false}
                                      iconOnly={false}
                                      ripple="dark"
                                      onClick={() => console.log(type.id)}
                                    >
                                      ลบ
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        {/* <SearchNotFound searchQuery={filterName} /> */}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[3, 5, 10, 20, 40]}
            component="div"
            count={ProductType.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="green" onClick={(e) => onClickNewType()} ripple="light">
            บันทึกประเภทสินค้าใหม่
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
