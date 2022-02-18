/* eslint-disable react/button-has-type */
/* eslint-disable import/no-dynamic-require */
import React from 'react';
import Image from '@material-tailwind/react/Image';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';

export default function CheckSlipImage({ images, Name }) {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <div>
      <button onClick={(e) => setShowModal(true)}>
        <Image
          className="h-5 w-5 rounded-full"
          src={
            `${process.env.REACT_APP_DRIVE_SELECT_IMAGE}${images}`
            // eslint-disable-next-line global-require
            // require(`../../../assets/img/${images}`).default
          }
          rounded={false}
          raised
          alt="Rounded Image"
        />
      </button>
      <Modal size="sm" active={showModal} toggler={() => setShowModal(false)}>
        <ModalHeader toggler={() => setShowModal(false)}>{Name}</ModalHeader>
        <ModalBody>
          <Image
            className="h-50 w-50 rounded-full"
            src={
              `${process.env.REACT_APP_DRIVE_SELECT_IMAGE}${images}`
              // eslint-disable-next-line global-require
              // require(`../../../assets/img/${images}`).default
            }
            rounded={false}
            raised
            alt="Rounded Image"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="red" buttonType="link" onClick={(e) => setShowModal(false)} ripple="dark">
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
