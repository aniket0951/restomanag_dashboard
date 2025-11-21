const owner_details_h3: string =
  "text-gray-400 dark:text-gray-400 font-medium font-sans";

const parent_div: string =
  "bg-white/80 dark:bg-slate-800 rounded-xl backdrop-blur-xl overflow-hidden w-full p-2 m-3";

const div_h2: string = "dark:text-white font-black";

function RestaurantFullDetails() {
  return (
    <div className="flex justify-between">
      {/* Owner Details */}
      {/*<div className={parent_div}>
        <div className="p-3.5">
          <h1 className="text-white dark:text-white font-semibold">
            Owner Details
          </h1>
          <div className="p-4">
            <div className="p-2">
              <h2 className={div_h2}>Name</h2>
              <span className={owner_details_h3}>Aniket Suryawanshi</span>
            </div>
            <div className="p-2">
              <h2 className={div_h2}>Email</h2>
              <span className={owner_details_h3}>
                aniketsuryawanshixz1@gmail.com
              </span>
            </div>
            <div className="p-2">
              <h2 className={div_h2}>Contact No</h2>
              <span className={owner_details_h3}>81615165511</span>
            </div>
          </div>
        </div>
      </div>*/}

      {/* Restaurant Details */}
      <div className={parent_div}>
        <div className="p-3.5">
          <h1 className="text-white dark:text-white font-semibold">
            Restaurant Details
          </h1>
          <div className="grid grid-cols-2 gap-4 p-4">
            <div className="p-1">
              <h2 className={div_h2}>Name</h2>
              <span className={owner_details_h3}>Taj Mahala</span>
            </div>
            <div className="p-1">
              <h2 className={div_h2}>Address</h2>
              <span className={owner_details_h3}>
                Somnath Nagar, viman nagar , pune , 414111
              </span>
            </div>
            <div className="p-1">
              <h2 className={div_h2}>Cuisine</h2>
              <span className={owner_details_h3}>
                Italian,French,Mediterranean
              </span>
            </div>
            <div className="p-1">
              <h2 className={div_h2}>Food Type</h2>
              <span className={owner_details_h3}>Veg</span>
            </div>
            <div className="p-1">
              <h2 className={div_h2}>Contact No</h2>
              <span className={owner_details_h3}>8262565514</span>
            </div>
            <div className="p-1 flex justify-baseline">
              <div className="p-2">
                <h2 className={div_h2}>Open Time</h2>
                <span className={owner_details_h3}>12:00 AM</span>
              </div>

              <div className="p-2">
                <h2 className={div_h2}>Close Time</h2>
                <span className={owner_details_h3}>12:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantFullDetails;
