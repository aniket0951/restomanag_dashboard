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
}
