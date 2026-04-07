const en = {
  // Common
  'common.search': 'Search',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.close': 'Close',
  'common.loading': 'Loading...',
  'common.noResults': 'No results found',
  'common.viewAll': 'View All',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.submit': 'Submit',
  'common.confirm': 'Confirm',
  'common.page': 'Page',
  'common.of': 'of',

  // Navigation
  'nav.dashboard': 'Dashboard',
  'nav.properties': 'Properties',
  'nav.myProperties': 'My Properties',
  'nav.messages': 'Messages',
  'nav.documents': 'Documents',
  'nav.wallet': 'Wallet',
  'nav.transactions': 'Transactions',
  'nav.calendar': 'Calendar',
  'nav.settings': 'Settings',
  'nav.favorites': 'Favorites',
  'nav.search': 'Search Properties',

  // Auth
  'auth.login': 'Log in',
  'auth.signup': 'Sign up',
  'auth.logout': 'Log out',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.forgotPassword': 'Forgot password?',
  'auth.resetPassword': 'Reset Password',
  'auth.createAccount': 'Create Account',
  'auth.welcomeBack': 'Welcome back',

  // Listings
  'listings.all': 'All',
  'listings.forSale': 'For Sale',
  'listings.forRent': 'For Rent',
  'listings.searchByLocation': 'Search By Location',
  'listings.filters': 'Filters',
  'listings.resetFilters': 'Reset Filters',
  'listings.priceRange': 'Price Range',
  'listings.propertyType': 'Property Type',
  'listings.amenities': 'Amenities',
  'listings.bedrooms': 'Bedrooms',
  'listings.status': 'Property Status',
  'listings.viewOnMap': 'View On Map',
  'listings.showing': 'Showing',
  'listings.propertiesIn': 'properties in',
  'listings.noProperties': 'No properties found matching your criteria.',
  'listings.compare': 'Compare',
  'listings.saveSearch': 'Save this search',
  'listings.savedSearches': 'Saved Searches',
  'listings.bookTour': 'Book a Tour',
  'listings.reserve': 'Reserve',
  'listings.virtualTour': 'Virtual Tour',

  // Property
  'property.beds': 'beds',
  'property.baths': 'baths',
  'property.price': 'Price',
  'property.location': 'Location',
  'property.area': 'Area',
  'property.agent': 'Agent',
  'property.description': 'Description',
  'property.landmarks': 'Landmarks',

  // Dashboard
  'dashboard.overview': 'Overview',
  'dashboard.totalProperties': 'Total Properties',
  'dashboard.totalTransactions': 'Total Transactions',
  'dashboard.pendingApproval': 'Pending Approval',
  'dashboard.revenue': 'Revenue',
  'dashboard.recentActivity': 'Recent Activity',

  // Settings
  'settings.title': 'Settings',
  'settings.profile': 'Profile',
  'settings.payout': 'Payout',
  'settings.subscription': 'Subscription Plans',
  'settings.commissions': 'Commissions',
  'settings.account': 'Account',
  'settings.helpCenter': 'Help Center',
  'settings.appearance': 'Appearance',
  'settings.language': 'Language',
  'settings.languageDesc': 'Choose your preferred language for i-Realty.',

  // Admin
  'admin.allUsers': 'All Users',
  'admin.approve': 'Approve',
  'admin.reject': 'Reject',
  'admin.flag': 'Flag',
  'admin.suspend': 'Suspend',
  'admin.reactivate': 'Reactivate',
  'admin.exportCsv': 'Export CSV',
  'admin.broadcast': 'Broadcast',
  'admin.selected': 'selected',
  'admin.bulkActions': 'Bulk Actions',

  // Notifications
  'notifications.title': 'Notifications',
  'notifications.markAllRead': 'Mark all as read',
  'notifications.noNew': 'No new notifications',
  'notifications.enable': 'Enable Notifications',
  'notifications.stayUpdated': 'Stay Updated',
  'notifications.enableDesc': 'Get notified about new messages, tour bookings, KYC updates, and payment confirmations.',

  // Offline
  'offline.title': "You're Offline",
  'offline.message': 'Some features may be unavailable.',
  'offline.backOnline': 'Back online',
} as const;

export default en;
export type TranslationKey = keyof typeof en;
