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
  TextField,
  Box
} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDateRangePicker from '@mui/lab/MobileDateRangePicker';
import {
  CheckOrderDetailUnderMemberListHead,
  CheckOrderDetailUnderMemberMoreMenu
} from '../../../components/_dashboard/checkorderdetailundermember';
import Page from '../../../components/Page';
// import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'level', label: 'level', alignRight: false },
  { id: 'order_id', label: 'ID', alignRight: false },
  { id: 'order_status', label: 'Status', alignRight: false },
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
        _user.order_product_date.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

function CheckOrderDetailUnderMemberApp() {
  const dispatch = useDispatch();
  dispatch({ type: 'OPEN' });
  // eslint-disable-next-line no-undef
  const [Orderlist, setOrderlist] = useState([]);
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
    const level = sessionStorage.getItem('level');
    const user = sessionStorage.getItem('user');
    const getOrderAndMember = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getJoinOrder_Member`
    );
    const getUser_id = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/member/${user}`);
    const reverseOrderAndMember = getOrderAndMember.data.data.reverse();
    const filterByStatus = reverseOrderAndMember.filter((e) => e.order_status === 'รอจัดส่ง');
    console.log(filterByStatus);
    let filterData = [];
    if (level === 'province') {
      console.log('ระดับ province');
      filterData = filterByStatus.filter((f) => f.province === getUser_id.data.data.province);
    }
    if (level === 'district') {
      console.log('ระดับ district');
      const a = filterByStatus.filter((f) => f.district === getUser_id.data.data.district);
      const b = a.filter((f) => f.level === 'district');
      const c = a.filter((f) => f.level === 'subdistrict');
      filterData = b.concat(c);
    }
    if (level === 'subdistrict') {
      console.log('ระดับ subdistrict');
      const a = filterByStatus.filter((f) => f.subdistrict === getUser_id.data.data.subdistrict);
      filterData = a.filter((f) => f.level === 'subdistrict');
    }
    console.log(filterData);

    setOrderlist(filterData);
  }, []);
  dispatch({ type: 'TURNOFF' });
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = Orderlist.map((n) => n.order_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
    setSelected_id([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  dispatch({ type: 'OPEN' });
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - Orderlist.length) : 0;

  const newOrderlist =
    valueDate[0] && valueDate[1] !== null
      ? Orderlist.filter(
          (f) =>
            dayjs(f.order_product_date).format() >= dayjs(valueDate[0]).format() &&
            dayjs(f.order_product_date).format() <= dayjs(valueDate[1]).format()
        )
      : Orderlist;
  const filteredOrder = applySortFilter(newOrderlist, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredOrder.length === 0;
  dispatch({ type: 'TURNOFF' });
  return (
    <>
      <Page title="CheckOrder | FoodExpress">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              <div> ออเดอร์ผู้ใช้ใต้สังกัต</div>
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
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <CheckOrderDetailUnderMemberListHead
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
                          level,
                          order_id,
                          order_member_id,
                          order_status,
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
                            <TableCell>
                              <Typography variant="subtitle2" noWrap>
                                {level === 'province' ? (
                                  <Label color="pink"> ระดับจังหวัด</Label>
                                ) : null}
                                {level === 'district' ? (
                                  <Label color="lightBlue"> ระดับอำเภอ</Label>
                                ) : null}
                                {level === 'subdistrict' ? (
                                  <Label color="amber"> ระดับตำบล</Label>
                                ) : null}
                                {/* <Label color="blueGray"> {level}</Label> */}
                              </Typography>
                            </TableCell>
                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  <Label color="blueGray"> {order_id}</Label>
                                </Typography>{' '}
                              </Stack>
                            </TableCell>
                            <TableCell align="left">
                              {order_status === 'รอจัดส่ง' ? (
                                <Label color="orange">{order_status}</Label>
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
                              <CheckOrderDetailUnderMemberMoreMenu
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
export default CheckOrderDetailUnderMemberApp;
