/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import {
  Autocomplete,
  Stack,
  TextField,
  Button,
  Container,
  Typography,
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
  Radio,
  AppBar,
  Toolbar,
  IconButton,
  CloseIcon,
  ListItem,
  ListItemText,
  Divider,
  List
} from '@mui/material';
import axios from 'axios';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function ConsigneeMember({
  setSeleteConsignee,
  setNewNoteConsignee,
  setNewConsignee
}) {
  const [valueMembers, setValueMembers] = useState([]);
  const [AllProvinceMember, setAllProvinceMember] = useState([]); // จังหวัดทั้งหมด
  const [openSelectProvince, setOpenSelectProvince] = useState(false);
  const [selectProvince, setSelectProvince] = useState();

  useEffect(async () => {
    const Members = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/members`);
    const addNameLevel = [];
    Members.data.data.forEach((element) => {
      if (element.level === 'subdistrict') {
        addNameLevel.push({
          ...element,
          level_name: `ระดับตำบล ${element.subdistrict} จังหวัด ${element.province}`
        });
      } else if (element.level === 'district') {
        addNameLevel.push({
          ...element,
          level_name: `ระดับอำเภอ ${element.district} จังหวัด ${element.province}`
        });
      } else if (element.level === 'province') {
        addNameLevel.push({ ...element, level_name: `ระดับจังหวัด ${element.province}` });
      }
    });
    setValueMembers(addNameLevel);
    const filterProvince = [];
    Members.data.data.forEach((element) => {
      const idx = filterProvince.findIndex((item) => item.province === element.province);
      if (idx === -1) {
        filterProvince.push(element);
      }
    });
    setAllProvinceMember(filterProvince);
  }, []);

  const onClickSelectMember = () => {
    setOpenSelectProvince(true);
  };

  const onChangeSelectProvince = (newValue) => {
    const filterProvince = valueMembers.filter((item) => item.province === newValue);
    if (filterProvince.length === 0) {
      setSelectProvince(valueMembers);
    } else {
      setSelectProvince(filterProvince);
    }
  };
  const headleSubmit = async (event) => {
    const data = {
      consignee_type: 'member',
      consignee_name: event.firstname,
      consignee_id: event.userId,
      consignee_note: event.address
    };
    setSeleteConsignee(data);
    setNewNoteConsignee(
      `ชื่อ ${event.firstname} ${event.lastname} เบอร์โทรศัพท์ ${event.tel} ที่อยู่ ${event.address}`
    );
    setOpenSelectProvince(false);
  };
  return (
    <div>
      {' '}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button onClick={() => onClickSelectMember()} variant="contained" size="small">
          ค้นหาศูนย์ที่ต้องการจัดส่ง
        </Button>
      </Stack>
      <Dialog
        fullScreen
        open={openSelectProvince}
        onClose={() => setOpenSelectProvince(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', bgcolor: '#BA55D3' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpenSelectProvince(false)}
              aria-label="close"
            >
              <Icon icon="ant-design:close-circle-filled" width="50" height="50" />
            </IconButton>
            <Typography sx={{ ml: 0, flex: 1 }} variant="h6" component="div">
              <Autocomplete
                sx={{
                  bgcolor: '#ffffff',
                  width: '95%',
                  m: 2,
                  borderRadius: 2
                }}
                disablePortal
                id="combo-box-demo"
                options={AllProvinceMember}
                getOptionLabel={(option) => option.province}
                onInputChange={(e, newValue) => {
                  onChangeSelectProvince(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="สามารถค้นหาตามจังหวัดที่มีอยู่ได้" />
                )}
              />
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpenSelectProvince(false)}
              aria-label="close"
            >
              <Icon icon="ant-design:close-circle-filled" width="50" height="50" />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container>
          <List>
            {(selectProvince || valueMembers).map((item) => (
              <>
                <ListItem button onClick={(e) => headleSubmit(item)}>
                  <ListItemText
                    primary={`${item.level_name}`}
                    secondary={`ชื่อ ${item.firstname} ${item.lastname} เบอร์โทรศัพท์ ${item.tel} ที่อยู่ ${item.address}`}
                  />
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
        </Container>
      </Dialog>
    </div>
  );
}
