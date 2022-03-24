import React, { useEffect, useState } from 'react';
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Card,
  Table,
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
  MenuItem,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import Input from '@material-tailwind/react/Input';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function DealerCompany({
  SelectConsignee,
  Consignee,
  setConsignee,
  setSelectConsignee
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const Company = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllCompany`);
    setConsignee(Company.data.data);
  }, []);
  const onChangeCompany = (e) => {
    setSelectConsignee(e.target.value);
  };
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { mr: 40, width: '100%' }
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-select-currency"
          select
          label="ค้นหาบริษัท"
          value={SelectConsignee}
          // {...getFieldProps('company_name')}
          // onChange={(e) => setSelectCompany(e.target.value)}
          onChange={(e) => onChangeCompany(e)}
        >
          {Consignee.map((value) => (
            <MenuItem key={value.productid} value={value}>
              {value.company_name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Input
        disabled
        // color="pink"
        size="Regular"
        outline
        placeholder="ที่อยู่บริษัท"
        defaultValue={SelectConsignee === null ? '' : SelectConsignee.company_address}
      />
    </Stack>
  );
}
