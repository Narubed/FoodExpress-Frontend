import PropTypes from 'prop-types';
import axios from 'axios';
// ----------------------------------------------------------------------

CheckWalletSubDistrict.propTypes = {
  props: PropTypes.array.isRequired
};

export default async function CheckWalletSubDistrict(myUser, percentOrderDetail) {
  const getWallets = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllWalletMember`);
  const filterWalletMyUserID = getWallets.data.data.filter(
    (f) => f.wallet_member_id_express === myUser.userId
  );
  const reducePercentMe = percentOrderDetail.reduce(
    (sum, percent) => sum + percent.percent_value_detail_subdistrict,
    0
  );
  const getAllMembers = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/members`);
  const filterProvice = getAllMembers.data.data.filter(
    (f) => f.province === myUser.province && f.level === 'province' && f.status === 'Active'
  );
  const filterDistrict = getAllMembers.data.data.filter(
    (f) => f.district === myUser.district && f.level === 'district' && f.status === 'Active'
  );
  if (filterProvice.length !== 0) {
    console.log('มีจังหวัด');
    const filterWalletMyProvince = getWallets.data.data.filter(
      (f) => f.wallet_member_id_express === filterProvice[0].userId
    );
    const reducePercentProvince = percentOrderDetail.reduce(
      (sum, percent) => sum + percent.percent_value_detail_provice,
      0
    );
    if (filterWalletMyProvince.length !== 0) {
      const dataPutWalletProvince = {
        id_wallet_member_express: filterWalletMyProvince[0].id_wallet_member_express,
        wallet_member_total: reducePercentProvince + filterWalletMyProvince[0].wallet_member_total
      };
      await axios.put(
        `${process.env.REACT_APP_WEB_BACKEND}/putWalletMemberTotal`,
        dataPutWalletProvince
      );
    } else {
      const dataPutWalletsProvince = {
        wallet_member_id_express: filterProvice[0].userId,
        wallet_member_total: reducePercentProvince
      };
      await axios.post(
        `${process.env.REACT_APP_WEB_BACKEND}/postWalletMember`,
        dataPutWalletsProvince
      );
    }
  } // ไม่มีจังหวัดก็ไม่ทำอะไรต่อเลย
  if (filterDistrict.length !== 0) {
    console.log('มีอำเภอ');
    const filterWalletMyDistrict = getWallets.data.data.filter(
      (f) => f.wallet_member_id_express === filterDistrict[0].userId
    );
    const reducePercentDistrict = percentOrderDetail.reduce(
      (sum, percent) => sum + percent.percent_value_detail_district,
      0
    );
    if (filterWalletMyDistrict.length !== 0) {
      const dataPutWalletDistrict = {
        id_wallet_member_express: filterWalletMyDistrict[0].id_wallet_member_express,
        wallet_member_total: reducePercentDistrict + filterWalletMyDistrict[0].wallet_member_total
      };
      await axios.put(
        `${process.env.REACT_APP_WEB_BACKEND}/putWalletMemberTotal`,
        dataPutWalletDistrict
      );
    } else {
      const dataPutWalletsDistrict = {
        wallet_member_id_express: filterProvice[0].userId,
        wallet_member_total: reducePercentDistrict
      };
      await axios.post(
        `${process.env.REACT_APP_WEB_BACKEND}/postWalletMember`,
        dataPutWalletsDistrict
      );
    }
  } // ไม่มีอำเภอก็ไม่ทำอะไรต่อเลย
  if (filterWalletMyUserID.length !== 0) {
    const dataPutWallet = {
      id_wallet_member_express: filterWalletMyUserID[0].id_wallet_member_express,
      wallet_member_total: reducePercentMe + filterWalletMyUserID[0].wallet_member_total
    };
    await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putWalletMemberTotal`, dataPutWallet);
  } else {
    const dataPutWallets = {
      wallet_member_id_express: myUser.userId,
      wallet_member_total: reducePercentMe
    };
    await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postWalletMember`, dataPutWallets);
  }
}
