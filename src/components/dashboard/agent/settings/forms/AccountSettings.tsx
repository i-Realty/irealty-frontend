import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function AccountSettings() {
  const { security, updatePasswords, updatePins, submitSecurityMock, isSaving } = useSettingsStore();

  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitSecurityMock('password');
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitSecurityMock('pin');
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in slide-in-from-right-4 fade-in duration-300">
       
       <div className="flex flex-col">
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-1">Account</h2>
          <p className="text-[13px] font-medium text-gray-400">Manage your account settings and security</p>
       </div>

       {/* Reset Password Form */}
       <div className="flex flex-col">
          <h3 className="text-[16px] font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Reset password</h3>
          
          <form onSubmit={handlePasswordSubmit} className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 flex flex-col shadow-sm max-w-2xl">
              
              <div className="flex flex-col gap-4 mb-8">
                 <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold text-gray-900 ml-1">Current password</label>
                    <div className="relative">
                       <input 
                          type={showCurrentPwd ? 'text' : 'password'}
                          placeholder=".........."
                          value={security.passwordForm.current}
                          onChange={(e) => updatePasswords({ current: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors tracking-widest placeholder:tracking-normal font-mono"
                       />
                       <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                          {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-[12px] font-bold text-gray-900 ml-1">New password</label>
                       <div className="relative">
                          <input 
                             type={showNewPwd ? 'text' : 'password'}
                             placeholder=".........."
                             value={security.passwordForm.new}
                             onChange={(e) => updatePasswords({ new: e.target.value })}
                             className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors tracking-widest placeholder:tracking-normal font-mono"
                          />
                          <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                             {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                       </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[12px] font-bold text-gray-900 ml-1">Confirm password</label>
                       <div className="relative">
                          <input 
                             type={showConfirmPwd ? 'text' : 'password'}
                             placeholder=".........."
                             value={security.passwordForm.confirm}
                             onChange={(e) => updatePasswords({ confirm: e.target.value })}
                             className={`w-full border rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors tracking-widest placeholder:tracking-normal font-mono ${
                               security.passwordForm.confirm && security.passwordForm.confirm !== security.passwordForm.new 
                               ? 'border-red-300 focus:border-red-500 bg-red-50/20' 
                               : 'border-gray-200'
                             }`}
                          />
                          <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                             {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="w-full flex justify-end">
                 <button 
                   type="submit"
                   disabled={isSaving || !security.passwordForm.current || !security.passwordForm.new}
                   className="w-full md:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-[14px] py-4 md:py-3 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                 >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset Password'}
                 </button>
              </div>
          </form>
       </div>

       {/* Set Transaction Pin Form */}
       <div className="flex flex-col mt-4">
          <h3 className="text-[16px] font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Set transaction pin</h3>
          
          <form onSubmit={handlePinSubmit} className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 flex flex-col shadow-sm max-w-2xl">
              
              <div className="flex flex-col gap-4 mb-8">
                 <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold text-gray-900 ml-1">Current pin</label>
                    <div className="relative">
                       <input 
                          type={showCurrentPin ? 'text' : 'password'}
                          placeholder="...."
                          value={security.pinForm.current}
                          onChange={(e) => updatePins({ current: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors tracking-[0.5em] placeholder:tracking-normal"
                          maxLength={6}
                       />
                       <button type="button" onClick={() => setShowCurrentPin(!showCurrentPin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                          {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-[12px] font-bold text-gray-900 ml-1">New pin</label>
                       <div className="relative">
                          <input 
                             type={showNewPin ? 'text' : 'password'}
                             placeholder="...."
                             value={security.pinForm.new}
                             onChange={(e) => updatePins({ new: e.target.value })}
                             className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors tracking-[0.5em] placeholder:tracking-normal"
                             maxLength={6}
                          />
                          <button type="button" onClick={() => setShowNewPin(!showNewPin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                             {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                       </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-[12px] font-bold text-gray-900 ml-1">Confirm pin</label>
                       <div className="relative">
                          <input 
                             type={showConfirmPin ? 'text' : 'password'}
                             placeholder="...."
                             value={security.pinForm.confirm}
                             onChange={(e) => updatePins({ confirm: e.target.value })}
                             className={`w-full border rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors tracking-[0.5em] placeholder:tracking-normal ${
                               security.pinForm.confirm && security.pinForm.confirm !== security.pinForm.new 
                               ? 'border-red-300 focus:border-red-500 bg-red-50/20' 
                               : 'border-gray-200'
                             }`}
                             maxLength={6}
                          />
                          <button type="button" onClick={() => setShowConfirmPin(!showConfirmPin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                             {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="w-full flex justify-end">
                 <button 
                   type="submit"
                   disabled={isSaving || !security.pinForm.current || !security.pinForm.new}
                   className="w-full md:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-[14px] py-4 md:py-3 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                 >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset Transaction pin'}
                 </button>
              </div>
          </form>
       </div>

    </div>
  );
}
