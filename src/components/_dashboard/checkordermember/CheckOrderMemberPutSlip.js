/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable import/no-dynamic-require */
import React from 'react';
import Image from '@material-tailwind/react/Image';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';

// eslint-disable-next-line camelcase
export default function CheckOrderMemberPutSlip({ order_id }) {
  console.log(order_id);
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
    formdata.append('order_id', order_id);
    formdata.append('order_status', 'รอตรวจสอบ');
    Swal.fire({
      title: 'คุณต้องการบันทึกสลิปหรือไม่ ?',
      text: 'หลังจากคุณบันทึกสถานะของรายการนี้จะถูกเปลี่ยนเป็นรอตรวจสอบ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, need it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putSlip`, formdata);
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
      {/* <button onClick={(e) => setShowModal(true)}>
        <Image
          className="h-5 w-5 rounded-full"
          src={
            // eslint-disable-next-line global-require
            require(`../../../assets/img/${images}`).default
          }
          rounded={false}
          raised
          alt="Rounded Image"
        />
      </button> */}
      <Button
        onClick={(e) => setShowModal(true)}
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
          <Button type="submit" className="btn" onClick={() => submit()}>
            {' '}
            Save{' '}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
