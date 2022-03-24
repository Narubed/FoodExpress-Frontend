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
  PickUpListHead,
  PickUpListToolbar,
  PickUpDetail
} from '../../../components/_rider/pickupproduct';
//

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'order_rider_dealer_type', label: 'ประเภท', alignRight: false },
  { id: 'order_rider_product_name', label: 'ชื่อผู้นำจ่าย', alignRight: false },
  { id: 'order_rider_amount', label: 'ที่อยู่/note', alignRight: false },
  { id: '', label: 'รายระเอียด', alignRight: false },
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

export default function PickUpProductApp() {
  const [Riderlist, setRiderlist] = useState([]);
  const [OrderRiders, setOrderRiders] = useState([]);
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
    setOrderRiders(getRider.data.data);
    const filterRider_id = getRider.data.data.filter(
      (f) => parseInt(f.order_rider_id, 10) === parseInt(rider, 10)
    );
    const filterStatusOrder = filterRider_id.filter(
      (f) => f.order_rider_status === 'ไรเดอร์รับมอบหมายงานแล้ว'
    );
    const filtereds = [];
    filterStatusOrder.forEach((element) => {
      const idx = filtereds.findIndex(
        (value) => value.order_rider_dealer_note === element.order_rider_dealer_note
      );
      if (idx === -1) {
        filtereds.push(element);
      }
    });
    console.log(filtereds);
    const reverseRider = filtereds.reverse();
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
    <Page title="Pick Up | FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            <div>รวมยอดสินค้าและสถานที่ ที่ต้องไปรับสินค้า</div>
          </Typography>
          {/* <Button
            variant="contained"
            component={RouterLink}
            to="/rider/RiderTakesOrderApp/RiderCreatBarCodeApp"
            startIcon={<Icon icon={plusFill} />}
          >
            สร้าง Barcode
          </Button> */}
        </Stack>
        <Card>
          <PickUpListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selected={selected}
            selected_id={selected_id}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <PickUpListHead
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
                        order_rider_currency,
                        order_rider_dealer_type,
                        order_rider_dealer_name,
                        order_rider_dealer_note
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
                            <TableCell align="left">
                              {order_rider_dealer_type === 'company' ? (
                                <Label color="pink">บริษัท</Label>
                              ) : (
                                <Label color="green">ไรเดอร์</Label>
                              )}
                            </TableCell>
                          </TableCell>
                          <TableCell align="left">{order_rider_dealer_name}</TableCell>
                          <TableCell align="left">{order_rider_dealer_note}</TableCell>
                          <TableCell align="left">
                            <PickUpDetail props={row} OrderRiders={OrderRiders} />
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
