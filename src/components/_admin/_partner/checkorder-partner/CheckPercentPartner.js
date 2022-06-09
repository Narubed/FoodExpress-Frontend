import axios from 'axios';

export default async function CheckPercentPartner(props) {
  const getOrderDetail = await axios.get(
    `${process.env.REACT_APP_PARTNER_API}/order_detail/order_id/${props.id}`
  );
  let walletPartner = [];
  await axios
    .get(`${process.env.REACT_APP_PARTNER_API}/wallet_partner/partner_id/${props.order_partner_id}`)
    .then((res) => {
      walletPartner = res.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
  const reducePercent = getOrderDetail.data.data.reduce(
    (value, item) => value + parseFloat(item.odd_percent_service),
    0
  );
  if (walletPartner.length === 0) {
    const dataPostWallet = {
      wallet_partner_id: props.order_partner_id,
      wallet_partner_total: reducePercent
    };
    await axios.post(`${process.env.REACT_APP_PARTNER_API}/wallet_partner`, dataPostWallet);
  } else {
    const dataPutWallet = {
      wallet_partner_id: props.order_partner_id,
      wallet_partner_total: reducePercent + walletPartner[0].wallet_partner_total
    };
    const id = walletPartner[0]._id;
    await axios.put(`${process.env.REACT_APP_PARTNER_API}/wallet_partner/${id}`, dataPutWallet);
  }
}
