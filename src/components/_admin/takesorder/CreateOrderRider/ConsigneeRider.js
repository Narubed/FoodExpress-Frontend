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
  setTextConsignee,
  SelectConsignee,
  setSelectConsignee,
  Consignee,
  setConsignee
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const Riders = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllRider`);
    setConsignee(Riders.data.data);
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
          label="ค้นหาไรเดอรฺ์"
          value={SelectConsignee}
          // {...getFieldProps('company_name')}
          // onChange={(e) => setSelectCompany(e.target.value)}
          onChange={(e) => onChangeCompany(e)}
        >
          {Consignee.map((value) => (
            <MenuItem key={value.rider_id} value={value}>
              {value.rider_first_name} {value.rider_last_name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Input
        // disabled
        // color="pink"
        size="Regular"
        outline
        placeholder="หมายเหตุ"
        onChange={(e) => setTextConsignee(e.target.value)}
        // defaultValue={SelectDealer === null ? '' : SelectDealer.company_address}
      />
    </Stack>
  );
}
