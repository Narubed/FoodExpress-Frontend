import React, { useEffect, useState } from 'react';
import { filter } from 'lodash';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { purple, lime } from '@mui/material/colors';
import { Icon } from '@iconify/react';
import { Card, Container, Typography, Stack, TextField, Box } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDateRangePicker from '@mui/lab/MobileDateRangePicker';

import ReportActionAdminListToolbar from '../../../components/_admin/reportactionadmin/ReportActionAdminListToolbar';

import Page from '../../../components/Page';

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
        _user.id_report_action_admin.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.admin_first_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.admin_last_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.report_action_order_id.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.report_action_admin_value.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.report_action_admin_date.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ControlledAccordions() {
  const [expanded, setExpanded] = React.useState(false);
  // eslint-disable-next-line camelcase
  const [orderBy] = useState('name');
  const [order] = useState('asc');
  const [filterName, setFilterName] = useState('');
  const [report, setReport] = React.useState([]);
  const [valueDate, setValueDate] = useState([null, null]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getReportAdminJoinAdmin = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getReportAdminJoinAdmin`
    );
    const reverseData = getReportAdminJoinAdmin.data.data.reverse();
    setReport(reverseData);
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  // dayjs(f.order_product_date).format() >= dayjs(valueDate[0]).format() &&
  //   dayjs(f.order_product_date).format() <= dayjs(valueDate[1]).format();
  const filterDate =
    valueDate[0] === null && valueDate[1] === null
      ? report
      : report.filter(
          (f) =>
            dayjs(f.report_action_admin_date).add(7, 'hour').format() >=
              dayjs(valueDate[0]).format() &&
            dayjs(f.report_action_admin_date).add(7, 'hour').format() <=
              dayjs(valueDate[1]).format()
        );
  const filteredReport = applySortFilter(filterDate, getComparator(order, orderBy), filterName);
  return (
    <Page title="ReportAdmin | FoodExpress">
      <Container>
        <Card>
          <ReportActionAdminListToolbar
            // numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            // selected_id={selected_id}
          />
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
          <div>
            <Accordion
              expanded={expanded === '1'}
              onChange={handleChange('1')}
              sx={{
                color: purple[800],
                backgroundColor: purple[200]
              }}
            >
              <AccordionSummary
                //   expandIcon={<Icon icon="emojione:up-arrow" />}
                aria-controls="panel1bh-content"
                //   id="panel1bh-header"
              >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>ออเดอร์ไอดีที่ทำรายการ</Typography>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>ใครทำรายการ</Typography>
                <Typography sx={{ width: '33%', flexShrink: 0 }}>วันที่</Typography>
              </AccordionSummary>
            </Accordion>
            {filteredReport.map((value, index) => (
              <div key={value.id_report_action_admin}>
                <Accordion
                  sx={{
                    backgroundColor: index % 2 !== 0 ? purple[50] : lime[50]
                  }}
                  expanded={expanded === value.id_report_action_admin}
                  onChange={handleChange(value.id_report_action_admin)}
                >
                  <AccordionSummary
                    expandIcon={<Icon icon="emojione:up-arrow" width="38" height="38" />}
                    aria-controls="panel2bh-content"
                    //   id="panel2bh-header"
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                      {value.report_action_order_id}
                    </Typography>
                    <Typography sx={{ width: '33%', flexShrink: 0, color: 'text.secondary' }}>
                      {value.admin_first_name} {value.admin_last_name}
                    </Typography>
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                      {dayjs(value.report_action_admin_date)
                        .add(7, 'hour')
                        .add(543, 'year')
                        .locale('th')
                        .format('วัน ddd ที่ D MMM YYYY h:mm A')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ color: 'red' }}>{value.report_action_admin_value}</Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
            ))}
          </div>
        </Card>
      </Container>
    </Page>
  );
}
// 16481199304289876543211
