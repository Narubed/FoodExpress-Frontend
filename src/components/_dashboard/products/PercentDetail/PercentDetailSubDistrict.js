/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import axios from 'axios';
// ----------------------------------------------------------------------

PercentDetailSubDistrict.propTypes = {
  props: PropTypes.array.isRequired
};

export default async function PercentDetailSubDistrict({ count, OrderFoodExpress, filterLevel }) {
  console.log(filterLevel);
  console.log(OrderFoodExpress);
  console.log(count);

  const getAllUsers = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/members`);
  const filterMyuser = getAllUsers.data.data.filter(
    (f) => f.userId === sessionStorage.getItem('user')
  );
  const filterProvice = getAllUsers.data.data.filter(
    (f) =>
      f.province === filterMyuser[0].province && f.level === 'province' && f.status === 'Active'
  );
  const filterDistrict = getAllUsers.data.data.filter(
    (f) =>
      f.district === filterMyuser[0].district && f.level === 'district' && f.status === 'Active'
  );
  console.log(filterProvice);
  console.log(filterDistrict);
  let Percent_Order_Detail = [];
  if (filterProvice.length !== 0) {
    if (filterDistrict.length !== 0) {
      console.log('มีจังหวัด มีอำเภอ');
      await count.map(
        (value) =>
          (Percent_Order_Detail = Percent_Order_Detail.concat({
            percent_order_id: OrderFoodExpress.order_id, // ไอดีออเดอร์
            percent_order_detail_id: OrderFoodExpress.order_id + value.productid, // ไอดีมันเอง
            percent_order_member_id: OrderFoodExpress.order_member_id, // ไอดีเจ้าของ

            percent_level_name: filterLevel[0].percent_name, // ระดับ
            percent_subdistrict: filterLevel[0].percent_subdistrict, // เปอร์เซ็นตำบล
            percent_district: filterLevel[0].percent_district, // เปอร์เซ็นอำเภอ
            percent_provice: filterLevel[0].percent_provice, // เปอร์เซ็นจังหวัด

            percentage_increase: 0, // เปอร์เซ็นที่ได้รับเพิ่มเติ่มกรณีศูนย์สั่งสินค้า เก็บเป็นตัวเลขเปอร์เซ็นเลย
            percentage_increase_income: 0, // จำนวนเงินที่ได้รรับเพิ่มขึ้นจากศูนย์

            percent_value_takeoff_vat: ((value.productPrice * value.amount * 100) / 107).toFixed(3), // ราคา ถอดvat x จำนวน
            percent_value_vat: ((value.productPrice * value.amount * 7) / 107).toFixed(3), // vat x จำนวน
            percent_value_PF_VAT: (
              (value.percent_service + value.percent_NBA) *
              value.amount
            ).toFixed(3), // กำไรสุทธิ (หักvatแล้ว)
            percent_value_PF_HO: (value.percent_NBA * value.amount).toFixed(3), // กำไรสุทธิของบริษัท

            percent_older_price_value: value.productPrice * value.amount, // ราคาขาย x จำนวน
            percent_older_cost_value: value.productCost * value.amount, // ต้นทุน x จำนวน

            percent_service_value_subdistrict: (
              value.percent_service *
              value.amount *
              filterLevel[0].percent_subdistrict
            ).toFixed(3),
            percent_service_value_district: (
              value.percent_service *
              value.amount *
              filterLevel[0].percent_district
            ).toFixed(3),
            percent_service_value_provice: (
              value.percent_service *
              value.amount *
              filterLevel[0].percent_provice
            ).toFixed(3) // เปอร์เซ็นที่จังหวัดได้รับ
          }))
      );
    } else {
      console.log('มีจังหวัด ไม่มีอำเภอ');
      await count.map(
        (value) =>
          (Percent_Order_Detail = Percent_Order_Detail.concat({
            percent_order_id: OrderFoodExpress.order_id, // ไอดีออเดอร์
            percent_order_detail_id: OrderFoodExpress.order_id + value.productid, // ไอดีมันเอง
            percent_order_member_id: OrderFoodExpress.order_member_id, // ไอดีเจ้าของ

            percent_level_name: filterLevel[0].percent_name, // ระดับ
            percent_subdistrict: filterLevel[0].percent_subdistrict, // เปอร์เซ็นตำบล
            percent_district: filterLevel[0].percent_district, // เปอร์เซ็นอำเภอ
            percent_provice: filterLevel[0].percent_provice, // เปอร์เซ็นจังหวัด

            percentage_increase: filterLevel[0].percent_district * 100, // เปอร์เซ็นที่ได้รับเพิ่มเติ่มกรณีศูนย์สั่งสินค้า เก็บเป็นตัวเลขเปอร์เซ็นเลย
            percentage_increase_income: (
              value.percent_service *
              value.amount *
              filterLevel[0].percent_district
            ).toFixed(3), // จำนวนเงินที่ได้รับเพิ่มขึ้นจากศูนย์

            percent_value_takeoff_vat: ((value.productPrice * value.amount * 100) / 107).toFixed(3), // ราคา ถอดvat x จำนวน
            percent_value_vat: ((value.productPrice * value.amount * 7) / 107).toFixed(3), // vat x จำนวน
            percent_value_PF_VAT: (
              (value.percent_service + value.percent_NBA) *
              value.amount
            ).toFixed(3), // กำไรสุทธิ (หักvatแล้ว)
            percent_value_PF_HO: (value.percent_NBA * value.amount).toFixed(3), // กำไรสุทธิของบริษัท

            percent_older_price_value: value.productPrice * value.amount, // ราคาขาย x จำนวน
            percent_older_cost_value: value.productCost * value.amount, // ต้นทุน x จำนวน

            percent_service_value_subdistrict: (
              value.percent_service *
              value.amount *
              filterLevel[0].percent_subdistrict
            ).toFixed(3),
            percent_service_value_district: 0,
            percent_service_value_provice: (
              value.percent_service *
              value.amount *
              filterLevel[0].percent_provice
            ).toFixed(3) // เปอร์เซ็นที่จังหวัดได้รับ
          }))
      );
    }
  } else if (filterDistrict.length !== 0) {
    console.log('ไม่มีจังหวัด มีอำเภอ');
    await count.map(
      (value) =>
        (Percent_Order_Detail = Percent_Order_Detail.concat({
          percent_order_id: OrderFoodExpress.order_id, // ไอดีออเดอร์
          percent_order_detail_id: OrderFoodExpress.order_id + value.productid, // ไอดีมันเอง
          percent_order_member_id: OrderFoodExpress.order_member_id, // ไอดีเจ้าของ

          percent_level_name: filterLevel[0].percent_name, // ระดับ
          percent_subdistrict: filterLevel[0].percent_subdistrict, // เปอร์เซ็นตำบล
          percent_district: filterLevel[0].percent_district, // เปอร์เซ็นอำเภอ
          percent_provice: filterLevel[0].percent_provice, // เปอร์เซ็นจังหวัด

          percentage_increase: filterLevel[0].percent_provice * 100, // เปอร์เซ็นที่ได้รับเพิ่มเติ่มกรณีศูนย์สั่งสินค้า เก็บเป็นตัวเลขเปอร์เซ็นเลย
          percentage_increase_income: (
            value.percent_service *
            value.amount *
            filterLevel[0].percent_provice
          ).toFixed(3), // จำนวนเงินที่ได้รับเพิ่มขึ้นจากศูนย์

          percent_value_takeoff_vat: ((value.productPrice * value.amount * 100) / 107).toFixed(3), // ราคา ถอดvat x จำนวน
          percent_value_vat: ((value.productPrice * value.amount * 7) / 107).toFixed(3), // vat x จำนวน
          percent_value_PF_VAT: (
            (value.percent_service + value.percent_NBA) *
            value.amount
          ).toFixed(3), // กำไรสุทธิ (หักvatแล้ว)
          percent_value_PF_HO: (value.percent_NBA * value.amount).toFixed(3), // กำไรสุทธิของบริษัท

          percent_older_price_value: value.productPrice * value.amount, // ราคาขาย x จำนวน
          percent_older_cost_value: value.productCost * value.amount, // ต้นทุน x จำนวน

          percent_service_value_subdistrict: (
            value.percent_service *
            value.amount *
            filterLevel[0].percent_subdistrict
          ).toFixed(3),
          percent_service_value_district: (
            value.percent_service *
            value.amount *
            filterLevel[0].percent_district
          ).toFixed(3), // เปอร์เซ็นที่อำเภอได้รับ,
          percent_service_value_provice: 0
        }))
    );
  } else {
    console.log('ไม่มีจังหวัด ไม่มีอำเภอ');
    await count.map(
      (value) =>
        (Percent_Order_Detail = Percent_Order_Detail.concat({
          percent_order_id: OrderFoodExpress.order_id, // ไอดีออเดอร์
          percent_order_detail_id: OrderFoodExpress.order_id + value.productid, // ไอดีมันเอง
          percent_order_member_id: OrderFoodExpress.order_member_id, // ไอดีเจ้าของ

          percent_level_name: filterLevel[0].percent_name, // ระดับ
          percent_subdistrict: filterLevel[0].percent_subdistrict, // เปอร์เซ็นตำบล
          percent_district: filterLevel[0].percent_district, // เปอร์เซ็นอำเภอ
          percent_provice: filterLevel[0].percent_provice, // เปอร์เซ็นจังหวัด

          percentage_increase:
            (filterLevel[0].percent_provice + filterLevel[0].percent_district) * 100, // เปอร์เซ็นที่ได้รับเพิ่มเติ่มกรณีศูนย์สั่งสินค้า เก็บเป็นตัวเลขเปอร์เซ็นเลย
          percentage_increase_income: (
            value.percent_service *
            value.amount *
            (filterLevel[0].percent_provice + filterLevel[0].percent_district)
          ).toFixed(3), // จำนวนเงินที่ได้รับเพิ่มขึ้นจากศูนย์

          percent_value_takeoff_vat: ((value.productPrice * value.amount * 100) / 107).toFixed(3), // ราคา ถอดvat x จำนวน
          percent_value_vat: ((value.productPrice * value.amount * 7) / 107).toFixed(3), // vat x จำนวน
          percent_value_PF_VAT: (
            (value.percent_service + value.percent_NBA) *
            value.amount
          ).toFixed(3), // กำไรสุทธิ (หักvatแล้ว)
          percent_value_PF_HO: (value.percent_NBA * value.amount).toFixed(3), // กำไรสุทธิของบริษัท

          percent_older_price_value: value.productPrice * value.amount, // ราคาขาย x จำนวน
          percent_older_cost_value: value.productCost * value.amount, // ต้นทุน x จำนวน

          percent_service_value_subdistrict: (
            value.percent_service *
            value.amount *
            filterLevel[0].percent_subdistrict
          ).toFixed(3),
          percent_service_value_district: 0, // เปอร์เซ็นที่อำเภอได้รับ,
          percent_service_value_provice: 0
        }))
    );
  }
  console.log(Percent_Order_Detail);
  Percent_Order_Detail.map(async (value) => {
    await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postPercentOrderDetail`, value);
  });
}
