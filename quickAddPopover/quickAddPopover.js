import { LightningElement, api } from 'lwc';
import { getFormattedDate } from 'c/utils';
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

  handleClose(e) {
    this.dispatchEvent(
        new CustomEvent('close', {
            bubbles: true,
            composed: true
        })
    );
  }

  handleInputChange(e) { this.title = e.target.value; }

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
}