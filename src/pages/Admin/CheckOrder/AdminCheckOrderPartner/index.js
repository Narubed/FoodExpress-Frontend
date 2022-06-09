/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
import { filter } from 'lodash';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import axios from 'axios';
import { styled } from '@mui/material/styles';

// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Badge,
  TextField,
  Box,
  Button,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDateRangePicker from '@mui/lab/MobileDateRangePicker';

import {
  CheckOrderListHead,
  CheckOrderListToolbar,
  CheckOrderMoreMenu,
  WatchingImage
} from '../../../../components/_admin/_partner/checkorder-partner';

import Scrollbar from '../../../../components/Scrollbar';
import SearchNotFound from '../../../../components/SearchNotFound';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: '_id', label: 'ไอดีออเดอร์', alignRight: false },
  { id: 'order_partner_status', label: 'สถานะ', alignRight: false },
  { id: 'order_partner_image', label: 'หลักฐานการโอน', alignRight: false },
  { id: 'order_partner_total', label: 'ผลรวมของออเดอร์', alignRight: false },
  { id: 'order_partner_timestamp', label: 'วัน-เดือน-ปี', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;

    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user._id.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.order_partner_status.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.order_partner_total.toLocaleString().toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}));

function AdminCheckOrderApp() {
  // eslint-disable-next-line no-undef
  const [Orderlist, setOrderlist] = useState([]);
  const [OrderlistFilter, setOrderlistFilter] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  // eslint-disable-next-line camelcase
  const [selected_id, setSelected_id] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [valueDate, setValueDate] = useState([null, null]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getOrdder = await axios.get(`${process.env.REACT_APP_PARTNER_API}/order`);
    console.log(getOrdder.data.data);
    const reverseData = getOrdder.data.data.reverse();
    console.log(reverseData);
    setOrderlist(reverseData);
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = Orderlist.map((n) => n._id);

      // const newSelectedsid = Orderlist.map((n) => n.order_id);
      setSelected(newSelecteds);

      // setSelected_id(newSelectedsid);
      return;
    }
    setSelected([]);
    setSelected_id([]);
  };

  const onChangeStatus = (e) => {
    const filterStatus = Orderlist.filter((value) => value.order_partner_status === e);
    if (filterStatus.length !== 0) {
      setOrderlistFilter(filterStatus);
    }
  };

  const onResetFilter = () => {
    setOrderlistFilter(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const newOrderlist =
    OrderlistFilter !== null && valueDate[0] !== null && valueDate[1] !== null
      ? OrderlistFilter.filter(
          (f) =>
            dayjs(f.order_partner_timestamp).format() >= dayjs(valueDate[0]).format() &&
            dayjs(f.order_partner_timestamp).format() <= dayjs(valueDate[1]).format()
        )
      : OrderlistFilter === null && valueDate[0] !== null && valueDate[1] !== null
      ? Orderlist.filter(
          (f) =>
            dayjs(f.order_partner_timestamp).format() >= dayjs(valueDate[0]).format() &&
            dayjs(f.order_partner_timestamp).format() <= dayjs(valueDate[1]).format()
        )
      : OrderlistFilter !== null && valueDate[0] === null && valueDate[1] === null
      ? OrderlistFilter
      : Orderlist;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - newOrderlist.length) : 0;
  const filteredOrder = applySortFilter(newOrderlist, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredOrder.length === 0;

  const statusObj = {
    รอจัดส่ง: { color: 'info' },
    รอชำระเงิน: { color: 'warning' },
    รอตรวจสอบ: { color: 'primary' },
    จัดส่งสำเร็จ: { color: 'success' },
    ผู้ใช้ยกเลิก: { color: 'error' },
    ผู้ดูแลระบบยกเลิก: { color: 'error' }
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            <div>เช็คออเดอร์</div>
          </Typography>
          {sessionStorage.getItem('level') === 'ManagerAdmin' ? (
            <Tooltip title="ปริ้นรายระเอียดออเดอร์">
              <Link to="/admin/AdminCheckOrderPartnerApp/AdminPrintOrderPartner">
                <Button sx={{ color: 'purple' }}>
                  <Icon icon="flat-color-icons:print" width={32} height={32} />
                </Button>
              </Link>
            </Tooltip>
          ) : null}
        </Stack>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3}>
            <MobileDateRangePicker
              startText="start"
              value={valueDate}
              onChange={(newValue) => {
                setValueDate(newValue);
              }}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField size="small" {...startProps} />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField size="small" {...endProps} />
                </>
              )}
            />
          </Stack>
        </LocalizationProvider>
        <br />

        <Card>
          <CheckOrderListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selected={selected}
            onChangeStatus={onChangeStatus}
            onResetFilter={onResetFilter}
            // eslint-disable-next-line camelcase
            selected_id={selected_id}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <CheckOrderListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={Orderlist.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredOrder
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        _id,
                        order_partner_id,
                        order_partner_image,
                        order_partner_status,
                        order_partner_total,
                        order_partner_timestamp
                      } = row;
                      const isItemSelected = selected.indexOf(_id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            {/* <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, company_name, company_id)}
                              /> */}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {_id}
                              </Typography>{' '}
                            </Stack>
                          </TableCell>
                          <TableCell align="left">
                            <Chip
                              label={row.order_partner_status}
                              color={statusObj[row.order_partner_status].color}
                              sx={{
                                height: 24,
                                fontSize: '0.75rem',
                                textTransform: 'capitalize',
                                '& .MuiChip-label': { fontWeight: 500 }
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {order_partner_image ? (
                              <WatchingImage image={order_partner_image} />
                            ) : null}
                          </TableCell>
                          <TableCell align="left">{order_partner_total.toLocaleString()}</TableCell>
                          <TableCell align="left">
                            {order_partner_timestamp
                              ? dayjs(order_partner_timestamp)
                                  .add(543, 'year')
                                  .locale('th')
                                  .format('DD MMMM YYYY')
                              : null}
                          </TableCell>

                          <TableCell align="right">
                            <CheckOrderMoreMenu
                              id={_id}
                              Orderlist={Orderlist}
                              row={row}
                              order_partner_total={order_partner_total}
                              order_partner_status={order_partner_status}
                              order_partner_id={order_partner_id}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={newOrderlist.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}

export default AdminCheckOrderApp;
