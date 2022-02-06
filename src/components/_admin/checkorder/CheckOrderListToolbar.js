import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
import roundClearAll from '@iconify/icons-ic/round-clear-all';
// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Radio,
  Toolbar,
  Tooltip,
  Button,
  Drawer,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  FormControlLabel,
  Stack,
  RadioGroup
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

import Scrollbar from '../../Scrollbar';
// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

CompanyListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  selected_id: PropTypes.array,
  onChangeStatus: PropTypes.string,
  onResetFilter: PropTypes.func
};

export default function CompanyListToolbar({
  numSelected,
  filterName,
  onFilterName,
  onChangeStatus,
  onResetFilter,
  // eslint-disable-next-line camelcase
  selected_id
}) {
  const [state, setState] = useState(false);
  const [statusOrder, setStatusOrder] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const statusOrder = [
      'รอจัดส่ง',
      'รอชำระเงิน',
      'รอตรวจสอบ',
      'จัดส่งสำเร็จ',
      'ผู้ใช้ยกเลิก',
      'ผู้ดูแลระบบยกเลิก'
    ];
    setStatusOrder(statusOrder);
  }, []);

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search Order..."
          startAdornment={
            <InputAdornment position="start">
              <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}

      <Tooltip title="Filter list">
        <Button
          disableRipple
          color="inherit"
          endIcon={<Icon icon={roundFilterList} />}
          onClick={() => setState(true)}
        >
          สถานะสินค้า&nbsp;
        </Button>
      </Tooltip>

      <Drawer
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' }
        }}
        anchor="right"
        open={state}
        onClose={() => setState(false)}
      >
        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              สถานะสินค้า
            </Typography>

            <RadioGroup>
              {statusOrder.map((item) => (
                <FormControlLabel
                  key={item}
                  value={item}
                  control={<Radio />}
                  onChange={(e) => onChangeStatus(e.target.value)}
                  label={item}
                />
              ))}
            </RadioGroup>
          </Stack>
        </Scrollbar>
        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={() => onResetFilter()}
            startIcon={<Icon icon={roundClearAll} />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </RootStyle>
  );
}
