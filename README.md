# Ticket Fields Manager

A Freshworks app demonstrating dynamic ticket field visibility and platform capabilities using both **Ticket Background** and **Ticket Sidebar** locations simultaneously. The app automatically shows/hides the Internal Notes field based on ticket type, with state persistence across page refreshes.

## 🎯 Use Case

This app demonstrates how to:
- **Hide/show ticket fields** dynamically based on ticket properties
- **Run background processes** and **sidebar UI** simultaneously on the same ticket page
- **Persist field visibility** across page refreshes
- **Automatically update UI** when ticket properties change

**Primary Use Case:** Automatically hide Internal Notes for Refund tickets while keeping them visible for all other ticket types, with the visibility state maintained even after page refresh.

## 🏗️ Architecture

This app utilizes **two app locations** working together:

1. **Ticket Background** (`ticket_background.html`) - Runs silently in the background
   - Monitors ticket type changes
   - Automatically shows/hides the Internal Notes field
   - Sets ticket priority for Refund tickets

2. **Ticket Sidebar** (`index.html`) - Provides a minimal UI
   - Displays current ticket type
   - Allows toggling between ticket types
   - Updates in real-time as ticket changes

## 🔄 App Flow

### Initial Load Flow

```
1. User opens a ticket in Freshdesk/Freshservice
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

**Key Point:** The ticket type is persisted in the Freshworks database, so on refresh, both apps read the same persisted value and maintain consistent state.

## 🛠️ Technology Stack

- **Platform:** Freshworks Platform v3.0
- **Module:** `support_ticket` (Freshdesk)
- **Locations:**
  - `ticket_background` - Background processing
  - `ticket_sidebar` - User interface
- **APIs Used:**
  - **Data API:** `client.data.get("ticket")` - Read ticket information
  - **Interface API:** 
    - `client.interface.trigger("setValue")` - Update field values
    - `client.interface.trigger("show")` - Show UI elements
    - `client.interface.trigger("hide")` - Hide UI elements
  - **Events API:** 
    - `ticket.typeChanged` - Detect type changes
    - `ticket.updated` - Detect ticket updates
    - `app.activated` - App initialization
    - `ticket.propertiesLoaded` - Properties loaded (Freshservice)

## 📁 Project Structure

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

## 🔑 Key Features Demonstrated

### 1. Dual Location Architecture
- **Background App:** Handles business logic without UI
- **Sidebar App:** Provides user interaction interface
- Both apps communicate through Freshworks events

### 2. Dynamic Field Visibility
- Automatically hides Internal Notes for Refund tickets
- Shows Internal Notes for all other ticket types (including "Other")
- Visibility persists across page refreshes

### 3. Event-Driven Architecture
- Uses `ticket.typeChanged` event for real-time updates
- Responds to multiple events for reliability
- No polling required - reactive to changes

### 4. State Persistence
- Ticket type is stored in Freshworks database
- On refresh, both apps read the same persisted state
- Note visibility automatically restored based on persisted type

## 📋 Behavior Details

### When Ticket Type = "Refund"
- ✅ Priority automatically set to **High** (value: 3)
- ✅ Internal Notes field is **hidden**
- ✅ Sidebar shows "Set to Other" button

### When Ticket Type = "Other" (or any other type)
- ✅ Internal Notes field is **visible**
- ✅ Sidebar shows "Set to Refund" button
- ✅ No automatic priority change

### On Page Refresh
- ✅ Background app reads persisted ticket type
- ✅ Note visibility automatically restored based on type
- ✅ Sidebar displays correct current type
- ✅ No manual intervention needed

## 🧪 Testing

### Prerequisites
- Freshworks FDK installed
- Node.js 18.20.8
- Freshdesk/Freshservice account

### Steps

1. **Start the app:**
   ```bash
   fdk run
   ```

2. **Configure settings:**
   - Navigate to http://localhost:10001/system_settings
   - Complete installation parameters if required

3. **Test Background App:**
   - Open a ticket in Freshdesk (append `?dev=true` to URL)
   - Change ticket type to "Refund"
   - Verify Internal Notes field disappears automatically
   - Verify Priority is set to High
   - Refresh the page - verify note remains hidden

4. **Test Sidebar App:**
   - Open the sidebar (if not already visible)
   - Verify current ticket type is displayed
   - Click "Toggle Ticket Type" button
   - Verify type changes and note visibility updates
   - Refresh page - verify state persists

5. **Test State Persistence:**
   - Set ticket type to "Other"
   - Refresh the page
   - Verify Internal Notes is visible
   - Set ticket type to "Refund"
   - Refresh the page
   - Verify Internal Notes is hidden

## 📊 Field IDs Reference

- `ticket_type` - Ticket type dropdown field
- `priority` - Ticket priority field
- `note` - Internal Notes field/tab

### Priority Values
- `1` = Low
- `2` = Medium
- `3` = High
- `4` = Urgent

## 📚 Learn More

- [Freshworks Platform Documentation](https://developers.freshworks.com/docs/)
- [Freshworks Sample Apps](https://community.developers.freshworks.com/t/freshworks-sample-apps/3604)
- [Data API Reference](https://developers.freshworks.com/docs/data-api/)
- [Interface API Reference](https://developers.freshworks.com/docs/interface-api/)
- [Events API Reference](https://developers.freshworks.com/docs/events-api/)

## 📝 Notes

- The app uses a small delay (200ms) in the background app to ensure ticket data is fully loaded before processing
- Ticket type changes via `setValue` trigger the `ticket.typeChanged` event automatically
- The note visibility state is maintained by the background app, which runs on every ticket load/refresh
- Both apps work independently but share the same ticket data source
# hide-fields
