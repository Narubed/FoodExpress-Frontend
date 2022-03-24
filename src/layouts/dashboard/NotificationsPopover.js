import faker from 'faker';
import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { set, sub, formatDistanceToNow } from 'date-fns';
import { Icon } from '@iconify/react';
import bellFill from '@iconify/icons-eva/bell-fill';
import clockFill from '@iconify/icons-eva/clock-fill';
import doneAllFill from '@iconify/icons-eva/done-all-fill';
import numeral from 'numeral';
// material
import { alpha } from '@mui/material/styles';
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton
} from '@mui/material';
// utils
import axios from 'axios';
import { mockImgAvatar } from '../../utils/mockImages';
// components
import Scrollbar from '../../components/Scrollbar';
import MenuPopover from '../../components/MenuPopover';

// ----------------------------------------------------------------------

const NOTIFICATIONS = [
  {
    id: faker.datatype.uuid(),
    title: 'Your order is placed',
    description: 'waiting for shipping',
    avatar: null,
    type: 'order_placed',
    createdAt: set(new Date(), { hours: 10, minutes: 30 }),
    isUnRead: true
  },
  {
    id: faker.datatype.uuid(),
    title: faker.name.findName(),
    description: 'answered to your comment on the Minimal',
    avatar: mockImgAvatar(2),
    type: 'friend_interactive',
    createdAt: sub(new Date(), { hours: 3, minutes: 30 }),
    isUnRead: true
  },
  {
    id: faker.datatype.uuid(),
    title: 'You have new message',
    description: '5 unread messages',
    avatar: null,
    type: 'chat_message',
    createdAt: sub(new Date(), { days: 1, hours: 3, minutes: 30 }),
    isUnRead: false
  },
  {
    id: faker.datatype.uuid(),
    title: 'You have new mail',
    description: 'sent from Guido Padberg',
    avatar: null,
    type: 'mail',
    createdAt: sub(new Date(), { days: 2, hours: 3, minutes: 30 }),
    isUnRead: false
  },
  {
    id: faker.datatype.uuid(),
    title: 'Delivery processing',
    description: 'Your order is being shipped',
    avatar: null,
    type: 'order_shipped',
    createdAt: sub(new Date(), { days: 3, hours: 3, minutes: 30 }),
    isUnRead: false
  }
];

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired
};

function NotificationItem({ notification }) {
  const today = new Date(notification.order_product_date);
  today.setHours(today.getHours() - 7);
  const title = `${notification.order_status} ${numeral(
    notification.order_product_total
  ).format()} บาท`;
  //
  return (
    <ListItemButton
      to="/dashboard/CheckOrderMemberApp"
      disableGutters
      component={RouterLink}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected'
        })
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>
          <Icon icon="emojione:shopping-bags" width="30" height="30" />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            variant="button"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center'
              // color: 'text.disabled'
            }}
          >
            {title}
          </Typography>
        }
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}
          >
            <Box component={Icon} icon={clockFill} sx={{ mr: 0.5, width: 16, height: 16 }} />
            {formatDistanceToNow(new Date(today))}
          </Typography>
        }
      />
    </ListItemButton>
  );
}
NotificationItemTakeOrder.propTypes = {
  notification: PropTypes.object.isRequired,
  order_rider_product_name: PropTypes.string
};
function NotificationItemTakeOrder({ notification }) {
  // const { avatar, title } = renderContent(notification);
  const title = `สิ่งที่คุณต้องได้รับจากไรเดอร์คือ ${notification.order_rider_product_name}`;
  //
  console.log(notification.order_rider_date_cut_arount);
  const today = new Date(notification.order_rider_date_cut_arount);
  today.setHours(today.getHours() + 7);
  return (
    <ListItemButton
      to="/dashboard/TakeOrdersMemberApp"
      disableGutters
      component={RouterLink}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected'
        })
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>
          <Icon icon="emojione:delivery-truck" width="30" height="30" />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            variant="button"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center'
              // color: 'text.disabled'
            }}
          >
            {title}
          </Typography>
        }
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}
          >
            <Box component={Icon} icon={clockFill} sx={{ mr: 0.5, width: 16, height: 16 }} />
            {formatDistanceToNow(new Date(today))}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

NotificationItemTakeOrderInProvince.propTypes = {
  notification: PropTypes.object.isRequired,
  member_delivery_level: PropTypes.string
};
function NotificationItemTakeOrderInProvince({ notification }) {
  // const { avatar, title } = renderContent(notification);
  const title = `คุณต้องได้รับของจากระดับ ${
    notification.member_delivery_level === 'province' ? 'ระดับจังหวัด' : 'ระดับอำเภอ'
  }`;
  const today = new Date(notification.member_delivery_date);
  today.setHours(today.getHours() - 7);
  return (
    <ListItemButton
      to="/dashboard/TakeOrdersInProvinceApp"
      disableGutters
      component={RouterLink}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected'
        })
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>
          <Icon icon="noto:shopping-bags" width="30" height="30" />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            variant="button"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center'
              // color: 'text.disabled'
            }}
          >
            {title}
          </Typography>
        }
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}
          >
            <Box component={Icon} icon={clockFill} sx={{ mr: 0.5, width: 16, height: 16 }} />
            {formatDistanceToNow(new Date(today))}
          </Typography>
        }
      />
    </ListItemButton>
  );
}
export default function NotificationsPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState();
  // const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;
  const [Total, setTotal] = useState([]);
  const [showTakesOrderRider, setTakesOrderRider] = useState([]);
  const [showTakesOrderINProvince, setTakesOrderINProvince] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const user = sessionStorage.getItem('user');
    const getAllOrder = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getByOrderMember_id/${user}`
    );
    const filterStatusOrder = getAllOrder.data.data.filter((f) => f.order_status === 'รอชำระเงิน');
    setTotal(filterStatusOrder);

    //--------------------------------------------------------------------------------------

    const getOrderRider = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getAllOrderExpressJoinRider`
    );
    const filterOrder = getOrderRider.data.data.filter(
      (f) => parseInt(f.order_rider_consignee_id, 10) === parseInt(user, 10)
    );
    const filterOrderStatus = filterOrder.filter(
      (value) => value.order_rider_status === 'ไรเดอร์รับมอบหมายงานแล้ว'
    );
    setTakesOrderRider(filterOrderStatus);
    //----------------------------------------------------------------------------------------------
    const getDeliveryDetail = await axios.get(
      `${process.env.REACT_APP_WEB_BACKEND}/getJoinDeliveryProviceAndMemberDelivery`
    );
    const filterUserID = getDeliveryDetail.data.data.filter(
      (f) => parseInt(f.receiver_delivery_member_id, 10) === parseInt(user, 10)
    );
    const filterStatus = filterUserID.filter((f) => f.member_delivery_status === 'ตัดรอบแล้ว');
    setTakesOrderINProvince(filterStatus);
  }, []);

  function handleOpen() {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      Total.map((notification) => ({
        ...notification,
        isUnRead: false
      }))
    );
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        size="large"
        color={open ? 'primary' : 'default'}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <Badge
          badgeContent={Total.length + showTakesOrderRider.length + showTakesOrderINProvince.length}
          color="error"
        >
          <Icon icon={bellFill} width={20} height={20} />
        </Badge>
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 420 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {showTakesOrderRider.length !== 0 ? (
                <div>คุณมี {showTakesOrderRider.length} รายการที่ต้องได้รับของจากไรเดอร์ </div>
              ) : null}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {showTakesOrderINProvince.length !== 0 ? (
                <div>
                  คุณมี {showTakesOrderINProvince.length} รายการที่ต้องได้รับของภายในจังหวัด
                </div>
              ) : null}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {Total.length !== 0 ? <div>คุณมี {Total.length} รายการที่ต้องชำระเงิน </div> : null}
            </Typography>
          </Box>

          {(Total.length > 0 ||
            showTakesOrderRider.length > 0 ||
            showTakesOrderINProvince.length > 0) && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Icon icon={doneAllFill} width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {Total.map((notification) => (
              <NotificationItem key={notification.order_id} notification={notification} />
            ))}
            {showTakesOrderRider.map((notification) => (
              <NotificationItemTakeOrder
                key={notification.id_order_rider_id}
                notification={notification}
              />
            ))}
            {showTakesOrderINProvince.map((notification) => (
              <NotificationItemTakeOrderInProvince
                key={notification.id}
                notification={notification}
              />
            ))}
          </List>

          {/* <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {notifications.slice(2, 5).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List> */}
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple component={RouterLink} to="/">
            View All
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
