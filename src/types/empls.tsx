export interface ListEmployeesByRestaurant {
  pid: string;
  restaurant_pid: string;
  owner_pid: string;
  name: string;
  email: string;
  contact_number: string;
  empl_code: number;
  role: string;
  joining_date: number;
  created_at: number;
}

export interface CreateEmployeeRes {
  pid: string;
  restaurant_pid: string;
  owner_pid: string;
  name: string;
  email: string;
  contact_number: string;
  empl_code: number;
  role: string;
  joining_date: number;
  created_at: number;
}

export interface EmployeeAttendanceRes {
  pid: string;
  name: string;
  empl_code: string;
  attendance_status: string;
  attendance_date: string;
  in_time: string;
  out_time: string;
}
