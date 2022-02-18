import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AppstoreAddOutlined } from '@ant-design/icons';
// material tailwind
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';
import Input from '@material-tailwind/react/Input';
import 'animate.css';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@mui/material';
import Scrollbar from '../../../../components/Scrollbar';
// ----------------------------------------------------------------------
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function AdminProductTypeApp() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [ProductType, setProductType] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [onChangeType, setonChangeType] = useState(null);
  const [editProductTypeID, seteditProductTypeID] = useState(null);
  const [editProductTypeName, seteditProductTypeName] = useState(null);
  const [editnewProductTypeName, setneweditProductTypeName] = useState(null);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalCodeDelete, setShowModalCodeDelete] = useState(false);
  const [deleteProductTypeID, setdeleteProductTypeID] = useState(false);
  const [showModalCodeDelete2, setShowModalCodeDelete2] = useState(false);
  dispatch({ type: 'OPEN' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const ProductType = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/producttypes`);

    setProductType(ProductType.data.data);
  }, []);
  dispatch({ type: 'TURNOFF' });
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
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!'
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
          dispatch({ type: 'OPEN' });
          await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/producttype`, {
            name: onChangeType
          });
          Swal.fire({
            icon: 'success',
            title: 'คุณได้ทำการเพิ่มประเภทสินค้าใหม่เรียบร้อยเเล้ว',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => {
            dispatch({ type: 'TURNOFF' });
          }, 1500);
        }
      }
    });

    setShowModal(false);
  };
  const showModalEditProductType = async (e) => {
    seteditProductTypeID(e.id);
    seteditProductTypeName(e.nameproducttype);
    setShowModal(false);
    setShowModalEdit(true);
  };
  const confirmEditType = async () => {
    const data = {
      id: editProductTypeID,
      nameproducttype: editnewProductTypeName
    };
    Swal.fire({
      title: 'Are you sure?',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      text: 'คุณต้องการแก้ไขประเภทสินค้าหรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, need it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (editnewProductTypeName === null) {
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
          dispatch({ type: 'OPEN' });
          await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/producttype`, data);
          Swal.fire({
            icon: 'success',
            title: 'คุณได้ทำการแก้ประเภทสินค้าใหม่เรียบร้อยเเล้ว',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => {
            dispatch({ type: 'TURNOFF' });
          }, 1500);
        }
      }
    });
  };
  const showModalDeleteProductType = async (e) => {
    setdeleteProductTypeID(e.id);
    setShowModal(false);
    setShowModalCodeDelete(true);
  };
  const deleteProductType = async () => {
    const data = deleteProductTypeID;
    const reqProduct = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/products`);
    const newF = reqProduct.data.data.filter((fil) => fil.typeid === data);
    if (newF.length !== 0) {
      setShowModalCodeDelete2(true);
      setShowModalCodeDelete(false);
    } else {
      dispatch({ type: 'OPEN' });
      await axios
        .delete(`${process.env.REACT_APP_WEB_BACKEND}/producttype/${data}`)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

      Swal.fire({
        icon: 'success',
        title: 'คุณได้ทำการลบประเภทสินค้าใหม่เรียบร้อยเเล้ว',
        showConfirmButton: false,
        timer: 1500
      });
      setTimeout(() => {
        dispatch({ type: 'TURNOFF' });
      }, 1500);
    }
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
        onClick={() => setShowModal(true)}
      >
        <AppstoreAddOutlined
          style={{ fontSize: '250%', color: '#08c' }}
          twoToneColor="#eb2f96"
          size=""
        />
        เพิ่ม-ลบ-แก้ไขประเภทสินค้า
      </Button>

      <Dialog
        fullWidth="fullWidth"
        maxWidth="xs"
        open={showModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setShowModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>ประเภทสินค้า</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Input
              type="text"
              color="lightBlue"
              size="regular"
              outline={false}
              placeholder=" กรุณาเพิ่มสถานะของสินค้าใหม่"
              // defaultValue={onChangeType}
              onChange={(e) => setonChangeType(e.target.value)}
            />
            <Scrollbar>
              <TableContainer sx={{ minWidth: 400 }}>
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
                                        onClick={() => showModalEditProductType(type)}
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
                                        onClick={() => showModalDeleteProductType(type)}
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
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button buttonType="outline" color="red" onClick={() => setShowModal(false)}>
            ยกเลิก
          </Button>
          <Button
            buttonType="outline"
            color="green"
            onClick={() => onClickNewType()}
            ripple="light"
          >
            บันทึกประเภทสินค้าใหม่
          </Button>
        </DialogActions>
      </Dialog>
      <Modal size="regular" active={showModalEdit} toggler={() => setShowModalEdit(false)}>
        <ModalHeader toggler={() => setShowModalEdit(false)}>{editProductTypeName}</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            color="lightBlue"
            size="regular"
            outline={false}
            placeholder={editProductTypeName}
            onChange={(e) => setneweditProductTypeName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="red"
            buttonType="link"
            onClick={(e) => setShowModalEdit(false)}
            ripple="dark"
          >
            Close
          </Button>

          <Button color="green" onClick={(e) => confirmEditType(e)} ripple="light">
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>
      {/* DELETE-------------------------------------------------------- */}
      <Modal
        size="regular"
        active={showModalCodeDelete}
        toggler={() => setShowModalCodeDelete(false)}
      >
        <ModalHeader toggler={() => setShowModalCodeDelete(false)}>
          ยืนยันที่จะลบประเภทสินค้านี้หรือไม่
        </ModalHeader>
        <ModalBody>
          กรุณาตรวจสอบว่ายังมีสินค้าอยู่ที่อยู่ประเภทนี้ว่ามีอยู่หรือไม่
          หากมีจะไม่สามารถทำการลบประเภทสินค้านี้ได้
          <br />
        </ModalBody>
        <ModalFooter>
          <Button
            color="red"
            buttonType="link"
            onClick={(e) => setShowModalCodeDelete(false)}
            ripple="dark"
          >
            ยกเลิก
          </Button>
          <Button color="green" onClick={() => deleteProductType()} ripple="light">
            ยืนยัน
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        size="regular"
        active={showModalCodeDelete2}
        toggler={() => setShowModalCodeDelete2(false)}
      >
        <ModalHeader toggler={() => setShowModalCodeDelete2(false)}>ไม่สามารถลบได้</ModalHeader>
        <ModalBody>
          เนื่องจากยังมีสินค้าที่อยู่ในประเภทสินค้านี้อยู่กรุณาตรวจสอบใหม่อีกครั้ง
          <br />
        </ModalBody>
        <ModalFooter>
          <Button color="green" onClick={(e) => setShowModalCodeDelete2(false)} ripple="light">
            ยืนยัน
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
