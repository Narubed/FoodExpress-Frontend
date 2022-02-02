import PropTypes from 'prop-types';

import axios from 'axios';

TakesOrderCheckStatusOrder.propTypes = {
  orderList: PropTypes.array
};
export default async function TakesOrderCheckStatusOrder({ result }) {
  const getAllOrderJoinDetailJoinCutArount = await axios.get(
    `${process.env.REACT_APP_WEB_BACKEND}/getByOrderMember_id/${result.order_rider_member_userid}`
  );
  const filterOrderStatus = getAllOrderJoinDetailJoinCutArount.data.data.filter(
    (value) => value.order_status === 'รอจัดส่ง'
  );
  filterOrderStatus.forEach(async (element) => {
    const getOrderDetail = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getByOrderDetail_id/${element.order_id}`
    );
    let checkStatusDetail = true;
    getOrderDetail.data.data.forEach((element) => {
      const valueStatus = element.order_company_status === 'ตัดรอบการจัดส่งแล้ว';
      if (valueStatus) {
        checkStatusDetail = false;
      }
    });
    if (checkStatusDetail === true) {
      console.log(element.order_id);
      const data = { order_id: element.order_id, order_status: 'จัดส่งสำเร็จ' };
      await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putStatusOrder`, data);
      console.log(data);
    }
  });
}
