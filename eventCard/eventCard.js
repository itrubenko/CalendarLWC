import { LightningElement, api } from 'lwc';
export default class EventCard extends LightningElement {
  @api event;
  open() {
    // this.dispatchEvent(new CustomEvent('eventclick', { detail: this.event }));
  }
}
