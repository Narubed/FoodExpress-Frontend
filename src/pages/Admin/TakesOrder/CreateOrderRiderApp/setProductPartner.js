import axios from 'axios';

export default async function componentName({ setDataProduct, id }) {
  const getValueProduct = await axios.get(`${process.env.REACT_APP_PARTNER_API}/order_detail`);
  const filterStatusOrder = getValueProduct.data.data.filter(
    (f) => f.odd_status === 'ตัดรอบการจัดส่งแล้ว'
  );
  const filterCutArount = filterStatusOrder.filter((f) => f.odd_cutarount_id === id);

  const valueLoop = [];
  await filterCutArount.forEach(async (element) => {
    const idx = valueLoop.findIndex((item) => item.odd_product_id === element.odd_product_id);
    if (idx === -1) {
      valueLoop.push(element);
    } else {
      valueLoop[idx].odd_product_amount += element.odd_product_amount;
    }
  });
  const valueProduct = [];
  valueLoop.forEach((element) => {
    valueProduct.push({
      product_id: element.odd_product_id,
      product_name: element.odd_product_name,
      product_amoumt: element.odd_product_amount,
      product_currency: element.odd_product_currency
    });
  });
  await setDataProduct(valueProduct);
}
