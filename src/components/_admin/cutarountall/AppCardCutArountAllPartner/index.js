/* eslint-disable no-return-await */
/* eslint-disable no-undef */
import { Icon } from '@iconify/react';
import React, { useEffect, useState, useRef, useReactToPrint } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import androidFilled from '@iconify/icons-ant-design/android-filled';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';
import { CheckCircleOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import ReactToPrint from 'react-to-print';
// material
import { alpha, styled } from '@mui/material/styles';
import {
  Card,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter,
  '&:hover': {
    background: theme.palette.primary.lighter,
    boxShadow: '10px 10px 4px green'
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
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  '&:hover': {
    background: theme.palette.primary.lighter,
    boxShadow: '10px 10px 4px green'
  },
  '&:last-child': {
    borderRight: 'solid 1px #cccccc'
  },
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
// ----------------------------------------------------------------------

// eslint-disable-next-line camelcase
export default function AppCardCutArountAll(props) {
  const [showModal, setShowModal] = useState(false);
  const [DataCutArount, setDataCutArount] = useState([]);
  let componentRef = useRef();
  const onClickCard = async (req, res) => {
    const getOrderDetail = await axios.get(
      `${process.env.REACT_APP_PARTNER_API}/order_detail/cutarount_id/${req}`
    );
    const filtereds = [];
    await getOrderDetail.data.data.forEach((item) => {
      const idx = filtereds.findIndex((value) => value.odd_product_name === item.odd_product_name);
      if (idx !== -1) {
        // eslint-disable-next-line operator-assignment
        filtereds[idx].odd_product_amount =
          filtereds[idx].odd_product_amount + item.odd_product_amount;
      } else {
        filtereds.push(item);
      }
    });
    setDataCutArount(filtereds);
    setShowModal(true);
  };
  return (
    <>
      <RootStyle onClick={async () => await onClickCard(props.props._id)}>
        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
          รหัสการตัดรอบ : <br />
          {props.props._id}
        </Typography>
        <Typography variant="h3">{props.props.cao_level}</Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
          {props.props.cao_level_name}
        </Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
          {props.props.cao_timestamp
            ? dayjs(props.props.cao_timestamp).add(543, 'year').locale('th').format('DD MMMM YYYY')
            : null}
        </Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
          {' '}
          {props.props.cao_timestamp
            ? `${dayjs(props.props.cao_first_date)
                .add(543, 'year')
                .locale('th')
                .format('DD MMMM YYYY')} ถึง ${dayjs(props.props.cao_last_data)
                .add(543, 'year')
                .locale('th')
                .format('DD MMMM YYYY')}`
            : null}
        </Typography>
      </RootStyle>

      <Dialog
        open={showModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setShowModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div ref={(el) => (componentRef = el)}>
          <DialogTitle> รหัสการตัดรอบ : {props.props._id}</DialogTitle>
          <DialogTitle>
            {' '}
            {props.props.cao_level} : {props.props.cao_level_name}
          </DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              ชื่อสินค้า
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              จำนวน
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {/* คลิ๊ก */}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {DataCutArount.map((data) => (
                            <tr key={data.odd_product_name}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{data.odd_product_name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {data.odd_product_amount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {data.odd_product_currency}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" />
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </div>
        <DialogActions>
          <Button
            color="red"
            buttonType="link"
            onClick={() => setShowModal(false)}
            ripple="dark"
            danger
          >
            ยกเลิก
          </Button>
          {/* <Button onClick={handlePrint}> oss</Button> */}
          <ReactToPrint
            trigger={() => (
              <Button
                color="lightBlue"
                buttonType="link"
                size="regular"
                rounded
                block={false}
                iconOnly
                ripple="dark"
              >
                <Icon icon="flat-color-icons:print" width={32} height={32} />
              </Button>
            )}
            content={() => componentRef}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}
AppCardCutArountAll.propTypes = {
  props: PropTypes.array.isRequired,
  cut_arount_province: PropTypes.string.isRequired
};
