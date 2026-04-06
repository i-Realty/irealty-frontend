import {
  LayoutDashboard,
  Home,
  MessageSquare,
  FileText,
  Wallet,
  ArrowRightLeft,
  Calendar,
  Settings,
  Building2,
  Search,
  Heart,
  LayoutGrid,
  Users,
  Coins,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UserRole } from '@/lib/store/useAuthStore';

export interface NavItem {
  label: string;
  icon?: LucideIcon;
  href?: string;
  isHeader?: boolean;
}

// ── Per-role nav definitions ──────────────────────────────────────────

const agentNav: NavItem[] = [
  { label: 'OVERVIEW', isHeader: true },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/agent' },
  { label: 'My Properties', icon: Home, href: '/dashboard/agent/properties' },
  { label: 'Messages', icon: MessageSquare, href: '/dashboard/agent/messages' },
  { label: 'Documents', icon: FileText, href: '/dashboard/agent/documents' },

  { label: 'FINANCIAL', isHeader: true },
  { label: 'Wallet', icon: Wallet, href: '/dashboard/agent/wallet' },
  { label: 'Transactions', icon: ArrowRightLeft, href: '/dashboard/agent/transactions' },

  { label: 'TOOLS', isHeader: true },
  { label: 'Calendar', icon: Calendar, href: '/dashboard/agent/calendar' },

  { label: 'ACCOUNT', isHeader: true },
  { label: 'Settings', icon: Settings, href: '/dashboard/agent/settings' },
];

const seekerNav: NavItem[] = [
  { label: 'OVERVIEW', isHeader: true },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/seeker' },
  { label: 'Search Properties', icon: Search, href: '/dashboard/seeker/search' },
  { label: 'My Properties', icon: Home, href: '/dashboard/seeker/my-properties' },
  { label: 'Messages', icon: MessageSquare, href: '/dashboard/seeker/messages' },
  { label: 'Favorites', icon: Heart, href: '/dashboard/seeker/favorites' },

  { label: 'FINANCIAL', isHeader: true },
  { label: 'Wallet', icon: Wallet, href: '/dashboard/seeker/wallet' },
  { label: 'Transactions', icon: ArrowRightLeft, href: '/dashboard/seeker/transactions' },

  { label: 'ACCOUNT', isHeader: true },
  { label: 'Settings', icon: Settings, href: '/dashboard/seeker/settings' },
];

const developerNav: NavItem[] = [
  { label: 'OVERVIEW', isHeader: true },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/developer' },
  { label: 'My Projects', icon: Building2, href: '/dashboard/developer/projects' },
  { label: 'Messages', icon: MessageSquare, href: '/dashboard/developer/messages' },
  { label: 'Documents', icon: FileText, href: '/dashboard/developer/documents' },

  { label: 'FINANCIAL', isHeader: true },
  { label: 'Wallet', icon: Wallet, href: '/dashboard/developer/wallet' },
  { label: 'Transactions', icon: ArrowRightLeft, href: '/dashboard/developer/transactions' },

  { label: 'TOOLS', isHeader: true },
  { label: 'Calendar', icon: Calendar, href: '/dashboard/developer/calendar' },

  { label: 'ACCOUNT', isHeader: true },
  { label: 'Settings', icon: Settings, href: '/dashboard/developer/settings' },
];

const diasporaNav: NavItem[] = [
  { label: 'OVERVIEW', isHeader: true },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/diaspora' },
  { label: 'Service Catalog', icon: LayoutGrid, href: '/dashboard/diaspora/service-catalog' },
  { label: 'Search Properties', icon: Search, href: '/dashboard/diaspora/search' },
  { label: 'My Properties', icon: Home, href: '/dashboard/diaspora/my-properties' },
  { label: 'Messages', icon: MessageSquare, href: '/dashboard/diaspora/messages' },
  { label: 'Favorites', icon: Heart, href: '/dashboard/diaspora/favorites' },

  { label: 'FINANCIAL', isHeader: true },
  { label: 'Wallet', icon: Wallet, href: '/dashboard/diaspora/wallet' },
  { label: 'Transactions', icon: ArrowRightLeft, href: '/dashboard/diaspora/transactions' },

  { label: 'ACCOUNT', isHeader: true },
  { label: 'Settings', icon: Settings, href: '/dashboard/diaspora/settings' },
];

const landlordNav: NavItem[] = [
  { label: 'OVERVIEW', isHeader: true },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/landlord' },
  { label: 'Properties', icon: Home, href: '/dashboard/landlord/properties' },
  { label: 'Messages', icon: MessageSquare, href: '/dashboard/landlord/messages' },
  { label: 'Documents', icon: FileText, href: '/dashboard/landlord/documents' },

  { label: 'FINANCIAL', isHeader: true },
  { label: 'Wallet', icon: Wallet, href: '/dashboard/landlord/wallet' },
  { label: 'Transactions', icon: ArrowRightLeft, href: '/dashboard/landlord/transactions' },

  { label: 'ACCOUNT', isHeader: true },
  { label: 'Settings', icon: Settings, href: '/dashboard/landlord/settings' },
];

const adminNav: NavItem[] = [
  { label: 'OVERVIEW', isHeader: true },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/admin' },
  { label: 'Users', icon: Users, href: '/dashboard/admin/users' },
  { label: 'Properties', icon: Home, href: '/dashboard/admin/properties' },
  { label: 'Messages', icon: MessageSquare, href: '/dashboard/admin/messages' },

  { label: 'FINANCIAL', isHeader: true },
  { label: 'Transactions', icon: ArrowRightLeft, href: '/dashboard/admin/transactions' },
  { label: 'Finance', icon: Coins, href: '/dashboard/admin/finance' },

  { label: 'ACCOUNT', isHeader: true },
  { label: 'Settings', icon: Settings, href: '/dashboard/admin/settings' },
];

// ── Page title map — used by TopNavBar ────────────────────────────────

export const PAGE_TITLE_MAP: Record<string, string> = {
  '/dashboard/agent': 'Dashboard',
  '/dashboard/agent/properties': 'My Properties',
  '/dashboard/agent/messages': 'Messages',
  '/dashboard/agent/documents': 'Documents',
  '/dashboard/agent/wallet': 'Wallet',
  '/dashboard/agent/transactions': 'Transactions',
  '/dashboard/agent/calendar': 'Calendar',
  '/dashboard/agent/settings': 'Settings',
  '/dashboard/seeker': 'Dashboard',
  '/dashboard/seeker/search': 'Search Properties',
  '/dashboard/seeker/my-properties': 'My Properties',
  '/dashboard/seeker/messages': 'Messages',
  '/dashboard/seeker/favorites': 'Favorites',
  '/dashboard/seeker/wallet': 'Wallet',
  '/dashboard/seeker/transactions': 'Transactions',
  '/dashboard/seeker/settings': 'Settings',
  '/dashboard/diaspora': 'Dashboard',
  '/dashboard/diaspora/service-catalog': 'Service Catalog',
  '/dashboard/diaspora/search': 'Search Properties',
  '/dashboard/diaspora/my-properties': 'My Properties',
  '/dashboard/diaspora/messages': 'Messages',
  '/dashboard/diaspora/favorites': 'Favorites',
  '/dashboard/diaspora/wallet': 'Wallet',
  '/dashboard/diaspora/transactions': 'Transactions',
  '/dashboard/diaspora/settings': 'Settings',
  '/dashboard/developer': 'Dashboard',
  '/dashboard/developer/projects': 'My Projects',
  '/dashboard/developer/messages': 'Messages',
  '/dashboard/developer/documents': 'Documents',
  '/dashboard/developer/wallet': 'Wallet',
  '/dashboard/developer/transactions': 'Transactions',
  '/dashboard/developer/calendar': 'Calendar',
  '/dashboard/developer/settings': 'Settings',
  '/dashboard/admin': 'Dashboard',
  '/dashboard/admin/users': 'Users',
  '/dashboard/admin/properties': 'Properties',
  '/dashboard/admin/messages': 'Messages',
  '/dashboard/admin/transactions': 'Transactions',
  '/dashboard/admin/finance': 'Finance',
  '/dashboard/admin/settings': 'Settings',
  '/dashboard/landlord': 'Dashboard',
  '/dashboard/landlord/properties': 'Properties',
  '/dashboard/landlord/messages': 'Messages',
  '/dashboard/landlord/documents': 'Documents',
  '/dashboard/landlord/wallet': 'Wallet',
  '/dashboard/landlord/transactions': 'Transactions',
  '/dashboard/landlord/settings': 'Settings',
};

export function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case 'Property Seeker': return seekerNav;
    case 'Developer': return developerNav;
    case 'Diaspora': return diasporaNav;
    case 'Landlord': return landlordNav;
    case 'Admin': return adminNav;
    default: return agentNav;
  }
}

/** Resolve a page title from a pathname, matching the longest prefix. */
export function getPageTitle(pathname: string): string {
  // Try exact match first
  if (PAGE_TITLE_MAP[pathname]) return PAGE_TITLE_MAP[pathname];

  // Find longest matching prefix
  const match = Object.keys(PAGE_TITLE_MAP)
    .filter((key) => pathname.startsWith(key) && key !== '/')
    .sort((a, b) => b.length - a.length)[0];

  return match ? PAGE_TITLE_MAP[match] : 'Dashboard';
}

/** Map a role to its dashboard root path. */
export function getDashboardRoot(role: UserRole): string {
  switch (role) {
    case 'Property Seeker': return '/dashboard/seeker';
    case 'Developer': return '/dashboard/developer';
    case 'Diaspora': return '/dashboard/diaspora';
    case 'Landlord': return '/dashboard/landlord';
    case 'Admin': return '/dashboard/admin';
    default: return '/dashboard/agent';
  }
}

/**
 * Derive the active UserRole from the current pathname.
 * This is the source of truth for sidebar nav — avoids stale auth store role.
 */
export function getRoleFromPath(pathname: string): UserRole {
  if (pathname.startsWith('/dashboard/seeker'))    return 'Property Seeker';
  if (pathname.startsWith('/dashboard/developer')) return 'Developer';
  if (pathname.startsWith('/dashboard/diaspora'))  return 'Diaspora';
  if (pathname.startsWith('/dashboard/landlord'))  return 'Landlord';
  if (pathname.startsWith('/dashboard/admin'))     return 'Admin';
  return 'Agent';
}
