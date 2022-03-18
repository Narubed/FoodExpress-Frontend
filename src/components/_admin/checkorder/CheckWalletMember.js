/* eslint-disable camelcase */
import React from 'react';
import Image from '@material-tailwind/react/Image';
import Button from '@material-tailwind/react/Button';
import axios from 'axios';
import {
  CheckWalletSubDistrict,
  CheckWalletDistrict,
  CheckWalletProvice
} from './CheckWalletDetail';
// eslint-disable-next-line camelcase
export default async function CheckWalletMember(
  order_id,
  order_product_total,
  order_status,
  order_member_id
) {
  const getMemberByID = await axios.get(
    `${process.env.REACT_APP_WEB_BACKEND}/member/${order_member_id}`
  );
  const getPercentOrderDetail = await axios.get(
    `${process.env.REACT_APP_WEB_BACKEND}/getJoin_order_detail_member`
  );

  const percentOrderDetail = getPercentOrderDetail.data.data.filter((f) => f.order_id === order_id);
  const myUser = getMemberByID.data.data;
  if (getMemberByID.data.data.level === 'province') {
    console.log('level provice');
    await CheckWalletProvice(myUser, percentOrderDetail);
  } else if (getMemberByID.data.data.level === 'district') {
    console.log('level district');
    await CheckWalletDistrict(myUser, percentOrderDetail);
  } else if (getMemberByID.data.data.level === 'subdistrict') {
    console.log('level subdistrict');
    await CheckWalletSubDistrict(myUser, percentOrderDetail);
  }
}
