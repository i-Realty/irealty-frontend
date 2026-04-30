'use client';

import { useState } from 'react';
import { User, Home, Users, Globe, Building2, X, Loader2 } from 'lucide-react';
import { useSettingsStore, type AccountRole } from '@/lib/store/useSettingsStore';
import { useEscapeKey } from '@/lib/hooks/useEscapeKey';

export default function AddAccountModal() {
  const { isAddAccountModalOpen, setAddAccountModalOpen, addLinkedAccount, accounts } = useSettingsStore();
  const [selectedRole, setSelectedRole] = useState<AccountRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEscapeKey(() => { if (!loading) setAddAccountModalOpen(false); });

  if (!isAddAccountModalOpen) return null;

  // Roles the user already has — grey them out
  const existingRoles = new Set(accounts.map(a => a.role));

  const roles: { id: AccountRole; icon: typeof User; label: string; description: string }[] = [
    { id: 'Property Seeker', icon: User,      label: 'Property Seeker',    description: 'Buy or rent' },
    { id: 'Landlord',        icon: Home,      label: 'Property Owner',     description: 'Sell or rent out' },
    { id: 'Agent',           icon: Users,     label: 'Real Estate Agent',  description: 'List & manage properties' },
    { id: 'Diaspora',        icon: Globe,     label: 'Diaspora Investor',  description: 'Invest from abroad' },
    { id: 'Developer',       icon: Building2, label: 'Developer',          description: 'Showcase projects and connect with investors.' },
  ];

  const handleCreate = async () => {
     if (!selectedRole || loading) return;
     setLoading(true);
     setError('');
     try {
       await addLinkedAccount(selectedRole);
       setSelectedRole(null);
       setAddAccountModalOpen(false);
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Failed to add account. Please try again.');
     } finally {
       setLoading(false);
     }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-label="Add account">
      <div className="bg-white rounded-[24px] w-full max-w-2xl flex flex-col shadow-xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-end p-4 border-b border-gray-100">
           <button 
             onClick={() => setAddAccountModalOpen(false)}
             className="text-gray-400 hover:text-gray-900 transition-colors p-2"
           >
              <X className="w-5 h-5" />
           </button>
        </div>

        <div className="p-6 md:p-8 pt-2 overflow-y-auto no-scrollbar">
           
           <h2 className="text-[20px] font-bold text-gray-900">How will you use i-Realty?</h2>
           <p className="text-[14px] text-gray-400 font-medium mb-6 mt-1">Select your primary role on the platform</p>

           {error && (
             <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-4">{error}</div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role, idx) => {
                 const isSelected = selectedRole === role.id;
                 const alreadyAdded = existingRoles.has(role.id);
                 const Icon = role.icon;
                 return (
                    <button
                      key={role.id}
                      onClick={() => !alreadyAdded && setSelectedRole(role.id)}
                      disabled={alreadyAdded}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border text-center transition-all ${
                         alreadyAdded
                         ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                         : isSelected
                           ? 'border-blue-500 bg-blue-50/20 shadow-sm'
                           : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50/50'
                      } ${idx === roles.length - 1 ? 'md:col-span-2' : ''}`}
                    >
                       <Icon className={`w-8 h-8 mb-3 ${alreadyAdded ? 'text-gray-300' : isSelected ? 'text-blue-600' : 'text-blue-500'}`} />
                       <span className={`text-[15px] font-bold mb-1 ${alreadyAdded ? 'text-gray-400' : 'text-gray-900'}`}>
                         {role.label}{alreadyAdded ? ' (active)' : ''}
                       </span>
                       <span className="text-[13px] text-gray-400 font-medium">{role.description}</span>
                    </button>
                 );
              })}
           </div>

           <div className="flex justify-end mt-8">
              <button
                onClick={handleCreate}
                disabled={!selectedRole || loading}
                className="w-full md:w-auto min-w-[140px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-blue-400 text-white font-medium text-[14px] py-3.5 px-8 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                 {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : 'Add Account'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
