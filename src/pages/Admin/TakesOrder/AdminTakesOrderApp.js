/* eslint-disable camelcase */
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
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
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { TakesOrderListHead, TakesOrderListToolbar } from '../../../components/_admin/takesorder';
//

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'rider_first_name', label: 'ชื่อ', alignRight: false },
  { id: 'rider_last_name', label: 'นามสกุล', alignRight: false },
  { id: 'rider_id_login', label: 'Login ID', alignRight: false },
  { id: 'rider_pw_login', label: 'Login Password', alignRight: false },
  { id: 'rider_tel', label: 'เบอร์โทรศัพท์', alignRight: false },
  { id: '', label: 'เพิ่มงาน', alignRight: false },
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
      (_user) => _user.rider_first_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
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

export default function AdminTakesOrderApp() {
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
    const getRider = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllRider`);
    setRiderlist(getRider.data.data);
  }, []);
  dispatch({ type: 'TURNOFF' });
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
  dispatch({ type: 'OPEN' });
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - Riderlist.length) : 0;

  const filteredUsers = applySortFilter(Riderlist, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;
  dispatch({ type: 'TURNOFF' });
  const setlocalstore = (row) => {
    localStorage.setItem('rider_id', row.rider_id);
    localStorage.setItem('rider_first_name', row.rider_first_name);
    localStorage.setItem('rider_last_name', row.rider_last_name);
  };
  return (
    <Page title="TakesOrder | FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            รายชื่อไรเดอร์
          </Typography>
          <Button
            color="error"
            variant="outlined"
            component={RouterLink}
            to="/admin/AdminTakesOrderApp/CheckRemainingOrders"
            startIcon={<Icon icon="fluent:delete-arrow-back-16-regular" width="22" height="22" />}
          >
            เช็คออเดอร์ตกค้าง
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
                        rider_id,
                        rider_id_login,
                        rider_pw_login,
                        rider_tel,
                        rider_first_name,
                        rider_last_name
                      } = row;
                      const isItemSelected = selected.indexOf(rider_first_name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={rider_id}
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
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                              >
                                <Icon icon="emojione:delivery-truck" width={36} height={36} />
                                {/* <Avatar {...stringAvatar(`${rider_id_login} ${rider_pw_login}`)} /> */}
                              </StyledBadge>
                              <Typography variant="subtitle2" noWrap>
                                {rider_first_name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{rider_last_name}</TableCell>
                          <TableCell align="left">{rider_id_login}</TableCell>
                          <TableCell align="left">{rider_pw_login}</TableCell>
                          <TableCell align="left">{rider_tel}</TableCell>

                          <TableCell align="">
                            <Button
                              onClick={() => setlocalstore(row)}
                              ripple="dark"
                              component={RouterLink}
                              to="/admin/AdminTakesOrderApp/AdminTakesOrderDetail"
                            >
                              <Icon icon="flat-color-icons:data-recovery" width={38} height={38} />
                            </Button>
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
