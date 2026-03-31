import { useDocumentsStore } from '@/lib/store/useDocumentsStore';
import { ChevronDown, CalendarIcon, Check } from 'lucide-react';

export default function Step2_DocumentDetails() {
  const { formData, updateFormData, setWizardStep } = useDocumentsStore();

  const handleValidation = () => {
    // Basic validation required to proceed to preview
    if (formData.title && formData.landlordName && formData.tenantName) {
      setWizardStep(3);
    } else {
      alert("Please fill in Document Title, Landlord Name, and Tenant Name at minimum to preview.");
    }
  };

  return (
    <div className="flex flex-col p-6 md:p-10 w-full animate-in slide-in-from-right-4 fade-in duration-300">
      
      <div className="mb-8">
         <h2 className="text-[20px] font-bold text-gray-900 tracking-tight leading-tight mb-2">Document Details</h2>
         <p className="text-[14px] font-medium text-gray-400">Fill in the basic information and customize your Standard Rental Agreement template.</p>
      </div>

      <div className="flex flex-col gap-8">
         
         {/* Basic Information */}
         <div className="border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col gap-5">
            <h3 className="text-[15px] font-bold text-gray-900">Basic Information</h3>
            
            <div className="flex flex-col gap-2">
               <label className="text-[13px] font-medium text-gray-900">Document Title</label>
               <input 
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  placeholder="e.g. Victoria Island Apartment Rental Agreement"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
               />
            </div>

            <div className="flex flex-col gap-2 relative z-20">
               <label className="text-[13px] font-medium text-gray-900">Property Reference</label>
               <div className="relative group">
                  <select 
                    value={formData.propertyReference || ''}
                    onChange={(e) => updateFormData({ propertyReference: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] text-gray-500 appearance-none focus:outline-none focus:border-blue-500 shadow-sm font-medium hover:border-blue-300 transition-colors cursor-pointer"
                  >
                     <option value="">Select</option>
                     <option value="3-Bed Duplex, Lekki">3-Bed Duplex, Lekki</option>
                     <option value="2-Bed Apartment, Yaba">2-Bed Apartment, Yaba</option>
                     <option value="4-Bed Villa, Ikoyi">4-Bed Villa, Ikoyi</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                     <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  {/* Note: The "+ Add Another Property" explicit dropdown mock is abstracted to native select for cross-browser reliability in this step */}
               </div>
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-[13px] font-medium text-gray-900">Document Description</label>
               <textarea 
                  value={formData.description || ''}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  placeholder="e.g. Standard rental agreement for 3-bedroom apartment in Victoria Island, Lagos. Includes standard terms and conditions for residential lease."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300 min-h-[120px] resize-y"
               />
            </div>
         </div>

         {/* Parties Information */}
         <div className="border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col gap-5">
            <h3 className="text-[15px] font-bold text-gray-900 mb-2">Parties Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-gray-900">Landlord/Owner Name</label>
                  <input 
                     type="text"
                     value={formData.landlordName || ''}
                     onChange={(e) => updateFormData({ landlordName: e.target.value })}
                     placeholder="Enter Name"
                     className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                  />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-gray-900">Landlord Contact</label>
                  <div className="flex w-full">
                     <div className="bg-gray-50 border border-gray-200 border-r-0 rounded-l-xl px-4 py-3 text-[14px] font-medium text-gray-400 flex items-center shrink-0">
                        +234
                     </div>
                     <input 
                        type="tel"
                        value={formData.landlordContact || ''}
                        onChange={(e) => updateFormData({ landlordContact: e.target.value })}
                        placeholder="Enter Phone Number"
                        className="flex-1 border border-gray-200 rounded-r-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300 w-full"
                     />
                  </div>
               </div>
               
               <div className="flex flex-col gap-2 mt-2">
                  <label className="text-[13px] font-medium text-gray-900">Tenant Name</label>
                  <input 
                     type="text"
                     value={formData.tenantName || ''}
                     onChange={(e) => updateFormData({ tenantName: e.target.value })}
                     placeholder="Enter Name"
                     className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                  />
               </div>
               <div className="flex flex-col gap-2 mt-2">
                  <label className="text-[13px] font-medium text-gray-900">Tenant Contact</label>
                  <input 
                     type="text"
                     value={formData.tenantContact || ''}
                     onChange={(e) => updateFormData({ tenantContact: e.target.value })}
                     placeholder="Enter Tenant's Email address"
                     className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                  />
               </div>
            </div>
         </div>

         {/* Financial Terms */}
         <div className="border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col gap-5">
            <h3 className="text-[15px] font-bold text-gray-900 mb-2">Financial Terms</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-gray-900">Monthly Rent (₦)</label>
                  <input 
                     type="number"
                     value={formData.monthlyRent || ''}
                     onChange={(e) => updateFormData({ monthlyRent: Number(e.target.value) })}
                     placeholder="250000"
                     className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                  />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-gray-900">Security Deposit (₦)</label>
                  <input 
                     type="number"
                     value={formData.securityDeposit || ''}
                     onChange={(e) => updateFormData({ securityDeposit: Number(e.target.value) })}
                     placeholder="500000"
                     className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                  />
               </div>
               
               <div className="flex flex-col gap-2 mt-2">
                  <label className="text-[13px] font-medium text-gray-900">Agency Fee (₦)</label>
                  <input 
                     type="number"
                     value={formData.agencyFee || ''}
                     onChange={(e) => updateFormData({ agencyFee: Number(e.target.value) })}
                     placeholder="50000"
                     className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                  />
               </div>
               <div className="flex flex-col gap-2 mt-2">
                  <label className="text-[13px] font-medium text-gray-900">Legal Fee (₦)</label>
                  <input 
                     type="number"
                     value={formData.legalFee || ''}
                     onChange={(e) => updateFormData({ legalFee: Number(e.target.value) })}
                     placeholder="25000"
                     className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                  />
               </div>

               <div className="flex flex-col gap-2 mt-2">
                  <label className="text-[13px] font-medium text-gray-900">Lease Duration</label>
                  <div className="relative">
                     <select 
                       value={formData.leaseDuration || ''}
                       onChange={(e) => updateFormData({ leaseDuration: e.target.value })}
                       className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-500 appearance-none focus:outline-none focus:border-blue-500 shadow-sm font-medium hover:border-blue-300 transition-colors cursor-pointer"
                     >
                        <option value="">Select</option>
                        <option value="6 Months">6 Months</option>
                        <option value="1 Year">1 Year</option>
                        <option value="2 Years">2 Years</option>
                        <option value="5 Years">5 Years</option>
                     </select>
                     <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-2 mt-2 relative">
                  <label className="text-[13px] font-medium text-gray-900">Start Date</label>
                  <div className="relative cursor-pointer">
                     <input 
                        type="date"
                        value={formData.startDate || ''}
                        onChange={(e) => updateFormData({ startDate: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-medium text-gray-500 focus:outline-none focus:border-blue-500 shadow-sm transition-colors appearance-none cursor-pointer"
                     />
                     <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 bg-white pl-2">
                        <CalendarIcon className="w-4 h-4" />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Additional Options (Checkboxes) */}
         <div className="border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col gap-4">
            <h3 className="text-[15px] font-bold text-gray-900 mb-2">Additional Options</h3>

            <div className="flex flex-col gap-3">
               {[
                  { key: 'includeUtilities', label: 'Include utilities clause' },
                  { key: 'includePetPolicy', label: 'Include pet policy' },
                  { key: 'addMaintenance', label: 'Add maintenance responsibilities' },
                  { key: 'includeEarlyTermination', label: 'Include early termination clause' },
                  { key: 'addAutoRenewal', label: 'Add automatic renewal option' },
               ].map(({ key, label }) => {
                  const isChecked = !!formData[key as keyof typeof formData];
                  return (
                     <label key={key} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'}`}>
                           {isChecked && <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />}
                        </div>
                        <input 
                           type="checkbox" 
                           className="hidden" 
                           checked={isChecked} 
                           onChange={(e) => updateFormData({ [key]: e.target.checked })}
                        />
                        <span className="text-[14px] font-medium text-gray-900">{label}</span>
                     </label>
                  );
               })}
            </div>
         </div>

         {/* Template Variables */}
         <div className="border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col gap-5">
            <h3 className="text-[15px] font-bold text-gray-900 mb-1">Template Variables</h3>
            <p className="text-[13px] font-medium text-gray-400 mb-3">These fields will automatically populate throughout the document template.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-gray-900">Property Address</label>
                  <input 
                     type="text"
                     value={formData.propertyAddress || ''}
                     onChange={(e) => updateFormData({ propertyAddress: e.target.value })}
                     placeholder="Enter Address"
                     className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                  />
               </div>
               <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-gray-900">Landlord Address</label>
                  <input 
                     type="text"
                     value={formData.landlordAddress || ''}
                     onChange={(e) => updateFormData({ landlordAddress: e.target.value })}
                     placeholder="Enter Address"
                     className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                  />
               </div>
               
               <div className="flex flex-col gap-2 mt-2">
                  <label className="text-[13px] font-medium text-gray-900">Tenant Address</label>
                  <input 
                     type="text"
                     value={formData.tenantAddress || ''}
                     onChange={(e) => updateFormData({ tenantAddress: e.target.value })}
                     placeholder="Enter Address"
                     className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                  />
               </div>
               
               <div className="flex flex-col gap-2 mt-2">
                  <label className="text-[13px] font-medium text-gray-900">Property Type</label>
                  <div className="relative">
                     <select 
                       value={formData.propertyType || ''}
                       onChange={(e) => updateFormData({ propertyType: e.target.value })}
                       className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 appearance-none focus:outline-none focus:border-blue-500 shadow-sm font-medium hover:border-blue-300 transition-colors cursor-pointer"
                     >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                     </select>
                     <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-2 mt-2">
                  <label className="text-[13px] font-medium text-gray-900">Number of Occupants</label>
                  <input 
                     type="number"
                     value={formData.numberOfOccupants || ''}
                     onChange={(e) => updateFormData({ numberOfOccupants: Number(e.target.value) })}
                     placeholder="4"
                     className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium text-gray-900 focus:outline-none focus:border-blue-500 shadow-sm transition-colors placeholder:text-gray-300"
                  />
               </div>

               <div className="flex flex-col gap-2 mt-2 relative">
                  <label className="text-[13px] font-medium text-gray-900">Payment Due Date</label>
                  <div className="relative cursor-pointer">
                     <input 
                        type="date"
                        value={formData.paymentDueDate || ''}
                        onChange={(e) => updateFormData({ paymentDueDate: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-[14px] font-medium text-gray-500 focus:outline-none focus:border-blue-500 shadow-sm transition-colors appearance-none cursor-pointer"
                     />
                     <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 bg-white pl-2">
                        <CalendarIcon className="w-4 h-4" />
                     </div>
                  </div>
               </div>
            </div>
         </div>

      </div>

      <div className="w-full flex justify-end mt-10">
         <button 
           onClick={handleValidation}
           className="w-full md:w-auto min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-medium text-[15px] py-3.5 md:py-3 px-8 rounded-xl md:rounded-lg transition-colors shadow-sm"
         >
            Proceed
         </button>
      </div>
    </div>
  );
}
