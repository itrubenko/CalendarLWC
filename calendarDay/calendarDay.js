import { LightningElement, api } from 'lwc';

export default class CalendarDay extends LightningElement {
  @api data;

  handleClick() {
    this.dispatchEvent(new CustomEvent('select', { detail: this.data.date }));
  }
}
