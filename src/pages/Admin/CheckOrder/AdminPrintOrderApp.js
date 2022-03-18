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
  TableHead,
  TablePagination,
  Badge,
  TextField,
  Box,
  Tooltip,
  Button
} from '@mui/material';
import ButtonT from '@material-tailwind/react/Button';

function CustomToolbar() {
  return (
    <GridToolbarContainer className={gridClasses.toolbarContainer}>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
const columns = [
  { field: 'id_percent_order_detail', headerName: 'id', width: 50 },
  {
    field: 'percent_order_detail_timestamp',
    headerName: 'Date',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${
        dayjs(params.row.percent_order_detail_timestamp).locale('th').format('DD MMMM YYYY') || ''
      } `
  },
  {
    field: 'order_product_level',
    headerName: 'ระดับ',
    width: 150,
    valueGetter: (params) =>
      `${params.row.order_product_level === 'subdistrict' ? 'ระดับตำบล' : ''}
      ${params.row.order_product_level === 'district' ? 'ระดับอำเภอ' : ''}${
        params.row.order_product_level === 'province' ? 'ระดับจังหวัด' : ''
      }`,
    editable: false
  },
  {
    field: 'order_status',
    headerName: 'สถานะออเดอร์',
    width: 150,
    editable: true
  },
  {
    field: 'order_product_name',
    headerName: 'ชื่อสินค้า',
    width: 150,
    editable: true
  },
  {
    field: 'order_product_amoumt',
    headerName: 'จำนวน',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${params.row.order_product_amoumt || ''} ${params.row.order_product_currency || ''}`
  },
  {
    field: 'order_product_cost',
    headerName: 'ต้นทุนรวม',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${params.row.order_product_cost * params.row.order_product_amoumt || ''}`
  },
  {
    field: 'percent_value_detail',
    headerName: 'ราคาขายก่อนรวม Vat.',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${
        (params.row.order_product_price * params.row.order_product_amoumt * (100 / 107)).toFixed(
          3
        ) || ''
      }`
  },
  {
    field: '7_vat',
    headerName: 'vat.7%',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${
        (
          params.row.order_product_price * params.row.order_product_amoumt -
          params.row.order_product_price * params.row.order_product_amoumt * (100 / 107)
        ).toFixed(3) || ''
      }`
  },
  {
    field: 'order_product_price',
    headerName: 'ราคาขายรวม Vat.',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${params.row.order_product_price * params.row.order_product_amoumt || ''}`
  },

  {
    field: 'กำไร',
    headerName: 'กำไรทั้งหมด',
    width: 150,
    editable: true,
    valueGetter: (params) => `${params.row.percent_value_detail.toFixed(3) || ''}`
  },
  {
    field: 'กำไรบริษัท',
    headerName: 'กำไรบริษัท',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${params.row.percent_value_detail_nba || 0} ${
        `(${params.row.percent_order_detail_nba * 100}%)` || ''
      }`
  },
  {
    field: 'กำไรก่อนจ่ายให้เเต่ละศูนย์',
    headerName: 'กำไรก่อนจ่ายให้เเต่ละศูนย์',
    width: 250,
    editable: true,
    valueGetter: (params) =>
      `${(params.row.percent_value_detail - params.row.percent_value_detail_nba).toFixed(3) || 0}`
  },
  {
    field: 'กำไรจังหวัด',
    headerName: 'กำไรจังหวัด',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${
        (params.row.percent_value_detail * params.row.percent_order_detail_provice).toFixed(3) || 0
      }${`(${params.row.percent_order_detail_provice * 100}%)` || ''}`
  },
  {
    field: 'หัก 3% จังหวัด',
    headerName: 'หัก 3% จังหวัด',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${
        (params.row.percent_value_detail * params.row.percent_order_detail_provice * 0.03).toFixed(
          3
        ) || 0
      } ${`(${0.03 * 100}%)` || ''}`
  },
  {
    field: 'กำไรสุทธิจังหวัด',
    headerName: 'กำไรสุทธิจังหวัด',
    width: 150,
    editable: true,
    valueGetter: (params) => `${params.row.percent_value_detail_provice || 0} `
  },
  {
    field: 'กำไรอำเภอ',
    headerName: 'กำไรอำเภอ',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${
        (params.row.percent_value_detail * params.row.percent_order_detail_district).toFixed(3) || 0
      }${`(${params.row.percent_order_detail_district * 100}%)` || ''}`
  },
  {
    field: 'หัก 3% อำเภอ',
    headerName: 'หัก 3% อำเภอ',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${
        (params.row.percent_value_detail * params.row.percent_order_detail_district * 0.03).toFixed(
          3
        ) || 0
      } ${`(${0.03 * 100}%)` || ''}`
  },
  {
    field: 'กำไรสุทธิอำเภอ',
    headerName: 'กำไรสุทธิอำเภอ',
    width: 150,
    editable: true,
    valueGetter: (params) => `${params.row.percent_value_detail_district || 0} `
  },
  {
    field: 'กำไรตำบล',
    headerName: 'กำไรตำบล',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${
        (params.row.percent_value_detail * params.row.percent_order_detail_subdistrict).toFixed(
          3
        ) || 0
      }${`(${params.row.percent_order_detail_subdistrict * 100}%)` || ''}`
  },
  {
    field: 'หัก 3% ตำบล',
    headerName: 'หัก 3% ตำบล',
    width: 150,
    editable: true,
    valueGetter: (params) =>
      `${
        (
          params.row.percent_value_detail *
          params.row.percent_order_detail_subdistrict *
          0.03
        ).toFixed(3) || 0
      } ${`(${0.03 * 100}%)` || ''}`
  },
  {
    field: 'กำไรสุทธิตำบล',
    headerName: 'กำไรสุทธิตำบล',
    width: 150,
    editable: true,
    valueGetter: (params) => `${params.row.percent_value_detail_subdistrict || 0} `
  },

  {
    field: 'firstname',
    headerName: 'ชื่อ',
    width: 150,
    editable: true
  },
  {
    field: 'lastname',
    headerName: 'นามสกุล',
    width: 150,
    editable: true
  },
  {
    field: 'address',
    headerName: 'ที่อยู่',
    width: 400,
    editable: true
  },
  {
    field: 'bookname',
    headerName: 'บัญชีธนาคาร',
    width: 250,
    editable: true
  },
  {
    field: 'booknumber',
    headerName: 'เลขบัญชี',
    width: 250,
    editable: true
  }
];

export default function DataGridDemo() {
  let componentRef = useRef();
  const [rowsOrder, setRowsOrder] = useState([]);
  const [valueDate, setValueDate] = useState([null, null]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getOrderDetail = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getJoin_order_detail_member`
    );
    console.log(getOrderDetail);
    getOrderDetail.data.data.forEach((element) => {
      element.id = element.id_percent_order_detail;
    });
    setRowsOrder(getOrderDetail.data.data);
  }, []);
  const newRowOrders =
    valueDate[0] !== null && valueDate[1] !== null
      ? rowsOrder.filter(
          (f) =>
            dayjs(f.order_product_date).format() >= dayjs(valueDate[0]).format() &&
            dayjs(f.order_product_date).format() <= dayjs(valueDate[1]).format()
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

      <div style={{ height: '80%', width: '100%' }}>
        <DataGrid
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
        <div ref={(el) => (componentRef = el)}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                ตารางผลรวม
                <ReactToPrint
                  trigger={() => (
                    <ButtonT
                      color="lightBlue"
                      buttonType="link"
                      size="regular"
                      rounded
                      block={false}
                      iconOnly
                      ripple="dark"
                    >
                      <Icon icon="flat-color-icons:print" width={32} height={32} />
                    </ButtonT>
                  )}
                  content={() => componentRef}
                />
                <TableRow>
                  <TableCell>รวมต้นทุน</TableCell>
                  <TableCell>vat.7%</TableCell>
                  <TableCell>ยอดขายรวมภาษี</TableCell>
                  <TableCell>กำไรทั้งหมด</TableCell>
                  <TableCell>กำไรบริษัท</TableCell>
                  <TableCell>กำไรก่อนจ่ายให้เเต่ละศูนย์</TableCell>
                  <TableCell>หัก 3% จังหวัด</TableCell>
                  <TableCell>กำไรสุทธิ จังหวัด</TableCell>
                  <TableCell>หัก 3% อำเภอ</TableCell>
                  <TableCell>กำไรสุทธิ อำเภอ</TableCell>
                  <TableCell>หัก 3% ตำบล</TableCell>
                  <TableCell>กำไรสุทธิ ตำบล</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* order_product_cost order_product_amoumt */}
                <TableCell>
                  {newRowOrders.reduce(
                    (sumPrice, product) =>
                      sumPrice + product.order_product_cost * product.order_product_amoumt,
                    0
                  )}
                </TableCell>
                <TableCell>
                  {newRowOrders
                    .reduce(
                      (sumPrice, product) =>
                        sumPrice +
                        (product.order_product_price * product.order_product_amoumt -
                          product.order_product_price * product.order_product_amoumt * (100 / 107)),
                      0
                    )
                    .toFixed(3)}
                </TableCell>
                <TableCell>
                  {newRowOrders.reduce(
                    (sumPrice, product) =>
                      sumPrice + product.order_product_price * product.order_product_amoumt,
                    0
                  )}
                </TableCell>
                <TableCell>
                  {newRowOrders
                    .reduce((sumPrice, product) => sumPrice + product.percent_value_detail, 0)
                    .toFixed(3)}
                </TableCell>
                <TableCell>
                  {newRowOrders
                    .reduce((sumPrice, product) => sumPrice + product.percent_value_detail_nba, 0)
                    .toFixed(3)}
                </TableCell>
                <TableCell>
                  {newRowOrders
                    .reduce(
                      (sumPrice, product) =>
                        sumPrice +
                        (product.percent_value_detail - product.percent_value_detail_nba),
                      0
                    )
                    .toFixed(3)}
                </TableCell>
                <TableCell>
                  {newRowOrders
                    .reduce(
                      (sumPrice, product) =>
                        sumPrice +
                        product.percent_value_detail * product.percent_order_detail_provice * 0.03,
                      0
                    )
                    .toFixed(3)}
                </TableCell>
                <TableCell>
                  {newRowOrders
                    .reduce(
                      (sumPrice, product) => sumPrice + product.percent_value_detail_provice,
                      0
                    )
                    .toFixed(3)}
                </TableCell>
                {/* params.row.percent_value_detail * params.row.percent_order_detail_district * 0.03 */}
                <TableCell>
                  {newRowOrders
                    .reduce(
                      (sumPrice, product) =>
                        sumPrice +
                        product.percent_value_detail * product.percent_order_detail_district * 0.03,
                      0
                    )
                    .toFixed(3)}
                </TableCell>
                <TableCell>
                  {newRowOrders
                    .reduce(
                      (sumPrice, product) => sumPrice + product.percent_value_detail_district,
                      0
                    )
                    .toFixed(3)}
                </TableCell>
                <TableCell>
                  {newRowOrders
                    .reduce(
                      (sumPrice, product) =>
                        sumPrice +
                        product.percent_value_detail *
                          product.percent_order_detail_subdistrict *
                          0.03,
                      0
                    )
                    .toFixed(3)}
                </TableCell>
                <TableCell>
                  {newRowOrders
                    .reduce(
                      (sumPrice, product) => sumPrice + product.percent_value_detail_subdistrict,
                      0
                    )
                    .toFixed(3)}
                </TableCell>
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          <br />
          <br />
          <br />.
        </div>
      </div>
    </>
  );
}
