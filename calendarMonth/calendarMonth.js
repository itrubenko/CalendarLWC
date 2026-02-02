import { LightningElement, api } from 'lwc';
import { getFormattedDate } from 'c/utils';
export default class CalendarMonth extends LightningElement {
  @api month;
  @api events;
  @api activeEvent;
  @api activeDate;
  @api showPopover;
  popoverPosition = { top: 0, left: 0 };

  get days() {
    const start = new Date(this.month.getFullYear(), this.month.getMonth(), 1);
    const firstMonday = new Date(start);
    firstMonday.setDate(start.getDate() - ((start.getDay() + 6) % 7));

    return Array.from({ length: 35 }).map((_, i) => {
      const d = new Date(firstMonday);
      d.setDate(d.getDate() + i);
      const date = getFormattedDate(d);
      const event = this.events[date] || null;

      return {
        date,
        day: d.getDate(),
        event,
        isHoliday: !!event?.isHoliday,
        hasEvent: !!event,
        isPopover: this.activeDate === date && this.showPopover
      };
    });
  }

  selectDay(e) {
    this.dispatchEvent(new CustomEvent('selectday', { detail: e.detail }));
    this.calculatePopoverPosition(e.detail);
  }

  calculatePopoverPosition(dateStr) {
    const dayContainer = this.template.querySelector(`[key="${dateStr}"]`);
    if (dayContainer) {
      const rect = dayContainer.getBoundingClientRect();
      this.popoverPosition = {
        top: rect.top,
        left: rect.right + 10 // Position to the right with 10px gap
      };
    }
  }
}