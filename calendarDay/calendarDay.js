import { LightningElement, api } from 'lwc';

export default class CalendarDay extends LightningElement {
  @api data;

  select() {
    this.dispatchEvent(new CustomEvent('select', { detail: this.data.date }));
  }

  eventClick(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('eventclick', { detail: e.detail }));
  }
}
