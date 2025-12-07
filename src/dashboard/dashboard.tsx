import ActivityFeed from "./activityfeed";
import Chart from "./chart";
import StatusGrid, { OrderStats, Revenue } from "./stats";
import TableSection from "./tablesection";

function Dashboard() {
  return (
    <div className="space-y-6">
      <StatusGrid>
        <OrderStats value={3744} changes={89} />
        <Revenue value={56748} />
      </StatusGrid>
      <Chart />
      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TableSection />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
