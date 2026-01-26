# hide-fields

A Freshworks app that dynamically shows/hides ticket fields based on ticket type. Automatically hides Internal Notes for Refund tickets and sets priority to High, with state persistence across page refreshes.

## 🎯 Use Case

Automatically hide Internal Notes for Refund tickets while keeping them visible for all other ticket types. The app triggers **on ticket create** or **when ticket type changes**.

## 🏗️ Architecture

Uses **two app locations** working together:

- **Ticket Background** - Runs silently, monitors ticket events, and manages field visibility
- **Ticket Sidebar** - Provides UI to view and toggle ticket type

## 🛠️ Platform Features Demonstrated

### App Locations
- `ticket_background` - Background processing without UI
- `ticket_sidebar` - User interface

### APIs Used
- **Data API:** `client.data.get("ticket")` - Read ticket information
- **Interface API:**
  - `client.interface.trigger("setValue")` - Update field values
  - `client.interface.trigger("show")` / `client.interface.trigger("hide")` - Control field visibility
- **Events API:**
  - `app.activated` - App initialization (ticket create/load)
  - `ticket.typeChanged` - Type change detection
  - `ticket.updated` - Ticket updates
  - `ticket.propertiesLoaded` - Properties loaded (Freshservice)

## 📋 Behavior

**When Ticket Type = "Refund":**
- ✅ Priority automatically set to **High** (value: 3)
- ✅ Internal Notes field is **hidden**
- ✅ State persists on page refresh

**When Ticket Type = "Other" or any other type:**
- ✅ Internal Notes field is **visible**
- ✅ No automatic priority change

**Triggers:**
- On ticket create (if type is already "Refund")
- On ticket type change
- On page refresh (state restored automatically)

## 🚀 Quick Start

```bash
fdk run
```

Open a ticket in Freshdesk/Freshservice (append `?dev=true` to URL) and test the field visibility changes.

## 📁 Project Structure

```
hide-fields/
├── manifest.json                # App configuration
├── app/
│   ├── index.html              # Sidebar UI
│   ├── ticket_background.html  # Background app
│   ├── scripts/
│   │   ├── app.js              # Background logic
│   │   └── sidebar.js          # Sidebar logic
│   └── styles/
│       └── style.css
└── config/
    └── iparams.json
```

## 📚 Learn More

- [Freshworks Platform Documentation](https://developers.freshworks.com/docs/)
- [Data API Reference](https://developers.freshworks.com/docs/data-api/)
- [Interface API Reference](https://developers.freshworks.com/docs/interface-api/)
- [Events API Reference](https://developers.freshworks.com/docs/events-api/)
