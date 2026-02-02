import { LightningElement, api, track } from 'lwc';
const getFormattedDate = (date) => {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}
export default class CalendarHeader extends LightningElement {
  @api month;
  @api events;
  @api showQuickAdd;
  activeDate = getFormattedDate(new Date());
  searchValue = '';
  suggestions = [];
  showSuggestions = false;

  get label() {
    return this.month.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  get isDisabled() {
    return this.events[this.activeDate];
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
      this.showSuggestions = this.suggestions.length > 0;
      this.suggestions = Object.values(this.events).filter(event =>
        event.title.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    } else {
      this.showSuggestions = false;
      this.suggestions = [];
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
    this.showSuggestions = false;
  }
}