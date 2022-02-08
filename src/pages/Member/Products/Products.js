/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable import/no-duplicates */
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../../../components/Page';
import {
  ProductSort,
  ProductList,
  ProductCartWidget,
  ProductFilterSidebar
} from '../../../components/_dashboard/products';
import checkStatusOrder from '../../../utils/checkStatusOrder';
//

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const dispatch = useDispatch();
  dispatch({ type: 'OPEN' });
  const [openFilter, setOpenFilter] = useState(false);
  const [openShopCard, setOpenShopCard] = useState(false);

  const [ProductsType, setProductsType] = useState([]);
  const [FilterProductsType, setFilterProductsType] = useState([]);
  const [count, setCount] = useState([]);
  const [Types, setTypes] = useState([]);
  const [number, setNumber] = useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const Products = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getJoinProductType`);
    const filterStatusProduct = Products.data.data.filter(
      (f) => f.productStetus === 'สินค้าพร้อมจำหน่าย'
    );
    setProductsType(filterStatusProduct);
    await checkStatusOrder();
  }, []);
  const onSubmitProduct = () => {
    setFilterProductsType([]);
    setOpenFilter(false);
  };
  const formik = useFormik({
    initialValues: {
      types: '',
      gender: '',
      category: '',
      colors: '',
      priceRange: '',
      rating: ''
    },
    onSubmit: () => onSubmitProduct()
  });

  const { resetForm, handleSubmit } = formik;
  const setTypeProduct = async (e) => {
    const filterTypes = ProductsType.filter((f) => f.nameproducttype === e);
    setProductsType(filterTypes);
  };

  const handleOpenShopCard = () => {
    setOpenShopCard(true);
  };

  const handleCloseShopCard = () => {
    setOpenShopCard(false);
  };
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();

    resetForm();
  };
  const deleteProductShopCard = (e) => {
    const findIndex = count.findIndex((find) => find === e);
    const dataRemoved = count.splice(findIndex, 1);
    setNumberRereder(dataRemoved);
  };
  const setNumberRereder = (e) => {
    setNumber(e);
  };
  const onChangeType = (e) => {
    const filterProductByTypeName = ProductsType.filter((f) => f.nameproducttype === e);
    setFilterProductsType(filterProductByTypeName);
  };
  const sortByPriceHL = () => {
    const valueSort = ProductsType.sort((a, b) => b.productPrice - a.productPrice);
    setFilterProductsType(valueSort);
    setNumber(2);
  };
  const sortByPriceLH = () => {
    const valueSort = ProductsType.sort((a, b) => a.productPrice - b.productPrice);
    setFilterProductsType(valueSort);
    setNumber(3);
  };
  dispatch({ type: 'TURNOFF' });
  return (
    <Page title="สินค้าทั้งหมด | NBA-Express">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          <div>สินค้าทั้งหมด</div>
        </Typography>
        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
              setTypeProduct1Unit={setTypeProduct}
              onChangeType={onChangeType}
            />
            <ProductSort sortByPriceHL={sortByPriceHL} sortByPriceLH={sortByPriceLH} />
          </Stack>
        </Stack>

        <ProductList
          // products={PRODUCTS}
          ProductsType={FilterProductsType.length !== 0 ? FilterProductsType : ProductsType}
          setCount={setCount}
          count={count}
        />
        <ProductCartWidget
          count={count}
          key={count}
          isOpenShopCard={openShopCard}
          onOpenShopCard={handleOpenShopCard}
          onCloseShopCard={handleCloseShopCard}
          deleteProductShopCard={deleteProductShopCard}
          setNumberRereder={setNumberRereder}
        />
      </Container>
    </Page>
  );
}
