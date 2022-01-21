import React from 'react';
import PropTypes from 'prop-types';
// material
import { Grid, Button } from '@mui/material';
import ShopProductCard from './ProductCard';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  ProductsType: PropTypes.array.isRequired,
  count: PropTypes.array.isRequired,

  setCount: PropTypes.func.isRequired
};

export default function ProductList({ products, ProductsType, setCount, count, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {ProductsType.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={3}>
          <ShopProductCard product={product} setCount={setCount} count={count} key={product.id} />
        </Grid>
      ))}
    </Grid>
  );
}
