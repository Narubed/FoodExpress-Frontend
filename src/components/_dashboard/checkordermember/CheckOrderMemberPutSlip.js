/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Image from '@material-tailwind/react/Image';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import LoadingButton from '@mui/lab/LoadingButton';

CheckOrderMemberPutSlip.propTypes = {
  order_id: PropTypes.number
};
// eslint-disable-next-line camelcase
export default function CheckOrderMemberPutSlip({ order_id }) {
  const dispatch = useDispatch();
  dispatch({ type: 'OPEN' });
  const [loading, setLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [userInfo, setuserInfo] = React.useState({
    file: [],
    filepreview: null
  });
  const handleInputChange = (event) => {
    setuserInfo({
      ...userInfo,
      file: event.target.files[0],
      filepreview: URL.createObjectURL(event.target.files[0])
    });
  };
  const submit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2500);
    if (userInfo.file.length === 0) {
      Swal.fire({
        position: '',
        icon: 'eooro',
        title: 'คุณยังไม่ได้เพิ่มไฟล์สลิป ?',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      const formdata = new FormData();
      formdata.append('avatar', userInfo.file);
      formdata.append('order_id', order_id);
      formdata.append('order_status', 'รอตรวจสอบ');
      Swal.fire({
        title: 'คุณต้องการบันทึกสลิปหรือไม่ ?',
        text: 'หลังจากคุณบันทึกสถานะของรายการนี้จะถูกเปลี่ยนเป็นรอตรวจสอบ !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยันยัน!',
        cancelButtonText: 'ยกเลิก!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch({ type: 'OPEN' });
          await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putSlip`, formdata);
          Swal.fire({
            position: '',
            icon: 'success',
            title: 'คุณได้ทำการยืนยันการจ่ายเงินเเล้ว ',
            showConfirmButton: false,
            timer: 1500
          });
          dispatch({ type: 'TURNOFF' });
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        }
      });
    }
  };
  dispatch({ type: 'TURNOFF' });
  return (
    <div>
      <button>
        <Icon
          onClick={(e) => setShowModal(true)}
          icon="flat-color-icons:add-image"
          width={22}
          height={22}
        />
      </button>
      <Modal size="sm" active={showModal} toggler={() => setShowModal(false)}>
        <ModalHeader toggler={() => setShowModal(false)}>เพิ่มสลิปเงิน</ModalHeader>
        <ModalBody>
          {' '}
          <div className="form-row">
            <label className="text-white">หลักฐานการโอน :</label>
            <input type="file" name="upload_file" onChange={handleInputChange} />
            {userInfo.filepreview !== null ? (
              <Image
                width="500"
                className="previewimg"
                src={userInfo.filepreview}
                alt="UploadImage"
              />
            ) : null}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="red" buttonType="link" onClick={(e) => setShowModal(false)} ripple="dark">
            Close
          </Button>

          <LoadingButton
            onClick={(e) => submit(e)}
            loading={loading}
            loadingIndicator="Loading..."
            variant="outlined"
          >
            ยืนยันรายการสั่งซื้อ
          </LoadingButton>
        </ModalFooter>
      </Modal>
    </div>
  );
}
