import { LightningElement, track } from 'lwc';
import { mockEvents, getFormattedDate } from 'c/utils';

const STORAGE_KEY = 'calendarEvents';

export default class CalendarApp extends LightningElement {
  @track events = {};
  @track visibleEvents = [];
  currentMonth = new Date();
  search = '';

  activeDate;
  activeEvent;
  showPopover = false;
  showQuickAdd = false;
  isQuickAddDisabled = false;
  popoverPosition = { top: 0, left: 0 };

  connectedCallback() {
    this.events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || mockEvents;
    this.filterEvents();
  }

  get popoverStyle() {
    return `position: absolute; top: ${this.popoverPosition.top}px; left: ${this.popoverPosition.left}px; z-index: 1000;`;
  }

  persist() {
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
    this.closePopover();
    this.closeQuickAdd();
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
    this.showQuickAdd = false;
  }

  handleSaveEvent(e) {
    const evt = e.detail;
    if (evt.date) {
      this.events[evt.date] = evt;
      this.persist();
      this.filterEvents();
      this.closePopover();
      this.closeQuickAdd();
    }
  }

  handleDeleteEvent(e) {
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
    this.closePopover();
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