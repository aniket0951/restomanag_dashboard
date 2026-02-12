export const LocalStorageKey = {
  CurrentRestaurant: "current_resto",
} as const;

export const EmplRoles = {
  Waiter: "waiter",
  Chef: "chef",
  Other: "other",
} as const;

export const OrderStatus = {
  Preparing: "preparing",
  Pending: "pending",
  Completed: "completed",
  Cancelled: "cancelled",
  Ready: "ready",
  Served: "served",
} as const;
