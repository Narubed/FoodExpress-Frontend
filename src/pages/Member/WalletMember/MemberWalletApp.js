/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { filter } from 'lodash';
import numeral from 'numeral';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import Label from '@material-tailwind/react/Label';
import axios from 'axios';
// material
import {
  Card,
  CardHeader,
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
  TextField
} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { styled } from '@mui/material/styles';
import { WalletListHead, WalletImage } from '../../../components/_admin/wallet';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'level', label: 'ระดับ', alignRight: false },
  { id: 'firstname', label: 'ชื่อ', alignRight: false },
  // { id: 'wallet_slip', label: 'Slip', alignRight: false },
  // { id: 'wallet_total', label: 'สถานะ', alignRight: false },
  { id: 'report_wallet_member_total', label: 'ผลรวม', alignRight: false },
  { id: 'subdistrict', label: 'ตำบล', alignRight: false },
  { id: 'district', label: 'อำเภอ', alignRight: false },
  { id: 'province', label: 'จังหวัด', alignRight: false },
  { id: 'report_wallet_member_status', label: 'สถานะ', alignRight: false },
  { id: 'report_wallet_member_timestamp', label: 'วัน-เดือน-ปี', alignRight: false },
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
        _user.report_wallet_member_status.toLowerCase().indexOf(query.toLowerCase()) !== -1
      // _user.wallet_date.toLowerCase().indexOf(query.toLowerCase()) !== -1
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
  const [WalletMemberlist, setWalletMemberlist] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [selected_id, setSelected_id] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [value, setValue] = React.useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const user = sessionStorage.getItem('user');
    const WalletMember = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getReportWalletJoinMembers`
    );
    const filterMemberId = WalletMember.data.data.filter((f) => f.userId === user);
    const reverseData = filterMemberId.reverse();
    setWalletMemberlist(reverseData);
  }, []);
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
      <Page title="Commission | NBA-FoodExpress">
        <Container>
          <Card>
            <CardHeader
              avatar={<Icon icon="emojione:money-with-wings" width="38" height="38" />}
              color="orange"
              contentPosition="left"
              title="Commission"
            />
            <br />
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
                          id_report_wallet_member_express,
                          level,
                          firstname,
                          report_wallet_member_total,
                          subdistrict,
                          district,
                          province,
                          report_wallet_member_status,
                          report_wallet_member_timestamp,
                          report_wallet_member_slip
                        } = row;
                        const isItemSelected =
                          selected.indexOf(id_report_wallet_member_express) !== -1;

                        return (
                          <TableRow
                            hover
                            key={id_report_wallet_member_express}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox" />
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
                              {numeral(report_wallet_member_total).format('0,0.000')}
                            </TableCell>
                            <TableCell align="left">{subdistrict}</TableCell>
                            <TableCell align="left">{district}</TableCell>
                            <TableCell align="left">{province}</TableCell>
                            <TableCell align="left">
                              {report_wallet_member_status === 'รอรับค่าคอมมิชชั่น' ? (
                                <Label color="pink"> {report_wallet_member_status}</Label>
                              ) : (
                                <Label color="green"> {report_wallet_member_status}</Label>
                              )}
                            </TableCell>
                            <TableCell align="left">
                              <Label color="lightGreen">
                                {report_wallet_member_timestamp
                                  ? dayjs(report_wallet_member_timestamp)
                                      .locale('th')
                                      .format('DD MMMM YYYY')
                                  : null}
                              </Label>{' '}
                            </TableCell>

                            <TableCell align="left">
                              {report_wallet_member_status === 'รอรับค่าคอมมิชชั่น' ? (
                                <StyledBadge
                                  overlap="circular"
                                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                  variant="dot"
                                >
                                  {/* <WalletPutSlip row={row} /> */}
                                </StyledBadge>
                              ) : (
                                <WalletImage images={report_wallet_member_slip} />
                              )}
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
