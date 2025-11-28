export interface CreateRestaurantRes {
  pid: string;
  name: string;
  address_line1: string;
  state: string;
  city: string;
  pincode: string;
  cuisine: string;
  food_type: string;
}

export interface ListRestaurantsRes {
  pid: string;
  name: string;
  address_line1: string;
  state: string;
  city: string;
  pincode: string;
  cuisine: string;
  food_type: string;
  created_at: number;
}

export interface GetRestaurantRes {
  pid: string;
  name: string;
  address_line1: string;
  state: string;
  city: string;
  pincode: string;
  cuisine: string;
  food_type: string;
  contact_no: string;
  open_time: string;
  close_time: string;
}

export interface ListCategoriesRes {
  pid: string;
  name: string;
  description: string;
  restaurantPID: string;
  created_at: number;
}

export interface CreateCategoryRes {
  pid: string;
  name: string;
  description: string;
  restaurantPID: string;
}

export interface ListMenuItemsRes {
  pid: string;
  name: string;
  description: string;
  price: number;
  is_veg: boolean;
  is_available: boolean;
  preparation_time: number;
  restaurant_pid: string;
  category_pid: string;
  category_name: string;
  created_at: number;
}

export interface CreateMenuItemsRes {
  pid: string;
  name: string;
  description: string;
  price: number;
  is_veg: boolean;
  is_available: boolean;
  preparation_time: number;
  restaurant_pid: string;
}

export interface ListMenuCategoryNameByRestaurantRes {
  name: string;
  pid: string;
}

export interface UpdateMenuItemsRes {
  pid: string;
  name: string;
  description: string;
  price: number;
  is_veg: boolean;
  is_available: boolean;
  preparation_time: number;
  restaurant_pid: string;
  category_pid: string;
  category_name: string;
  created_at: number;
}

export interface ListRestaurantTablesRes {
  pid: string;
  number: string;
  status: string;
  created_at: number;
}

export interface CreateRestaurantTableRes {
  pid: string;
  number: string;
  status: string;
}
