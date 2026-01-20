import { useEffect, useState } from "react";
import { getApi, postApi } from "../../../utils/api";
import type { ListRestaurantTablesRes } from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import {
  Trash2,
  Plus,
  PencilIcon,
  LayoutGrid,
  Search,
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  QrCode,
  Download,
  Hash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { unixToString } from "../../../utils/utils";
import { LocalStorageKey } from "../../../utils/constants";
import toast from "react-hot-toast/headless";
import QRCode from "qrcode";
import { restaurantStore } from "../../../store/user_store";

const getStatusConfig = (status: string) => {
  const lowerStatus = status?.toLowerCase() || "";
  if (lowerStatus === "available") {
    return {
      icon: CheckCircle,
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
    };
  }
  if (lowerStatus === "occupied") {
    return {
      icon: XCircle,
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/30",
    };
  }
  return {
    icon: CheckCircle,
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/30",
  };
};
type Params = {
  restaurantID: string | null;
};
function Tables({ restaurantID }: Params) {
  const [restauranTables, setRestauranTables] = useState<
    ListRestaurantTablesRes[]
  >([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const [selectedTable, setSelectedTable] =
    useState<ListRestaurantTablesRes | null>(null);
  const restoStore = restaurantStore((state) => state.restaurant);
  const fecthNextCategory = () => setPage((p) => p + 1);

  const fecthPreviousCategory = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  useEffect(() => {
    fetchRestaurantTables();
  }, [page]);

  const fetchRestaurantTables = async () => {
    try {
      let restaurant_pid: string = "";

      if (
        restaurantID != "" &&
        restaurantID != null &&
        restaurantID != undefined
      ) {
        restaurant_pid = restaurantID;
      } else {
        restaurant_pid =
          localStorage.getItem(LocalStorageKey.CurrentRestaurant) ?? "";
      }
      const res = await getApi<ListRestaurantTablesRes[]>(
        EndPoint.ListRestaurantTables + restaurant_pid,
      );
      setRestauranTables(res.data);
    } catch {
      console.log();
    }
  };

  const editMenuItem = async (currentTable: ListRestaurantTablesRes) => {
    navigate("/dashboard/table/create", {
      state: { currentTable: currentTable },
    });
  };

  const deleteTable = async (tableID: string) => {
    try {
      const res = await postApi(EndPoint.DeleteRestaurantTable + tableID);
      if (res.status_code == 200) {
        toast.success(res.message);
        fetchRestaurantTables();
      } else {
        toast.error(res.message);
      }
    } catch {
      console.log();
    }
  };

  const downloadQR = async (table: ListRestaurantTablesRes) => {
    try {
      const qrData = JSON.stringify({
        tableId: table.pid,
        tableNumber: table.number,
        capacity: table.capacity,
        restaurantName: restoStore?.name ? restoStore?.name : "NA",
        restaurantPID: restoStore?.id ? restoStore?.id : "NA",
      });

      const qrDataURL = await QRCode.toDataURL(qrData, {
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrCodeData(qrDataURL);
      setSelectedTable(table);
      setShowQRModal(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeData || !selectedTable) return;

    const link = document.createElement("a");
    link.href = qrCodeData;
    link.download = `Table_${selectedTable.number}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("QR Code downloaded successfully");
    setShowQRModal(false);
  };

  return (
    <>
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Restaurant Tables</h3>
              <p className="text-xs text-slate-400">
                {restauranTables.length} tables found
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md ml-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tables..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
              />
            </div>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200"
            onClick={() => navigate("/dashboard/table/create")}
          >
            <Plus className="w-4 h-4" />
            <span>Add Table</span>
          </button>
        </div>
      </div>

      {restauranTables.length > 0 ? (
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
                    Table
                  </th>
                  <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="text-center py-4 px-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    QR Code
                  </th>
                </tr>
              </thead>
              <tbody>
                {restauranTables.map((table, index) => {
                  const statusConfig = getStatusConfig(table.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr
                      className={`border-b border-white/5 hover:bg-white/5 transition-all duration-200 ${index % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                      key={table.pid}
                    >
                      <td className="py-4 px-4">
                        <span className="text-slate-500 text-sm">
                          {(page - 1) * 10 + index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                            <Hash className="w-5 h-5 text-teal-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-100">
                              Table {table.number}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {table.pid?.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-slate-200 text-sm font-medium">
                          <Users className="w-3.5 h-3.5 text-cyan-400" />
                          {table.capacity} Person
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {table.status || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-sm">
                            {unixToString(table.created_at)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              editMenuItem(table);
                            }}
                            title="Edit Table"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItemId(table.pid);
                              setShowConfirm(true);
                            }}
                            title="Delete Table"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-400 hover:from-violet-500/30 hover:to-purple-500/30 border border-violet-500/30 text-xs font-medium transition-all duration-200"
                          onClick={() => downloadQR(table)}
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          Generate
                        </button>
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
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 rounded-lg text-sm text-white font-medium shadow-lg shadow-teal-500/25 transition-all duration-200"
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
              <LayoutGrid className="w-10 h-10 text-slate-500" />
            </div>
            <div>
              <p className="text-slate-300 font-medium">No tables found</p>
              <p className="text-sm text-slate-500 mt-1">
                Get started by adding your first table
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200 mt-2"
              onClick={() => navigate("/dashboard/table/create")}
            >
              <Plus className="w-4 h-4" />
              <span>Add Table</span>
            </button>
          </div>
        </div>
      )}
      </div>

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
                Delete Table
              </h3>
              <p className="text-sm text-slate-400">
                Are you sure you want to delete this table? This action cannot
                be undone.
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
                  deleteTable(selectedItemId);
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

      {/* QR Code Modal */}
      {showQRModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowQRModal(false)}
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">
                    Table QR Code
                  </h3>
                  {selectedTable && (
                    <p className="text-xs text-slate-400">
                      Table {selectedTable.number} • {selectedTable.capacity}{" "}
                      Person
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl mb-4">
                <img
                  src={qrCodeData}
                  alt="QR Code"
                  className="w-full h-auto"
                />
              </div>

              {selectedTable && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Table Number</p>
                    <p className="text-sm font-medium text-slate-200">
                      Table {selectedTable.number}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Capacity</p>
                    <p className="text-sm font-medium text-slate-200">
                      {selectedTable.capacity} Person
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 p-4 border-t border-white/10 bg-white/5">
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-medium rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadQR}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-violet-500/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Tables;
