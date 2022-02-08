/* eslint-disable react/button-has-type */
/* eslint-disable import/no-dynamic-require */
import React from 'react';
import Image from '@material-tailwind/react/Image';
import Button from '@material-tailwind/react/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function ProductImage({ images, Name }) {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        <Image
          className="h-10 w-10 rounded-full"
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
        <DialogTitle>{Name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Image
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
          <Button color="red" buttonType="link" onClick={() => setShowModal(false)} ripple="dark">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
