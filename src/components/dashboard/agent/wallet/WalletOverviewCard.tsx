import { useWalletStore } from '@/lib/store/useWalletStore';
import { Plus, ArrowDownLeft, Settings } from 'lucide-react';

export default function WalletOverviewCard() {
  const { walletBalance, escrowBalance, setActiveModal } = useWalletStore();

  const formatCurrency = (val: number) => {
    return `₦${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
       
       <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-8">
          
          <div className="flex-1 bg-gray-50/50 rounded-xl p-8 flex flex-col items-center justify-center">
             <span className="text-gray-400 font-medium text-[15px] mb-2">Wallet Balance</span>
             <h2 className="text-[28px] md:text-[32px] font-bold text-gray-900 tracking-tight">
                {formatCurrency(walletBalance)}
             </h2>
          </div>

          <div className="flex-1 bg-gray-50/50 rounded-xl p-8 flex flex-col items-center justify-center">
             <span className="text-gray-400 font-medium text-[15px] mb-2">Escrow Balance</span>
             <h2 className="text-[28px] md:text-[32px] font-bold text-gray-900 tracking-tight">
                {formatCurrency(escrowBalance)}
             </h2>
          </div>

       </div>

       <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <button 
            onClick={() => setActiveModal('deposit')}
            className="w-full md:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm text-[15px]"
          >
             <Plus className="w-4 h-4" /> Deposit
          </button>

          <button 
            onClick={() => setActiveModal('withdraw')}
            className="w-full md:flex-1 bg-white border border-blue-600 font-medium text-blue-600 hover:bg-blue-50 py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-[15px]"
          >
             <ArrowDownLeft className="w-4 h-4" /> Withdraw
          </button>

          <button 
            onClick={() => console.log('Settings triggered')}
            className="w-full md:flex-1 bg-white border border-gray-200 font-medium text-gray-400 hover:border-gray-300 hover:text-gray-600 py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors text-[15px]"
          >
             <Settings className="w-4 h-4" /> Settings
          </button>
       </div>

    </div>
  );
}
