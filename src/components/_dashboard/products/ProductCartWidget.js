/* eslint-disable react/prop-types */
import { Icon } from '@iconify/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import numeral from 'numeral';
// material
import { styled } from '@mui/material/styles';
import {
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@material-tailwind/react/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
import ProductCartShopping from './ProductCartShopping';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  zIndex: 999,
  right: 0,
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  alignItems: 'center',
  top: theme.spacing(16),
  height: theme.spacing(5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.25),
  boxShadow: theme.customShadows.z20,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderTopLeftRadius: theme.shape.borderRadiusMd,
  borderBottomLeftRadius: theme.shape.borderRadiusMd,
  transition: theme.transitions.create('opacity'),
  '&:hover': { opacity: 0.72 }
}));

// ----------------------------------------------------------------------

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function CartWidget({
  count,
  isOpenShopCard,
  onOpenShopCard,
  onCloseShopCard,
  deleteProductShopCard,
  setNumberRereder
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const onSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    if (count.length === 0) {
      onCloseShopCard();
      Swal.fire('ไม่มีสินค้าในตะกร้า ?', 'กรุณาตรวจเช็คสินค้าของท่านอีกครั้ง ?', 'question');
    } else {
      const today = new Date();
      const date =
        today.getFullYear() +
        (today.getMonth() + 1) +
        today.getDate() +
        today.getTime() +
        sessionStorage.getItem('user');
      const valueOrder = count.reduce((sumValue, value) => sumValue + value.value, 0);
      const OrderFoodExpress = {
        order_id: date,
        order_member_id: sessionStorage.getItem('user'),
        order_status: 'รอชำระเงิน',
        order_product_total: valueOrder
      };
      const getMemberMyID = await axios.get(
        `${process.env.REACT_APP_WEB_BACKEND}/member/${sessionStorage.getItem('user')}`
      );
      // eslint-disable-next-line camelcase
      let Order_Detail_FoodExpress = [];
      await count.map(
        (e) =>
          // eslint-disable-next-line camelcase
          (Order_Detail_FoodExpress = Order_Detail_FoodExpress.concat({
            order_id: OrderFoodExpress.order_id,
            order_member_id: OrderFoodExpress.order_member_id,
            order_product_id: e.productid,
            order_product_price: e.productPrice,
            order_product_amoumt: e.amount,
            order_product_currency: e.currency,
            order_product_unitkg: e.unitkg,
            order_product_name: e.productName,
            order_product_type_name: e.nameproducttype,
            order_product_address: getMemberMyID.data.data.address,
            order_product_subdistrict: getMemberMyID.data.data.subdistrict,
            order_product_district: getMemberMyID.data.data.district,
            order_product_province: getMemberMyID.data.data.province,
            order_product_level: getMemberMyID.data.data.level
          }))
      );
      Swal.fire({
        title: 'Are you sure?',
        text: 'คุณต้องการเพิ่มรายการสินค้านี้หรือไม่ !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน!',
        cancelButtonText: 'ยกเลิก!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postOrder`, OrderFoodExpress);

          Order_Detail_FoodExpress.map(
            async (e) =>
              // eslint-disable-next-line no-return-await
              await axios.post(
                await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postOrderDetail`, e)
              )
          );
          Swal.fire({
            position: '',
            icon: 'success',
            title: 'คุณได้เพิ่มรายการสินค้าเรียบร้อยเเล้ว',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => {
            navigate('/dashboard/CheckOrderMemberApp', { replace: true });
          }, 1500);
        }
      });
      onCloseShopCard();
    }
  };
  return (
    <>
      <RootStyle>
        <Badge
          showZero
          // eslint-disable-next-line react/prop-types
          badgeContent={count.length}
          color="error"
          max={99}
          onClick={() => onOpenShopCard()}
        >
          <Icon icon="emojione:shopping-cart" width={28} height={28} />
        </Badge>
      </RootStyle>

      <Dialog
        fullWidth="fullWidth"
        maxWidth="md"
        open={isOpenShopCard}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => onCloseShopCard()}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <Icon icon="emojione:shopping-cart" width={32} height={32} />
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
                            สินค้า
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ราคา
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
                            ราคารวม
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            {/* <span className="sr-only">Edit</span> */}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {count.map((m) => (
                          <ProductCartShopping
                            product={m}
                            key={m.productid}
                            deleteProductShopCard={deleteProductShopCard}
                            setNumberRereder={setNumberRereder}
                          />
                        ))}
                      </tbody>
                    </table>
                    <div className="text-right">
                      ผลรวม {numeral(count.reduce((sum, value) => sum + value.value, 0)).format()}{' '}
                      บาท
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button color="green" onClick={(e) => onSubmit(e)} ripple="light">
            ยืนยันรายการสั่งซื้อ
          </Button> */}
          <LoadingButton
            onClick={(e) => onSubmit(e)}
            loading={loading}
            loadingIndicator="Loading..."
            variant="outlined"
          >
            ยืนยันรายการสั่งซื้อ
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
