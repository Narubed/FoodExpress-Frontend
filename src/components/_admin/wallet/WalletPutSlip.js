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

WalletPutSlip.propTypes = {
  wallet_id: PropTypes.string
};

// eslint-disable-next-line camelcase
export default function WalletPutSlip({ wallet_id }) {
  const dispatch = useDispatch();
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
    const formdata = new FormData();
    formdata.append('avatar', userInfo.file);
    formdata.append('wallet_id', wallet_id);
    formdata.append('wallet_status', 'ได้รับเงินแล้ว');
    Swal.fire({
      title: 'คุณต้องการบันทึกสลิปหรือไม่ ?',
      text: 'หลังจากคุณบันทึกสถานะของรายการนี้จะถูกเปลี่ยนเป็นได้รับเงินเเล้ว !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน!',
      cancelButtonText: 'ยกเลิก!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch({ type: 'OPEN' });
        await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putSlipWallet`, formdata);
        dispatch({ type: 'TURNOFF' });
        Swal.fire({
          position: '',
          icon: 'success',
          title: 'คุณได้ทำการยืนยันการจ่ายเงินเเล้ว ',
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      }
    });
  };
  return (
    <div>
      <Button
        onClick={() => setShowModal(true)}
        color="lightBlue"
        buttonType="link"
        size="regular"
        rounded
        block={false}
        iconOnly
        ripple="dark"
      >
        <Icon icon="flat-color-icons:add-image" width={22} height={22} />
      </Button>
      <Modal size="sm" active={showModal} toggler={() => setShowModal(false)}>
        <ModalHeader toggler={() => setShowModal(false)}>เพิ่มสลิปเงิน</ModalHeader>
        <ModalBody>
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
          <Button color="red" buttonType="link" onClick={() => setShowModal(false)} ripple="dark">
            Close
          </Button>
          <Button type="submit" className="btn" onClick={() => submit()}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
