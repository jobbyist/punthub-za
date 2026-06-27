// Static reference rates (ZAR base). Replace with live FX feed later.
export const FX: Record<string, number> = {
  ZAR: 1,
  USD: 0.054,
  EUR: 0.050,
  GBP: 0.043,
  BTC: 0.0000008,
  SOL: 0.00029,
  USDC: 0.054,
  PUNT: 1.0,
};

export const SYMBOL: Record<string, string> = {
  ZAR: "R", USD: "$", EUR: "€", GBP: "£", BTC: "₿", SOL: "◎", USDC: "$", PUNT: "Ᵽ",
};

export const formatCurrency = (zar: number, currency = "ZAR") => {
  const v = zar * (FX[currency] ?? 1);
  const decimals = currency === "BTC" ? 6 : currency === "SOL" ? 4 : 2;
  return `${SYMBOL[currency] ?? ""}${v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
};

export const CURRENCY_OPTIONS = ["ZAR", "USD", "EUR", "GBP", "BTC", "SOL", "USDC", "PUNT"] as const;
