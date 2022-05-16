/* eslint-disable import/no-dynamic-require */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import numeral from 'numeral';
import Image from '@material-tailwind/react/Image';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Link as RouterLink } from 'react-router-dom';
import { purple } from '@mui/material/colors';
import { motion } from 'framer-motion';

// material
import { Box, Card, Link, Typography, Stack, TypeMap } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
// utils
import Label from '../../Label';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  '&:hover': {
    width: '103%',
    height: '103%'
  },
  '&:last-child': {
    borderRight: 'solid 1px #cccccc'
  },
  position: 'absolute'
});
const ColorButton = styled(LoadingButton)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[200]
  }
}));
// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
  count: PropTypes.object,
  setCount: PropTypes.func.isRequired
};
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function ShopProductCard({ product, setCount, count }) {
  const [showModal, setShowModal] = React.useState(false);
  const [showButton, setButton] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(async () => {}, [count]);
  const { name, productStetus, productName, productImg, productPrice, productid } = product;
  // eslint-disable-next-line global-require
  const ImageProduct = `${process.env.REACT_APP_DRIVE_SELECT_IMAGE}${productImg}`;
  const AddProduct = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    const value = count.concat(product);
    const filtereds = [];
    await value.forEach((item, index) => {
      const idx = filtereds.findIndex((value) => value.productid === item.productid);
      if (idx !== -1) {
        // eslint-disable-next-line operator-assignment
        // filtereds[idx].value = item.productPrice;
        // filtereds[idx].amount = 1;
        //   filtereds[idx].order_product_amoumt + item.order_product_amoumt;
      } else {
        const value = {
          amount: 1,
          value: item.productPrice
        };
        Object.assign(item, value);
        filtereds.push(item);
      }
    });
    const findIndexProduct = value.findIndex((value) => value.productid === productid);
    if (findIndexProduct >= 0) {
      setButton(true);
    }
    setCount(filtereds);
  };
  return (
    <>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          <ProductImgStyle alt={name} src={ImageProduct} onClick={() => setShowModal(true)} />
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          <Link to="#" color="inherit" underline="hover" component={RouterLink}>
            <Typography variant="subtitle2" noWrap>
              <div>{productName}</div>
            </Typography>
          </Link>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {/* <ColorPreview colors={colors} /> */}
            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
              <ColorButton
                size="small"
                // color="secondary"
                endIcon={<Icon icon="clarity:add-line" />}
                loading={loading}
                loadingPosition="end"
                variant="outlined"
                onClick={() => AddProduct()}
              >
                เพิ่มสินค้า{' '}
              </ColorButton>
            </motion.button>
            <Typography variant="subtitle2" sx={{ mt: -3 }}>
              <Typography
                component="span"
                variant="body1"
                sx={{
                  color: 'text.disabled',
                  textDecoration: 'line-through'
                }}
              >
                {/* {priceSale && fCurrency(priceSale)} */}
              </Typography>
              &nbsp;
              {/* {fCurrency(price)} */}
              <div>{numeral(productPrice).format()}฿</div>
            </Typography>
          </Stack>
        </Stack>
      </Card>
      <Dialog
        open={showModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setShowModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{productName}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Image
              src={
                `${process.env.REACT_APP_DRIVE_SELECT_IMAGE}${productImg}`
                // eslint-disable-next-line global-require
                // require(`../../../assets/img/${productImg}`).default
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
    </>
  );
}
