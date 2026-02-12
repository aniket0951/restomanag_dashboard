export const BASE_URL = "http://localhost:8080/v1";

const Restaurant = BASE_URL + "/restaurant/";
const Categories = Restaurant + "menu/categories/";
const MenuItems = Restaurant + "menu/item/";
const OwnerLastActivity = BASE_URL + "/activity";
const Tables = Restaurant + "table";
const Empls = Restaurant + "empl";
const Orders = BASE_URL + "/order";

export const EndPoint = {
  CreateOwnerAccount: `${BASE_URL}/owner/`,
  OwnerAccountLogin: `${BASE_URL}/auth/login/owner`,
  CreateOwnerLastActivity: `${OwnerLastActivity}/create`,
  GetOwnerLastActivity: `${OwnerLastActivity}/get`,

  // Restaurant
  CreateRestaurant: `${Restaurant}create`,
  ListRestaurant: `${Restaurant}list`,
  GetRestaurant: `${Restaurant}`,
  UpdateRestaurant: `${Restaurant}update`,

  // Categories
  ListMenuCategoriesByRestaurant: `${Categories}`,
  CreateMenuCategory: `${Categories}create`,
  ListMenuCategoryNameByRestaurant: `${Categories}name/`,
  DeleteCategory: `${Categories}delete/`,
  UpdateCategory: `${Categories}update`,

  // MenuItems
  ListMenuItemsByRestaurant: `${MenuItems}`,
  CreateMenuItems: `${MenuItems}create`,
  DeleteMenuItems: `${MenuItems}delete/`,
  UpdateMenuItems: `${MenuItems}update`,

  // Tables
  ListRestaurantTables: `${Tables}/`,
  DeleteRestaurantTable: `${Tables}/delete/`,
  CreateRestaurantTable: `${Tables}/create`,
  UpdateRestaurantTable: `${Tables}/update`,

  // Employees
  ListEmployeesByRestaurant: `${Empls}/list`,
  DeleteEmpl: `${Empls}/delete/`,
  CreateEmpl: `${Empls}/create`,
  UpdateEmpl: `${Empls}/update`,
  ListEmplByRoleAndResto: `${Empls}/list/role`,

  // Orders
  ListOrdersByRestaurantAndStatus: `${Orders}/list/restaurant`,
  CountActiveOrdersByRestaurantAndStatus: `${Orders}/active/count`,
  GetOrdersFullDetails: `${Orders}/details`,
  AssignOrderToWaiter: `${Orders}/assign`,
  UpdateOrder: `${Orders}/update`,
};
