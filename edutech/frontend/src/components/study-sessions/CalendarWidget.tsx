import { useState, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export interface CalendarWidgetProps {
  daysWithSessions?: string[];
  selectedDate: string | null;
  onDateChange: (date: string) => void;
}

interface CalendarDay {
  dayNumber: number;
  fullDate: string;
}

const CalendarWidget = ({ daysWithSessions = [], selectedDate, onDateChange }: CalendarWidgetProps) => {
  const [viewDate, setViewDate] = useState(new Date());
  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const { days, monthName, year } = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long' });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const shiftFirstDay = (firstDayIndex + 6) % 7;
    const totalDays = new Date(year, month + 1, 0).getDate();

    const totalCellsNeeded = shiftFirstDay + totalDays;
    const totalGridSlots = Math.ceil(totalCellsNeeded / 7) * 7;

    const daysArray = Array.from({ length: totalGridSlots }, (_, index) => {
      const dayNumber = index - shiftFirstDay + 1;

      if (dayNumber > 0 && dayNumber <= totalDays) {
        const formattedMonth = String(month + 1).padStart(2, '0');
        const formattedDay = String(dayNumber).padStart(2, '0');
        const fullDate = `${year}-${formattedMonth}-${formattedDay}`;
        return { dayNumber, fullDate };
      }
      return null;
    });
    return { days: daysArray, monthName, year };
  }, [viewDate]);

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-6 px-2">
        <button onClick={() => changeMonth(-1)} className="text-gray-400 hover:text-black">
          <ChevronLeftIcon className="w-4 h-4 stroke-2" />
        </button>

        <div className="flex gap-1 font-bold text-gray-700 capitalize"> {monthName} {year} </div>

        <button onClick={() => changeMonth(1)} className="text-gray-400 hover:text-black">
          <ChevronRightIcon className="w-4 h-4 stroke-2" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-gray-400 font-bold mb-4 uppercase tracking-widest">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
        {days.map((day: CalendarDay | null, idx: number) => {
          const hasSession = day && daysWithSessions.includes(day.fullDate);
          const isSelected = day && selectedDate === day.fullDate;

          return (
            <div key={day?.fullDate || idx} className="flex justify-center items-center h-10">
              {day && (
                <button
                  onClick={() => onDateChange(day.fullDate)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all font-semibold hover:bg-gray-100
                    ${hasSession ? 'text-blue-500 border border-blue-500' : 'text-gray-600'}
                    ${isSelected ? 'border-2 border-blue-500 bg-blue-100 transition-colors' : ''}
                  `}
                >
                  {day.dayNumber}
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
