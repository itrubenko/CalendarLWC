import { LightningElement, api, track } from 'lwc';
const getFormattedDate = (date) => {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}
export default class CalendarHeader extends LightningElement {
  @api month;
  @api events;
  @api activeDate;
  @api showQuickAdd;
  @track searchValue = '';
  @track suggestions = [];

  get label() {
    return this.month.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  prev() { this.dispatchEvent(new CustomEvent('prev')); }
  next() { this.dispatchEvent(new CustomEvent('next')); }
  today() { this.dispatchEvent(new CustomEvent('today')); }
  add() { this.dispatchEvent(new CustomEvent('add')); }

  search(e) {
    this.searchValue = e.target.value;
    this.updateSuggestions();
    this.dispatchEvent(new CustomEvent('search', { detail: this.searchValue }));
  }

  updateSuggestions() {
    if (this.searchValue.trim()) {
      this.suggestions = Object.values(this.events).filter(event =>
        event.title.toLowerCase().includes(this.searchValue.toLowerCase())
      );
      this.showSuggestions = this.suggestions.length > 0;
    } else {
      this.suggestions = [];
      this.showSuggestions = false;
    }
  }

  selectSuggestion(e) {
    const eventDate = e.currentTarget.dataset.eventDate;
    const event = this.events[eventDate];
    if (event) {
      this.dispatchEvent(new CustomEvent('suggestselect', { detail: event }));
      this.searchValue = '';
      this.suggestions = [];
      this.showSuggestions = false;
    }
  }

  handleClickQuickAddEvent(e) {
    this.dispatchEvent(new CustomEvent('add'));
  }

  hideSuggestions() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
}
