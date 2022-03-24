/* eslint-disable react/button-has-type */
/* eslint-disable import/no-dynamic-require */
import PropTypes from 'prop-types';
import React from 'react';
import Image from '@material-tailwind/react/Image';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';
import { Icon } from '@iconify/react';
import { imageListClasses } from '@mui/material';

WalletImage.propTypes = {
  images: PropTypes.string,
  Name: PropTypes.string
};

export default function WalletImage(images) {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <div>
      <Button
        color="lightBlue"
        buttonType="link"
        size="regular"
        rounded
        block={false}
        iconOnly
        ripple="dark"
        onClick={() => setShowModal(true)}
      >
        <Icon icon="mdi:eye-check-outline" width={26} height={26} />
      </Button>
      <Modal size="sm" active={showModal} toggler={() => setShowModal(false)}>
        {/* <ModalHeader toggler={() => setShowModal(false)}>{Name}</ModalHeader> */}
        <ModalBody>
          <Image
            className="h-50 w-50 rounded-full"
            width="400"
            src={
              `${process.env.REACT_APP_DRIVE_SELECT_IMAGE}${images.images}`
              // eslint-disable-next-line global-require
              // require(`../../../assets/img/${images}`).default
            }
            rounded={false}
            raised
            alt="Rounded Image"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="red" buttonType="link" onClick={() => setShowModal(false)} ripple="dark">
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
