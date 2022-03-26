import axios from 'axios';

export default async function postActionAdmin(req, res) {
  console.log(req);
  axios.post(`${process.env.REACT_APP_WEB_BACKEND}/postReportActionAdmin`, req);
  // ตอนแสดงให้ + อีก 7 ชม.
}
