/* eslint-disable import/no-duplicates */
import { useFormik } from 'formik';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// material
import { Container, Stack, Typography, Button } from '@mui/material';
// components
import Page from '../components/Page';
import {
  ProductSort,
  ProductList,
  ProductCartWidget,
  ProductFilterSidebar
} from '../components/_dashboard/products';
//
import PRODUCTS from '../_mocks_/products';

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const [openFilter, setOpenFilter] = useState(false);
  const [openShopCard, setOpenShopCard] = useState(false);

  const [ProductsType, setProductsType] = useState([]);
  const [count, setCount] = useState([]);
  const [Types, setTypes] = useState([]);
  const [number, setNumber] = useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const Products = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getJoinProductType`);
    const filterStatusProduct = Products.data.data.filter(
      (f) => f.productStetus === 'สินค้าพร้อมจำหน่าย'
    );
    console.log('useEffect');
    console.log(formik.values);
    setProductsType(filterStatusProduct);
  }, [count, number]);
  const onSubmitProduct = (e) => {
    console.log('เหี้ยไรวะเนี้ยะ');
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
    console.log(e);
    const filterTypes = ProductsType.filter((f) => f.nameproducttype === e);
    // filtereds.push(filterTypes);
    console.log(ProductsType);

    console.log(filterTypes);
    setTypes(e);
    setNumber(3);
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
  return (
    <Page title="Dashboard: Products | NBA-Express">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Products
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
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList
          // products={PRODUCTS}
          ProductsType={ProductsType}
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
