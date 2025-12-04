import { useEffect, useState } from "react";
import EmplStats, { AttendanceCounts } from "./stats";
import {
  Calendar,
  PencilIcon,
  Plus,
  Search,
  Trash2,
  UserCog,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { postApi } from "../../../utils/api";
import { EndPoint } from "../../../utils/endpoints";
import toast from "react-hot-toast";
import { rounded_button } from "../../../utils/csstags";
import type { EmployeeAttendanceRes } from "../../../types/empls";

const th_class: string =
  "text-left p-4 text-sm font-semibold text-white border-r border-slate-200 dark:border-slate-700";
const td: string = "p-4 border-r border-slate-200 dark:border-slate-700 w-sm";
const td_span: string =
  "text-gray-400 dark:text-gray-400 font-medium font-sans";
const parent_div: string =
  "bg-white/80 bg-slate-800 dark:bg-slate-800 rounded-xl backdrop-blur-xl overflow-hidden w-full p-2 mt-5 border border-slate-200/50 dark:border-slate-700/50";

const action_button: string =
  "relative w-full  p-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors";

function Attendance() {
  const [attendance, setAttendance] = useState<EmployeeAttendanceRes[]>([
    {
      pid: "ds",
      name: "Aniket Suryawanshi",
      empl_code: "0001",
      attendance_status: "present",
      attendance_date: "2025-12-12",
      in_time: "11:30 AM",
      out_time: "18:00 PM",
    },
    {
      pid: "ds",
      name: "Aniket Suryawanshi I",
      empl_code: "0001",
      attendance_status: "absent",
      attendance_date: "2025-12-12",
      in_time: "11:30 AM",
      out_time: "18:00 PM",
    },
    {
      pid: "ds",
      name: "Aniket Suryawanshi I",
      empl_code: "0001",
      attendance_status: "Not Logged",
      attendance_date: "2025-12-12",
      in_time: "11:30 AM",
      out_time: "18:00 PM",
    },
  ]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");

  const fecthNextCategory = () => setPage((p) => p + 1);

  const fecthPreviousCategory = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  const deleteMenuItem = async (itemPID: string) => {
    try {
      const res = await postApi(EndPoint.DeleteMenuItems + itemPID);
      if (res.status_code === 200) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      console.log("");
    }
  };

  const generateAttendanceReport = (emplPID: string) => {
    console.log("EMPL_ID : ", emplPID);
  };

  const editAttendance = (attendance: EmployeeAttendanceRes) => {
    navigate("/dashboard/empl/attendance/create", {
      state: { attendance: attendance },
    });
  };

  return (
    <>
      <EmplStats>
        <AttendanceCounts
          title="Total Employees"
          count={123}
          icon={UserCog}
          icon_class="w-6 text-indigo-500 dark:text-indigo-500 text-shadow-emerald-600 dark:text-emerald-800"
        />
        <AttendanceCounts
          title="Present"
          count={73}
          icon={UserRoundCheck}
          icon_class="w-6 text-shadow-emerald-600 dark:text-emerald-800"
        />
        <AttendanceCounts
          title="Absent"
          count={13}
          icon={UserRoundX}
          icon_class="w-6 text-red-500 dark:text-red-500 text-shadow-emerald-600 dark:text-emerald-800"
        />
      </EmplStats>
      <div>
        {attendance.length > 0 ? (
          <div className={parent_div}>
            <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    Attendance
                  </h3>
                </div>
                {/* Search Bar */}
                <div className="flex-1 max-w-md mx-8">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search name or empl code"
                      className="w-full pl-10 pr-20 py-2.5 bg-slate-100 dark:bg-slate-800 border
                      border-slate-200 dark:border-slate-700 rounded-xl text-slate-800
                      dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2
                      focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5
                      bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg
                      transition-colors cursor-pointer"
                    >
                      Search
                    </button>
                  </div>
                </div>
                {/* Date Filter  */}
                <div className="flex items-center gap-4">
                  {/* From Date */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      From
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        onClick={(e) => e.currentTarget.showPicker()}
                        className="pl-2 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border
                        border-slate-200 dark:border-slate-700 rounded-xl text-slate-800
                        dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500
                        focus:border-transparent transition-all cursor-pointer "
                      />
                    </div>
                  </div>

                  {/* To Date */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      To
                    </label>
                    <div className="relative">
                      <div className="relative">
                        <input
                          type="date"
                          onClick={(e) => e.currentTarget.showPicker()}
                          className="pl-2 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border
                          border-slate-200 dark:border-slate-700 rounded-xl text-slate-800
                          dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500
                          focus:border-transparent transition-all cursor-pointer "
                        />
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-medium
                    rounded-xl transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-auto max-h-[calc(600px-80px)]">
              <table className="w-full">
                <thead className="border-b border-slate-300 dark:border-slate-700">
                  <tr>
                    <th className={th_class}>ID</th>
                    <th className={th_class}> Name </th>
                    <th className={th_class}> EmplCode </th>
                    <th className={th_class}> Attendance Date </th>
                    <th className={th_class}> Status </th>
                    <th className={th_class}> In Time </th>
                    <th className={th_class}> Out Time </th>
                    <th className={th_class}> Action </th>
                    <th className={th_class}> Attendance Report </th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((item, index) => (
                    <tr
                      className="cursor-pointer border-b border-slate-200/50 dark:border-slate-700/50
            hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                      key={index}
                    >
                      <td className={td}>
                        <span className={td_span}>{index + 1}</span>
                      </td>
                      <td className={td}>
                        <span className={`${td_span} capitalize`}>
                          {item?.name ? item.name : "NA"}
                        </span>
                      </td>

                      <td className={td}>
                        <span className={td_span}>
                          {item?.empl_code ? item.empl_code : "NA"}
                        </span>
                      </td>
                      <td className={td}>
                        <span className={td_span}>
                          {item?.attendance_date ? item.attendance_date : "NA"}
                        </span>
                      </td>
                      <td className={td}>
                        <span
                          className={`${
                            item?.attendance_status === "present"
                              ? "text-green-600 dark:text-green-600 "
                              : item?.attendance_status === "absent"
                                ? "text-rose-500 dark:text-rose-500"
                                : "text-yellow-500 dark:text-yellow-500"
                          } capitalize ${td_span}`}
                        >
                          {item?.attendance_status
                            ? `${item.attendance_status}`
                            : "NA"}
                        </span>
                      </td>
                      <td className={td}>
                        <span className={td_span}>
                          {item?.in_time ? ` ${item.in_time}` : "0.0"}
                        </span>
                      </td>
                      <td className={td}>
                        <span className={td_span}>
                          {item?.out_time ? `${item.out_time}` : "0.0"}
                        </span>
                      </td>

                      <td className="p-4 border-r border-slate-200 dark:border-slate-700">
                        <div className="flex justify-center">
                          <button
                            className={action_button}
                            onClick={(e) => {
                              e.stopPropagation();
                              editAttendance(item);
                            }}
                          >
                            <span className="flex justify-center cursor-pointer p-3">
                              <PencilIcon className="w-5 h-5 text-green-600" />
                            </span>
                          </button>
                        </div>
                      </td>
                      <td className="p-4 border-r border-slate-200 dark:border-slate-700">
                        <div className="m-3 p-2">
                          <button
                            className={`${rounded_button} cursor-pointer`}
                            onClick={(e) => {
                              e.stopPropagation();
                              generateAttendanceReport(item.pid);
                            }}
                          >
                            <span className="flex  justify-center cursor-pointer">
                              Generate
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end p-1 border-t border-slate-200/50 dark:border-slate-700/50">
              <span className="text-sm text-slate-600 dark:text-slate-300 m-3">
                {page}
              </span>
              <button
                disabled={page === 1}
                onClick={fecthPreviousCategory}
                className="px-4 py-2 m-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-40 cursor-pointer text-white dark:text-white"
              >
                Previous
              </button>

              <button
                onClick={fecthNextCategory}
                className={`${rounded_button} cursor-pointer`}
              >
                Next
              </button>
            </div>
            {showConfirm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                <div className="bg-white p-6 rounded-xl shadow-xl w-80">
                  <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete this item?
                  </p>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        deleteMenuItem(selectedItemId);
                        setShowConfirm(false);
                      }}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={parent_div}>
            <div className="p-3.5">
              <div className="flex items-center justify-between">
                <h1 className="text-white dark:text-white font-semibold">
                  Employee Attendance
                </h1>
              </div>
              <span className="text-sm font-medium dark:text-red-300">
                Data not available
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Attendance;
