import { LightningElement, api, track } from 'lwc';

export default class EventPopover extends LightningElement {
  @api date;
  @track positionOnRight = true;
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

  renderedCallback() {
    this.checkAndAdjustPosition();
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
  get popoverStyle() {
    const baseStyle = 'position: absolute; top: 0; z-index: 1001; width: 300px;';
    if (this.positionOnRight) {
      return baseStyle + ' right: -320px;';
    } else {
      return baseStyle + ' left: -320px;';
    }
  }

  get popoverClass() {
    const baseClass = 'slds-popover slds-popover_panel slds-p-vertical_small slds-p-horizontal_medium small-font';
    const nubbin = this.positionOnRight ? 'slds-nubbin_left-top' : 'slds-nubbin_right-top';
    return `${baseClass} ${nubbin}`;
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

  handleInputChange(e) {
    const formId = e.target.dataset.id;
    const value = e.target.value;
    this[formId] = value;
  }

  handleRemove() {
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

  checkAndAdjustPosition() {
    const section = this.template.querySelector('section');
    if (!section || !section.parentElement) return;

    const popoverWidth = 300;
    const gap = 20;
    const parentRect = section.parentElement.getBoundingClientRect();
    
    // Check if popover can fit on the right side
    const rightEdge = parentRect.right + popoverWidth + gap;
    const canFitRight = rightEdge <= window.innerWidth;
    
    // Check if popover can fit on the left side
    const leftEdge = parentRect.left - popoverWidth - gap;
    const canFitLeft = leftEdge >= 0;
    
    // Prefer right if it fits, otherwise use left
    if (canFitRight) {
      this.positionOnRight = true;
    } else if (canFitLeft) {
      this.positionOnRight = false;
    } else {
      // If neither fits perfectly, prefer right as default
      this.positionOnRight = true;
    }
  }
}