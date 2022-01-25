/* eslint-disable camelcase */
import { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { visuallyHidden } from '@mui/utils';
import { Grid, Card, TableRow, TableCell, TableHead, Typography, Button } from '@mui/material';
import { Icon } from '@iconify/react';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import ButtonT from '@material-tailwind/react/Button';
// ----------------------------------------------------------------------
import { alpha, styled } from '@mui/material/styles';

TakesOrderListHead.propTypes = {
  props: PropTypes.array,
  order_rider_product_name: PropTypes.string
};
const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: 'theme.palette.warning.darker',
  backgroundColor: '#F0FFFF',
  '&:hover': {
    background: '#F0F8FF',
    boxShadow: '10px 10px 4px #F0FFFF'
  },
  '&:last-child': {
    borderRight: 'solid 1px #cccccc'
  }
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  // width: theme.spacing(8),
  // height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3)
}));
export default function TakesOrderListHead({ props }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <ButtonT
              color="lightBlue"
              buttonType="link"
              size="regular"
              rounded
              block={false}
              iconOnly
              ripple="dark"
              onClick={() => setShowModal(true)}
            >
              <Icon icon="flat-color-icons:todo-list" width={30} height={30} />
            </ButtonT>
          </TableCell>
        </TableRow>
      </TableHead>
      <Modal size="lg" active={showModal} toggler={() => setShowModal(false)}>
        <div>
          <ModalHeader toggler={() => setShowModal(false)}>
            ชื่อสินค้า:{props.order_rider_product_name}
          </ModalHeader>
        </div>
        <ModalBody>
          <Grid>
            {[props].map((m) => (
              <Grid key={m.id_order_rider_id}>
                <RootStyle>
                  <IconWrapperStyle>
                    <Button target="_blank" href={m.map}>
                      <Icon icon="emojione:world-map" width="64" height="64" />
                    </Button>
                    {/* <Barcode value={m.id_order_rider_id} format="CODE128" /> */}
                  </IconWrapperStyle>
                  <Typography variant="h">ชื่อบริษัท : {m.order_rider_company_name} </Typography>
                  <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                    ที่อยู่บริษัท : {m.order_rider_company_company_address}
                  </Typography>
                  <Typography variant="h">ชื่อผู้รับ : {m.firstname}</Typography>
                  <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                    ที่อยู่ผู้รับ : {m.address}
                  </Typography>
                </RootStyle>
              </Grid>
            ))}
          </Grid>
        </ModalBody>
        <ModalFooter>
          <ButtonT
            color="red"
            buttonType="link"
            onClick={(e) => setShowModal(false)}
            ripple="dark"
            danger
          >
            ยกเลิก
          </ButtonT>
        </ModalFooter>
      </Modal>
    </>
  );
}
