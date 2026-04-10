/**
 * calculateFees — Platform fee calculator.
 *
 * Reads live platform fee rates from the admin dashboard store and
 * returns a full fee breakdown for any transaction type.
 *
 * Usage:
 *   const { gross, fee, net } = calculateFees(25000, 'inspection');
 */

import { useAdminDashboardStore } from '@/lib/store/useAdminDashboardStore';

export type FeeTransactionType =
  | 'inspection'
  | 'sale'
  | 'rental'
  | 'developer'
  | 'diaspora';

export interface FeeBreakdown {
  gross: number;
  fee: number;
  net: number;
  feeRate: number; // percentage, e.g. 10 for 10%
}

export function calculateFees(amount: number, transactionType: FeeTransactionType): FeeBreakdown {
  const { platformFees } = useAdminDashboardStore.getState();

  const rateMap: Record<FeeTransactionType, number> = {
    inspection: platformFees.inspection,
    sale: platformFees.sale,
    rental: platformFees.rental,
    developer: platformFees.developer,
    diaspora: platformFees.diaspora,
  };

  const feeRate = rateMap[transactionType] ?? 0;
  const fee = Math.round((amount * feeRate) / 100);
  const net = amount - fee;

  return { gross: amount, fee, net, feeRate };
}

/**
 * Pure version for use outside of React (e.g. in store actions) with explicit rates.
 */
export function calculateFeesFromRates(
  amount: number,
  rates: { inspection: number; sale: number; rental: number; developer: number; diaspora: number },
  transactionType: FeeTransactionType
): FeeBreakdown {
  const feeRate = rates[transactionType] ?? 0;
  const fee = Math.round((amount * feeRate) / 100);
  const net = amount - fee;
  return { gross: amount, fee, net, feeRate };
}
