import { LightningElement, api } from 'lwc';

export default class QuickAddPopover extends LightningElement {
  @api date;
  @api isGlobalPopover;
  title = '';

  change(e) { this.title = e.target.value; }

  save() {
    this.dispatchEvent(new CustomEvent('save', {
      detail: {
        id: crypto.randomUUID(),
        title: this.title,
        date: this.date
      }
    }));
  }

  get popoverClass() {
    return this.isGlobalPopover
      ? 'slds-popover slds-popover_panel slds-nubbin_bottom-left'
      : 'slds-popover slds-popover_panel slds-nubbin_top-left';
  }
}
