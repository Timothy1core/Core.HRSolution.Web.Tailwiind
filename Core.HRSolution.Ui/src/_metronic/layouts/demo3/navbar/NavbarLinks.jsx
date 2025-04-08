import { Menu } from '@/_metronic/components';

import { Popover, PopoverContent, PopoverTrigger } from '@/_metronic/components/ui/popover';
import { Calendar } from '@/_metronic/components/ui/calendar';
import { addDays, format } from 'date-fns';
import { cn } from '@/_metronic/lib/utils';
import { KeenIcon } from '@/_metronic/components/keenicons';
import { useState } from 'react';
const NavbarLinks = () => {
  
  const [date, setDate] = useState({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20)
  });
  return <Menu className="menu-default">
      <Popover>
        <PopoverTrigger asChild>
          <button id="date" className={cn('btn btn-sm btn-light data-[state=open]:bg-light-active', !date && 'text-gray-400')}>
            <KeenIcon icon="calendar" className="me-0.5" />
            {date?.from ? date.to ? <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </> : format(date.from, 'LLL dd, y') : <span>Pick a date range</span>}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
        </PopoverContent>
      </Popover>
    </Menu>;
};
export { NavbarLinks };