/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { filter } from 'lodash';
import numeral from 'numeral';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import Label from '@material-tailwind/react/Label';
import Button from '@material-tailwind/react/Button';
import { Tag } from 'antd';
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
import DatePicker from '@mui/lab/DatePicker';
import { styled } from '@mui/material/styles';
import {
  WalletListHead,
  WalletListToolbar,
  WalletImage,
  WalletPutSlip
} from '../../../components/_admin/wallet';
import Page from '../../../components/Page';
// import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'level', label: 'ระดับ', alignRight: false },
  { id: 'firstname', label: 'ชื่อ', alignRight: false },
  { id: 'wallet_slip', label: 'Slip', alignRight: false },
  { id: 'wallet_total', label: 'สถานะ', alignRight: false },
  { id: 'wallet_status', label: 'ผลรวม', alignRight: false },
  { id: 'subdistrict', label: 'ตำบล', alignRight: false },
  { id: 'district', label: 'อำเภอ', alignRight: false },
  { id: 'province', label: 'จังหวัด', alignRight: false },
  { id: 'wallet_date', label: 'วัน-เดือน-ปี', alignRight: false },
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
        _user.level.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.firstname.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        // _user.wallet_total.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.subdistrict.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.district.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.province.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        // _user.order_product_total.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.wallet_date.toLowerCase().indexOf(query.toLowerCase()) !== -1
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

function AdminWalletApp() {
  const dispatch = useDispatch();
  dispatch({ type: 'OPEN' });
  // eslint-disable-next-line no-undef
  const [WalletMemberlist, setWalletMemberlist] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  // eslint-disable-next-line camelcase
  const [selected_id, setSelected_id] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [value, setValue] = React.useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const WalletMember = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getJoinWalletMember`
    );
    const reverseData = WalletMember.data.data.reverse();
    setWalletMemberlist(reverseData);
  }, []);
  dispatch({ type: 'TURNOFF' });
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = WalletMemberlist.map((n) => n.wallet_id);
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  dispatch({ type: 'OPEN' });
  const newWalletMemberlist =
    value === null
      ? WalletMemberlist
      : WalletMemberlist.filter((f) => dayjs(f.wallet_date).month() === dayjs(value).month());
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - newWalletMemberlist.length) : 0;

  const filteredWallet = applySortFilter(
    newWalletMemberlist,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredWallet.length === 0;
  dispatch({ type: 'TURNOFF' });
  return (
    <>
      <Page title="Commission | FoodExpress">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Commission
            </Typography>
          </Stack>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DatePicker
                views={['year', 'month']}
                label="ค้นหาตาม เดือน-ปี"
                minDate={new Date('2019-01-01')}
                maxDate={new Date()}
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} helperText={null} />}
              />
            </Stack>
          </LocalizationProvider>
          <Card>
            <WalletListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              selected={selected}
              // eslint-disable-next-line camelcase
              selected_id={selected_id}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <WalletListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={WalletMemberlist.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredWallet
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const {
                          wallet_id,
                          level,
                          firstname,
                          wallet_slip,
                          wallet_total,
                          wallet_status,
                          subdistrict,
                          district,
                          province,
                          wallet_date
                        } = row;
                        const isItemSelected = selected.indexOf(wallet_id) !== -1;

                        return (
                          <TableRow
                            hover
                            key={wallet_id}
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
                              </Stack>
                            </TableCell>
                            <TableCell align="left">{firstname}</TableCell>
                            <TableCell align="left">
                              {wallet_slip !== '' ? (
                                <StyledBadge
                                  overlap="circular"
                                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                  variant="dot"
                                >
                                  {/* {wallet_slip} */}
                                  <WalletImage images={wallet_slip} Name={wallet_id} />
                                </StyledBadge>
                              ) : (
                                <WalletPutSlip wallet_id={wallet_id} />
                              )}
                            </TableCell>

                            <TableCell align="left">
                              {wallet_status === 'ยังไม่ได้รับเงิน' ? (
                                <Label color="pink"> {wallet_status}</Label>
                              ) : null}
                              {wallet_status === 'ได้รับเงินแล้ว' ? (
                                <Label color="lightBlue"> {wallet_status}</Label>
                              ) : null}
                            </TableCell>
                            <TableCell align="left">{numeral(wallet_total).format()}</TableCell>
                            <TableCell align="left">{subdistrict}</TableCell>
                            <TableCell align="left">{district}</TableCell>
                            <TableCell align="left">{province}</TableCell>
                            <TableCell align="left">
                              <Label color="lightGreen">
                                {wallet_date
                                  ? dayjs(wallet_date).locale('th').format('MMMM YYYY')
                                  : null}
                              </Label>{' '}
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
              count={newWalletMemberlist.length}
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
export default AdminWalletApp;
