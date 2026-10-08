import { test, expect } from "bun:test";
import { getRefundStatus } from "./refunds";
test("returns a known refund status", () => { expect(getRefundStatus("rf_1")).toBe("paid"); });
test("returns 'unknown' for a missing refund", () => { expect(getRefundStatus("nope")).toBe("unknown"); });
