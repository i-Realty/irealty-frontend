'use client';

import { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { SeekerTransactionDetail } from '@/lib/store/useSeekerTransactionsStore';

interface Props {
  transaction: SeekerTransactionDetail;
  onConfirmInspection: () => void;
  onConfirmHandover: () => void;
  onApproveMilestone: () => void;
  onMakePayment: () => void;
  onSubmitReview: (rating: number, comment: string) => void;
  isActionLoading: boolean;
}

type StepState = 'completed' | 'active' | 'future';

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
        <div className="w-3 h-3 bg-white rotate-45" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 z-10">
      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
    </div>
  );
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-colors"
        >
          <Star
            className={`w-6 h-6 ${(hovered || value) >= n ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function SeekerTransactionTimeline({
  transaction: tx,
  onConfirmInspection,
  onConfirmHandover,
  onApproveMilestone,
  onMakePayment,
  onSubmitReview,
  isActionLoading,
}: Props) {
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const { flow, currentStep, status } = tx;

  // ── Build steps list ──────────────────────────────────────────────

  type Step = { label: string };
  let steps: Step[] = [];

  if (flow === 'inspection') {
    steps = [
      { label: 'Awaiting Approval' },
      { label: 'Tour Confirmed' },
      { label: 'Completed' },
      { label: 'Feedback/Reviews' },
    ];
  } else if (flow === 'agent-rental' || flow === 'agent-sale') {
    steps = [
      { label: 'Awaiting Approval' },
      { label: 'Offer Accepted / Deal In Progress' },
      { label: 'Completed' },
      { label: 'Feedback/Reviews' },
    ];
  } else {
    // developer-purchase
    const milestones = tx.developerMilestones ?? [];
    steps = [
      { label: 'Awaiting Approval' },
      ...milestones.map((m) => ({ label: `${m.stage} (${m.percentage}%)` })),
      { label: 'Completed' },
    ];
  }

  const getState = (stepIdx: number): StepState => {
    if (status === 'Completed') return 'completed';
    if (stepIdx < currentStep) return 'completed';
    if (stepIdx === currentStep) return 'active';
    return 'future';
  };

  const isLast = (idx: number) => idx === steps.length - 1;

  // ── Render ────────────────────────────────────────────────────────

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Timeline</h3>

      <div className="flex flex-col">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const state = getState(stepNum);
          const connectorColor = state === 'completed' ? 'bg-green-500' : 'bg-gray-200';

          return (
            <div key={step.label} className="flex gap-4">
              {/* Icon + connector */}
              <div className="flex flex-col items-center">
                <StepIcon state={state} />
                {!isLast(idx) && (
                  <div className={`w-0.5 flex-1 min-h-[24px] ${connectorColor}`} />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 ${!isLast(idx) ? 'pb-6' : 'pb-0'}`}>
                <p className={`font-semibold text-[15px] ${state === 'future' ? 'text-gray-400' : 'text-gray-900'}`}>
                  {step.label}
                </p>

                {/* Step 1 — Awaiting Approval */}
                {stepNum === 1 && state === 'active' && (
                  <div className="mt-3 space-y-2 text-sm text-gray-500 leading-relaxed">
                    {flow === 'inspection' ? (
                      <>
                        <p>
                          You&apos;ve requested{tx.inspectionType ? ` a ${tx.inspectionType}` : ''} property inspection of{' '}
                          <span className="font-medium text-gray-700">{tx.propertyName}</span> and has paid the sum of{' '}
                          <span className="font-medium text-gray-700">₦{tx.amount.toLocaleString()}</span>. The money is in escrow
                          protection which will be released to the agent once the inspection is completed.
                        </p>
                        <p>Waiting for agent to accept/confirm tour.</p>
                        <p className="text-amber-600">
                          If Declined or Not Accepted within 48 hours: Your inspection fee is automatically refunded from escrow.
                        </p>
                      </>
                    ) : flow === 'developer-purchase' ? (
                      <>
                        <p>
                          You&apos;ve requested an initial deposit of the paid the sum of{' '}
                          <span className="font-medium text-gray-700">₦{tx.amount.toLocaleString()}</span> for{' '}
                          <span className="font-medium text-gray-700">{tx.propertyName}</span>. The money is in escrow
                          protection which will be released to the developer once the milestone is completed.
                        </p>
                        <p className="text-amber-600">
                          If Declined or Not Accepted within 48 hours: Your inspection fee is automatically refunded from escrow.
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          You&apos;ve paid the sum of{' '}
                          <span className="font-medium text-gray-700">₦{tx.amount.toLocaleString()}</span> for the{' '}
                          {flow === 'agent-rental' ? 'rental' : 'purchase'} of{' '}
                          <span className="font-medium text-gray-700">{tx.propertyName}</span>. Waiting for the agent/landlord
                          to accept your offer or reservation. No worries—your money is safe in escrow during this stage.
                        </p>
                        <p>You&apos;ll be notified once they respond.</p>
                        <p className="text-amber-600">
                          If they decline—or fail to respond within 24–48 hours—your money will be automatically refunded to you.
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* Inspection Step 2 — Tour Confirmed */}
                {flow === 'inspection' && stepNum === 2 && state === 'active' && (
                  <div className="mt-3 space-y-2 text-sm text-gray-500 leading-relaxed">
                    <p>Inspection has been approved by the agent.</p>
                    {tx.scheduledDate && (
                      <p>
                        The inspection is scheduled for{' '}
                        <span className="font-medium text-gray-700">{tx.scheduledDate} from {tx.scheduledTime}</span>.
                        Kindly ensure you attend the inspection. Failure to do so will result in an automatic release of funds to your agent.
                      </p>
                    )}
                    <p>
                      After your inspection, please confirm it as completed. Once you do, the transaction will be marked as complete
                      and your payment will be securely released to the agent or landlord.
                    </p>
                    <p>
                      If you do not confirm your inspection attendance within 24–48 hours, and the agent submits valid proof of
                      attendance, the system may proceed using the agent&apos;s confirmation. In this case, the inspection fee may be
                      released to the agent as compensation for their time.
                    </p>
                    <p>To avoid disputes or loss of your inspection fee, please ensure you confirm attendance promptly after your inspection.</p>
                    <button
                      onClick={onConfirmInspection}
                      disabled={isActionLoading}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                    >
                      Confirm Inspection
                    </button>
                  </div>
                )}

                {/* Agent Sale/Rental Step 2 — Deal In Progress */}
                {(flow === 'agent-rental' || flow === 'agent-sale') && stepNum === 2 && state === 'active' && (
                  <div className="mt-3 space-y-2 text-sm text-gray-500 leading-relaxed">
                    <p className="font-semibold text-gray-700">Great news! Your offer has been accepted. The transaction is now in progress.</p>
                    <p>
                      The agent/landlord will be uploading property documents for your review. Please take time to verify
                      everything before proceeding.
                    </p>
                    <p>We always encourage open communication directly with the agent through the platform.</p>
                    <p>
                      Once you confirm the documents are valid, Confirm &quot;Hand Over&quot; so the funds can be released to the
                      agent/Landlord.
                    </p>
                    <p>
                      If you have concerns, raise a dispute directly from this stage by{' '}
                      <span className="text-blue-600 cursor-pointer underline">Clicking here</span> or by reporting this transaction.
                    </p>
                    <button
                      onClick={onConfirmHandover}
                      disabled={isActionLoading}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                    >
                      Confirm Hand Over
                    </button>
                  </div>
                )}

                {/* Developer milestone steps (2..4) */}
                {flow === 'developer-purchase' && stepNum > 1 && stepNum < steps.length && state === 'active' && (() => {
                  const milestoneIdx = stepNum - 2;
                  const milestone = tx.developerMilestones?.[milestoneIdx];
                  const needsPayment = milestoneIdx > 0; // First milestone = approve, subsequent = pay then approve
                  return (
                    <div className="mt-3 space-y-2 text-sm text-gray-500 leading-relaxed">
                      <p>Review the uploaded site inspection proof before releasing the next stage payment.</p>
                      <div className="flex gap-3 mt-2 flex-wrap">
                        <button
                          onClick={onApproveMilestone}
                          disabled={isActionLoading}
                          className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                          Review Document
                        </button>
                        {needsPayment && milestone ? (
                          <button
                            onClick={onMakePayment}
                            disabled={isActionLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                          >
                            Make Payment (₦{(milestone.amount / 1_000_000).toFixed(1)}M)
                          </button>
                        ) : (
                          <button
                            onClick={onApproveMilestone}
                            disabled={isActionLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                          >
                            Approve Milestone
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Feedback/Reviews — last step for inspection / agent flows */}
                {(flow === 'inspection' || flow === 'agent-rental' || flow === 'agent-sale') &&
                  stepNum === steps.length && state === 'active' && (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-gray-500">Please tell us about your experience and rate the services of the agent</p>
                    <StarRating value={reviewRating} onChange={setReviewRating} />
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Give a comment..."
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-gray-300"
                    />
                    <button
                      onClick={() => onSubmitReview(reviewRating, reviewComment)}
                      disabled={isActionLoading || reviewRating === 0}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                    >
                      Submit
                    </button>
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
