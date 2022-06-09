import axios from 'axios';
import React from 'react';

export default async function setConsigneeRider({ setNewConsignee }) {
  const getValueCompany = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllRider`);
  const valueLoop = [];
  await getValueCompany.data.data.forEach((element) => {
    valueLoop.push({
      consignee_type: 'rider',
      consignee_name: element.rider_first_name,
      consignee_id: element.rider_id,
      consignee_note: 'ไม่มี'
    });
  });
  await setNewConsignee(valueLoop);
}
