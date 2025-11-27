export const BASE_URL = "http://localhost:8080/v1";

const Restaurant = BASE_URL + "/restaurant/";
const Categories = Restaurant + "menu/categories/";
const MenuItems = Restaurant + "menu/item/";
const OwnerLastActivity = BASE_URL + "/activity";

export const EndPoint = {
  CreateOwnerAccount: `${BASE_URL}/owner/`,
  OwnerAccountLogin: `${BASE_URL}/auth/login/owner`,
  CreateOwnerLastActivity: `${OwnerLastActivity}/create`,

  // Restaurant
  CreateRestaurant: `${Restaurant}create`,
  ListRestaurant: `${Restaurant}list`,
  GetRestaurant: `${Restaurant}`,

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
};
