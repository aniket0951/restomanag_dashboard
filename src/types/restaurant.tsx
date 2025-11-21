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
