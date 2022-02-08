/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { filter } from 'lodash';
import numeral from 'numeral';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { Link as RouterLink } from 'react-router-dom';
import Label from '@material-tailwind/react/Label';
import axios from 'axios';
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
  Box
} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDateRangePicker from '@mui/lab/MobileDateRangePicker';
import { styled } from '@mui/material/styles';
import {
  CheckOrderMemberListHead,
  CheckOrderMemberListToolbar,
  CheckOrderMemberMoreMenu,
  CheckSlipImageMember,
  CheckOrderMemberPutSlip
} from '../../../components/_dashboard/checkordermember';
import Page from '../../../components/Page';
// import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import checkStatusOrder from '../../../utils/checkStatusOrder';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'order_id', label: 'ID', alignRight: false },
  { id: 'order_status', label: 'Status', alignRight: false },
  { id: 'order_slip', label: 'Slip', alignRight: false },
  { id: 'order_product_total', label: 'ผลรวมของออเดอร์', alignRight: false },
  { id: 'order_product_date', label: 'วัน-เดือน-ปี', alignRight: false },
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
        _user.order_status.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.order_id.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        // _user.order_product_total.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.order_product_date.toLowerCase().indexOf(query.toLowerCase()) !== -1
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

function CheckOrderMemberApp() {
  const dispatch = useDispatch();
  dispatch({ type: 'OPEN' });
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
    checkStatusOrder();
    const getOrdder = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllOrder`);
    const filterMemberId = getOrdder.data.data.filter(
      (f) => f.order_member_id === sessionStorage.getItem('user')
    );
    const reverseData = filterMemberId.reverse();
    const sortData = reverseData.sort(
      (a, b) => dayjs(a.order_product_date).format - dayjs(b.order_product_date).format
    );
    setOrderlist(sortData);
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = Orderlist.map((n) => n.order_id);
      // const newSelectedsid = Orderlist.map((n) => n.order_id);
      setSelected(newSelecteds);
      // setSelected_id(newSelectedsid);
      return;
    }

    setSelected([]);
    setSelected_id([]);
  };
  const onChangeStatus = (e) => {
    const filterStatus = Orderlist.filter((value) => value.order_status === e);
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
            dayjs(f.order_product_date).format() >= dayjs(valueDate[0]).format() &&
            dayjs(f.order_product_date).format() <= dayjs(valueDate[1]).format()
        )
      : OrderlistFilter === null && valueDate[0] !== null && valueDate[1] !== null
      ? Orderlist.filter(
          (f) =>
            dayjs(f.order_product_date).format() >= dayjs(valueDate[0]).format() &&
            dayjs(f.order_product_date).format() <= dayjs(valueDate[1]).format()
        )
      : OrderlistFilter !== null && valueDate[0] === null && valueDate[1] === null
      ? OrderlistFilter
      : Orderlist;
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - newOrderlist.length) : 0;

  const filteredOrder = applySortFilter(newOrderlist, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredOrder.length === 0;
  dispatch({ type: 'TURNOFF' });
  return (
    <>
      <Page title="CheckOrder | FoodExpress">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              <div> ออเดอร์ของท่าน</div>
            </Typography>
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
          <Card>
            <CheckOrderMemberListToolbar
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
                  <CheckOrderMemberListHead
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
                          order_id,
                          order_member_id,
                          order_status,
                          order_slip,
                          order_product_total,
                          order_product_date
                        } = row;
                        const isItemSelected = selected.indexOf(order_id) !== -1;

                        return (
                          <TableRow
                            hover
                            key={order_id}
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
                                  <Label color="blueGray"> {order_id}</Label>
                                </Typography>{' '}
                              </Stack>
                            </TableCell>
                            <TableCell align="left">
                              {order_status === 'รอชำระเงิน' ? (
                                <Label color="brown">{order_status}</Label>
                              ) : null}
                              {order_status === 'รอตรวจสอบ' ? (
                                <Label color="lightBlue">{order_status}</Label>
                              ) : null}
                              {order_status === 'รอจัดส่ง' ? (
                                <Label color="amber">{order_status}</Label>
                              ) : null}
                              {order_status === 'จัดส่งสำเร็จ' ? (
                                <Label color="green">{order_status}</Label>
                              ) : null}
                              {order_status === 'ผู้ใช้ยกเลิก' ? (
                                <Label color="red">{order_status}</Label>
                              ) : null}
                              {order_status === 'ผู้ดูแลระบบยกเลิก' ? (
                                <Label color="pink">{order_status}</Label>
                              ) : null}
                            </TableCell>
                            <TableCell align="left">
                              {order_slip !== '' ? (
                                <StyledBadge
                                  overlap="circular"
                                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                  variant="dot"
                                >
                                  <CheckSlipImageMember images={order_slip} Name={order_id} />
                                </StyledBadge>
                              ) : order_status === 'รอชำระเงิน' ? (
                                <CheckOrderMemberPutSlip order_id={order_id} />
                              ) : null}
                            </TableCell>
                            <TableCell align="left">
                              {numeral(order_product_total).format()}
                            </TableCell>
                            <TableCell align="left">
                              <Label color="lightGreen">
                                {order_product_date
                                  ? dayjs(order_product_date).locale('th').format('DD MMMM YYYY')
                                  : null}
                              </Label>{' '}
                            </TableCell>

                            <TableCell align="right">
                              <CheckOrderMemberMoreMenu
                                order_id={order_id}
                                Orderlist={Orderlist}
                                row={row}
                                order_product_total={order_product_total}
                                order_status={order_status}
                                order_member_id={order_member_id}
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
      </Page>
    </>
  );
}
export default CheckOrderMemberApp;
