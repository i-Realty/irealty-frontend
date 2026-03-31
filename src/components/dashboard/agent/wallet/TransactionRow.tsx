import { Transaction } from '@/lib/store/useWalletStore';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function TransactionRow({ transaction }: { transaction: Transaction }) {
  
  const isDeposit = transaction.type === 'Deposit';
  const Icon = isDeposit ? ArrowUpRight : ArrowDownLeft;
  
  // Format currency cleanly
  const formattedAmount = `₦${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 rounded-lg group">
       
       <div className="flex items-center gap-4">
          {/* Icon Badge */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm
             ${isDeposit ? 'bg-green-100/50 text-green-600' : 'bg-blue-100/50 text-blue-600'}
          `}>
             <Icon className="w-5 h-5 stroke-[2.5]" />
          </div>

          <div className="flex flex-col">
             <span className="font-bold text-gray-900 text-[15px]">{transaction.type}</span>
             <span className="text-gray-400 font-medium text-[13px] tracking-tight">{formattedAmount}</span>
          </div>
       </div>

       <div className="flex flex-col items-end gap-1 shrink-0">
          {transaction.status === 'Completed' ? (
             <span className="bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-[5px] text-[11px] tracking-wide border border-emerald-100/50">
               Completed
             </span>
          ) : (
             <span className="bg-[#FFF4eb] text-[#f29f67] font-semibold px-2 py-0.5 rounded-[5px] text-[11px] tracking-wide border border-[#fceddf]">
               Pending
             </span>
          )}
          <span className="text-gray-900 font-medium text-[13px]">{transaction.date}</span>
       </div>

    </div>
  );
}
