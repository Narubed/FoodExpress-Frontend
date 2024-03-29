/* eslint-disable camelcase */
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import Label from '@material-tailwind/react/Label';
import numeral from 'numeral';
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
  Button
} from '@mui/material';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import {
  TakesOrderListHead,
  TakesOrderListToolbar,
  TakesOrderDetail,
  TakesOrderModalBarcode
} from '../../../components/_rider/takesorder';
//

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id_order_rider_id', label: 'รหัส barcode', alignRight: false },
  { id: 'order_rider_product_name', label: 'ชื่อสินค้า', alignRight: false },
  { id: 'order_rider_amount', label: 'จำนวน', alignRight: false },
  { id: 'order_rider_status', label: 'สถานะ', alignRight: false },
  { id: '', label: 'รายระเอียด', alignRight: false },
  { id: '', label: 'บาร์โค๊ต', alignRight: false },
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
        _user.id_order_rider_id.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function AdminTakesOrderDetail() {
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
    const rider = sessionStorage.getItem('user');
    const getRider = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllRiderOrder`);
    const filterRider_id = getRider.data.data.filter(
      (f) => parseInt(f.order_rider_id, 10) === parseInt(rider, 10)
    );
    const reverseRider = filterRider_id.reverse();
    setRiderlist(reverseRider);
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

  return (
    <Page title="TakeOrder | NBA-FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            <div>Rider TakeOrder</div>
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/rider/RiderTakesOrderApp/RiderCreatBarCodeApp"
            startIcon={<Icon icon={plusFill} />}
          >
            สร้าง Barcode
          </Button>
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
                        order_rider_currency
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
                          <TableCell align="left">
                            <Label color="blueGray">{id_order_rider_id}</Label>
                          </TableCell>
                          <TableCell align="left">{order_rider_product_name}</TableCell>
                          <TableCell align="left">
                            {numeral(order_rider_amount).format()} {order_rider_currency}
                          </TableCell>
                          <TableCell align="left">
                            {order_rider_status === 'ไรเดอร์รับมอบหมายงานแล้ว' ? (
                              <Label color="pink">{order_rider_status}</Label>
                            ) : (
                              <Label color="green">{order_rider_status}</Label>
                            )}
                          </TableCell>
                          <TableCell align="">
                            <TakesOrderDetail props={row} />
                          </TableCell>
                          <TableCell align="">
                            <TakesOrderModalBarcode props={row} />
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
