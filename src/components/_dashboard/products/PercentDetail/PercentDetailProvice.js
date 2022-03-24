import PropTypes from 'prop-types';
import axios from 'axios';
// ----------------------------------------------------------------------

PercentDetailProvice.propTypes = {
  props: PropTypes.array.isRequired
};

export default async function PercentDetailProvice({ count, OrderFoodExpress, filterLevel }) {
  // eslint-disable-next-line camelcase
  let Percent_Order_Detail = [];
  await count.map(
    (value) =>
      // eslint-disable-next-line camelcase
      (Percent_Order_Detail = Percent_Order_Detail.concat({
        percent_order_id: OrderFoodExpress.order_id,
        percent_order_detail_id: OrderFoodExpress.order_id + value.productid,
        percent_order_member_id: OrderFoodExpress.order_member_id,
        percent_order_detail_level_name: filterLevel[0].percent_name,
        percent_order_detail_subdistrict: filterLevel[0].percent_subdistrict,
        percent_order_detail_district: filterLevel[0].percent_district,
        percent_order_detail_provice: filterLevel[0].percent_provice,
        percent_order_detail_nba: filterLevel[0].percent_nba,
        percent_value_detail: (value.productPrice * (100 / 107) - value.productCost) * value.amount,
        percent_older_value_detail_subdistrict: 0,
        percent_older_value_detail_district: 0,
        percent_older_value_detail_provice:
          (value.productPrice * (100 / 107) - value.productCost) *
          (value.amount * filterLevel[0].percent_provice),
        percent_value_detail_subdistrict: 0,
        percent_value_detail_district: 0,
        percent_value_detail_provice:
          (value.productPrice * (100 / 107) - value.productCost) *
            (value.amount * filterLevel[0].percent_provice) -
          (value.productPrice * (100 / 107) - value.productCost) *
            (value.amount * filterLevel[0].percent_provice * 0.03),
        percent_value_detail_nba:
          (value.productPrice * (100 / 107) - value.productCost) *
          value.amount *
          filterLevel[0].percent_nba
      }))
  );
  console.log(Percent_Order_Detail);
  Percent_Order_Detail.map(async (value) => {
    console.log(value);
    await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postPercentOrderDetail`, value);
  });
}
