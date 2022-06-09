import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';

// ----------------------------------------------------------------------

const sidebarConfig = [
  {
    title: 'admin',
    titleth: 'หน้าหลัก',
    path: '/admin/app',
    icon: <Icon icon="flat-color-icons:home" width={22} height={22} />
  },

  {
    title: 'checkorder',
    titleth: 'ตรวจสอบออเดอร์',
    icon: <Icon icon="twemoji:card-index" width={22} height={22} color="blue" />,
    children: [
      {
        title: 'checkorder',
        titleth: 'ออเดอร์ศูนย์ภายในจังหวัด',
        path: '/admin/AdminCheckOrderApp'
      },
      {
        title: 'checkorder',
        titleth: 'ออเดอร์ศูนย์(เขต/ภาค)',
        path: '/admin/AdminCheckOrderPartnerApp'
      }
    ]
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
    icon: <Icon icon="emojione:money-bag" width={22} height={22} />,
    children: [
      {
        title: 'wallet',
        titleth: 'ศูนย์ภายในจังหวัด',
        path: '/admin/AdminWalletApp'
      },
      {
        title: 'wallet-partner',
        titleth: 'ศูนย์ (เขต/ภาค)',
        path: '/admin/AdminWalletPartner'
      }
    ]
  },

  {
    title: 'รวมยอดรายการสินค้า',
    titleth: 'รวมยอดรายการสินค้า',
    icon: <Icon icon="flat-color-icons:todo-list" width={22} height={22} />,
    children: [
      {
        title: 'confrim',
        titleth: 'ศูนย์ภายในจังหวัด',
        path: '/admin/AdminConfirmExpressApp'
      },
      {
        title: 'confrim',
        titleth: 'ศูนย์ เขต / ภาค',
        path: '/admin/AdminConfirmPartnerExpressApp'
      }
    ]
  },
  {
    title: 'cutarount',
    titleth: 'รายการตัดรอบเเล้ว',
    icon: <Icon icon="icon-park:order" width={22} height={22} />,
    children: [
      {
        title: 'confrim',
        titleth: 'ศูนย์ภายในจังหวัด',
        path: '/admin/AdminCutArountApp'
      },
      {
        title: 'confrim',
        titleth: 'ศูนย์ เขต / ภาค',
        path: '/admin/AdminCutArountPartnerApp'
      },
      {
        title: 'confrim',
        titleth: 'ศูนย์ภายในจังหวัด (ย้อนหลัง)',
        path: '/admin/AdminCutArountAllApp'
      },
      {
        title: 'confrim',
        titleth: 'ศูนย์ เขต / ภาค (ย้อนหลัง)',
        path: '/admin/AdminCutArountPartnerAllApp'
      }
    ]
  },

  {
    title: 'takesorder',
    titleth: 'Takes Order',
    path: '/admin/AdminTakesOrderApp',
    icon: <Icon icon="fxemoji:deliverytruck" width={22} height={22} />
  },

  {
    title: 'จัดการข้อมูลในระบบ',
    titleth: 'จัดการข้อมูลในระบบ',
    icon: <Icon icon="emojione-v1:shopping-bags" width={22} height={22} />,
    children: [
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
    ]
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
