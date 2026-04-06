'use client';

import { Check } from 'lucide-react';
import { TransactionDetail } from '@/lib/store/useTransactionsStore';

interface TimelineProps {
  transaction: TransactionDetail;
  onAccept: () => void;
  onDecline: () => void;
  onConfirmHandover: () => void;
  isActionLoading: boolean;
}

// ── Step icon logic ────────────────────────────────────────────────────

type StepState = 'completed' | 'active' | 'pending-action' | 'future' | 'declined';

function StepIcon({ state }: { state: StepState }) {
  if (state === 'completed') {
    return (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0 z-10">
        <Check className="w-4 h-4 text-white stroke-[3]" />
      </div>
    );
  }
  if (state === 'active') {
    return (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0 z-10">
        <div className="w-3 h-3 bg-white rotate-45"></div>
      </div>
    );
  }
  if (state === 'pending-action') {
    return (
      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shrink-0 z-10">
        <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
      </div>
    );
  }
  // future or declined
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 z-10">
      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
    </div>
  );
}

function getStepState(
  stepIndex: number,
  currentStep: number,
  status: TransactionDetail['status']
): StepState {
  if (status === 'Declined') return 'declined';
  if (status === 'Completed') return 'completed';
  if (stepIndex < currentStep) return 'completed';
  if (stepIndex === currentStep && status === 'Pending') return 'pending-action';
  if (stepIndex === currentStep) return 'active';
  return 'future';
}

function getConnectorColor(state: StepState): string {
  if (state === 'completed') return 'bg-green-500';
  return 'bg-gray-200';
}

// ── Main Component ─────────────────────────────────────────────────────

export default function TransactionTimeline({
  transaction: tx,
  onAccept,
  onDecline,
  onConfirmHandover,
  isActionLoading,
}: TimelineProps) {
  const isInspection = tx.transactionCategory === 'Inspection Fee';
  const isSale = tx.transactionCategory === 'Sale';

  const inspectionSteps = [
    'Accept /Decline Transaction',
    'Tour Confirmed',
    'Completed',
  ];

  const salesRentalSteps = [
    'Accept /Decline Transaction',
    'Deal In Progress',
    'Awaiting Confirmation',
    'Completed',
  ];

  const steps = isInspection ? inspectionSteps : salesRentalSteps;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Timeline</h3>

      <div className="flex flex-col">
        {steps.map((stepLabel, idx) => {
          const stepNum = idx + 1;
          const state = getStepState(stepNum, tx.currentStep, tx.status);
          const isLast = idx === steps.length - 1;

          return (
            <div key={stepLabel} className="flex gap-4">
              {/* Icon + Connector */}
              <div className="flex flex-col items-center">
                <StepIcon state={state} />
                {!isLast && (
                  <div className={`w-0.5 flex-1 min-h-[24px] ${getConnectorColor(state)}`}></div>
                )}
              </div>

              {/* Content */}
              <div className={`pb-6 flex-1 ${isLast ? 'pb-0' : ''}`}>
                <p className={`font-semibold text-[15px] ${state === 'future' || state === 'declined' ? 'text-gray-400' : 'text-gray-900'}`}>
                  {stepLabel}
                </p>

                {/* Step 1 content: Accept/Decline */}
                {stepNum === 1 && state === 'pending-action' && (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {isInspection ? (
                        <>
                          {tx.clientName} has requested a {tx.inspectionType || 'Video Chat'} property inspection of{' '}
                          <span className="font-medium text-gray-700">{tx.propertyName}</span> and has paid the sum of{' '}
                          <span className="font-medium text-gray-700">₦{tx.amount.toLocaleString()}</span>. The money is in escrow protection
                          which will be released to you once the inspection is completed.
                        </>
                      ) : (
                        <>
                          {tx.clientName} initiated a transaction for the {isSale ? 'purchase' : 'rental'} of{' '}
                          <span className="font-medium text-gray-700">{tx.propertyName}</span> and has paid the sum of{' '}
                          <span className="font-medium text-gray-700">₦{tx.amount.toLocaleString()}</span>. The money is in escrow protection
                          which will be released to you once the transaction is completed.
                        </>
                      )}
                    </p>

                    {isInspection && tx.scheduledDate && (
                      <p className="text-sm text-gray-500">
                        The inspection is scheduled for{' '}
                        <span className="font-medium text-gray-700">
                          {tx.scheduledDate} from {tx.scheduledTime}
                        </span>
                        . Accept or decline to proceed.
                      </p>
                    )}

                    <p className="text-sm text-red-400">
                      Declining or ignoring within 48 hours will trigger an automatic refund to the client.
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={onAccept}
                        disabled={isActionLoading}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={onDecline}
                        disabled={isActionLoading}
                        className="border border-red-300 text-red-500 hover:bg-red-50 font-medium px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2 content: Inspection — Tour Confirmed */}
                {isInspection && stepNum === 2 && state === 'active' && (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      You&apos;ve accepted the inspection.
                    </p>
                    {tx.scheduledDate && (
                      <p className="text-sm text-gray-500">
                        The Tour is scheduled for{' '}
                        <span className="font-medium text-gray-700">{tx.scheduledDate} from {tx.scheduledTime}</span>.
                      </p>
                    )}
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Kindly ensure you attend the inspection. Failure to do so will result in an automatic refund to your client.
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Once the buyer/renter confirms the inspection is completed, the transaction will be marked as Complete
                      and your funds will be released for withdrawal.
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      For your safety and transparency, we recommend taking photos or short videos with your client during
                      inspection or meeting days.
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      These serve as proof of attendance and can be very helpful in resolving any future disputes.
                    </p>
                  </div>
                )}

                {/* Step 2 content: Sales/Rental — Deal In Progress */}
                {!isInspection && stepNum === 2 && state === 'active' && (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm font-semibold text-gray-700">In Progress</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      The transaction is now active. Ensure you upload/upload on the platform all necessary documents / details
                      for your client to review. The funds remain safely held in escrow until the process is completed.
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Confirm Hand Over once you and your client have reached an agreement and they are satisfied with all
                      provided documents.
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Please note: your client will also need to confirm &apos;Hand Over&apos; before the transaction can be marked as
                      Completed and funds released.
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      For your safety and transparency, we recommend taking photos or short videos with your client during
                      inspection or meeting days.
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      These serve as proof of attendance and can be very helpful in resolving any future disputes.
                    </p>
                    <button
                      onClick={onConfirmHandover}
                      disabled={isActionLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 mt-1"
                    >
                      Confirm Handover
                    </button>
                  </div>
                )}

                {/* Step 3 content: Sales/Rental — Awaiting Confirmation */}
                {!isInspection && stepNum === 3 && state === 'active' && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Awaiting your client to confirm that everything is satisfactory before the funds are released to you.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
