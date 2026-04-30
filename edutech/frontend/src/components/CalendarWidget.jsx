import { useState, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const CalendarWidget = ({ daysWithSessions = [], selectedDate, onDateChange }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const { days, monthName, year } = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long' });
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    
    const shiftFirstDay = (firstDayIndex + 6) % 7;

    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const daysArray = [
      ...Array(shiftFirstDay).fill(null), 
      ...Array.from({ length: totalDays }, (_, i) => i + 1)
    ];
    
    return { days: daysArray, monthName, year };
  }, [viewDate]);

  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-6 px-2">
        <button onClick={() => changeMonth(-1)} className="text-gray-400 hover:text-black">
          <ChevronLeftIcon className="w-4 h-4 stroke-2" />
        </button>
        
        <div className="flex gap-1 font-bold text-gray-700 capitalize">
          <span>{monthName}</span>
          <span>{year}</span>
        </div>

        <button onClick={() => changeMonth(1)} className="text-gray-400 hover:text-black">
          <ChevronRightIcon className="w-4 h-4 stroke-2" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-gray-400 font-bold mb-4 uppercase tracking-widest">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
        {days.map((day, idx) => {
          const hasSession = day && daysWithSessions.includes(day);
          const isSelected = selectedDate === day;

          return (
            <div key={idx} className="flex justify-center items-center h-10">
              {day && (
                <button
                  onClick={() => onDateChange(day)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all font-semibold
                    ${hasSession ? 'bg-gray-800 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}
                    ${isSelected && !hasSession ? 'ring-2 ring-gray-400' : ''}
                  `}
                >
                  {day}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWidget;