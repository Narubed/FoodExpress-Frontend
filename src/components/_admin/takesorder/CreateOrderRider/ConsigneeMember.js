import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
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
import Label from '@material-tailwind/react/Label';
import Swal from 'sweetalert2';
import axios from 'axios';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function ConsigneeMember({
  SelectConsignee,
  setSelectConsignee,
  Consignee,
  setConsignee,
  setModalSelectAddress,
  showModalSelectAddress
}) {
  const [AllProvinceMember, setAllProvinceMember] = useState([]); // จังหวัดทั้งหมด
  const [provinceMember, setprovinceMember] = useState([]); // จังหวัดทั้งหมด
  const [SelectprovinceMember, setSelectprovinceMember] = useState([]); // ค่าที่ถูก Select แล้ว

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const Members = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/members`);
    const filteredsProvinceMember = [];
    Members.data.data.forEach((item) => {
      const idx = filteredsProvinceMember.findIndex((value) => value.province === item.province);
      if (idx === -1) {
        filteredsProvinceMember.push(item);
      }
    });
    setAllProvinceMember(filteredsProvinceMember);
    setConsignee(Members.data.data);
  }, []);
  const onChangeProvinceMember = (e) => {
    const filterProvinceMembers = Consignee.filter((f) => f.province === e.target.value);
    setprovinceMember(e.target.value);
    setSelectprovinceMember(filterProvinceMembers);
  };

  const confirmMemberAddress = (data) => {
    setSelectConsignee(data);
    setModalSelectAddress(false);
  };
  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { mr: 40, width: '100%' }
          }}
          noValidate
          autoComplete="off"
        >
          <Button onClick={() => setModalSelectAddress(true)}>เลือกที่อยู่ที่จะจัดส่ง</Button>
        </Box>

        <Input
          disabled
          color="pink"
          size="lg"
          outline
          placeholder="ที่อยู่ที่จะถูกจัดส่ง"
          defaultValue={
            SelectConsignee === null
              ? ''
              : `นาย ${SelectConsignee.firstname} นามสกุล ${SelectConsignee.lastname} เบอร์โทรศัพท์ ${SelectConsignee.tel} ที่อยู่ ${SelectConsignee.address}`
          }
        />
      </Stack>
      <Dialog
        fullWidth="fullWidth"
        maxWidth="md"
        open={showModalSelectAddress}
        onClose={() => setModalSelectAddress(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle>คุณต้องการเพิ่มงานให้ไรเดอร์หรือไม่</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <br />
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
                label="ค้นหาจังหวัด"
                value={provinceMember}
                // onChange={(e) => WTFsetprovinceMember(e.target.value)}
                onChange={(e) => onChangeProvinceMember(e)}
              >
                {AllProvinceMember.map((value) => (
                  <MenuItem key={value.province} value={value.province}>
                    {value.province}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContentText>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ระดับ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ชื่อ
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ที่อยู่
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ยืนยันที่อยู่
                </th>

                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(SelectprovinceMember.length === 0 ? Consignee : SelectprovinceMember).map(
                (data) => (
                  <tr key={data.firstname}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {data.level === 'subdistrict' ? (
                        <Label color="lightBlue">ระดับตำบล </Label>
                      ) : null}

                      {data.level === 'district' ? <Label color="green">ระดับอำเภอ</Label> : null}

                      {data.level === 'province' ? <Label color="red">ระดับจังหวัด</Label> : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{data.firstname}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs">{data.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button onClick={() => confirmMemberAddress(data)}>
                        <Icon icon="mdi:truck-delivery" width={38} height={38} />
                      </Button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setModalSelectAddress(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
