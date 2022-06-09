import axios from 'axios';
import React from 'react';

export default async function componentName({ setDataProduct, id }) {
  const getValueProduct = await axios.get(
    `${process.env.REACT_APP_WEB_BACKEND}/getJoinOrder_Detail`
  );
  const filterStatusOrder = getValueProduct.data.data.filter(
    (f) => f.order_company_status === 'ตัดรอบการจัดส่งแล้ว'
  );
  const filterCutArount = filterStatusOrder.filter((f) => f.cut_arount_id === id);

  const valueLoop = [];
  await filterCutArount.forEach(async (element) => {
    const idx = valueLoop.findIndex((item) => item.productid === element.productid);
    if (idx === -1) {
      valueLoop.push(element);
    } else {
      valueLoop[idx].order_product_amoumt += element.order_product_amoumt;
    }
  });
  const valueProduct = [];
  valueLoop.forEach((element) => {
    valueProduct.push({
      product_id: element.productid,
      product_name: element.productName,
      product_amoumt: element.order_product_amoumt,
      product_currency: element.currency
    });
  });
  await setDataProduct(valueProduct);
}
