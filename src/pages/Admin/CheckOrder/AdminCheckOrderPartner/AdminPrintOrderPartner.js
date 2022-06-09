import React, { useEffect, useState, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { DataGrid, GridToolbarContainer, GridToolbarExport, gridClasses } from '@mui/x-data-grid';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDateRangePicker from '@mui/lab/MobileDateRangePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { Stack, TextField, Box, Tooltip, Button } from '@mui/material';
import { element } from 'prop-types';

function CustomToolbar() {
  return (
    <GridToolbarContainer className={gridClasses.toolbarContainer}>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
const columns = [
  { field: '_id', headerName: 'id', width: 240 },
  {
    field: 'odd_timestamp',
    headerName: 'วันที่',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${
        dayjs(params.row.odd_timestamp).locale('th').add(543, 'year').format('D MMMM YYYY') || ''
      } `
  },
  {
    field: 'order_partner_status',
    headerName: 'สถานะออเดอร์',
    width: 150,
    editable: true
  },
  {
    field: 'odd_product_name',
    headerName: 'ชื่อสินค้า',
    width: 150,
    editable: true
  },
  {
    field: 'จำนวนสินค้า',
    headerName: 'จำนวนสินค้า',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${params.row.odd_product_amount || ''} ${params.row.odd_product_currency || ''}`
  },
  {
    field: 'ต้นทุนรวม',
    headerName: 'ต้นทุนรวม',
    width: 150,
    editable: true,
    valueGetter: (params) => `${params.row.odd_product_amount * params.row.odd_product_cost || ''}`
  },
  {
    field: 'ราคาขายในระบบ',
    headerName: 'ราคาขายในระบบ',
    width: 150,
    editable: true,
    valueGetter: (params) => `${params.row.odd_product_amount * params.row.odd_product_price || ''}`
  },
  {
    field: 'ราคาถอด VAT',
    headerName: 'ราคาถอด VAT',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${
        ((params.row.odd_product_amount * params.row.odd_product_price * 100) / 107).toFixed(3) ||
        ''
      }`
  },
  {
    field: 'VAT 7%',
    headerName: 'VAT 7%',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${
        ((params.row.odd_product_amount * params.row.odd_product_price * 7) / 107).toFixed(3) || ''
      }`
  },
  {
    field: 'กำไรทั้งหมด(PF-VAT)',
    headerName: 'กำไรทั้งหมด(PF-VAT)',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${(params.row.odd_percent_nba + params.row.odd_percent_service).toFixed(3) || ''}`
  },
  {
    field: 'กำไรบริษัท(PF-HO)',
    headerName: 'กำไรบริษัท(PF-HO)',
    width: 150,
    editable: true,
    valueGetter: (params) => `${params.row.odd_percent_nba.toFixed(3) || ''}`
  },
  {
    field: 'ปันผลศูนย์',
    headerName: 'ปันผลศูนย์',
    width: 150,
    editable: true,
    valueGetter: (params) => `${params.row.odd_percent_service.toFixed(3) || ''}`
  },
  {
    field: 'หัก 3 %',
    headerName: 'หัก 3 %',
    width: 150,
    editable: true,
    valueGetter: (params) => `${((params.row.odd_percent_service * 3) / 103).toFixed(3) || ''}`
  },
  {
    field: 'กำไรสุทธิ(เขต/ภาค)',
    headerName: 'กำไรสุทธิ(เขต/ภาค)',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${
        (params.row.odd_percent_service - (params.row.odd_percent_service * 3) / 103).toFixed(3) ||
        ''
      }`
  }
];

export default function DataGridDemo() {
  const [rowsOrder, setRowsOrder] = useState([]);
  const [valueDate, setValueDate] = useState([null, null]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getOrderDetail = await axios.get(`${process.env.REACT_APP_PARTNER_API}/order_detail`);
    const getOrder = await axios.get(`${process.env.REACT_APP_PARTNER_API}/order`);
    const getAllPartner = await axios.get(`${process.env.REACT_APP_API_OFFICE}/partner`);
    const getGEO = await axios.post(`${process.env.REACT_APP_API_GEO}/nba-geo`, {
      tokenKey: '*NBADigital9111*'
    });
    const getZone = await axios.post(`${process.env.REACT_APP_API_GEO}/zone`, {
      tokenKey: '*NBADigital9111*'
    });
    const newDataOrder = [];
    getOrderDetail.data.data.forEach((element) => {
      const idx = getOrder.data.data.find((item) => item._id === element.odd_order_id);
      newDataOrder.push({ ...element, order_partner_status: idx.order_partner_status });
    });
    const filterPartnerGEO = [];
    getAllPartner.data.data.forEach((element) => {
      if (element.partner_level === 'ระดับภาค') {
        const valueFind = getGEO.data.data.find(
          (item) => item.nba_geo_id === parseInt(element.partner_sublevel, 10)
        );
        filterPartnerGEO.push({ ...element, partner_sublevel_name: valueFind.nba_geo_name });
      } else if (element.partner_level === 'ระดับเขต') {
        const valueFind = getZone.data.data.find(
          (item) => item.nba_zone === parseInt(element.partner_sublevel, 10)
        );
        filterPartnerGEO.push({ ...element, partner_sublevel_name: valueFind.zone_name });
      }
    });
    const newDataPartner = [];
    newDataOrder.forEach((element) => {
      const idx = filterPartnerGEO.find((item) => item._id === element.odd_partner_id);
      newDataPartner.push({
        ...element,
        partner_name: idx.partner_name,
        partner_level: idx.partner_level,
        partner_sublevel_name: idx.partner_sublevel_name,
        partner_bank: idx.partner_bank,
        partner_bank_number: idx.partner_bank_number,
        partner_tel: idx.partner_tel
      });
    });
    const filterStatus = newDataPartner.filter(
      (item) =>
        item.order_partner_status !== 'รอตรวจสอบ' && item.order_partner_status !== 'รอชำระเงิน'
    );
    setRowsOrder(filterStatus);
  }, []);

  const newRowOrders =
    valueDate[0] !== null && valueDate[1] !== null
      ? rowsOrder.filter(
          (f) =>
            dayjs(f.odd_timestamp).format() >= dayjs(valueDate[0]).format() &&
            dayjs(f.odd_timestamp).format() <= dayjs(valueDate[1]).format()
        )
      : rowsOrder;

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack spacing={3}>
          <MobileDateRangePicker
            startText="start"
            value={valueDate}
            onChange={(newValue) => {
              setValueDate(newValue);
            }}
            renderInput={(startProps, endProps) => (
              <>
                <TextField size="small" {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField size="small" {...endProps} />
              </>
            )}
          />
        </Stack>
      </LocalizationProvider>

      <div style={{ height: '100%', width: '100%' }}>
        <DataGrid
          // sx={{ bgcolor: 'red' }}
          getRowId={(rowsOrder) => rowsOrder._id}
          rows={newRowOrders}
          columns={columns}
          pageSize={50}
          rowsPerPageOptions={[50]}
          checkboxSelection
          disableSelectionOnClick
          components={{
            Toolbar: CustomToolbar
          }}
        />
      </div>
    </>
  );
}
