export type RefundStatus = "requested" | "approved" | "paid" | "declined";
export interface Refund { id: string; amountCents: number; status: RefundStatus; }

const REFUNDS: Record<string, Refund> = {
  rf_1: { id: "rf_1", amountCents: 4999, status: "paid" },
  rf_2: { id: "rf_2", amountCents: 1200, status: "requested" },
};

export function getRefund(id: string): Refund | undefined {
  return REFUNDS[id];
}

/** Returns the refund's status, or "unknown" if there is no such refund. */
export function getRefundStatus(id: string): RefundStatus | "unknown" {
  return getRefund(id)?.status ?? "unknown";
}
