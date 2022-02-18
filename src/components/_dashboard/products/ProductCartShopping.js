/* eslint-disable no-undef */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import React, { useState, useEffect, useMemo } from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
// material
import { TextField, Button } from '@mui/material';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

ProductCartShopping.propTypes = {
  product: PropTypes.array.isRequired
};

export default function ProductCartShopping({ product, deleteProductShopCard, setNumberRereder }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    setNumberRereder(5);
  }, []);
  const onChangAmount = (e) => {
    product.amount = e.target.value;
    product.value = product.productPrice * e.target.value;
    setNumberRereder(e.target.value);
  };

  return (
    <tr key={product.productId}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full"
              src={`${process.env.REACT_APP_DRIVE_SELECT_IMAGE}${product.productImg}`}
              alt=""
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{product.productName}</div>
            <div className="text-sm text-gray-500">{product.nameproducttype}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{numeral(product.productPrice).format()}</div>
        {/* <div className="text-sm text-gray-500"></div> */}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
          <TextField
            size="string"
            type="number"
            id="outlined-basic"
            label={product.currency}
            variant="outlined"
            value={product.amount}
            onChange={(e) => onChangAmount(e)}
          />
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {numeral(product.amount * product.productPrice).format()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Button onClick={() => deleteProductShopCard(product)} ripple="dark">
          <Icon icon="ic:outline-delete-forever" color="red" width="34" height="34" />
        </Button>
      </td>
    </tr>
  );
}
