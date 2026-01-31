import { LightningElement, track } from 'lwc';

const STORAGE_KEY = 'calendarEvents';

const mockEvents = {
  "2026-01-08": {
    "id": "01e34806-413f-4980-a2f6-d58ea12ae163",
    "date": "2026-01-08",
    "title": "Test2",
    "participants": "",
    "description": "Descr Test2 33"
  },
  "2026-01-10": {
    "id": "01e34806-413f-4980-a2f6-d58ea12ae163",
    "title": "Test3",
    "date": "2026-01-10",
    "participants": "",
    "description": "Descr Test2 33"
  }
};

const getFormattedDate = (date) => {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

export default class CalendarApp extends LightningElement {
  @track events = {};
  @track visibleEvents = [];
  currentMonth = new Date();
  search = '';

  activeDate;
  activeEvent;
  showPopover = false;
  showQuickAdd = false;
  isGlobalPopover = true;
  isQuickAddDisabled = false;
  popoverPosition = { top: 0, left: 0 };

  connectedCallback() {
    this.events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || mockEvents;
    // this.isQuickAddDisabled = !!this.events[getFormattedDate(new Date())];
    this.filterEvents();
  }

  get popoverStyle() {
    return `position: absolute; top: ${this.popoverPosition.top}px; left: ${this.popoverPosition.left}px; z-index: 1000;`;
  }

  persist() {
    // Ensure all events have properly formatted structure
    const cleanedEvents = {};
    Object.entries(this.events).forEach(([date, event]) => {
      cleanedEvents[date] = {
        id: event.id,
        date: event.date,
        title: event.title,
        participants: event.participants || '',
        description: event.description || ''
      };
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedEvents));
  }

  filterEvents() {
    const allEvents = Object.values(this.events);
    this.visibleEvents = this.search
      ? allEvents.filter(e =>
          e.title.toLowerCase().includes(this.search.toLowerCase())
        )
      : allEvents;
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
    this.activeEvent = this.events[e.detail];
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
    if (evt.date) {
      this.events[evt.date] = evt;
      this.persist();
      this.filterEvents();
      this.closePopover();
      this.closeQuickAdd();
    }
  }

  deleteEvent(e) {
    const eventIdToDelete = e.detail;
    const dateToDelete = Object.keys(this.events).find(
      date => this.events[date].id === eventIdToDelete
    );
    if (dateToDelete) {
      delete this.events[dateToDelete];
      this.persist();
      this.filterEvents();
    }
    this.closePopover();
  }

  openQuickAdd() {
    this.activeDate = getFormattedDate(new Date());
    this.showQuickAdd = true;
  }


  closePopover() {
    this.showPopover = false;
  }

  closeQuickAdd() {
    this.showQuickAdd = false;
  }
}
