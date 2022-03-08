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
import { CheckCircleOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import ReactToPrint from 'react-to-print';
import numeral from 'numeral';
// material
import { alpha, styled } from '@mui/material/styles';
import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

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
  const [OrderJoinMember, setOrderJoinMember] = useState([]);
  const [DataOrderDetail, setDataOrderDetail] = useState([]);
  let componentRef = useRef();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getOrderDetail = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getJoinOrder_Member/`
    );
    const filterStatusOrderMember = getOrderDetail.data.data.filter(
      (f) => f.order_status === 'รอจัดส่ง' || f.order_status === 'จัดส่งสำเร็จ'
    );
    setOrderJoinMember(filterStatusOrderMember);
  }, []);

  const onClickCard = async (req, res) => {
    const filterProvinceINCard = OrderJoinMember.filter((f) => f.province === req);
    console.log(filterProvinceINCard);
    const filteredsProvince = [];
    filterProvinceINCard.forEach((item) => {
      const idx = filteredsProvince.findIndex((value) => value.userId === item.userId);
      if (idx !== -1) {
        // eslint-disable-next-line operator-assignment
        filteredsProvince[idx].order_percent_nba =
          filteredsProvince[idx].order_percent_nba + item.order_percent_nba;
      } else {
        filteredsProvince.push(item);
      }
    });
    setDataOrderDetail(filteredsProvince);
    setShowModal(true);
  };
  return (
    <>
      <Card onClick={async () => await onClickCard(props.props.province)}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="20"
            image="https://scontent.fcnx2-1.fna.fbcdn.net/v/t1.6435-9/163343230_219431456596557_8035454299368555826_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=Dfi7DUi_JFAAX9hnkd7&_nc_ht=scontent.fcnx2-1.fna&oh=00_AT9tRlnm2ltphO4Ofji9dZark9_smMI-HMOdGlDh8TAuEg&oe=624C004A"
            alt="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              ยอดรวมของจังหวัด :{props.props.province}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {numeral(props.props.order_percent_nba).format()} บาท
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Dialog
        fullWidth="fullWidth"
        maxWidth="md"
        open={showModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setShowModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div ref={(el) => (componentRef = el)}>
          {/* <DialogTitle> รหัสการตัดรอบ : {props.props.cut_arount_id}</DialogTitle> */}
          <DialogTitle> รายได้ของเเต่ละระดับที่บริษัทได้รับ</DialogTitle>

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
                              ระดับ
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              ตำบล
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              อำเภอ
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              จังหวัด
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              จำนวน
                            </th>
                            {/* <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              จำนวน
                            </th> */}
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {/* คลิ๊ก */}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {DataOrderDetail.map((data) => (
                            <tr key={data.order_member_id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {data.level === 'province' ? 'ระดับจังหวัด' : null}
                                  {data.level === 'district' ? 'ระดับอำเภอ' : null}
                                  {data.level === 'subdistrict' ? 'ระดับตำบล' : null}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{data.subdistrict}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{data.district}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{data.province}</td>
                              {/* <td className="px-6 py-4 whitespace-nowrap">{data.currency}</td> */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                {numeral(data.order_percent_nba).format()} บาท
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
