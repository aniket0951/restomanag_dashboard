import { useCallback, useEffect, useState } from "react";
import EmplStats, { AttendanceCounts } from "./stats";
import {
  PencilIcon,
  Search,
  UserCog,
  UserRoundCheck,
  UserRoundX,
  Plus,
  Calendar,
  Clock,
  FileText,
  ClipboardList,
  Filter,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { postApi } from "../../../utils/api";
import { EndPoint } from "../../../utils/endpoints";
import toast from "react-hot-toast";
import type { EmployeeAttendanceRes } from "../../../types/empls";

function Attendance() {
  const [attendance, setAttendance] = useState<EmployeeAttendanceRes[]>([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");

  const fetchAttendance = useCallback(async () => {
    try {
      // TODO: Replace with actual API call when endpoint is available
      // const res = await getApi<EmployeeAttendanceRes[]>(
      //   EndPoint.ListAttendance + "?page=" + page
      // );
      // if (res.status_code === 200 && Array.isArray(res.data) && res.data.length > 0) {
      //   setAttendance(res.data);
      // } else {
      //   setAttendance([]);
      // }

      // Mock data - only show on page 1
      if (page === 1) {
        setAttendance([
          {
            pid: "ds1",
            name: "Aniket Suryawanshi",
            empl_code: "0001",
            attendance_status: "present",
            attendance_date: "2025-12-12",
            in_time: "11:30 AM",
            out_time: "18:00 PM",
          },
          {
            pid: "ds2",
            name: "Rahul Kumar",
            empl_code: "0002",
            attendance_status: "absent",
            attendance_date: "2025-12-12",
            in_time: "11:30 AM",
            out_time: "18:00 PM",
          },
          {
            pid: "ds3",
            name: "Priya Sharma",
            empl_code: "0003",
            attendance_status: "Not Logged",
            attendance_date: "2025-12-12",
            in_time: "11:30 AM",
            out_time: "18:00 PM",
          },
        ]);
      } else {
        setAttendance([]);
      }
    } catch (err) {
      console.log("Error fetching attendance: ", err);
      setAttendance([]);
    }
  }, [page]);

  useEffect(() => {
    fetchAttendance();
  }, [page, fetchAttendance]);

  const fetchNextPage = () => setPage((p) => p + 1);

  const fetchPreviousPage = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  const deleteAttendance = async (itemPID: string) => {
    try {
      const res = await postApi(EndPoint.DeleteMenuItems + itemPID);
      if (res.status_code === 200) {
        toast.success(res.message);
        fetchAttendance();
      } else {
        toast.error(res.message);
      }
    } catch {
      console.log("");
    }
  };

  const generateAttendanceReport = (emplPID: string) => {
    console.log("EMPL_ID : ", emplPID);
    toast.success("Report generation started");
  };

  const editAttendance = (attendance: EmployeeAttendanceRes) => {
    navigate("/dashboard/empl/attendance/create", {
      state: { attendance: attendance },
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Present
          </span>
        );
      case "absent":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            Absent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Not Logged
          </span>
        );
    }
  };

  return (
    <>
      <EmplStats>
        <AttendanceCounts
          title="Total Employees"
          count={123}
          icon={UserCog}
          percentage={12}
        />
        <AttendanceCounts
          title="Present"
          count={73}
          icon={UserRoundCheck}
          percentage={59}
        />
        <AttendanceCounts
          title="Absent"
          count={13}
          icon={UserRoundX}
          percentage={-8}
        />
      </EmplStats>

      <div className="mt-6">
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-white/5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Attendance Records</h3>
                  <p className="text-xs text-slate-400">
                    {attendance.length} records found
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="flex-1 max-w-xs">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name or code..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Date Filters */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    onClick={(e) => e.currentTarget.showPicker()}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer [color-scheme:dark]"
                  />
                  <span className="text-slate-500">to</span>
                  <input
                    type="date"
                    onClick={(e) => e.currentTarget.showPicker()}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer [color-scheme:dark]"
                  />
                </div>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-medium rounded-xl transition-all">
                  Apply
                </button>
              </div>

              <button
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200"
                onClick={() => navigate("/dashboard/empl/attendance/create")}
              >
                <Plus className="w-4 h-4" />
                <span>Mark Attendance</span>
              </button>
            </div>
          </div>

          {attendance.length > 0 ? (
            <>
              {/* Table */}
              <div className="overflow-auto max-h-[calc(600px-80px)]">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 sticky top-0">
                    <tr>
                      <th className="text-left py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        #
                      </th>
                      <th className="text-left py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        In Time
                      </th>
                      <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Out Time
                      </th>
                      <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((item, index) => (
                      <tr
                        className={`border-b border-white/5 hover:bg-white/5 transition-all duration-200 ${index % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                        key={item.pid}
                      >
                        <td className="py-4 px-4">
                          <span className="text-slate-500 text-sm">
                            {(page - 1) * 10 + index + 1}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                              <span className="text-emerald-400 font-semibold text-sm">
                                {item.name?.charAt(0).toUpperCase() || "?"}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-100 capitalize">
                                {item.name || "N/A"}
                              </p>
                              <p className="text-xs text-slate-500">
                                Code: {item.empl_code || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-sm">
                              {item.attendance_date || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {getStatusBadge(item.attendance_status)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-sm">
                              {item.in_time || "--:--"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-red-400" />
                            <span className="text-sm">
                              {item.out_time || "--:--"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                editAttendance(item);
                              }}
                              title="Edit Attendance"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                generateAttendanceReport(item.pid);
                              }}
                              title="Generate Report"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItemId(item.pid);
                                setShowConfirm(true);
                              }}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-white/10 bg-white/5">
                <span className="text-sm text-slate-400">
                  Page <span className="font-medium text-slate-200">{page}</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={fetchPreviousPage}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 rounded-lg text-sm text-slate-300 transition-all duration-200"
                  >
                    Previous
                  </button>
                  <button
                    onClick={fetchNextPage}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg text-sm text-white font-medium shadow-lg shadow-emerald-500/25 transition-all duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="py-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                  <ClipboardList className="w-10 h-10 text-slate-500" />
                </div>
                <div>
                  <p className="text-slate-300 font-medium">No attendance records found</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {page > 1
                      ? "No more records on this page"
                      : "Start marking attendance for your employees"}
                  </p>
                </div>
                {page > 1 ? (
                  <button
                    onClick={fetchPreviousPage}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-xl transition-all duration-200 mt-2"
                  >
                    <span>← Go Back</span>
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 mt-2"
                    onClick={() => navigate("/dashboard/empl/attendance/create")}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Mark Attendance</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowConfirm(false)}
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                Delete Attendance Record
              </h3>
              <p className="text-sm text-slate-400">
                Are you sure you want to delete this attendance record? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 p-4 border-t border-white/10 bg-white/5">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteAttendance(selectedItemId);
                  setShowConfirm(false);
                }}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-red-500/25 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Attendance;
