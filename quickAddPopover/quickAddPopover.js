import { LightningElement, api } from 'lwc';

const getFormattedDate = (date) => {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

export default class QuickAddPopover extends LightningElement {
  title = '';

  get placeholder() {
    const date = new Date();
    const formatted =  date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });

    return `${formatted}, New Event`;
  }

  get isSubmitDisabled() {
    return !this.title;
  }

  handleCloseQuickPopover(e) {
    this.dispatchEvent(
        new CustomEvent('close', {
            bubbles: true,
            composed: true
        })
    );
  }

  change(e) { this.title = e.target.value; }

  handleFormSubmit(e) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('save', {
      detail: {
        id: crypto.randomUUID(),
        title: this.title,
        date: getFormattedDate(new Date()),
        participants: '',
        description: ''
      },
      bubbles: true,
      composed: true
    }));
  }

  onInputEvent(e) {
    this.title = e.target.value;
  }
}