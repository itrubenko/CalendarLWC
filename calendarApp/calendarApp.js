import { LightningElement, track } from 'lwc';

const STORAGE_KEY = 'calendarEvents';

export default class CalendarApp extends LightningElement {
  @track events = [];
  @track visibleEvents = [];
  currentMonth = new Date();
  search = '';

  activeDate;
  activeEvent;
  showPopover = false;
  showQuickAdd = false;
  isGlobalPopover = true;
  popoverPosition = { top: 0, left: 0 };

  connectedCallback() {
    this.events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    console.log('From connectedCallback:', JSON.parse(localStorage.getItem(STORAGE_KEY)) );
    console.log('Loaded events:', this.events);
    this.filterEvents();
  }

  get popoverStyle() {
    return `position: absolute; top: ${this.popoverPosition.top}px; left: ${this.popoverPosition.left}px; z-index: 1000;`;
  }

  persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events));
  }

  filterEvents() {
    this.visibleEvents = this.search
      ? this.events.filter(e =>
          e.title.toLowerCase().includes(this.search.toLowerCase())
        )
      : this.events;
  }

  prevMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
  }

  goToday() {
    this.currentMonth = new Date();
  }

  handleSearch(e) {
    this.search = e.detail;
    this.filterEvents();
  }

  handleSuggestSelect(e) {
    const event = e.detail;
    if (event && event.date) {
      const eventDate = new Date(event.date);
      this.currentMonth = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        1
      );
      this.activeEvent = event;
      this.activeDate = event.date;
      this.showPopover = true;
      this.search = '';
      this.filterEvents();
    }
  }

  selectDay(e) {
    this.activeDate = e.detail;
    this.activeEvent = null;
    this.showPopover = true;
    // Calculate position after DOM updates
    setTimeout(() => this.calculatePopoverPosition(), 0);
  }

  openEvent(e) {
    this.activeEvent = e.detail;
    this.activeDate = e.detail.date;
    this.showPopover = true;
    // Calculate position after DOM updates
    setTimeout(() => this.calculatePopoverPosition(), 0);
  }

  calculatePopoverPosition() {
    const monthComponent = this.template.querySelector('c-calendar-month');
    if (!monthComponent) return;

    // Find all day elements and locate the one with activeDate
    const dayElements = monthComponent.shadowRoot?.querySelectorAll('[data-date]') || [];
    let targetElement = null;

    for (const dayEl of dayElements) {
      if (dayEl.getAttribute('data-date') === this.activeDate) {
        targetElement = dayEl;
        break;
      }
    }

    // If not found by data attribute, try to find by content
    if (!targetElement) {
      const allDays = monthComponent.shadowRoot?.querySelectorAll('.day') || [];
      for (const dayEl of allDays) {
        if (dayEl.textContent && dayEl.textContent.includes(this.activeDate?.split('-')[2])) {
          targetElement = dayEl;
          break;
        }
      }
    }

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const container = this.template.querySelector('.calendar');
      const containerRect = container.getBoundingClientRect();

      this.popoverPosition = {
        top: rect.top - containerRect.top + rect.height + 8,
        left: rect.left - containerRect.left
      };
    }
  }

  setPopoverPosition(e) {
    // Backup method - try to get position from event target
    let target = e.target;
    while (target && !target.classList?.contains('day') && !target.classList?.contains('event-card')) {
      target = target.parentElement;
    }
    
    if (target) {
      const rect = target.getBoundingClientRect();
      const container = this.template.querySelector('.calendar');
      const containerRect = container.getBoundingClientRect();
      
      this.popoverPosition = {
        top: rect.top - containerRect.top + rect.height + 8,
        left: rect.left - containerRect.left
      };
    }
  }

  saveEvent(e) {
    const evt = e.detail;
    const idx = this.events.findIndex(x => x.id === evt.id);
    idx >= 0 ? (this.events[idx] = evt) : this.events.push(evt);
    this.persist();
    this.filterEvents();
    this.closePopover();
  }

  deleteEvent(e) {
    this.events = this.events.filter(x => x.id !== e.detail);
    this.persist();
    this.filterEvents();
    this.closePopover();
  }

  openQuickAdd() {
    this.activeDate = new Date().toISOString().split('T')[0];
    this.showQuickAdd = true;
  }

  quickSave(e) {
    this.events.push(e.detail);
    this.persist();
    this.filterEvents();
    this.closeQuickAdd();
  }

  closePopover() {
    this.showPopover = false;
  }

  closeQuickAdd() {
    this.showQuickAdd = false;
  }
}
