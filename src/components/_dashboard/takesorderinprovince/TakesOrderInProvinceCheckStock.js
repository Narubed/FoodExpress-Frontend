import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { Icon } from '@iconify/react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Swal from 'sweetalert2';
import axios from 'axios';
import { now } from 'lodash';

TakesOrderInProvinceCheckStock.propTypes = {
  DeliveryList: PropTypes.array
};
export default async function TakesOrderInProvinceCheckStock({ result, getDeliveryDetail }) {
  const getStockMember = await axios.get(
    `${process.env.REACT_APP_WEB_BACKEND}/getStockProductMemberByUserID/${result.receiver_delivery_member_id}`
  );
  getDeliveryDetail.data.data.forEach(async (value, index) => {
    const filterStockOrderByProductID = getStockMember.data.data.filter(
      (filtervalue) => filtervalue.stock_product_id === value.member_delivery_detail_product_id
    );
    if (filterStockOrderByProductID.length === 0) {
      const createStockID = Date.now() + result.receiver_delivery_member_id + index;
      const stockOrder = {
        id_stock_product_member_id: createStockID,
        stock_product_member_userid: result.receiver_delivery_member_id,
        stock_product_id: value.member_delivery_detail_product_id,
        stock_product_name: value.member_delivery_detail_product_name,
        stock_product_amount: value.member_delivery_detail_product_amoumt
      };
      await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postStockProductMember`, stockOrder);
    } else {
      const putStockOrder = {
        id_stock_product_member_id: filterStockOrderByProductID[0].id_stock_product_member_id,
        stock_product_amount:
          parseInt(filterStockOrderByProductID[0].stock_product_amount, 10) +
          parseInt(value.member_delivery_detail_product_amoumt, 10)
      };
      await axios.put(
        `${process.env.REACT_APP_WEB_BACKEND}/putAmountStockProductMember`,
        putStockOrder
      );
    }
  });
}
