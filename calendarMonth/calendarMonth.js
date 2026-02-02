import { LightningElement, api } from 'lwc';


const getFormattedDate = (date) => {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

export default class CalendarMonth extends LightningElement {
  @api month;
  @api events;
  @api activeEvent;
  @api activeDate;
  @api showPopover;

  get days() {
    const start = new Date(this.month.getFullYear(), this.month.getMonth(), 1);
    const firstMonday = new Date(start);
    firstMonday.setDate(start.getDate() - ((start.getDay() + 6) % 7));

    return Array.from({ length: 35 }).map((_, i) => {
      const d = new Date(firstMonday);
      d.setDate(d.getDate() + i);
      const iso = getFormattedDate(d);
      const event = this.events[iso] || null;
      return {
        date: iso,
        day: d.getDate(),
        event,
        hasEvent: !!event,
        isPopover: this.activeDate === iso && this.showPopover
      };
    });
  }

  selectDay(e) {
    this.dispatchEvent(new CustomEvent('selectday', { detail: e.detail }));
  }
}