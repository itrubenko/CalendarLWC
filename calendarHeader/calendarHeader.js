import { LightningElement, api } from 'lwc';
import { getFormattedDate } from 'c/utils';
export default class CalendarHeader extends LightningElement {
  @api month;
  @api events;
  @api showQuickAdd;
  activeDate = getFormattedDate(new Date());
  searchValue = '';
  suggestions = [];
  showSuggestions = false;

  get monthLabel() {
    return this.month.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  get isDisabled() {
    return this.events[this.activeDate];
  }

  prev() { this.dispatchEvent(new CustomEvent('prev')); }
  next() { this.dispatchEvent(new CustomEvent('next')); }
  today() { this.dispatchEvent(new CustomEvent('today')); }
  add() { this.dispatchEvent(new CustomEvent('add')); }


  handleEdit() {
    console.log('Edit button clicked');
  }
  handleSearch(e) {
    this.searchValue = e.target.value;
    this.updateSuggestions();
    this.dispatchEvent(new CustomEvent('search', { detail: this.searchValue }));
  }

  updateSuggestions() {
    if (this.searchValue.trim()) {
      this.suggestions = Object.values(this.events).filter(event =>
        event.title.toLowerCase().includes(this.searchValue.toLowerCase())
      ).map(event => ({
        ...event,
        dateLabel: new Date(event.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric'
        }).replace(' ', ', ')
      }));

      this.showSuggestions = this.suggestions.length > 0;
    } else {
      this.showSuggestions = false;
      this.suggestions = [];
    }
  }

  handleSelectSuggestion(e) {
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

  handleHideSuggestions() {
    this.showSuggestions = false;
  }
}