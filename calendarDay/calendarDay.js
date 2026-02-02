import { LightningElement, api } from 'lwc';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
function formattedDate() {
  if (!this.date) return '';
  const dateObj = new Date(this.date);
  return dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}
export default class CalendarDay extends LightningElement {
  @api data;
  @api index;

  get dateLabel() {
    const dayLabel = this.data.day;
    return this.index < 7 ? `${days[this.index]}, ${dayLabel}` : dayLabel;
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent('select', { detail: this.data.date }));
  }
}