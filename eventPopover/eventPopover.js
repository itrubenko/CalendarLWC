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

  id = crypto.randomUUID();
  title = '';
  participants = '';
  description = '';

  connectedCallback() {
    this.updateFromEvent();
  }

  get isDisabled() {
    return !this.title;
  }
  get getFormLabel() {
    return this._event ? 'Update Event' : 'Add Event';
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

  handleSubmit(e) {
    e.preventDefault();
    // 1. Get submitted data using FormData (recommended)
    const formData = new FormData(e.currentTarget);
    const dataObject = {};

    // Iterate over formData and convert to a regular JavaScript object
    formData.forEach((value, key) => {
        dataObject[key] = value;
    });

    let detail = { ...{id: this.id} ,  ...dataObject}
    this.dispatchEvent(new CustomEvent('save', {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  change(e) {
    const formId = e.target.dataset.id;
    const value = e.target.value;
    this[formId] = value;
  }

  save() {
    this.dispatchEvent(new CustomEvent('save', {
      detail: {
        id: this.id,
        title: this.title,
        date: this.date,
        participants: this.participants,
        description: this.description
      },
      bubbles: true,
      composed: true
    }));
  }

  remove() {
    this.dispatchEvent(
      new CustomEvent('delete', {
        detail: this.id,
        bubbles: true,
        composed: true
      })
    );
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent('close'));
  }
}