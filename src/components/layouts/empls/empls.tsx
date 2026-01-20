import { useEffect, useState } from "react";
import type { ListEmployeesByRestaurant } from "../../../types/empls";
import { LocalStorageKey } from "../../../utils/constants";
import { EndPoint } from "../../../utils/endpoints";
import { getApi, postApi } from "../../../utils/api";
import {
  Trash2,
  Plus,
  PencilIcon,
  Users,
  Search,
  Mail,
  Phone,
  BadgeCheck,
  Calendar,
  UserCircle,
  ChefHat,
  Coffee,
  ShieldCheck,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { unixToString } from "../../../utils/utils";
import toast from "react-hot-toast/headless";

const getRoleConfig = (role: string) => {
  const lowerRole = role?.toLowerCase() || "";
  if (lowerRole.includes("admin") || lowerRole.includes("manager")) {
    return {
      icon: ShieldCheck,
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/30",
    };
  }
  if (lowerRole.includes("chef") || lowerRole.includes("cook")) {
    return {
      icon: ChefHat,
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/30",
    };
  }
  if (lowerRole.includes("waiter") || lowerRole.includes("server")) {
    return {
      icon: Coffee,
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      border: "border-cyan-500/30",
    };
  }
  return {
    icon: User,
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/30",
  };
};

function Employees() {
  const [empls, setEmpls] = useState<ListEmployeesByRestaurant[]>([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");

  useEffect(() => {
    fecthEmpls();
  }, []);

  const fecthEmpls = async () => {
    try {
      const restaurantID = localStorage.getItem(
        LocalStorageKey.CurrentRestaurant,
      );

      const endpoint =
        EndPoint.ListEmployeesByRestaurant +
        "?pid=" +
        restaurantID +
        "&page=" +
        page;
      const res = await getApi<ListEmployeesByRestaurant[]>(endpoint);
      setEmpls(res.data);
    } catch {
      console.log();
    }
  };

  const fecthNextCategory = () => setPage((p) => p + 1);

  const fecthPreviousCategory = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  const deleteEmpl = async (emplid: string) => {
    try {
      const res = await postApi(EndPoint.DeleteEmpl + emplid);

      if (res.status_code === 200) {
        toast.success(res.message);
        fecthEmpls();
      } else {
        toast.error(res.message);
      }
    } catch {
      console.log();
    }
  };

  const editEmpl = (empl: ListEmployeesByRestaurant) => {
    navigate("/dashboard/empl/create", {
      state: {
        empl: empl,
      },
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Employees</h3>
              <p className="text-xs text-slate-400">
                {empls.length} employees found
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md ml-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200"
            onClick={() => navigate("/dashboard/empl/create")}
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {empls.length > 0 ? (
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
                  <th className="text-left py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {empls.map((empl, index) => {
                  const roleConfig = getRoleConfig(empl.role);
                  const RoleIcon = roleConfig.icon;
                  return (
                    <tr
                      className={`border-b border-white/5 hover:bg-white/5 transition-all duration-200 ${index % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                      key={empl.pid}
                    >
                      <td className="py-4 px-4">
                        <span className="text-slate-500 text-sm">
                          {(page - 1) * 10 + index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <span className="text-white font-semibold text-sm">
                              {empl.name?.charAt(0).toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-100 capitalize">
                              {empl.name || "N/A"}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {empl.pid?.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-sm truncate max-w-[180px]">
                              {empl.email || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-sm">
                              {empl.contact_number || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-slate-200 text-sm font-medium">
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                          {empl.empl_code || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize ${roleConfig.bg} ${roleConfig.text} border ${roleConfig.border}`}
                        >
                          <RoleIcon className="w-3 h-3" />
                          {empl.role || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-sm">
                            {unixToString(empl.joining_date)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              editEmpl(empl);
                            }}
                            title="Edit Employee"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItemId(empl.pid);
                              setShowConfirm(true);
                            }}
                            title="Delete Employee"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                onClick={fecthPreviousCategory}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 rounded-lg text-sm text-slate-300 transition-all duration-200"
              >
                Previous
              </button>
              <button
                onClick={fecthNextCategory}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg text-sm text-white font-medium shadow-lg shadow-blue-500/25 transition-all duration-200"
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
              <Users className="w-10 h-10 text-slate-500" />
            </div>
            <div>
              <p className="text-slate-300 font-medium">No employees found</p>
              <p className="text-sm text-slate-500 mt-1">
                Get started by adding your first employee
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 mt-2"
              onClick={() => navigate("/dashboard/empl/create")}
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative w-full max-w-sm mx-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                Delete Employee
              </h3>
              <p className="text-sm text-slate-400">
                Are you sure you want to delete this employee? This action
                cannot be undone.
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
                  deleteEmpl(selectedItemId);
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
    </div>
  );
}

export default Employees;
