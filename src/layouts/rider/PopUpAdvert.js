/* eslint-disable import/no-dynamic-require */
import React, { useRef, useState, useEffect } from 'react';
// material
import Image from '@material-tailwind/react/Image';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Icon } from '@iconify/react';
import axios from 'axios';
// components

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function PopUpAdvert() {
  const [open, setOpen] = useState(true);
  const [AnnounceAdvert, setAnnounceAdvert] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const AnnounceAdverts = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getAnnounceAdvert`
    );
    console.log(AnnounceAdverts.data.data);
    setAnnounceAdvert(AnnounceAdverts.data.data[0].announve_advert_image);
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {' '}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        {/* <DialogTitle>ประกาศจากเอ็นบีเอ</DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {AnnounceAdvert !== null ? (
              <Image
                rounded={false}
                raised={false}
                alt="Image"
                className="previewimg"
                src={
                  `${process.env.REACT_APP_DRIVE_SELECT_IMAGE}${AnnounceAdvert}`
                  // eslint-disable-next-line global-require
                  // require(`../../assets/img/${AnnounceAdvert}`).default
                }
              />
            ) : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            ออก
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
