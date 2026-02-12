import { useState, useRef, useEffect } from "react";
import { TrendingUp, BarChart3, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";

type DateRange = {
  from: Date | null;
  to: Date | null;
};

function Revenue() {
  // Sample data for visual representation
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const values = [65, 45, 75, 50, 85, 60, 90];
  const maxValue = Math.max(...values);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
  const [appliedDateRange, setAppliedDateRange] = useState<DateRange>({ from: null, to: null });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingFrom, setSelectingFrom] = useState(true);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    if (selectingFrom) {
      setDateRange({ from: selectedDate, to: null });
      setSelectingFrom(false);
    } else {
      if (dateRange.from && selectedDate < dateRange.from) {
        setDateRange({ from: selectedDate, to: dateRange.from });
      } else {
        setDateRange({ ...dateRange, to: selectedDate });
      }
      setSelectingFrom(true);
    }
  };

  const isInRange = (day: number) => {
    if (!dateRange.from || !dateRange.to) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date >= dateRange.from && date <= dateRange.to;
  };

  const isSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return (
      (dateRange.from && date.toDateString() === dateRange.from.toDateString()) ||
      (dateRange.to && date.toDateString() === dateRange.to.toDateString())
    );
  };

  const formatDateDisplay = () => {
    if (!appliedDateRange.from && !appliedDateRange.to) return "Select dates";
    if (appliedDateRange.from && !appliedDateRange.to) {
      return appliedDateRange.from.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    }
    if (appliedDateRange.from && appliedDateRange.to) {
      if (appliedDateRange.from.toDateString() === appliedDateRange.to.toDateString()) {
        return appliedDateRange.from.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      }
      return `${appliedDateRange.from.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${appliedDateRange.to.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
    }
    return "Select dates";
  };

  const clearDates = () => {
    setDateRange({ from: null, to: null });
    setAppliedDateRange({ from: null, to: null });
    setSelectingFrom(true);
  };

  const handleApply = () => {
    setAppliedDateRange(dateRange);
    setIsCalendarOpen(false);
    // Here you can trigger API call with the selected date range
    console.log("Applied date range:", dateRange);
  };

  const handleCancel = () => {
    setDateRange(appliedDateRange);
    setIsCalendarOpen(false);
    setSelectingFrom(true);
  };

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-white/10 relative z-20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
              <p className="text-sm text-slate-400">Monthly performance</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Date Picker */}
            <div className="relative" ref={calendarRef}>
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm"
              >
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300">{formatDateDisplay()}</span>
                {(dateRange.from || dateRange.to) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearDates();
                    }}
                    className="ml-1 p-0.5 rounded-full hover:bg-white/10"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                )}
              </button>

              {/* Calendar Dropdown */}
              {isCalendarOpen && (
                <div className="absolute right-0 top-full mt-2 p-4 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-50 min-w-[300px]">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={prevMonth}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-400" />
                    </button>
                    <span className="text-sm font-semibold text-white">
                      {currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                    </span>
                    <button
                      onClick={nextMonth}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  {/* Selection hint */}
                  <p className="text-xs text-slate-500 text-center mb-3">
                    {selectingFrom ? "Select start date" : "Select end date"}
                  </p>

                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <div key={day} className="text-center text-xs text-slate-500 py-1">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before first day */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-8" />
                    ))}
                    {/* Day cells */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const selected = isSelected(day);
                      const inRange = isInRange(day);
                      return (
                        <button
                          key={day}
                          onClick={() => handleDateClick(day)}
                          className={`h-8 w-full rounded-lg text-sm font-medium transition-all
                            ${selected
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                              : inRange
                              ? "bg-blue-500/20 text-blue-300"
                              : "text-slate-300 hover:bg-white/10"
                            }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        const today = new Date();
                        setDateRange({ from: today, to: today });
                      }}
                      className="flex-1 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => {
                        const today = new Date();
                        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        setDateRange({ from: weekAgo, to: today });
                      }}
                      className="flex-1 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      Last 7 days
                    </button>
                    <button
                      onClick={() => {
                        const today = new Date();
                        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                        setDateRange({ from: monthAgo, to: today });
                      }}
                      className="flex-1 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      Last 30 days
                    </button>
                  </div>

                  {/* Apply & Cancel Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={handleCancel}
                      className="flex-1 py-2.5 text-sm font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApply}
                      disabled={!dateRange.from}
                      className="flex-1 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-lg shadow-blue-500/25"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
              <span className="text-sm text-slate-400">Revenue</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-6">
        <div className="flex items-end justify-between gap-4 h-64">
          {months.map((month, index) => (
            <div key={month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center justify-end h-48">
                <div
                  className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transition-all duration-300 cursor-pointer group relative"
                  style={{ height: `${(values[index] / maxValue) * 100}%` }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-700 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₹{(values[index] * 1000).toLocaleString()}
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-500">{month}</span>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">₹4.5L</p>
            <p className="text-xs text-slate-400">This Month</p>
          </div>
          <div className="text-center border-x border-white/10">
            <p className="text-2xl font-bold text-white">₹3.8L</p>
            <p className="text-xs text-slate-400">Last Month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">+18.4%</p>
            <p className="text-xs text-slate-400">Growth</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Revenue;
