/* eslint-disable camelcase */
import { useDispatch } from 'react-redux';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Label from '@material-tailwind/react/Label';
import numeral from 'numeral';
// import Button from '@material-tailwind/react/Button';
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
  TablePagination
} from '@mui/material';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import {
  TakesOrderListHead,
  TakesOrderListToolbar,
  TakesOrderInputBarCode
} from '../../../components/_dashboard/takesorder';
//

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'order_rider_product_name', label: 'ชื่อสินค้า', alignRight: false },
  { id: 'order_rider_Amount', label: 'จำนวน', alignRight: false },
  { id: 'order_rider_status', label: 'สถานะ', alignRight: false },
  { id: 'rider_first_name', label: 'ชื่อไรเดอร์', alignRight: false },
  { id: 'rider_tel', label: 'เบอร์ไรเดอร์', alignRight: false },
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
        _user.order_rider_product_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.order_rider_status.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.rider_first_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function AdminTakesOrderDetail() {
  const dispatch = useDispatch();
  dispatch({ type: 'OPEN' });
  const [Riderlist, setRiderlist] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [selected_id, setSelected_id] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const user = sessionStorage.getItem('user');
    const getOrderRider = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getAllOrderExpressJoinRider`
    );
    const filterOrder = getOrderRider.data.data.filter(
      (f) => parseInt(f.order_rider_consignee_id, 10) === parseInt(user, 10)
    );
    const filterOrderStatus = filterOrder.filter(
      (value) => value.order_rider_status === 'ไรเดอร์รับมอบหมายงานแล้ว'
    );
    setRiderlist(filterOrderStatus);
  }, []);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = Riderlist.map((n) => n.rider_first_name);
      const newSelectedsid = Riderlist.map((n) => n.rider_id);
      setSelected(newSelecteds);
      setSelected_id(newSelectedsid);
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - Riderlist.length) : 0;
  const filteredUsers = applySortFilter(Riderlist, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;
  dispatch({ type: 'TURNOFF' });
  return (
    <Page title="ออเดอร์ที่ต้องได้รับ | NBA-FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            <div> ออเดอร์ที่ต้องได้รับจากไรเดอร์โดยตรง</div>
          </Typography>
          <TakesOrderInputBarCode orderList={Riderlist} key={Riderlist.length} />
        </Stack>
        <Card>
          <TakesOrderListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selected={selected}
            selected_id={selected_id}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TakesOrderListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={Riderlist.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        id_order_rider_id,
                        order_rider_product_name,
                        order_rider_amount,
                        order_rider_status,
                        rider_first_name,
                        rider_tel
                      } = row;
                      const isItemSelected = selected.indexOf(id_order_rider_id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id_order_rider_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox" />
                          <TableCell align="left">{order_rider_product_name}</TableCell>
                          <TableCell align="left">{numeral(order_rider_amount).format()}</TableCell>
                          <TableCell align="left">
                            {order_rider_status === 'ไรเดอร์รับมอบหมายงานแล้ว' ? (
                              <Label color="pink">{order_rider_status}</Label>
                            ) : (
                              <Label color="green">{order_rider_status}</Label>
                            )}
                          </TableCell>
                          <TableCell align="left">{rider_first_name}</TableCell>
                          <TableCell align="left">{rider_tel}</TableCell>
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
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
