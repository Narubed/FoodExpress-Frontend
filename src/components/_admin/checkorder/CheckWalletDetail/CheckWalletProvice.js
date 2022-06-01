/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import axios from 'axios';
// ----------------------------------------------------------------------
CheckWalletProvice.propTypes = {
  props: PropTypes.array.isRequired
};
export default async function CheckWalletProvice(myUser, percentOrderDetail) {
  const getWallets = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllWalletMember`);
  const filterWalletMyUserID = getWallets.data.data.filter(
    (f) => f.wallet_member_id_express === myUser.userId
  );
  const reducePercentMe = percentOrderDetail.reduce(
    (sum, percent) => sum + percent.percent_service_value_provice,
    0
  );

  if (filterWalletMyUserID.length !== 0) {
    const dataPutWallet = {
      id_wallet_member_express: filterWalletMyUserID[0].id_wallet_member_express,
      wallet_member_total: (reducePercentMe + filterWalletMyUserID[0].wallet_member_total).toFixed(
        3
      )
    };
    await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putWalletMemberTotal`, dataPutWallet);
  } else {
    const dataPostWallets = {
      wallet_member_id_express: myUser.userId,
      wallet_member_total: reducePercentMe.toFixed(3)
    };
    await axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postWalletMember`, dataPostWallets);
  }
}
