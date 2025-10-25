import Link from 'next/link';

 export default function Navbar(){
  return (
    <nav className="fixed w-full  h-20 top-0 bg-white shadow-sm z-50">
      <div className="max-w-[1440px] h-full mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" aria-label="Go to homepage" title="i-Realty Home">
            <img src="/logo.png" alt="i-Realty Logo" width={92} height={40} className="w-auto h-10" />
          </Link>
        </div>

        {/* Navigation Links - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex items-center justify-center space-x-1">
          <NavLink href="/listings?purpose=sale">Buy</NavLink>
          <NavLink href="/listings?purpose=rent">Rent</NavLink>
          <NavLink href="/sell">Sell</NavLink>
          <NavLink href="/rent-out">Rent Out</NavLink>
          <NavLink href="/agent">Agent</NavLink>
          <NavLink href="/listings/developers" isLarge>Developers</NavLink>
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/auth/login" className="flex justify-center items-center px-6 py-3 h-11 border border-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors">
            <span className="text-sm font-bold text-[#2563EB]">Login</span>
          </Link>
          <Link href="/auth/signup" className="flex justify-center items-center px-6 py-3 h-11 bg-[#2563EB] rounded-lg hover:bg-blue-600 transition-colors">
            <span className="text-sm font-bold text-white">Sign up</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

// NavLink component for consistent styling
const NavLink = ({ 
  href, 
  children, 
  isLarge 
}: { 
  href: string; 
  children: React.ReactNode; 
  isLarge?: boolean;
}) => (
  <Link 
    href={href} 
    className={`
      flex items-center justify-center px-4 h-10 rounded-md hover:bg-gray-50 transition-colors
      ${isLarge ? 'text-base' : 'text-sm'} text-gray-900 font-normal
    `}
  >
    {children}
  </Link>
);