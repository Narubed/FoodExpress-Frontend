import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        ตอนนี้ยังไม่มีข้อมูล
      </Typography>
      <Typography variant="body2" align="center">
        กรุณาทำรายการ &nbsp; หรือติดต่อผู้ดูแลระบบเพื่อเเก้ไขปัญหานี้.
      </Typography>
    </Paper>
  );
}
