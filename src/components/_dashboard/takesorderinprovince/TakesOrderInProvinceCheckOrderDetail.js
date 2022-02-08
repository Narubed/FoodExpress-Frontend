import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import axios from 'axios';

TakesOrderInProvinceCheckOrderDetail.propTypes = {
  orderList: PropTypes.array
};
export default async function TakesOrderInProvinceCheckOrderDetail({ result }) {
  const dispatch = useDispatch();
  dispatch({ type: 'OPEN' });
  const userID = sessionStorage.getItem('user');
  const getAllOrderJoinDetailJoinCutArount = await axios.get(
    `${process.env.REACT_APP_WEB_BACKEND}/getJoinOrder_detail_cutarount`
  );
  const filterOrderMe = getAllOrderJoinDetailJoinCutArount.data.data.filter(
    (value) => value.order_member_id === userID
  );
  const filterOrderStatus = filterOrderMe.filter((value) => value.order_status === 'รอจัดส่ง');
  const filterOrderDetailStatus = filterOrderStatus.filter(
    (value) => value.order_company_status === 'ตัดรอบการจัดส่งแล้ว'
  );

  const getDeliveryDetail = await axios.get(
    `${process.env.REACT_APP_WEB_BACKEND}/getDeliveryDetailByDeliveryID/${result.member_delivery_id}`
  );
  const DeliveryDetail = getDeliveryDetail.data.data;
  const getStockMember = await axios.get(
    `${process.env.REACT_APP_WEB_BACKEND}/getStockProductMemberByUserID/${userID}`
  );
  await DeliveryDetail.forEach(async (element) => {
    const filterStockOrderByProductID = getStockMember.data.data.filter(
      (value) => value.stock_product_id === element.member_delivery_detail_product_id
    );
    const Stock = filterStockOrderByProductID[0];
    const filterOrderProductID = filterOrderDetailStatus.filter(
      (value) =>
        parseInt(value.order_product_id, 10) ===
        parseInt(element.member_delivery_detail_product_id, 10)
    );
    await filterOrderProductID.forEach(async (element, index) => {
      Stock.stock_product_amount -= element.order_product_amoumt;
      if (Stock.stock_product_amount >= 0) {
        const createReportID = Date.now() + result.member_delivery_member_id + index + 6;
        const reportOrders = {
          report_order_id: createReportID,
          id_order_rider_id: createReportID,
          report_order_member_userid: parseInt(sessionStorage.getItem('user'), 10),
          report_order_product_id: parseInt(element.order_product_id, 10),
          report_order_product_name: element.order_product_name,
          report_order_product_amount_in: 0,
          report_order_product_amount_out: element.order_product_amoumt,
          report_order_status: 'จ่ายออก'
        };

        const putStockOrder = {
          id_stock_product_member_id: filterStockOrderByProductID[0].id_stock_product_member_id,
          stock_product_amount: Stock.stock_product_amount
        };
        const putStatusOrderDetail = {
          order_detail_id: element.order_detail_id,
          order_company_status: 'ได้รับสินค้าแล้ว'
        };

        await axios.post(
          `${process.env.REACT_APP_WEB_BACKEND}/portReportOrderMember`,
          reportOrders
        );
        await axios.put(
          `${process.env.REACT_APP_WEB_BACKEND}/putAmountStockProductMember`,
          putStockOrder
        );
        await axios.put(
          `${process.env.REACT_APP_WEB_BACKEND}/putStatusOrderDetail`,
          putStatusOrderDetail
        );
      }
    });
  });
  dispatch({ type: 'TURNOFF' });
}
