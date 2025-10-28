export const fmtTime = (ts: number) => new Date(ts).toLocaleTimeString();
export const fmtUsd = (n: number) =>
  Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
export const fmtQty = (q: number) => Intl.NumberFormat().format(q);
export const fmtOcc = (occ?: string) => (occ ?? "").replace(/([A-Z]+)(\d{6})([CP])(\d{8})/,
  (_, ul, yymmdd, cp, k) => {
    const exp = `20${yymmdd.slice(0,2)}-${yymmdd.slice(2,4)}-${yymmdd.slice(4,6)}`;
    const strike = (Number(k)/1000).toFixed(2);
    return `${ul} ${exp} ${cp==="C"?"CALL":"PUT"} ${strike}`;
  });

