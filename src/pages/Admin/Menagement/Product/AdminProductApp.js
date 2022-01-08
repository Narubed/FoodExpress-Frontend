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
  ProductListHead,
  ProductListToolbar,
  ProductMoreMenu,
  ProductImage
} from '../../../../components/_admin/product';
import Page from '../../../../components/Page';
import Label from '../../../../components/Label';
import Scrollbar from '../../../../components/Scrollbar';
import SearchNotFound from '../../../../components/SearchNotFound';
// utils
import { fNumber } from '../../../../utils/formatNumber';
import AddProductType from './AddProductType';
import AdminProductTypeApp from './AdminProductTypeApp';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'productName', label: 'ชื่อสินค้า', alignRight: false },
  { id: 'productPrice', label: 'ราคาสินค้า', alignRight: false },
  { id: 'productCost', label: 'ราคาต้นทุนสินค้า', alignRight: false },
  { id: 'productStetus', label: 'สถานะสินค้า', alignRight: false },
  { id: 'nameproducttype', label: 'ประเภทสินค้า', alignRight: false },
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
        _user.productName.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.productStetus.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.nameproducttype.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

function AdminCompanyApp() {
  // eslint-disable-next-line no-undef
  const [Productlist, setProductlist] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  // eslint-disable-next-line camelcase
  const [selected_id, setSelected_id] = useState([]);
  const [selected_productImg, setSelected_productImg] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getProduct = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getJoinProductType`);
    setProductlist(getProduct.data.data);
  }, []);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = Productlist.map((n) => n.productName);
      const newSelectedsid = Productlist.map((n) => n.productid);
      setSelected(newSelecteds);
      setSelected_id(newSelectedsid);
      return;
    }
    setSelected([]);
    setSelected_id([]);
  };

  const handleClick = (event, name, id, productImg) => {
    const selectedIndex = selected.indexOf(name);
    const selectedIndexid = selected_id.indexOf(id);
    const selectedproductImg = selected_productImg.indexOf(productImg);
    let newSelected = [];
    let newSelectedid = [];
    let newselectedproductImg = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
      newSelectedid = newSelectedid.concat(selected_id, id);
      newselectedproductImg = newselectedproductImg.concat(selected_productImg, productImg);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelectedid = newSelectedid.concat(selected_id.slice(1));
      newselectedproductImg = newselectedproductImg.concat(selected_productImg.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newSelectedid = newSelectedid.concat(selected_id.slice(0, -1));
      newselectedproductImg = newselectedproductImg.concat(selected_productImg.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
      newSelectedid = newSelectedid.concat(
        selected_id.slice(0, selectedIndexid),
        selected_id.slice(selectedIndexid + 1)
      );
      newselectedproductImg = newselectedproductImg.concat(
        selected_productImg.slice(0, selectedproductImg),
        selected_productImg.slice(selectedproductImg + 1)
      );
    }
    setSelected(newSelected);
    setSelected_id(newSelectedid);
    setSelected_productImg(newselectedproductImg);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - Productlist.length) : 0;

  // eslint-disable-next-line no-undef
  const filteredProduct = applySortFilter(Productlist, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredProduct.length === 0;
  return (
    <>
      <Page title="Product | FoodExpress">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Product
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/admin/AdminProductApp/AdminCreateProductApp"
              startIcon={<Icon icon={plusFill} />}
            >
              New Product
            </Button>
          </Stack>
          <AddProductType />
          <AdminProductTypeApp />
          <Card>
            <ProductListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
              selected={selected}
              // eslint-disable-next-line camelcase
              selected_id={selected_id}
              selected_productImg={selected_productImg}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <ProductListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={Productlist.length}
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
                          productid,
                          productName,
                          productPrice,
                          productCost,
                          productImg,
                          productStetus,
                          unitkg,
                          currency,
                          nameproducttype
                        } = row;
                        const isItemSelected = selected.indexOf(productName) !== -1;

                        return (
                          <TableRow
                            hover
                            key={productid}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) =>
                                  handleClick(event, productName, productid, productImg)
                                }
                              />
                            </TableCell>

                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                {productStetus === 'สินค้าพร้อมจำหน่าย' ? (
                                  <StyledBadge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                  >
                                    <ProductImage images={productImg} Name={productName} />
                                  </StyledBadge>
                                ) : (
                                  <ProductImage images={productImg} Name={productName} />
                                )}
                                <Typography variant="subtitle2" noWrap>
                                  {productName}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">{numeral(productPrice).format()}</TableCell>
                            <TableCell align="left">{numeral(productCost).format()}</TableCell>
                            <TableCell align="left">{productStetus}</TableCell>
                            <TableCell align="left">{nameproducttype}</TableCell>

                            <TableCell align="right">
                              <ProductMoreMenu
                                productid={productid}
                                productName={productName}
                                productPrice={productPrice}
                                productCost={productCost}
                                productImg={productImg}
                                productStetus={productStetus}
                                unitkg={unitkg}
                                currency={currency}
                                nameproducttype={nameproducttype}
                                id={id}
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
              count={Productlist.length}
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
