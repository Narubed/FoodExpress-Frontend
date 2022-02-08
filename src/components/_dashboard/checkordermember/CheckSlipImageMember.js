/* eslint-disable react/button-has-type */
/* eslint-disable import/no-dynamic-require */
import React from 'react';
import Image from '@material-tailwind/react/Image';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';
import {
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@mui/material';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function CheckSlipImage({ images, Name }) {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <div>
      <button onClick={(e) => setShowModal(true)}>
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
      </button>

      <Dialog
        open={showModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setShowModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Image
              className="h-50 w-50 rounded-full"
              src={
                // eslint-disable-next-line global-require
                require(`../../../assets/img/${images}`).default
              }
              rounded={false}
              raised
              alt="Rounded Image"
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="red" buttonType="link" onClick={(e) => setShowModal(false)} ripple="dark">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
