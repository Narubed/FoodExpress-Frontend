import axios from 'axios';
import React from 'react';

export default async function setCompany({ setNewDealer }) {
  const getValueCompany = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllCompany`);
  const valueLoop = [];
  await getValueCompany.data.data.forEach((element) => {
    valueLoop.push({
      dealer_type: 'company',
      dealer_name: element.company_name,
      dealer_id: element.company_id,
      dealer_note: element.company_address
    });
  });
  await setNewDealer(valueLoop);
}
