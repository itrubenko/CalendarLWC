import { LightningElement, api } from 'lwc';
import { days} from 'c/utils';
export default class CalendarDay extends LightningElement {
  @api data;
  @api index;

  get dateLabel() {
    const dayLabel = this.data.day;
    return this.index < 7 ? `${days[this.index]}, ${dayLabel}` : dayLabel;
  }

  handleClick(e) {
    const isHoliday = e.currentTarget.dataset.isHoliday === 'true';
    if (!isHoliday) {
      this.dispatchEvent(new CustomEvent('select', { detail: this.data.date }));
    }}
}