import axios from 'axios';
import React from 'react';

export default async function setRider({ setNewDealer }) {
  const getValueRider = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllRider`);
  const valueLoop = [];
  await getValueRider.data.data.forEach((element) => {
    valueLoop.push({
      dealer_type: 'rider',
      dealer_name: element.rider_first_name,
      dealer_id: element.rider_id,
      dealer_note: 'ไม่มี'
    });
  });
  await setNewDealer(valueLoop);
}
