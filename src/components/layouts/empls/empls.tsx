import { useEffect, useState } from "react";
import type { ListEmployeesByRestaurant } from "../../../types/empls";
import { LocalStorageKey } from "../../../utils/constants";
import { EndPoint } from "../../../utils/endpoints";
import { getApi, postApi } from "../../../utils/api";
import { rounded_button } from "../../../utils/csstags";
import { Trash2, Plus, PencilIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { unixToString } from "../../../utils/utils";
import toast from "react-hot-toast/headless";

const th_class: string =
  "text-left p-4 text-sm font-semibold text-white border-r border-slate-200 dark:border-slate-700";
const td: string = "p-4 border-r border-slate-200 dark:border-slate-700 w-sm";
const td_span: string =
  "text-gray-400 dark:text-gray-400 font-medium font-sans";
const parent_div: string =
  "bg-white/80 bg-slate-800 dark:bg-slate-800 rounded-xl backdrop-blur-xl overflow-hidden w-full p-2 m-3 border border-slate-200/50 dark:border-slate-700/50";

const action_button: string =
  "relative w-full p-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors";

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
    <>
      {empls.length > 0 ? (
        <div className={parent_div}>
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  Restaurant Employee
                </h3>
              </div>
              <button
                className={`${rounded_button} cursor-pointer`}
                onClick={() => navigate("/dashboard/empl/create")}
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
                  <th className={th_class}> Name </th>
                  <th className={th_class}> Email </th>
                  <th className={th_class}> Contact No </th>
                  <th className={th_class}> Empl Code </th>
                  <th className={th_class}> Role </th>
                  <th className={th_class}> Joining Date </th>
                  <th className={th_class}> Created At</th>
                  <th className={th_class}> Action </th>
                </tr>
              </thead>
              <tbody>
                {empls.map((empl, index) => (
                  <tr
                    className="cursor-pointer border-b border-slate-200/50 dark:border-slate-700/50
          hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                    key={empl.pid}
                  >
                    <td className={td}>
                      <span className={td_span}>{index + 1}</span>
                    </td>
                    <td className={td}>
                      <span className={`${td_span} capitalize`}>
                        {empl?.name ? empl.name : "NA"}
                      </span>
                    </td>

                    <td className={td}>
                      <span className={td_span}>
                        {empl?.email ? empl.email : "NA"}
                      </span>
                    </td>
                    <td className={td}>
                      <span className={td_span}>
                        {empl?.contact_number ? empl.contact_number : "NA"}
                      </span>
                    </td>
                    <td className={td}>
                      <span className={td_span}>
                        {empl?.empl_code ? `${empl.empl_code}` : "NA"}
                      </span>
                    </td>
                    <td className={td}>
                      <span className={td_span}>
                        {empl?.role ? `${empl.role}` : "0.0"}
                      </span>
                    </td>
                    <td className={td}>
                      <span className={td_span}>
                        {unixToString(empl.joining_date)}
                      </span>
                    </td>

                    <td className={td}>
                      <span className={td_span}>
                        {unixToString(empl.created_at)}
                      </span>
                    </td>
                    <td className={td}>
                      <div className="flex  items-center">
                        <button
                          className={action_button}
                          onClick={(e) => {
                            e.stopPropagation();
                            editEmpl(empl);
                          }}
                        >
                          <span className="flex  justify-center cursor-pointer">
                            <PencilIcon className="w-5 h-5 text-green-600" />
                          </span>
                        </button>
                        <button
                          className={action_button}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItemId(empl.pid);
                            setShowConfirm(true);
                          }}
                        >
                          <span className="flex  justify-center cursor-pointer">
                            <Trash2 className="w-5 h-5 text-red-500" />
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
                      deleteEmpl(selectedItemId);
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
                Restaurant Employee
              </h1>
              <button
                className={`${rounded_button} cursor-pointer`}
                onClick={() => navigate("/dashboard/empl/create")}
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
    </>
  );
}

export default Employees;
