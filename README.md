# Development Notes

Some requirements were not fully clear based on the provided Figma sketch, which appears to be non-final. I followed the overall design direction but did not aim for pixel-perfect accuracy.

## Implemented

* The "Edit" button in the right navigation is present but has no logic, as its intended behavior was unclear.
* Nav Month label container has a fixed width so navigation arrows do not cause layout shifting when switching months.
* Only one event per day is supported.
* Text overflow is handled for:
    * Search input
    * Event titles on event cards
* "Add event" button in navigation creates an event for the currently selected day.
* Clicking a suggested event navigates to the correct month and opens the popover modal.
* Basic form validation is implemented for the title field only.
* Events are persisted using localStorage.
* Responsive design was not implemented.

## Technical Notes

* This was my first time working with LWC.
* Time was spent:
    * Had an issue connecting to a sandbox 
    * LWC fundamentals
    * Debugging
    * Salesforce documentation and watching few tutorials
* Due to time constraints, not everything was fully refactored or completed.

## Not Completed

* Popover styling with automatic positioning.
* Popover content when clicking on a day that already has an event.
