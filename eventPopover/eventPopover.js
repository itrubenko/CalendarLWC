import { LightningElement, api, track } from 'lwc';

export default class EventPopover extends LightningElement {
  @api date;

  _event;
  @api
  get event() {
    return this._event;
  }
  set event(value) {
    this._event = value;
    this.updateFromEvent();
  }

  @track id = crypto.randomUUID();
  @track title = '';
  @track participants = '';
  @track description = '';

  connectedCallback() {
    this.updateFromEvent();
  }

  get isNewEvent() {
    return !this.event;
  }

  get formattedDate() {
    if (!this.date) return '';
    const dateObj = new Date(this.date);
    return dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  }

  updateFromEvent() {
    if (this.event) {
      this.id = this.event.id || crypto.randomUUID();
      this.title = this.event.title || '';
      this.participants = this.event.participants || '';
      this.description = this.event.description || '';
    } else {
      this.id = crypto.randomUUID();
      this.title = '';
      this.participants = '';
      this.description = '';
    }
  }

  change(e) {
    const label = e.target.label.toLowerCase();
    const value = e.target.value;

    // Map label to property name
    if (label === 'event name') {
      this.title = value;
    } else if (label === 'day, month, year') {
      // Don't allow editing date in existing event view
      if (!this.event) {
        this.date = value;
      }
    } else if (label === 'participants') {
      this.participants = value;
    } else if (label === 'description') {
      this.description = value;
    }
  }

  save() {
    this.dispatchEvent(new CustomEvent('save', {
      detail: { id: this.id, title: this.title, date: this.date, participants: this.participants, description: this.description }
    }));
  }

  remove() {
    this.dispatchEvent(new CustomEvent('delete', { detail: this.id }));
  }
}
