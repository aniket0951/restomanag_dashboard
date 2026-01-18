export interface ListOrdersByRestaurantAndStatusRes {
  pid: string;
  user_pid: string;
  restaurant_pid: string;
  restaurant_name: string;
  table_no: string;
  table_pid: string;
  total_amount: number;
  status: string;
  created_at: number;
}

export interface CountActiveOrdersByRestaurantAnsStatusRes {
  status: string;
  label: string;
  total_count: number;
  percentage: number;
}

export interface GetOrderFullDetailsRes {
  order_obj: OrderObj;
  customer_details: CustomerDetails;
  waiter_details: WaiterDetails;
}
export interface OrderObj {
  pid: string;
  menu_items: MenuItems[];
  user_pid: string;
  restaurant_pid: string;
  restaurant_name: string;
  table_no: string;
  table_pid: string;
  total_amount: number;
  status: string;
  created_at: number; // unix timestamp
}

export interface MenuItems {
  pid: string;
  menu_name: string;
  menu_item_pid: string;
  category_pid: string;
  quantity: number;
  price: number;
  status: string;
  is_veg: boolean;
}

export interface CustomerDetails {
  pid: string;
  name: string;
  contact_no: string;
}

export interface WaiterDetails {
  waiter_name: string;
  waiter_pid: string;
}
