import axios from 'axios';
import React from 'react';

export default async function setConsigneeCompany({ setNewConsignee }) {
  const getValueCompany = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllCompany`);
  const valueLoop = [];
  await getValueCompany.data.data.forEach((element) => {
    valueLoop.push({
      consignee_type: 'company',
      consignee_name: element.company_name,
      consignee_id: element.company_id,
      consignee_note: element.company_address
    });
  });
  await setNewConsignee(valueLoop);
}
