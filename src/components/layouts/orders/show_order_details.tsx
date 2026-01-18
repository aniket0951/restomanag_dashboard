import type { GetOrderFullDetailsRes } from "../../../types/orders";
import { form_class } from "../../../utils/csstags";

function ShowOrderDetails({ order }: { order: GetOrderFullDetailsRes }) {
  return <div className={`${form_class} w-4 h-5`}></div>;
}

export default ShowOrderDetails;
