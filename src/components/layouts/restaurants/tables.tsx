import { useEffect, useState } from "react";
import { getApi, postApi } from "../../../utils/api";
import type { ListRestaurantTablesRes } from "../../../types/restaurant";
import { EndPoint } from "../../../utils/endpoints";
import { rounded_button } from "../../../utils/csstags";
import { Trash2, Plus, PencilIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { unixToString } from "../../../utils/utils";
import { LocalStorageKey } from "../../../utils/constants";
import toast from "react-hot-toast/headless";
import QRCode from "qrcode";
import { restaurantStore } from "../../../store/user_store";

const th_class: string =
  "text-left p-4 text-sm font-semibold text-white border-r border-slate-200 dark:border-slate-700";
const td: string = "p-4 border-r border-slate-200 dark:border-slate-700 w-sm";
const td_span: string =
  "text-gray-400 dark:text-gray-400 font-medium font-sans";
const parent_div: string =
  "bg-white/80 bg-slate-800 dark:bg-slate-800 rounded-xl backdrop-blur-xl overflow-hidden w-full p-2 m-3 border border-slate-200/50 dark:border-slate-700/50";

const action_button: string =
  "relative w-full  rounded-xl text-slate-600 dark:text-slate-300  transition-colors";
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
      {restauranTables.length > 0 ? (
        <div className={parent_div}>
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  Restaurant Tables
                </h3>
              </div>
              <button
                className={`${rounded_button} cursor-pointer`}
                onClick={() => navigate("/dashboard/table/create")}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add New</span>
              </button>
            </div>
          </div>

          <div className="overflow-auto max-h-[calc(600px-80px)]">
            <table className="w-full">
              <thead className="border-b border-slate-300 dark:border-slate-700">
                <tr>
                  <th className={th_class}>ID</th>
                  <th className={th_class}> Table Number </th>
                  <th className={th_class}> Table Capacity </th>
                  <th className={th_class}> Status </th>
                  <th className={th_class}> Created At</th>
                  <th className={th_class}> Action </th>
                  <th className={th_class}> Table QR </th>
                </tr>
              </thead>
              <tbody>
                {restauranTables.map((menu, index) => (
                  <tr
                    className="cursor-pointer border-b border-slate-200/50 dark:border-slate-700/50
          hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                    key={menu.pid}
                  >
                    <td className={td}>
                      <span className={td_span}>{index + 1}</span>
                    </td>
                    <td className={td}>
                      <span className={td_span}>
                        {menu?.number ? `Table_${menu.number}` : "NA"}
                      </span>
                    </td>

                    <td className={td}>
                      <span className={td_span}>
                        {menu?.number ? `${menu.capacity} Person` : "NA"}
                      </span>
                    </td>

                    <td className={td}>
                      <span
                        className={`${
                          menu?.status === "available"
                            ? "text-green-600 dark:text-green-600"
                            : menu?.status === "occupied"
                              ? "text-red-600"
                              : ""
                        } capitalize ${td_span}`}
                      >
                        {menu?.status ? menu.status : "NA"}
                      </span>
                    </td>
                    <td className={td}>
                      <span className={td_span}>
                        {menu?.status ? unixToString(menu.created_at) : "NA"}
                      </span>
                    </td>

                    <td className={td}>
                      <div className="flex">
                        <button
                          className={action_button}
                          onClick={(e) => {
                            e.stopPropagation();
                            editMenuItem(menu);
                          }}
                        >
                          <span className="flex  justify-center cursor-pointer">
                            <PencilIcon className="w-4 h-5 text-green-600" />
                          </span>
                        </button>
                        <button
                          className={action_button}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItemId(menu.pid);
                            setShowConfirm(true);
                          }}
                        >
                          <span className="flex w-10 justify-center cursor-pointer">
                            <Trash2 className="w-4 h-5 text-red-500" />
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className={td}>
                      <button
                        className={`${action_button} cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2`}
                        onClick={() => downloadQR(menu)}
                      >
                        Download
                      </button>
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
        </div>
      ) : (
        <div className={parent_div}>
          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <h1 className="text-white dark:text-white font-semibold">
                Restaurant Tables
              </h1>
              <button
                className={`${rounded_button} cursor-pointer`}
                onClick={() => navigate("/dashboard/table/create")}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add New</span>
              </button>
            </div>
            <span className="text-sm font-medium dark:text-red-300">
              Data not available
            </span>
          </div>
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this table?
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
                  deleteTable(selectedItemId);
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
      {showQRModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">
              Table QR Code
            </h3>
            {selectedTable && (
              <div className="mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Table Number:{" "}
                  <span className="font-semibold">
                    Table_{selectedTable.number}
                  </span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Capacity:{" "}
                  <span className="font-semibold">
                    {selectedTable.capacity} Person
                  </span>
                </p>
              </div>
            )}
            <div className="flex justify-center mb-6 bg-white p-4 rounded-lg">
              <img src={qrCodeData} alt="QR Code" className="w-64 h-64" />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowQRModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleDownloadQR}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
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
