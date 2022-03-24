import PropTypes from 'prop-types';

import axios from 'axios';

TakesOrderCheckOrderDetail.propTypes = {
  orderList: PropTypes.array
};
export default async function TakesOrderCheckOrderDetail({ result }) {
  const getAllOrderJoinDetailJoinCutArount = await axios.get(
    `${process.env.REACT_APP_WEB_BACKEND}/getJoinOrder_detail_cutarount`
  );
  const filterOrderMe = getAllOrderJoinDetailJoinCutArount.data.data.filter(
    (value) => value.order_member_id === result.order_rider_consignee_id
  );
  const filterOrderStatus = filterOrderMe.filter((value) => value.order_status === 'รอจัดส่ง');
  const filterOrderDetailStatus = filterOrderStatus.filter(
    (value) => value.order_company_status === 'ตัดรอบการจัดส่งแล้ว'
  );
  const filterOrderProductID = filterOrderDetailStatus.filter(
    (value) => parseInt(value.order_product_id, 10) === parseInt(result.order_rider_product_id, 10)
  );
  console.log(filterOrderProductID);
  const getStockMember = await axios.get(
    `${process.env.REACT_APP_WEB_BACKEND}/getStockProductMemberByUserID/${result.order_rider_consignee_id}`
  );
  const filterStockOrderByProductID = getStockMember.data.data.filter(
    (value) => parseInt(value.stock_product_id, 10) === parseInt(result.order_rider_product_id, 10)
  );
  const Stock = filterStockOrderByProductID[0];
  filterOrderProductID.forEach(async (element, index) => {
    Stock.stock_product_amount -= element.order_product_amoumt;
    if (Stock.stock_product_amount >= 0) {
      const putStockOrder = {
        id_stock_product_member_id: filterStockOrderByProductID[0].id_stock_product_member_id,
        stock_product_amount: Stock.stock_product_amount
      };
      await axios.put(
        `${process.env.REACT_APP_WEB_BACKEND}/putAmountStockProductMember`,
        putStockOrder
      );
      let random = new Array(1000).fill(1);
      random = random.map((x, i) => i);
      random = random.sort(() => 2 * Math.random() - 1);
      const createReportID =
        Date.now() +
        result.order_rider_consignee_id +
        result.order_rider_product_id +
        random[index];
      const reportOrder = {
        report_order_id: createReportID,
        id_order_rider_id: result.id_order_rider_id,
        report_order_member_userid: result.order_rider_consignee_id,
        report_order_product_id: result.order_rider_product_id,
        report_order_product_name: result.order_rider_product_name,
        report_order_product_amount_in: 0,
        report_order_product_amount_out: element.order_product_amoumt,
        report_order_status: 'จ่ายออก'
      };
      await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/portReportOrderMember`, reportOrder);
      const putStatusOrderDetail = {
        order_detail_id: element.order_detail_id,
        order_company_status: 'ได้รับสินค้าแล้ว'
      };
      await axios.put(
        `${process.env.REACT_APP_WEB_BACKEND}/putStatusOrderDetail`,
        putStatusOrderDetail
      );
    }
  });
}
