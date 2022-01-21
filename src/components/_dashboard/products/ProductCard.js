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
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack, TypeMap } from '@mui/material';
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
    width: '110%',
    height: '110%'
  },
  '&:last-child': {
    borderRight: 'solid 1px #cccccc'
  },
  position: 'absolute'
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
  count: PropTypes.object,
  setCount: PropTypes.func.isRequired
};

export default function ShopProductCard({ product, setCount, count }) {
  const [showModal, setShowModal] = React.useState(false);
  const [showButton, setButton] = React.useState(false);
  React.useEffect(async () => {}, [count]);
  const { name, productStetus, productName, productImg, productPrice, productid } = product;
  // eslint-disable-next-line global-require
  const ImageProduct = require(`../../../assets/img/${productImg}`).default;
  const AddProduct = async () => {
    const value = count.concat(product);
    const filtereds = [];
    await value.forEach((item, index) => {
      const idx = filtereds.findIndex((value) => value.productid === item.productid);
      if (idx !== -1) {
        console.log('ซ้ำ');
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
          {productStetus && (
            <Label
              variant="filled"
              color={(productStetus === 'สินค้ายังไม่พร้อมจำหน่าย' && 'error') || 'info'}
              sx={{
                zIndex: 9,
                top: 16,
                right: 16,
                position: 'absolute',
                textTransform: 'uppercase'
              }}
            >
              {productStetus}
            </Label>
          )}
          <ProductImgStyle alt={name} src={ImageProduct} onClick={() => setShowModal(true)} />
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          <Link to="#" color="inherit" underline="hover" component={RouterLink}>
            <Typography variant="subtitle2" noWrap>
              {productName}
            </Typography>
          </Link>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {/* <ColorPreview colors={colors} /> */}

            <Button
              color="purple"
              buttonType="outline"
              size="sm"
              rounded={false}
              block={false}
              iconOnly={false}
              ripple="dark"
              onClick={() => AddProduct()}
            >
              เพิ่มในตะกร้า
            </Button>

            <Typography variant="subtitle1">
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
              <div className="row">{numeral(productPrice).format()}฿</div>
            </Typography>
          </Stack>
        </Stack>
      </Card>
      <Modal size="regular" active={showModal} toggler={() => setShowModal(false)}>
        <ModalHeader toggler={() => setShowModal(false)}>{productName}</ModalHeader>
        <ModalBody>
          <Image
            src={
              // eslint-disable-next-line global-require
              require(`../../../assets/img/${productImg}`).default
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
    </>
  );
}
