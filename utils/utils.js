export const mockEvents = {
  "2026-01-10": {
    "id": "01e34806-413f-4980-a2f6-d58ea12ae163",
    "date": "2026-01-10",
    "title": "Invisible Meeting",
    "participants": "Ghost, Casper",
    "description": "Discussing the benefits of transparency in project management."
  },
  "2026-02-06": {
    "id": "d2884630-f540-40b9-9239-3a45856c8996",
    "date": "2026-02-06",
    "title": "Snack Break",
    "participants": "Alice, Bob, Charlie",
    "description": "Mandatory cookie tasting session. Opinions on chocolate chips only."
  },
  "2026-02-05": {
    "id": "64536e61-ce8b-4075-b486-239e8b9cc3b6",
    "date": "2026-02-05",
    "title": "Nap Time Committee",
    "participants": "Bob, Steve",
    "description": "Vote on the official office nap duration: 15, 30, or 45 minutes."
  },
  "2026-06-11": {
    "id": "a3610359-3755-4b9c-93fc-21ff190c297c",
    "date": "2026-06-11",
    "title": "Penguin Appreciation Day",
    "participants": "Everyone",
    "description": "Celebrate penguins by wearing tuxedos and sliding on ice."
  },
  "2026-02-13": {
    "id": "f4ed7c0c-7b35-4c27-9bc6-245af18e9ea5",
    "date": "2026-02-13",
    "title": "Moon Cheese Tasting",
    "participants": "Test, Test",
    "description": "Analyzing the flavor profile of lunar cheese samples. Spoiler: it's out of this world."
  },
  "2026-02-04": {
    "id": "5e591b12-470c-430d-828d-c660b9070a05",
    "date": "2026-02-04",
    "title": "Boo Fest",
    "participants": "Test, Tes",
    "description": "Annual competition: who can scare the most coworkers with a single 'Boo!'"
  },
    "2026-01-30": {
    "id": "5e591b12-470c-430d-828d-c660b9070a06",
    "date": "2026-01-30",
    "isHoliday": true,
    "title": "Boo Fest",
    "participants": "Test, Tes",
    "description": "Annual competition: who can scare the most coworkers with a single 'Boo!'"
  }
}

export const getFormattedDate = (date) => {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
