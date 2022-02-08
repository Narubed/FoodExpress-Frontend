import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import axios from 'axios';

TakesOrderCheckStock.propTypes = {
  orderList: PropTypes.array
};
export default async function TakesOrderCheckStock({ result }) {
  const dispatch = useDispatch();
  dispatch({ type: 'OPEN' });
  const getStockMember = await axios.get(
    `${process.env.REACT_APP_WEB_BACKEND}/getStockProductMemberByUserID/${result.order_rider_member_userid}`
  );
  const filterStockOrderByProductID = getStockMember.data.data.filter(
    (value) => value.stock_product_id === result.order_rider_product_id
  );
  if (filterStockOrderByProductID.length === 0) {
    const createStockID =
      Date.now() + result.order_rider_product_id + result.order_rider_member_userid;
    const stockOrder = {
      id_stock_product_member_id: createStockID,
      stock_product_member_userid: result.order_rider_member_userid,
      stock_product_id: result.order_rider_product_id,
      stock_product_name: result.order_rider_product_name,
      stock_product_amount: result.order_rider_Amount
    };
    await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postStockProductMember`, stockOrder);
  } else {
    const putStockOrder = {
      id_stock_product_member_id: filterStockOrderByProductID[0].id_stock_product_member_id,
      stock_product_amount:
        parseInt(filterStockOrderByProductID[0].stock_product_amount, 10) +
        parseInt(result.order_rider_Amount, 10)
    };
    await axios.put(
      `${process.env.REACT_APP_WEB_BACKEND}/putAmountStockProductMember`,
      putStockOrder
    );
  }
  dispatch({ type: 'TURNOFF' });
}
