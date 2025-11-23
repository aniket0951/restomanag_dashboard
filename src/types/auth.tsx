export interface LoginResponseData {
  user_id: string;
  name: string;
  email: string;
  access_token: string;
}

export interface CreateOwnerAccountResponseData {
  pid: string;
  name: string;
  email: string;
  contact_no: string;
}

export interface CreateOwnerLastActivityRes {
  restaurant_pid: string;
  owner_pid: string;
}
