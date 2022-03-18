import PropTypes from 'prop-types';
import axios from 'axios';
import PercentDetailSubDistrict from './PercentDetail/PercentDetailSubDistrict';
import PercentDetailDistrict from './PercentDetail/PercentDetailDistrict';
import PercentDetailProvice from './PercentDetail/PercentDetailProvice';
// ----------------------------------------------------------------------

ProductPercentDetail.propTypes = {
  props: PropTypes.array.isRequired
};

export default async function ProductPercentDetail({ count, OrderFoodExpress }) {
  const getPercent = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllPrecent`);
  const filterLevel = getPercent.data.data.filter(
    (f) => f.percent_name === sessionStorage.getItem('level')
  );
  // eslint-disable-next-line no-self-compare
  if (sessionStorage.getItem('level') === 'province') {
    console.log('level provice');
    await PercentDetailProvice({ count, OrderFoodExpress, filterLevel });
  } else if (sessionStorage.getItem('level') === 'district') {
    console.log('level district');
    await PercentDetailDistrict({ count, OrderFoodExpress, filterLevel });
  } else if (sessionStorage.getItem('level') === 'subdistrict') {
    console.log('level subdistrict');
    await PercentDetailSubDistrict({ count, OrderFoodExpress, filterLevel });
  }
}
