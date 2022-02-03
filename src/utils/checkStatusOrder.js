import axios from 'axios';

export default async function checkStatusOrder() {
  const userID = sessionStorage.getItem('user');
  const getAllOrderJoinDetailJoinCutArount = await axios.get(
    `${process.env.REACT_APP_WEB_BACKEND}/getByOrderMember_id/${userID}`
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
      const data = { order_id: element.order_id, order_status: 'จัดส่งสำเร็จ' };
      await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putStatusOrder`, data);
    }
  });
}
