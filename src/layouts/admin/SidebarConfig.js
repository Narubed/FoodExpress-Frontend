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
    title: 'admin',
    titleth: 'หน้าหลัก',
    path: '/admin/app',
    icon: <Icon icon="twemoji:card-index" width={22} height={22} />
  },

  {
    title: 'checkorder',
    titleth: 'ตรวจสอบออเดอร์',
    path: '/admin/AdminCheckOrderApp',
    icon: <Icon icon="jam:task-list-f" width={22} height={22} color="blue" />
  },
  {
    title: 'percent',
    titleth: 'กำหนดเปอร์เซ็น',
    path: '/admin/AdminPercentApp',
    icon: <Icon icon="emojione-v1:money-bag" width={22} height={22} />
  },
  {
    title: 'wallet',
    titleth: 'ค่าคอมมิสชั่น',
    path: '/admin/AdminWalletApp',
    icon: <Icon icon="emojione:money-bag" width={22} height={22} />
  },

  {
    title: 'confrim',
    titleth: 'รวมยอดรายการสินค้า',
    path: '/admin/AdminConfirmExpressApp',
    icon: <Icon icon="flat-color-icons:todo-list" width={22} height={22} />
  },
  {
    title: 'cutarount',
    titleth: 'รายการตัดรอบเเล้ว',
    path: '/admin/AdminCutArountApp',
    icon: <Icon icon="icon-park:order" width={22} height={22} />
  },
  {
    title: 'takesorder',
    titleth: 'Takes Order',
    path: '/admin/AdminTakesOrderApp',
    icon: <Icon icon="fxemoji:deliverytruck" width={22} height={22} />
  },

  {
    title: 'rider',
    titleth: 'จัดการข้อมูลไรเดอร์',
    path: '/admin/AdminRiderApp',
    icon: <Icon icon="noto:person-biking-light-skin-tone" width={22} height={22} />
  },
  {
    title: 'company',
    titleth: 'จัดการข้อมูลบริษัท',
    path: '/admin/AdminCompanyApp',
    icon: <Icon icon="emojione:office-building" width={22} height={22} />
  },
  {
    title: 'product',
    titleth: 'จัดการข้อมูลสินค้า',
    path: '/admin/AdminProductApp',
    icon: <Icon icon="emojione-v1:shopping-bags" width={22} height={22} />
  },
  {
    title: 'member',
    titleth: 'จัดการข้อมูลผู้ใช้',
    path: '/admin/AdminMemberApp',
    icon: <Icon icon="emojione:person-walking-medium-skin-tone" width={22} height={22} />
  }
  // {
  //   title: 'rider',
  //   titleth: 'จัดการข้อมูลไรเดอร์',
  //   path: '/admin/AdminCreateRiderApp',
  //   icon: <Icon icon="icon-park-outline:riding" width={22} height={22} />
  // },
  // {
  //   title: 'product',
  //   titleth: 'สินค้า',
  //   path: '/dashboard/products',
  //   icon: getIcon(shoppingBagFill)
  // },
  // {
  //   title: 'blog',
  //   titleth: 'บล๊อคข่าวสาร',
  //   path: '/dashboard/blog',
  //   icon: getIcon(fileTextFill)
  // },
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
