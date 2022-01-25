import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'product',
    titleth: 'สินค้าทั้งหมด',
    path: '/dashboard/products',
    icon: <Icon icon="emojione-v1:shopping-bags" width={22} height={22} />
  },
  {
    title: 'checkorder',
    titleth: 'เช็คออเดอร์',
    path: '/dashboard/CheckOrderMemberApp',
    icon: <Icon icon="flat-color-icons:todo-list" width={22} height={22} />
  },
  {
    title: 'checkorderdetailundermember',
    titleth: 'ออเดอร์ผู้ใช้ใต้สังกัต',
    path: '/dashboard/CheckOrderDetailUnderMemberApp',
    icon: <Icon icon="logos:airtable" width={22} height={22} />
  },

  {
    title: 'undermember',
    titleth: 'ผู้ใช้ใต้สังกัต',
    path: '/dashboard/UnderMemberApp',
    icon: <Icon icon="logos:undertow" width={22} height={22} />
  },

  {
    title: 'dashboard',
    titleth: 'กระเป๋าเงิน',
    path: '/dashboard/app',
    icon: <Icon icon="emojione:money-bag" width={22} height={22} />
  },
  {
    title: 'TakeOrdersMemberApp',
    titleth: 'TakeOrders',
    path: '/dashboard/TakeOrdersMemberApp',
    icon: <Icon icon="fa-solid:people-carry" width={24} height={24} />
  },
  {
    title: 'StockProductApp',
    titleth: 'สต๊อกสินค้า',
    path: '/dashboard/StockProductApp',
    icon: <Icon icon="emojione:card-file-box" width={24} height={24} />
  },

  {
    title: 'BlogsReportOrderApp',
    titleth: 'บล๊อคข่าวสาร',
    path: '/dashboard/BlogsReportOrderApp',
    icon: <Icon icon="twemoji:rolled-up-newspaper" width={24} height={24} />
  }

  // {
  //   title: 'user',
  //   titleth: 'ผู้ใช้',
  //   path: '/dashboard/user',
  //   icon: getIcon(peopleFill)
  // },

  // {
  //   title: 'blog',
  //   titleth: 'บล๊อคข่าวสาร',
  //   path: '/dashboard/blog',
  //   icon: getIcon(fileTextFill)
  // }
  // {
  //   title: 'login',
  //   titleth: 'เข้าสู่ระบบ',
  //   path: '/login',
  //   icon: getIcon(lockFill)
  // },
  // {
  //   title: 'register',
  //   titleth: 'สมัครสมาชิก',
  //   path: '/register',
  //   icon: getIcon(personAddFill)
  // },
  // {
  //   title: 'Not found',
  //   titleth: 'หาหน้าไม่เจอ',
  //   path: '/404',
  //   icon: getIcon(alertTriangleFill)
  // }
];

export default sidebarConfig;
