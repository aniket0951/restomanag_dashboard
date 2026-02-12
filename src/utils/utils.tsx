export const unixToString = (unixValue: number) => {
  const date = new Date(unixValue * 1000);
  return date.toISOString().split("T")[0];
};

export function formatOrderId(orderId?: string): string {
  if (!orderId || orderId.length < 6) {
    return "ORD_";
  }

  return `ORD_${orderId.slice(-6).toUpperCase()}`;
}
