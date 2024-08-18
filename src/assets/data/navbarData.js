// Updated navbarItems with proper hrefs
export const navbarItems = [
  {
    name: 'Home',
    href: '/',
    hasDropdown: false,
  },
  {
    name: 'About',
    href: '/about',
    hasDropdown: false,
  },
  {
    name: 'Solutions',
    href: '#solutions',
    hasDropdown: true,
    dropdownItems: [
      {
        name: 'Tech Solutions',
        hasSubmenu: true,
        items: [
          { name: 'Web Development', href: '/solution/web-development' },
          { name: 'Mobile Apps', href: '/solution/mobile-apps' },
          { name: 'Dashboards', href: '/solution/dashboards' },
          { name: 'Custom Solutions', href: '/solution/custom-solutions' },
          { name: 'API Development', href: '/solution/api-development' },
          { name: 'Data Analytics', href: '/solution/data-analytics' },
          { name: 'E-commerce Solutions', href: '/solution/ecommerce-solutions' },
        ],
      },
      {
        name: 'Brand Solutions',
        hasSubmenu: true,
        items: [
          { name: 'Brand Guides', href: '/solution/brand-guides' },
          { name: 'Brand Packages', href: '/solution/brand-packages' },
          { name: 'Logo Design', href: '/solution/logo-design' },
          { name: 'Marketing Materials', href: '/solution/marketing-materials' },
          { name: 'Brand Strategy', href: '/solution/brand-strategy' },
          { name: 'Corporate Identity', href: '/solution/corporate-identity' },
          { name: 'Social Media Branding', href: '/solution/social-media-branding' },
        ],
      },
    ],
  },
  {
    name: 'Blog',
    href: '/blog',
    hasDropdown: false,
  },
  {
    name: 'Contact',
    href: '/contact',
    hasDropdown: false,
  },
];
