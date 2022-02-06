/* eslint-disable react/button-has-type */
/* eslint-disable camelcase */
import { useEffect, useState } from 'react';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import Image from '@material-tailwind/react/Image';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Label from '@material-tailwind/react/Label';
import numeral from 'numeral';
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
import { styled } from '@mui/material/styles';
import {
  UnderMemberListHead,
  UnderMemberListToolbar
} from '../../../components/_dashboard/undermember';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
// utils
import { fNumber } from '../../../utils/formatNumber';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'level', label: 'ระดับ', alignRight: false },
  { id: 'firstname', label: 'ชื่อ', alignRight: false },
  { id: 'userId', label: 'เลขบัตร', alignRight: false },
  { id: 'address', label: 'ที่อยู่', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'tel', label: 'tel', alignRight: false },
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
        _user.userId.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.firstname.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.lastname.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.subdistrict.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.district.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.province.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.status.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.tel.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.booknumber.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

function AdminMemberApp() {
  // eslint-disable-next-line no-undef
  const [Memberlist, setMemberlist] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  // eslint-disable-next-line camelcase
  const [selected_id, setSelected_id] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const level = sessionStorage.getItem('level');
    const user = sessionStorage.getItem('user');
    const results = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/members`);
    const getUser_id = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/member/${user}`);
    const filterMember = results.data.data.filter((e) => e.role === 'Member');
    if (level === 'province') {
      const filterUser = filterMember.filter((e) => e.province === getUser_id.data.data.province);
      setMemberlist(filterUser);
    }
    if (level === 'district') {
      const filterUser = filterMember.filter((e) => e.district === getUser_id.data.data.district);
      const filterUser3 = filterMember.filter(
        (e) => e.province === getUser_id.data.data.province && e.level === 'province'
      );
      const findUser = filterUser.find((e) => e === filterUser3[0]);
      if (!findUser) {
        filterUser.push(filterUser3[0]);
      }
      setMemberlist(filterUser);
    }
    if (level === 'subdistrict') {
      const filterUser = filterMember.filter(
        (e) => e.subdistrict === getUser_id.data.data.subdistrict
      );
      const filterUser2 = filterMember.filter(
        (e) => e.district === getUser_id.data.data.district && e.level === 'district'
      );
      const filterUser3 = filterMember.filter(
        (e) => e.province === getUser_id.data.data.province && e.level === 'province'
      );
      const findUser = filterUser.find((e) => e === filterUser2[0]);
      const findUser2 = filterUser.find((e) => e === filterUser3[0]);
      if (findUser) {
        filterUser.push(filterUser2[0]);
      }
      if (findUser2) {
        filterUser.push(filterUser3[0]);
      }
      setMemberlist(filterUser);
    }
  }, []);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = Memberlist.map((n) => n.userId);
      const newSelectedsid = Memberlist.map((n) => n.id);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - Memberlist.length) : 0;

  // eslint-disable-next-line no-undef
  const filteredProduct = applySortFilter(Memberlist, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredProduct.length === 0;
  return (
    <>
      <Page title="underMember | FoodExpress">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              <div>ผู้ใช้งานใต้สังกัต</div>
            </Typography>
          </Stack>
          <Card>
            <UnderMemberListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              selected={selected}
              // eslint-disable-next-line camelcase
              selected_id={selected_id}
              Memberlist={Memberlist}
              // selected_productImg={selected_productImg}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UnderMemberListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={Memberlist.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredProduct
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const {
                          id,
                          password,
                          email,
                          firstname,
                          lastname,
                          bookname,
                          booknumber,
                          role,
                          tel,
                          address,
                          subdistrict,
                          district,
                          province,
                          map,
                          userId,
                          status,
                          bookBankImg,
                          cardImg,
                          level
                        } = row;
                        const isItemSelected = selected.indexOf(userId) !== -1;

                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              {/* <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, userId, id)}
                              /> */}
                            </TableCell>
                            <TableCell align="left">
                              {role === 'Member' ? (
                                <Label color="">
                                  <div className="text-xs">
                                    {level === 'subdistrict' ? (
                                      <Label color="lightBlue">
                                        <div className="text-xs">ตำบล</div>
                                      </Label>
                                    ) : null}
                                    {level === 'district' ? (
                                      <Label color="green">
                                        <div className="text-xs">อำเภอ</div>
                                      </Label>
                                    ) : null}
                                    {level === 'province' ? (
                                      <Label color="pink">
                                        <div className="text-xs">จังหวัด</div>
                                      </Label>
                                    ) : null}
                                  </div>
                                </Label>
                              ) : (
                                <Label color="">
                                  <Label color="blueGray">
                                    <div className="text-xs">admin</div>
                                  </Label>
                                </Label>
                              )}

                              {/* <Label color="lightBlue"> {level}</Label> */}
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
                                    src="https://imchun.files.wordpress.com/2017/09/user-male.png"
                                    alt=""
                                  />
                                </StyledBadge>
                                <Typography variant="subtitle2" noWrap>
                                  <div className="text-orange-200">{firstname}</div>
                                  <div className=" font-light text-xs">{email}</div>
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="left">{userId}</TableCell>

                            <TableCell align="left">{address}</TableCell>
                            <TableCell align="left">
                              {status === 'Active' ? (
                                <Label color="green">
                                  <div className="text-xs">{status}</div>
                                </Label>
                              ) : (
                                <Label color="red">
                                  <div className="text-xs">{status}</div>
                                </Label>
                              )}
                            </TableCell>
                            <TableCell align="left">{tel}</TableCell>

                            <TableCell align="right">
                              <Button target="_blank" href={map}>
                                <Icon icon="emojione:world-map" width="32" height="32" />
                              </Button>
                            </TableCell>
                            <TableCell align="left">
                              {' '}
                              {/* <MemberMoreMenu bookBankImg={bookBankImg} cardImg={cardImg} id={id} /> */}
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
              count={Memberlist.length}
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
export default AdminMemberApp;
