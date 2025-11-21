import Revenue from "./revenue";
import Sales from "./sales";

function Chart() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <Revenue />
      </div>
      <div className="space-y-6">
        <Sales />
      </div>
    </div>
  );
}

export default Chart;
