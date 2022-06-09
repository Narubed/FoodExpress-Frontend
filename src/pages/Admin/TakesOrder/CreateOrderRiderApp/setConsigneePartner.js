import axios from 'axios';
import React from 'react';

export default async function setConsigneePartner({ setNewConsignee }) {
  const Partner = await axios.get(`${process.env.REACT_APP_API_OFFICE}/partner`);
  const getGEO = await axios.post(`${process.env.REACT_APP_API_GEO}/nba-geo`, {
    tokenKey: '*NBADigital9111*'
  });
  const getZone = await axios.post(`${process.env.REACT_APP_API_GEO}/zone`, {
    tokenKey: '*NBADigital9111*'
  });
  const filterPartnerGEO = [];
  Partner.data.data.forEach((element) => {
    if (element.partner_level === 'ระดับภาค') {
      const valueFind = getGEO.data.data.find(
        (item) => item.nba_geo_id === parseInt(element.partner_sublevel, 10)
      );
      filterPartnerGEO.push({ ...element, partner_sublevel_name: valueFind.nba_geo_name });
    } else if (element.partner_level === 'ระดับเขต') {
      const valueFind = getZone.data.data.find(
        (item) => item.nba_zone === parseInt(element.partner_sublevel, 10)
      );
      filterPartnerGEO.push({ ...element, partner_sublevel_name: valueFind.zone_name });
    }
  });

  const valueLoop = [];
  await filterPartnerGEO.forEach((element) => {
    valueLoop.push({
      consignee_type: 'partner',
      consignee_name: element.partner_sublevel_name,
      consignee_id: element._id,
      consignee_note: element.partner_address
    });
  });
  await setNewConsignee(valueLoop);
}
