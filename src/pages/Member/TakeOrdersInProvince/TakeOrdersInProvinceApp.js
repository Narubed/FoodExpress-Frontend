/* eslint-disable camelcase */
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
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
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Button,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import {
  TakesOrderInProvinceListHead,
  TakesOrderInProvinceListToolbar,
  TakesOrderInProvinceInputBarCode
} from '../../../components/_dashboard/takesorderinprovince';
//

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'member_delivery_level', label: 'ระดับที่ส่งของให้', alignRight: false },
  { id: 'member_delivery_status', label: 'สถานะ', alignRight: false },
  { id: 'firstname', label: 'ชื่อคนส่งสินค้า', alignRight: false },
  { id: 'tel', label: 'เบอร์ผู้ส่ง', alignRight: false },
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

export default function TakeOrdersInProvinceApp() {
  const [DeliveryList, setDeliverList] = useState([]);
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

    const getDeliveryDetail = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getJoinDeliveryProviceAndMemberDelivery`
    );
    const filterUserID = getDeliveryDetail.data.data.filter(
      (f) => parseInt(f.receiver_delivery_member_id, 10) === parseInt(user, 10)
    );
    const filterStatus = filterUserID.filter((f) => f.member_delivery_status === 'ตัดรอบแล้ว');
    setDeliverList(filterStatus);
  }, []);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = DeliveryList.map((n) => n.rider_first_name);
      const newSelectedsid = DeliveryList.map((n) => n.rider_id);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - DeliveryList.length) : 0;
  const filteredUsers = applySortFilter(DeliveryList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="ออเดอร์ที่ต้องได้รับภายในจังหวัด | FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            <div>ออเดอร์ที่ต้องได้รับภายในจังหวัด</div>
          </Typography>
          <TakesOrderInProvinceInputBarCode DeliveryList={DeliveryList} />
        </Stack>
        <Card>
          <TakesOrderInProvinceListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selected={selected}
            selected_id={selected_id}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TakesOrderInProvinceListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={DeliveryList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        member_delivery_id,
                        member_delivery_level,
                        member_delivery_status,
                        firstname,
                        tel
                      } = row;
                      const isItemSelected = selected.indexOf(member_delivery_id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={member_delivery_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            {/* <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, rider_first_name, rider_id)}
                            /> */}
                          </TableCell>
                          <TableCell align="left">
                            {member_delivery_level === 'province' ? (
                              <Label color="pink"> ระดับจังหวัด</Label>
                            ) : null}
                            {member_delivery_level === 'district' ? (
                              <Label color="lightBlue"> ระดับอำเภอ</Label>
                            ) : null}
                            {member_delivery_level === 'subdistrict' ? (
                              <Label color="amber"> ระดับตำบล</Label>
                            ) : null}
                            {/* <Label color="blueGray"> {level}</Label> */}
                          </TableCell>
                          <TableCell align="left">
                            {member_delivery_status === 'ไรเดอร์รับมอบหมายงานแล้ว' ? (
                              <Label color="pink">{member_delivery_status}</Label>
                            ) : (
                              <Label color="green">{member_delivery_status}</Label>
                            )}
                          </TableCell>
                          <TableCell align="left">{firstname}</TableCell>
                          <TableCell align="left">{tel}</TableCell>
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
