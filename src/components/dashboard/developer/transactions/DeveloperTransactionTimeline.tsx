'use client';

import { DeveloperTransactionDetail } from '@/lib/store/useDeveloperTransactionsStore';
import { Check, Circle, Upload, Diamond } from 'lucide-react';

interface Props {
  transaction: DeveloperTransactionDetail;
  onAccept: () => void;
  onDecline: () => void;
  onUploadDocs: (milestoneIndex: number) => void;
  isActionLoading: boolean;
}

type StepState = 'completed' | 'active' | 'pending-action' | 'future';

interface TimelineStep {
  label: string;
  percentage?: number;
  state: StepState;
  content?: React.ReactNode;
}

export default function DeveloperTransactionTimeline({
  transaction,
  onAccept,
  onDecline,
  onUploadDocs,
  isActionLoading,
}: Props) {
  const isPending = transaction.status === 'Pending';
  const isDeclined = transaction.status === 'Declined';

  // Build timeline steps
  const steps: TimelineStep[] = [];

  // Step 1: Accept/Decline
  const step1State: StepState = isPending
    ? 'pending-action'
    : isDeclined
    ? 'future'
    : 'completed';

  steps.push({
    label: 'Accept /Decline Transaction',
    state: step1State,
    content:
      step1State === 'pending-action' ? (
        <div className="space-y-3 mt-3">
          <p className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">{transaction.buyerName}</span> has paid the sum of{' '}
            <span className="font-bold text-gray-900">&#8358;{transaction.paidAmount.toLocaleString()}</span> as the initial payment for{' '}
            <span className="font-bold text-gray-900">{transaction.projectName}</span>. The money is in escrow protection which will be released to you once the milestone is completed.
          </p>
          <p className="text-sm text-gray-600">Begin mobilization once you accept the transaction.</p>
          <p className="text-sm text-gray-500 italic">
            Declining or ignoring within 48 hours will trigger an automatic refund to the client.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onAccept}
              disabled={isActionLoading}
              className="bg-green-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Accept
            </button>
            <button
              onClick={onDecline}
              disabled={isActionLoading}
              className="border border-red-200 text-red-600 font-medium py-2.5 px-6 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Decline
            </button>
          </div>
        </div>
      ) : null,
  });

  // Milestone steps (2..N)
  transaction.milestones.forEach((milestone, index) => {
    const milestoneState: StepState =
      milestone.status === 'completed'
        ? 'completed'
        : milestone.status === 'active'
        ? 'active'
        : 'future';

    steps.push({
      label: `${milestone.name} (${milestone.percentage}%)`,
      percentage: milestone.percentage,
      state: milestoneState,
      content:
        milestoneState === 'active' ? (
          <div className="space-y-3 mt-3">
            <p className="text-sm text-gray-600">
              Please Begin mobilization and Upload site photos or inspection proof to trigger buyer approval and fund release.
            </p>
            <button
              onClick={() => onUploadDocs(index)}
              disabled={isActionLoading}
              className="bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Upload Documents
            </button>
          </div>
        ) : null,
    });
  });

  // Final step: Completed
  const allMilestonesDone = transaction.milestones.every((m) => m.status === 'completed');
  steps.push({
    label: 'Completed',
    state: allMilestonesDone ? 'completed' : 'future',
  });

  const getStepIcon = (state: StepState) => {
    switch (state) {
      case 'completed':
        return (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white stroke-[3]" />
          </div>
        );
      case 'active':
        return (
          <div className="w-8 h-8 rounded-md bg-green-500 flex items-center justify-center rotate-45">
            <Diamond className="w-4 h-4 text-white -rotate-45" />
          </div>
        );
      case 'pending-action':
        return (
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <Circle className="w-4 h-4 text-white fill-white" />
          </div>
        );
      case 'future':
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <Circle className="w-3 h-3 text-gray-400" />
          </div>
        );
    }
  };

  const getConnectorColor = (state: StepState) => {
    switch (state) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
      case 'pending-action':
        return 'bg-green-300';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Timeline</h3>

      <div className="relative">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4">
            {/* Icon + Connector */}
            <div className="flex flex-col items-center">
              {getStepIcon(step.state)}
              {index < steps.length - 1 && (
                <div className={`w-[2px] flex-1 min-h-[40px] ${getConnectorColor(step.state)}`} />
              )}
            </div>

            {/* Content */}
            <div className="pb-8 flex-1">
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500 font-medium">{index + 1}</span>
                <span className="text-sm font-bold text-gray-900">{step.label}</span>
              </div>
              {step.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
