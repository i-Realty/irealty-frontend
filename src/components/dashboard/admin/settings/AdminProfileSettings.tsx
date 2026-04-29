'use client';

import React, { useRef } from 'react';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Camera, Loader2, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const FALLBACK_AVATAR = '/images/demo-avatar.jpg';

export default function AdminProfileSettings() {
  const { profile, updateProfile, updateSocials, submitProfileMock, isSaving } = useSettingsStore();
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarSrc = user?.avatarUrl ?? FALLBACK_AVATAR;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    updateUser({ avatarUrl: localUrl });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitProfileMock();
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in slide-in-from-right-4 fade-in duration-300">
       
       <div className="flex flex-col">
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-1">Admin Profile</h2>
          <p className="text-[13px] font-medium text-gray-400">Manage your admin account information</p>
       </div>

       {/* Form Block 1: Personal Info */}
       <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 flex flex-col shadow-sm">
           
           <div className="flex items-center gap-4 mb-8">
               <div
                 className="relative cursor-pointer group"
                 onClick={() => fileInputRef.current?.click()}
               >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <Image
                     src={avatarSrc}
                     alt="Profile"
                     width={80}
                     height={80}
                     className="w-20 h-20 rounded-full border-4 border-white shadow-sm object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                     <Camera className="w-3.5 h-3.5 text-blue-600" />
                  </div>
               </div>
               <div className="flex flex-col">
                  <span className="text-[18px] font-bold text-gray-900">{profile.displayName || 'Admin'}</span>
                  <span className="text-[13px] font-medium text-gray-400 mt-0.5">Platform Administrator</span>
               </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="flex flex-col gap-2">
                 <label className="text-[12px] font-bold text-gray-900 ml-1">First name</label>
                 <input 
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => updateProfile({ firstName: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors"
                 />
              </div>
              <div className="flex flex-col gap-2">
                 <label className="text-[12px] font-bold text-gray-900 ml-1">Last name</label>
                 <input 
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => updateProfile({ lastName: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors"
                 />
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-[12px] font-bold text-gray-900 ml-1">Display name</label>
                 <input 
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => updateProfile({ displayName: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors"
                 />
              </div>
              <div className="flex flex-col gap-2">
                 <label className="text-[12px] font-bold text-gray-900 ml-1">Phone number</label>
                 <div className="flex w-full">
                     <div className="bg-white border border-gray-200 border-r-0 rounded-l-xl px-4 py-3 text-[14px] font-bold text-gray-700 flex items-center shrink-0 cursor-pointer hover:bg-gray-50 transition-colors gap-2">
                        <div className="w-5 h-3.5 bg-green-600 rounded-sm overflow-hidden flex shadow-sm border border-black/10">
                           <div className="w-1/3 h-full bg-white ml-auto mr-auto"></div>
                        </div>
                        {profile.phoneCode}
                        <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                     </div>
                     <input 
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => updateProfile({ phone: e.target.value })}
                        className="flex-1 border border-gray-200 rounded-r-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors w-full"
                     />
                 </div>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                 <label className="text-[12px] font-bold text-gray-900 ml-1">About</label>
                 <textarea 
                    value={profile.about}
                    onChange={(e) => updateProfile({ about: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-4 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300 min-h-[140px] resize-y"
                 />
              </div>
           </div>

           <div className="w-full flex justify-end mt-4">
              <button 
                type="submit"
                disabled={isSaving}
                className="w-full md:w-auto min-w-[140px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-[14px] py-3.5 md:py-2.5 px-6 rounded-xl md:rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                 {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
              </button>
           </div>
       </form>

       {/* Form Block 2: Socials */}
       <div className="flex flex-col mt-4">
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight mb-1">Socials</h2>
          <p className="text-[13px] font-medium text-gray-400 mb-6">Provide links to your social media pages</p>

          <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl md:rounded-[24px] p-6 flex flex-col shadow-sm">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                 <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold text-gray-900 ml-1">LinkedIn</label>
                    <input 
                       type="url"
                       placeholder="Enter URL"
                       value={profile.socials.linkedin}
                       onChange={(e) => updateSocials({ linkedin: e.target.value })}
                       className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                    />
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold text-gray-900 ml-1">Facebook</label>
                    <input 
                       type="url"
                       placeholder="Enter URL"
                       value={profile.socials.facebook}
                       onChange={(e) => updateSocials({ facebook: e.target.value })}
                       className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                    />
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold text-gray-900 ml-1">Instagram</label>
                    <input 
                       type="url"
                       placeholder="Enter URL"
                       value={profile.socials.instagram}
                       onChange={(e) => updateSocials({ instagram: e.target.value })}
                       className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                    />
                 </div>
                 <div className="flex flex-col gap-2">
                    <label className="text-[12px] font-bold text-gray-900 ml-1">Twitter</label>
                    <input 
                       type="url"
                       placeholder="Enter URL"
                       value={profile.socials.twitter}
                       onChange={(e) => updateSocials({ twitter: e.target.value })}
                       className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                    />
                 </div>
             </div>

             <div className="w-full flex justify-end">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full md:w-auto min-w-[140px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-[14px] py-3.5 md:py-2.5 px-6 rounded-xl md:rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                   {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
             </div>
          </form>
       </div>

    </div>
  );
}
