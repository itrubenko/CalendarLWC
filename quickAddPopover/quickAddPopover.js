import { LightningElement, api } from 'lwc';

const getFormattedDate = (date) => {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

export default class QuickAddPopover extends LightningElement {
  @api isGlobalPopover;
  title = '';

  change(e) { this.title = e.target.value; }

  handleSave() {
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

  get popoverClass() {
    return this.isGlobalPopover
      ? 'slds-popover slds-popover_panel slds-nubbin_bottom-left'
      : 'slds-popover slds-popover_panel slds-nubbin_top-left';
  }
}
