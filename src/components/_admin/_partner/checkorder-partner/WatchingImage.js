/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: '60px',
  [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
    height: 100
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15
    },
    '& .MuiImageMarked-root': {
      opacity: 0
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor'
    }
  }
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%'
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity')
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity')
}));

const ImgStyled = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',

  // marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}));

export default function watchingImage({ image }) {
  const [open, setOpen] = React.useState(false);

  console.log(process.env.NEXT_PUBLIC_DRIVE_SELECT_IMAGE + image);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ImageButton
        onClick={() => handleClickOpen()}
        focusRipple
        key={image.title}
        style={{
          width: image.width
        }}
      >
        <ImageSrc
          style={{ backgroundImage: `url(${process.env.REACT_APP_DRIVE_SELECT_IMAGE}${image})` }}
        />
        11111
        <ImageBackdrop className="MuiImageBackdrop-root" />
        <Image>
          <Typography
            component="span"
            variant="subtitle1"
            color="inherit"
            sx={{
              position: 'relative',
              p: 4,
              pt: 2,
              pb: (theme) => `calc(${theme.spacing(1)} + 6px)`
            }}
          >
            <Icon icon="carbon:view" />
            <ImageMarked className="MuiImageMarked-root" />
          </Typography>
        </Image>
      </ImageButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>หลักฐานการโอนเงิน</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <ImgStyled src={`${process.env.REACT_APP_DRIVE_SELECT_IMAGE}${image}`} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ออก</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
