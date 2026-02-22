export interface NavItem {
  id: string
  label: string
  href?: string
  icon: string
  badge?: 'pendingOrders' | 'pendingInquiries' | 'customerCount' | 'unreadNotifications'
  isNew?: boolean
  external?: boolean
  children?: NavItem[]
}

export interface NavGroup {
  group: string
  items: NavItem[]
}

export const MANAGER_NAV: NavGroup[] = [
  {
    group: '브랜드 운영',
    items: [
      {
        id: 'dashboard',
        label: '대시보드',
        href: '/manager',
        icon: 'LayoutDashboard',
      },
      {
        id: 'design',
        label: '디자인 모드',
        href: '/manager/design',
        icon: 'Paintbrush',
      },
      {
        id: 'notifications',
        label: '알림',
        href: '/manager/notifications',
        icon: 'Bell',
        badge: 'unreadNotifications',
      },
      {
        id: 'customers',
        label: '고객',
        href: '/manager/customers',
        icon: 'Users',
        badge: 'customerCount',
      },
      {
        id: 'shopping',
        label: '쇼핑',
        icon: 'ShoppingBag',
        children: [
          { id: 'products', label: '상품', href: '/manager/shopping/products', icon: 'Package' },
          { id: 'orders', label: '주문', href: '/manager/shopping/orders', icon: 'ClipboardList', badge: 'pendingOrders' },
          { id: 'shipping', label: '배송', href: '/manager/shopping/shipping', icon: 'Truck' },
          { id: 'subscriptions', label: '정기 구독', href: '/admin/collections/orders', icon: 'RefreshCw', external: true },
          { id: 'inquiries', label: '문의', href: '/manager/shopping/inquiries', icon: 'MessageCircle', badge: 'pendingInquiries' },
          { id: 'reviews', label: '구매평', href: '/manager/shopping/reviews', icon: 'Star' },
          { id: 'external-products', label: '외부 상품 연동', href: '/manager/extensions', icon: 'Link2', isNew: true },
          { id: 'restock', label: '재입고 알림', href: '/manager/extensions', icon: 'Bell', isNew: true },
          { id: 'gifting', label: '선물하기', href: '/manager/extensions', icon: 'Gift' },
          { id: 'shop-settings', label: '쇼핑 설정', href: '/manager/shopping/settings', icon: 'Settings' },
        ],
      },
      {
        id: 'promotions',
        label: '프로모션',
        href: '/manager/promotions',
        icon: 'Megaphone',
      },
      {
        id: 'content',
        label: '콘텐츠',
        href: '/manager/content',
        icon: 'FileText',
      },
      {
        id: 'statistics',
        label: '통계',
        href: '/manager/statistics',
        icon: 'BarChart2',
      },
      {
        id: 'marketing',
        label: '홍보·마케팅',
        icon: 'TrendingUp',
        children: [
          { id: 'messages', label: '메시지', href: '/manager/marketing/messages', icon: 'MessageSquare' },
          { id: 'crm', label: 'CRM 캠페인', href: '/manager/marketing/crm', icon: 'Target' },
        ],
      },
      {
        id: 'extensions',
        label: '확장',
        icon: 'Puzzle',
        isNew: true,
        children: [
          { id: 'sales-tools', label: '매출 상승 도구', href: '/manager/extensions', icon: 'TrendingUp', isNew: true },
          { id: 'apps', label: '앱', href: '/manager/extensions', icon: 'Smartphone', isNew: true },
        ],
      },
    ],
  },
  {
    group: '관리',
    items: [
      { id: 'payment', label: '결제', href: '/manager/payment', icon: 'CreditCard' },
      {
        id: 'settings',
        label: '설정',
        icon: 'Settings2',
        children: [
          { id: 'settings-hero', label: '홈 화면', href: '/admin/globals/hero', icon: 'Home', external: true },
          { id: 'settings-seo', label: 'SEO 설정', href: '/manager/settings/seo', icon: 'Search' },
          { id: 'settings-nav', label: '메뉴 설정', href: '/manager/settings/nav', icon: 'Menu' },
          { id: 'payload-admin', label: 'Payload Admin', href: '/admin', icon: 'Database', external: true },
        ],
      },
    ],
  },
  {
    group: '리소스',
    items: [
      { id: 'guide', label: '고객 가이드', href: 'https://payloadcms.com/docs', icon: 'BookOpen', external: true },
      { id: 'education', label: '고객 성장 센터', href: '#', icon: 'GraduationCap', external: true },
      { id: 'experts', label: '아임웹 전문가', href: '#', icon: 'Award', external: true },
    ],
  },
]
