/* eslint-disable camelcase */
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Badge
} from '@mui/material';
import Image from '@material-tailwind/react/Image';
import { styled } from '@mui/material/styles';
// components
import Page from '../../../../components/Page';
import Scrollbar from '../../../../components/Scrollbar';
import SearchNotFound from '../../../../components/SearchNotFound';
import {
  RiderListHead,
  RiderListToolbar,
  RiderMoreMenu
} from '../../../../components/_admin/rider';
//
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'rider_first_name', label: 'ชื่อ', alignRight: false },
  { id: 'rider_last_name', label: 'นามสกุล', alignRight: false },
  { id: 'rider_id_login', label: 'Login ID', alignRight: false },
  { id: 'rider_pw_login', label: 'Login Password', alignRight: false },
  { id: 'rider_tel', label: 'เบอร์โทรศัพท์', alignRight: false },
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

export default function User() {
  const dispatch = useDispatch();
  const [Riderlist, setRiderlist] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [selected_id, setSelected_id] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  dispatch({ type: 'OPEN' });
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

  const handleClick = (event, name, id) => {
    const selectedIndex = selected.indexOf(name);
    const selectedIndexid = selected_id.indexOf(id);
    let newSelected = [];
    let newSelectedid = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
      newSelectedid = newSelectedid.concat(selected_id, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelectedid = newSelectedid.concat(selected_id.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newSelectedid = newSelectedid.concat(selected_id.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
      newSelectedid = newSelectedid.concat(
        selected_id.slice(0, selectedIndexid),
        selected_id.slice(selectedIndexid + 1)
      );
    }
    setSelected(newSelected);
    setSelected_id(newSelectedid);
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
  return (
    <Page title="ไรเดอร์ทั้งหมด | FoodExpress">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            ไรเดอร์ทั้งหมด
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/admin/AdminRiderApp/AdminCreateRiderApp"
            startIcon={<Icon icon={plusFill} />}
          >
            New Rider
          </Button>
        </Stack>

        <Card>
          <RiderListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selected={selected}
            selected_id={selected_id}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <RiderListHead
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
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, rider_first_name, rider_id)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                              >
                                <Image
                                  className="h-10 w-10 rounded-full"
                                  // eslint-disable-next-line react/jsx-curly-brace-presence
                                  src={
                                    'https://production-rabbit-care-blog.imgix.net/2022/01/choose-motorcycle-for-the-rider-03.jpg?auto=compress%2Cformat&crop=faces%2Ccenter&fit=scale&h=768&q=30&w=1024'
                                  }
                                  alt=""
                                />
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

                          <TableCell align="right">
                            <RiderMoreMenu
                              id={rider_id}
                              rider_first_name={rider_first_name}
                              rider_last_name={rider_last_name}
                              rider_id_login={rider_id_login}
                              rider_pw_login={rider_pw_login}
                              rider_tel={rider_tel}
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
            count={Riderlist.length}
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
