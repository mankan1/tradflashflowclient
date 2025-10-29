// src/lib/applyQtyFilters.ts
import type { QtyFilterConfig } from "../components/QtyFilterBar";

/** Expects items with a numeric `qty` field */
export function applyQtyFilters<T extends { qty?: number }>(items: T[], cfg: QtyFilterConfig): T[] {
  const { minQty, multiplesOf } = cfg;
  return items.filter((it) => {
    const q = Number(it.qty ?? NaN);
    if (!Number.isFinite(q)) return false;
    if (q < minQty) return false;
    if (multiplesOf && q % multiplesOf !== 0) return false;
    return true;
  });
}

