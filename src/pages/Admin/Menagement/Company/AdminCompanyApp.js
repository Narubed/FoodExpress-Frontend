/* eslint-disable camelcase */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
// material
import {
  Card,
  Table,
  Stack,
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
import {
  CompanyListHead,
  CompanyListToolbar,
  CompanyMoreMenu
} from '../../../../components/_admin/company';

import Page from '../../../../components/Page';
import Scrollbar from '../../../../components/Scrollbar';
import SearchNotFound from '../../../../components/SearchNotFound';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'company_name', label: 'ชื่อ', alignRight: false },
  { id: 'company_tel', label: 'เบอร์โทรศัพท์', alignRight: false },
  { id: 'book_name', label: 'ชื่อบัญชีธนาคาร', alignRight: false },
  { id: 'book_number', label: 'เลขบัญชีธนาคาร', alignRight: false },
  { id: 'company_address', label: 'ที่อยู่บริษัท', alignRight: false },
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
        _user.company_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.company_tel.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.book_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.book_number.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.company_address.toLowerCase().indexOf(query.toLowerCase()) !== -1
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

function AdminCompanyApp() {
  const dispatch = useDispatch();

  // eslint-disable-next-line no-undef
  const [Companylist, setCompanylist] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  // eslint-disable-next-line camelcase
  const [selected_id, setSelected_id] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  dispatch({ type: 'OPEN' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getCompany = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllCompany`);
    setCompanylist(getCompany.data.data);
  }, []);
  dispatch({ type: 'TURNOFF' });
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = Companylist.map((n) => n.company_name);
      const newSelectedsid = Companylist.map((n) => n.company_id);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - Companylist.length) : 0;

  // eslint-disable-next-line no-undef
  const filteredCompany = applySortFilter(Companylist, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredCompany.length === 0;
  return (
    <>
      <Page title="บริษัท | FoodExpress">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              บริษัทที่อยู่ในระบบ
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/admin/AdminCompanyApp/AdminCreateCompanyApp"
              startIcon={<Icon icon={plusFill} />}
            >
              เพิ่มบริษัทใหม่
            </Button>
          </Stack>
          <Card>
            <CompanyListToolbar
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
                  <CompanyListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={Companylist.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredCompany
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const {
                          company_id,
                          company_name,
                          company_tel,
                          book_name,
                          book_number,
                          company_address,
                          company_login_id,
                          company_login_pw,
                          company_taxpayer_number,
                          company_line_id
                        } = row;
                        const isItemSelected = selected.indexOf(company_name) !== -1;

                        return (
                          <TableRow
                            hover
                            key={company_id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, company_name, company_id)}
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
                                      'https://www.kindpng.com/picc/m/585-5854562_size-of-company-icon-hd-png-download.png'
                                    }
                                    alt=""
                                  />
                                </StyledBadge>
                                <Typography variant="subtitle2" noWrap>
                                  {company_name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="left">{company_tel}</TableCell>
                            <TableCell align="left">{book_name}</TableCell>
                            <TableCell align="left">{book_number}</TableCell>
                            <TableCell align="left">{company_address}</TableCell>

                            <TableCell align="right">
                              <CompanyMoreMenu
                                id={company_id}
                                company_name={company_name}
                                company_tel={company_tel}
                                book_name={book_name}
                                book_number={book_number}
                                company_address={company_address}
                                company_login_id={company_login_id}
                                company_login_pw={company_login_pw}
                                company_taxpayer_number={company_taxpayer_number}
                                company_line_id={company_line_id}
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
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={Companylist.length}
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
export default AdminCompanyApp;
