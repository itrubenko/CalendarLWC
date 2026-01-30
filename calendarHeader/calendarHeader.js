import { LightningElement, api, track } from 'lwc';

export default class CalendarHeader extends LightningElement {
  @api month;
  @api events = [];
  @track searchValue = '';
  @track suggestions = [];
  @track showSuggestions = false;

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
      this.suggestions = this.events.filter(event =>
        event.title.toLowerCase().includes(this.searchValue.toLowerCase())
      );
      this.showSuggestions = this.suggestions.length > 0;
    } else {
      this.suggestions = [];
      this.showSuggestions = false;
    }
  }

  selectSuggestion(e) {
    const eventId = e.currentTarget.dataset.eventId;
    const event = this.suggestions.find(s => s.id === eventId);
    if (event) {
      this.dispatchEvent(new CustomEvent('suggestselect', { detail: event }));
      this.searchValue = '';
      this.suggestions = [];
      this.showSuggestions = false;
    }
  }

  hideSuggestions() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
}
