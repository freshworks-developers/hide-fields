Ticket Fields Manager
=====================

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#ticket-fields-manager)

A Freshworks app demonstrating dynamic ticket field visibility and platform capabilities using both Ticket Background and Ticket Sidebar locations simultaneously. The app automatically shows/hides the Internal Notes field based on ticket type, with state persistence across page refreshes.

## Screenshots

<table>
<tr>
<td width="50%">

**Before:** Ticket with Internal Notes hidden (Refund ticket type)

![Before](screenshots/1.png)

</td>
<td width="50%">

**After:** Ticket with Internal Notes visible (Other ticket type)

![After](screenshots/2.png)

</td>
</tr>
</table>

🏗️ Architecture
----------------

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#%EF%B8%8F-architecture)

This app utilizes two app locations working together:

1.  Ticket Background (`ticket_background.html`) - Runs silently in the background

    -   Monitors ticket type changes
    -   Automatically shows/hides the Internal Notes field
    -   Sets ticket priority for Refund tickets
2.  Ticket Sidebar (`index.html`) - Provides a minimal UI

    -   Displays current ticket type
    -   Allows toggling between ticket types
    -   Updates in real-time as ticket changes

🔄 App Flow
-----------

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#-app-flow)

### Initial Load Flow

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#initial-load-flow)

```
1\. User opens a ticket in Freshdesk/Freshservice
   ↓
2. Both apps initialize simultaneously:
   - Background app (app.js) subscribes to ticket events
   - Sidebar app (sidebar.js) loads and displays current ticket type
   ↓
3. Background app checks ticket type:
   ├─ If type = "Refund"
   │  ├─ Set Priority = High (3)
   │  └─ Hide Internal Notes field
   └─ If type = "Other" or any other type
      └─ Show Internal Notes field
   ↓
4. Sidebar displays current type and enables toggle button

```

### User Interaction Flow

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#user-interaction-flow)

```
User clicks "Toggle Ticket Type" button
   ↓
Sidebar app (sidebar.js):
   ├─ Reads current ticket type
   ├─ Determines new type (Refund ↔ Other)
   └─ Calls setValue API to update ticket_type field
   ↓
Freshworks platform fires ticket.typeChanged event
   ↓
Background app (app.js) receives event:
   ├─ Reads updated ticket data
   ├─ Checks new ticket type
   └─ Shows/hides Internal Notes accordingly
   ↓
Sidebar app receives ticket.typeChanged event:
   └─ Updates UI to reflect new ticket type

```

### Page Refresh Flow

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#page-refresh-flow)

```
User refreshes the ticket page
   ↓
Both apps reinitialize
   ↓
Background app (app.js):
   ├─ Reads ticket data (including persisted type)
   ├─ Checks ticket.type value
   └─ Automatically shows/hides Internal Notes based on type
   ↓
Sidebar app (sidebar.js):
   └─ Displays current ticket type from persisted data

```

Key Point: The ticket type is persisted in the Freshworks database, so on refresh, both apps read the same persisted value and maintain consistent state.

📁 Project Structure
--------------------

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#-project-structure)

```
ticket-fields/
├── README.md                    # This file
├── manifest.json                # App configuration and location definitions
├── config/
│   └── iparams.json            # Installation parameters
└── app/                         # Frontend assets
    ├── index.html              # Sidebar UI (ticket_sidebar location)
    ├── ticket_background.html  # Background app (ticket_background location)
    ├── scripts/
    │   ├── app.js              # Background logic - handles note visibility
    │   └── sidebar.js          # Sidebar logic - UI and type toggling
    └── styles/
        ├── style.css           # Minimal styling for sidebar
        └── images/
            └── icon.svg        # App icon

```

🔑 Key Features Demonstrated
----------------------------

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#-key-features-demonstrated)

### 1\. Dual Location Architecture

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#1-dual-location-architecture)

-   Background App: Handles business logic without UI
-   Sidebar App: Provides user interaction interface
-   Both apps communicate through Freshworks events

### 2\. Dynamic Field Visibility

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#2-dynamic-field-visibility)

-   Automatically hides Internal Notes for Refund tickets
-   Shows Internal Notes for all other ticket types (including "Other")
-   Visibility persists across page refreshes

### 3\. Event-Driven Architecture

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#3-event-driven-architecture)

-   Uses `ticket.typeChanged` event for real-time updates
-   Responds to multiple events for reliability
-   No polling required - reactive to changes

### 4\. State Persistence

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#4-state-persistence)

-   Ticket type is stored in Freshworks database
-   On refresh, both apps read the same persisted state
-   Note visibility automatically restored based on persisted type

📋 Behavior Details
-------------------

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#-behavior-details)

### When Ticket Type = "Refund"

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#when-ticket-type--refund)

-   ✅ Priority automatically set to High (value: 3)
-   ✅ Internal Notes field is hidden
-   ✅ Sidebar shows "Set to Other" button

### When Ticket Type = "Other" (or any other type)

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#when-ticket-type--other-or-any-other-type)

-   ✅ Internal Notes field is visible
-   ✅ Sidebar shows "Set to Refund" button
-   ✅ No automatic priority change

### On Page Refresh

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#on-page-refresh)

-   ✅ Background app reads persisted ticket type
-   ✅ Note visibility automatically restored based on type
-   ✅ Sidebar displays correct current type
-   ✅ No manual intervention needed

🧪 Testing
----------

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#-testing)

### Prerequisites

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#prerequisites)

-   Freshworks FDK installed
-   Node.js 18.20.8
-   Freshdesk/Freshservice account

### Steps

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#steps)

1.  Start the app:

    ```source-shell
    fdk run
    ```

2.  Configure settings:

    -   Navigate to <http://localhost:10001/system_settings>
    -   Complete installation parameters if required
3.  Test Background App:

    -   Open a ticket in Freshdesk (append `?dev=true` to URL)
    -   Change ticket type to "Refund"
    -   Verify Internal Notes field disappears automatically
    -   Verify Priority is set to High
    -   Refresh the page - verify note remains hidden
4.  Test Sidebar App:

    -   Open the sidebar (if not already visible)
    -   Verify current ticket type is displayed
    -   Click "Toggle Ticket Type" button
    -   Verify type changes and note visibility updates
    -   Refresh page - verify state persists
5.  Test State Persistence:

    -   Set ticket type to "Other"
    -   Refresh the page
    -   Verify Internal Notes is visible
    -   Set ticket type to "Refund"
    -   Refresh the page
    -   Verify Internal Notes is hidden
/)
📝 Notes
--------

[](https://github.com/freshworks-developers/hide-fields/tree/3b7a94a1f392352057639a06c8cee7bf10a22b26#-notes)

-   The app uses a small delay (200ms) in the background app to ensure ticket data is fully loaded before processing
-   Ticket type changes via `setValue` trigger the `ticket.typeChanged` event automatically
-   The note visibility state is maintained by the background app, which runs on every ticket load/refresh
-   Both apps work independently but share the same ticket data source

hide-fields
===========