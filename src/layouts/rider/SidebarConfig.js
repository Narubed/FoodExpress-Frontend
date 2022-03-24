import { Icon } from '@iconify/react';
// ----------------------------------------------------------------------
const sidebarConfig = [
  // {
  //   title: 'rider',
  //   titleth: 'หน้าหลัก',
  //   path: '/rider/app',
  //   icon: <Icon icon="twemoji:card-index" width={22} height={22} />
  // },
  {
    title: 'RiderTakeOrder',
    titleth: 'รายการที่ได้รับมอบหมาย',
    path: '/rider/RiderTakesOrderApp',
    icon: <Icon icon="noto:card-file-box" width={36} height={36} />
  },
  {
    title: 'rider',
    titleth: 'สถานที่ต้องไปรับสินค้า',
    path: '/rider/PickUpProductApp',
    icon: <Icon icon="noto:inbox-tray" width={36} height={36} />
  }
  // {
  //   title: 'rider',
  //   titleth: 'สถานที่ต้องไปส่งสินค้า',
  //   path: '/rider/RiderTakesOrderApp',
  //   icon: <Icon icon="noto:outbox-tray" width={36} height={36} />
  // },
  // {
  //   title: 'rider',
  //   titleth: 'สต๊อกสินค้า',
  //   path: '/rider/RiderTakesOrderApp',
  //   icon: <Icon icon="emojione-v1:card-file-box" width={36} height={36} />
  // }

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
