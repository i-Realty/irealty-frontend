import { useDocumentsStore } from '@/lib/store/useDocumentsStore';
import { Loader2 } from 'lucide-react';

export default function Step3_ReviewCreate() {
  const { formData, isSubmitting, error, createDocumentMock } = useDocumentsStore();

  const handleCreate = async () => {
    await createDocumentMock();
  };

  const formatCurrency = (val?: number) => {
    if (!val) return '₦0';
    return `₦${val.toLocaleString('en-US')}`;
  };

  // Fallbacks for display
  const startDate = formData.startDate || '[START_DATE]';
  const landlordName = formData.landlordName || '[LANDLORD_NAME]';
  const tenantName = formData.tenantName || '[TENANT_NAME]';

  return (
    <div className="flex flex-col p-6 md:p-10 w-full animate-in slide-in-from-right-4 fade-in duration-300">
      
      <div className="mb-8">
         <h2 className="text-[20px] font-bold text-gray-900 tracking-tight leading-tight mb-2">Review & Create Document</h2>
         <p className="text-[14px] font-medium text-gray-400">Review your document before creating. You can make changes to any section if needed.</p>
         {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
         )}
      </div>

      {/* Contract Visual Preview Frame */}
      <div className="w-full bg-white border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl py-10 px-6 md:px-12 mb-8">
         
         <div className="text-center mb-10 pb-6 border-b border-gray-100">
            <h1 className="text-[18px] md:text-[20px] font-bold text-gray-900 mb-2 uppercase tracking-wide">Residential Lease Agreement</h1>
            <p className="text-[14px] text-gray-400 font-medium">{formData.title || 'Victoria Island Apartment Rental Agreement'}</p>
         </div>

         <div className="flex flex-col gap-8 text-[14px] text-gray-600 leading-relaxed font-medium">
            
            <p>
               <span className="font-bold text-gray-800">This Lease Agreement</span> is entered into on <span className="text-gray-900 font-bold bg-gray-50 px-1 rounded">{startDate}</span> between:
            </p>

            <div className="flex flex-col gap-2">
               <p><span className="font-bold text-gray-900">LANDLORD:</span> {landlordName}</p>
               <p><span className="text-gray-500">Address:</span> {formData.landlordAddress || 'Ikoyi, Lagos'}</p>
               <p><span className="text-gray-500">Contact:</span> {formData.landlordContact || '+234 802 123 4567'}</p>
            </div>

            <div className="flex flex-col gap-2">
               <p><span className="font-bold text-gray-900">TENANT:</span> {tenantName}</p>
               <p><span className="text-gray-500">Address:</span> {formData.tenantAddress || 'Surulere, Lagos'}</p>
               <p><span className="text-gray-500">Contact:</span> {formData.tenantContact || 'john.doe@email.com'}</p>
            </div>

            <div className="flex flex-col gap-2 mt-4">
               <p className="font-bold text-gray-900 uppercase text-[12px] tracking-widest mb-1">Property Description:</p>
               <p>{formData.description || 'The leased premises consists of a 3-Bedroom Apartment located at Block 15, Victoria Island, Lagos.'}</p>
            </div>

            <div className="flex flex-col gap-3 mt-4">
               <p className="font-bold text-gray-900 uppercase text-[12px] tracking-widest mb-1">Lease Terms:</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                     <span className="text-gray-500">Monthly Rent:</span>
                     <span className="font-bold text-gray-900">{formatCurrency(formData.monthlyRent)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                     <span className="text-gray-500">Security Deposit:</span>
                     <span className="font-bold text-gray-900">{formatCurrency(formData.securityDeposit)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                     <span className="text-gray-500">Agency Fee:</span>
                     <span className="font-bold text-gray-900">{formatCurrency(formData.agencyFee)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                     <span className="text-gray-500">Legal Fee:</span>
                     <span className="font-bold text-gray-900">{formatCurrency(formData.legalFee)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                     <span className="text-gray-500">Lease Duration:</span>
                     <span className="font-bold text-gray-900">{formData.leaseDuration || '1 year'}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                     <span className="text-gray-500">Max. Occupants:</span>
                     <span className="font-bold text-gray-900">{formData.numberOfOccupants || '4'} persons</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-50 pb-2 md:col-span-2">
                     <span className="text-gray-500">Rent Due Date:</span>
                     <span className="font-bold text-gray-900">1st of each month</span>
                  </div>
               </div>
            </div>

            {formData.includeUtilities && (
               <div className="flex flex-col gap-1 mt-4">
                  <p className="font-bold text-gray-900 uppercase text-[12px] tracking-widest">Utilities & Maintenance:</p>
                  <p>The tenant shall be responsible for all utilities including electricity, water, and internet services.</p>
               </div>
            )}

            {formData.includePetPolicy && (
               <div className="flex flex-col gap-1 mt-4">
                  <p className="font-bold text-gray-900 uppercase text-[12px] tracking-widest">Pet Policy:</p>
                  <p>Pets are subject to landlord approval and additional security deposit.</p>
               </div>
            )}

            {formData.includeEarlyTermination && (
               <div className="flex flex-col gap-1 mt-4">
                  <p className="font-bold text-gray-900 uppercase text-[12px] tracking-widest">Early Termination:</p>
                  <p>Either party may terminate this lease with 30 days written notice.</p>
               </div>
            )}

            <div className="flex flex-col gap-8 mt-12 pt-8 border-t border-gray-100">
               <p className="font-medium text-gray-400 uppercase text-[12px] tracking-widest">Signatures:</p>
               
               <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-8">
                  <div className="flex flex-col flex-1">
                     <div className="border-b-2 border-gray-300 w-full mb-3"></div>
                     <p className="text-[13px] font-bold text-gray-600 text-center">Landlord Signature & Date</p>
                  </div>
                  <div className="flex flex-col flex-1">
                     <div className="border-b-2 border-gray-300 w-full mb-3"></div>
                     <p className="text-[13px] font-bold text-gray-600 text-center">Tenant Signature & Date</p>
                  </div>
               </div>
            </div>

         </div>

      </div>

      <div className="w-full flex justify-end mt-4">
         <button 
           onClick={handleCreate}
           disabled={isSubmitting}
           className="w-full md:w-auto min-w-[180px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[15px] py-4 md:py-3.5 px-8 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
         >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Document'}
         </button>
      </div>
    </div>
  );
}
