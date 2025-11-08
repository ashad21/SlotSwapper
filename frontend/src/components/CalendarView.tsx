import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import type { Event } from '@/types';

interface CalendarViewProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onEventClick }) => {
  const weekStart = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 1 }), []);
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isSameDay(parseISO(event.startTime), day)
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      BUSY: 'bg-gray-100 border-gray-300 text-gray-700',
      SWAPPABLE: 'bg-green-100 border-green-300 text-green-700',
      SWAP_PENDING: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    };
    return colors[status as keyof typeof colors] || colors.BUSY;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          Week View
        </h3>
        <p className="text-sm text-gray-600">
          {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <Card 
              key={index} 
              className={`${isToday ? 'ring-2 ring-primary' : ''} hover:shadow-md transition-shadow`}
            >
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm font-medium text-center">
                  <div className={`${isToday ? 'text-primary font-bold' : 'text-gray-600'}`}>
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-2xl ${isToday ? 'text-primary' : 'text-gray-900'}`}>
                    {format(day, 'd')}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-1 min-h-[120px]">
                {dayEvents.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No events</p>
                ) : (
                  dayEvents.map((event) => (
                    <div
                      key={event._id}
                      onClick={() => onEventClick?.(event)}
                      className={`p-2 rounded border cursor-pointer hover:shadow-sm transition-all ${getStatusColor(event.status)}`}
                    >
                      <p className="text-xs font-medium truncate">{event.title}</p>
                      <p className="text-xs flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {format(parseISO(event.startTime), 'HH:mm')}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
          <span className="text-xs text-gray-600">Busy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
          <span className="text-xs text-gray-600">Swappable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
          <span className="text-xs text-gray-600">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
