/* eslint-disable camelcase */
import { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { TableRow, TableCell, TableHead } from '@mui/material';
import Barcode from 'react-barcode';
import { Icon } from '@iconify/react';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import ButtonT from '@material-tailwind/react/Button';
// ----------------------------------------------------------------------
import { styled } from '@mui/material/styles';

TakesOrderModalBarcode.propTypes = {
  props: PropTypes.array,
  id_order_rider_id: PropTypes.string,
  order_rider_product_name: PropTypes.string
};
const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3)
}));
export default function TakesOrderModalBarcode({ props }) {
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
              <Icon icon="mdi:barcode-scan" width={30} height={30} />
            </ButtonT>
          </TableCell>
        </TableRow>
      </TableHead>
      <Modal size="lg" active={showModal} toggler={() => setShowModal(false)}>
        <div>
          <ModalHeader toggler={() => setShowModal(false)}>
            {props.order_rider_product_name}
          </ModalHeader>
        </div>
        <ModalBody>
          <IconWrapperStyle>
            <Barcode value={props.id_order_rider_id} format="CODE128" />
          </IconWrapperStyle>
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
