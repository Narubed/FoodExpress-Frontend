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
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'rider',
    titleth: 'จัดการข้อมูลไรเดอร์',
    path: '/admin/AdminRiderApp',
    icon: <Icon icon="icon-park-outline:riding" width={22} height={22} />
  },
  {
    title: 'company',
    titleth: 'จัดการข้อมูลบริษัท',
    path: '/admin/AdminCompanyApp',
    icon: <Icon icon="mdi:office-building-cog-outline" width={22} height={22} />
  },
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
  {
    title: 'login',
    titleth: 'เข้าสู่ระบบ',
    path: '/login',
    icon: getIcon(lockFill)
  },
  {
    title: 'register',
    titleth: 'สมัครสมาชิก',
    path: '/register',
    icon: getIcon(personAddFill)
  },
  {
    title: 'Not found',
    titleth: 'หาหน้าไม่เจอ',
    path: '/404',
    icon: getIcon(alertTriangleFill)
  }
];

export default sidebarConfig;
