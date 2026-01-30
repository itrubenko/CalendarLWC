import { LightningElement, api } from 'lwc';

export default class CalendarMonth extends LightningElement {
  @api month;
  @api events;

  get days() {
    const start = new Date(this.month.getFullYear(), this.month.getMonth(), 1);
    const firstMonday = new Date(start);
    firstMonday.setDate(start.getDate() - ((start.getDay() + 6) % 7));


    return Array.from({ length: 35 }).map((_, i) => {
      const d = new Date(firstMonday);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];

      return {
        date: iso,
        day: d.getDate(),
        event: this.events.find(e => e.date === iso)
      };
    });
  }

  selectDay(e) {
    this.dispatchEvent(new CustomEvent('selectday', { detail: e.detail }));
  }

  openEvent(e) {
    this.dispatchEvent(new CustomEvent('eventclick', { detail: e.detail }));
  }
}
