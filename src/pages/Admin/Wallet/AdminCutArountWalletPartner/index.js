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
import { Link as RouterLink, Link } from 'react-router-dom';
import Label from '@material-tailwind/react/Label';
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
  IconButton,
  Button
} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { styled } from '@mui/material/styles';
import { WalletListHead, WalletListToolbar } from '../../../../components/_admin/wallet';

import ShowSlipWallet from './ShowSlipWallet';
// import WalletCutArount from './WalletPartnerCutArount';
import Page from '../../../../components/Page';
// import Label from '../../../components/Label';
import Scrollbar from '../../../../components/Scrollbar';
import SearchNotFound from '../../../../components/SearchNotFound';
// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'wallet_name_level', label: 'ระดับ', alignRight: false },
  { id: 'partner_name', label: 'ชื่อ', alignRight: false },
  // { id: 'wallet_slip', label: 'Slip', alignRight: false },
  // { id: 'wallet_total', label: 'สถานะ', alignRight: false },
  { id: 'wallet_partner_total', label: 'ผลรวม', alignRight: false },
  { id: 'หัก3%', label: 'หัก3%', alignRight: false },
  { id: 'ยอดสุทธิ', label: 'ยอดสุทธิ', alignRight: false },
  { id: 'partner_address', label: 'ที่อยู่', alignRight: false },
  { id: 'cutarount', label: 'ตัดรอบการจ่ายเงิน', alignRight: false },
  // { id: 'wallet_date', label: 'วัน-เดือน-ปี', alignRight: false },
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
        _user.wallet_name_level.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.partner_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        // _user.wallet_total.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.partner_address.toLowerCase().indexOf(query.toLowerCase()) !== -1
      // _user.order_product_total.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const WalletMember = await axios.get(
      `${process.env.REACT_APP_PARTNER_API}/wallet_partner/wallet_partner_report`
    );
    console.log(WalletMember.data.data);
    const getAllPartner = await axios.get(`${process.env.REACT_APP_API_OFFICE}/partner`);
    const getGEO = await axios.post(`${process.env.REACT_APP_API_GEO}/nba-geo`, {
      tokenKey: '*NBADigital9111*'
    });
    const getZone = await axios.post(`${process.env.REACT_APP_API_GEO}/zone`, {
      tokenKey: '*NBADigital9111*'
    });
    const partnerDetail = [];
    WalletMember.data.data.forEach(async (element) => {
      const idx = getAllPartner.data.data.find((item) => item._id === element.wpr_partner_id);
      if (idx.partner_level === 'ระดับภาค') {
        const GEONBA = getGEO.data.data.find(
          (item) => item.nba_geo_id === parseInt(idx.partner_sublevel, 10)
        );
        partnerDetail.push({
          ...idx,
          wallet_partner_total: element.wpr_partner_total,
          wallet_id: element._id,
          wallet_name_level: GEONBA.nba_geo_name,
          wpr_status: element.wpr_status,
          wpr_slip: element.wpr_slip
        });
      } else {
        const ZoneNBA = getZone.data.data.find(
          (item) => item.nba_zone === parseInt(idx.partner_sublevel, 10)
        );
        partnerDetail.push({
          ...idx,
          wallet_partner_total: element.wpr_partner_total,
          wallet_id: element._id,
          wallet_name_level: ZoneNBA.zone_name,
          wpr_status: element.wpr_status,
          wpr_slip: element.wpr_slip
        });
      }
    });
    console.log(partnerDetail);
    setWalletMemberlist(partnerDetail);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - WalletMemberlist.length) : 0;

  const filteredWallet = applySortFilter(
    WalletMemberlist,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredWallet.length === 0;
  return (
    <>
      <Page title="ค่าคอมมิสชั่นศูนย์(เขต/ภาค) | FoodExpress">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              ค่าคอมมิสชั่นศูนย์(เขต/ภาค)
            </Typography>
          </Stack>

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
                          partner_level,
                          partner_name,
                          wallet_name_level,
                          wallet_partner_total,
                          partner_address,
                          wpr_status,
                          wpr_slip
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
                            <TableCell padding="checkbox" />
                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  {partner_level === 'ระดับเขต' ? (
                                    <Label color="pink">
                                      {' '}
                                      {partner_level} {wallet_name_level}
                                    </Label>
                                  ) : (
                                    <Label color="lightBlue">
                                      {' '}
                                      {partner_level} {wallet_name_level}
                                    </Label>
                                  )}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="left">{partner_name}</TableCell>

                            <TableCell align="left">
                              {numeral(wallet_partner_total).format('0,0.000')}
                            </TableCell>
                            <TableCell align="left">
                              {numeral((wallet_partner_total * 3) / 103).format('0,0.000')}
                            </TableCell>
                            <TableCell align="left">
                              {numeral(
                                wallet_partner_total - (wallet_partner_total * 3) / 103
                              ).format('0,0.000')}
                            </TableCell>
                            <TableCell align="left">{partner_address}</TableCell>
                            <TableCell align="center">
                              <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                              >
                                {wpr_status === 'รอรับค่าคอมมิชชั่น' ? (
                                  <StyledBadge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                  >
                                    <Link
                                      state={row}
                                      to={{
                                        pathname:
                                          '/admin/AdminWalletPartner/AdminCutArountWalletPartner/AdminWalletPutSlip'
                                      }}
                                    >
                                      รอรับค่าคอมมิชชั่น
                                      <br />
                                      <IconButton
                                        sx={{ color: 'purple' }}
                                        // color="primary"
                                        aria-label="upload picture"
                                        component="span"
                                        onClick={() =>
                                          localStorage.setItem('row', JSON.stringify(row))
                                        }
                                      >
                                        <Icon
                                          icon="fluent:image-search-24-regular"
                                          width="32"
                                          height="32"
                                        />
                                      </IconButton>
                                    </Link>
                                    {/* <WalletPutSlip row={row} /> */}
                                  </StyledBadge>
                                ) : (
                                  <ShowSlipWallet images={wpr_slip} />
                                )}
                              </StyledBadge>
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
              count={WalletMemberlist.length}
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
