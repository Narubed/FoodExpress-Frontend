/* eslint-disable react/button-has-type */
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';

export default async function CheckSlipImage(req) {
  const getStockMember = await axios.get(
    `${process.env.REACT_APP_WEB_BACKEND}/getStockProductMemberByUserID/${sessionStorage.getItem(
      'user'
    )}`
  );
  const filterProductID = getStockMember.data.data.filter(
    (f) => parseInt(f.stock_product_id, 10) === parseInt(req.order_product_id, 10)
  );
  if (filterProductID.length > 0) {
    if (filterProductID[0].stock_product_amount < req.order_product_amoumt) {
      Swal.fire('ไม่สามารถหักสินค้าในสต๊อกได้!', 'สินค้าในสต๊อกคุณน้อยเกินไป', 'error');
    } else {
      const reduceStock =
        parseInt(filterProductID[0].stock_product_amount, 10) -
        parseInt(req.order_product_amoumt, 10);
      const dataPutStock = {
        id_stock_product_member_id: filterProductID[0].id_stock_product_member_id,
        stock_product_amount: reduceStock
      };
      const createReportID = Date.now() + req.order_member_id + req.order_product_id;
      const reportOrder = {
        report_order_id: createReportID,
        id_order_rider_id: createReportID,
        report_order_member_userid: req.order_member_id,
        report_order_product_id: req.order_product_id,
        report_order_product_name: req.order_product_name,
        report_order_product_amount_in: 0,
        report_order_product_amount_out: req.order_product_amoumt,
        report_order_status: 'จ่ายออก'
      };
      const data = {
        order_detail_id: req.order_detail_id,
        order_company_status: 'ได้รับสินค้าแล้ว'
      };
      await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putStatusOrderDetail`, data);
      await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/portReportOrderMember`, reportOrder);
      await axios.put(
        `${process.env.REACT_APP_WEB_BACKEND}/putAmountStockProductMember`,
        dataPutStock
      );
      Swal.fire({
        position: '',
        icon: 'success',
        title: 'คุณได้รับสินค้านี้เเล้ว',
        showConfirmButton: false,
        timer: 1500
      });
    }
  } else {
    Swal.fire('คุณไม่มีสินค้านี้ในสต๊อก!', 'หาสินค้าในสต๊อกไม่เจอ', 'error');
  }
}
