Use Cases - Hide Fields / Damazon Customer Support
===================================================

Company Overview
----------------

**Damazon** is a global e-commerce company utilizing **Freshdesk** to manage millions of customer inquiries daily, including order issues, refunds, product questions, and account management across tiered support workflows.

* * * * *

Use Case Scenarios
------------------

### 1\. Refund Ticket Streamlining

**Scenario**: During peak refund seasons, refund specialists process hundreds of tickets per day. Internal Notes fields and optional properties slow down a workflow that should be fast and consistent.

**Use Case**: The background app detects ticket type **Refund**, sets priority to High, and hides the Internal Notes field via Interface Methods. Specialists see a streamlined ticket view automatically — even when the sidebar app is closed — because rules run in `ticket_background`.

* * * * *

### 2\. Automated Priority Enforcement

**Scenario**: Refund tickets were inconsistently prioritized manually; SLA breaches on high-value refunds cost Damazon revenue and customer trust.

**Use Case**: When type is Refund, the app calls `setValue` on `priority` to High (3) on every ticket load and type change. Priority assignment is no longer dependent on agent memory or training drift — compliance reaches 100% for the refund queue.

* * * * *

### 3\. Properties Widget Customization per Team

**Scenario**: Tier 1 agents need full access to status, priority, and tags, while refund specialists should hide or disable fields they must not edit during triage.

**Use Case**: The React sidebar exposes Show, Hide, Enable, and Disable controls for core property fields (`status`, `priority`, `ticket_type`, `group`, `product`, `tag`). Each agent's last selection persists per ticket in `localStorage` and re-applies on refresh with the active button highlighted.

* * * * *

### 4\. Workflow Compliance Across Page Refreshes

**Scenario**: Agents refresh tickets or navigate away mid-session; manually hidden fields and priority changes were lost, causing rework and inconsistent customer experiences.

**Use Case**: Background logic listens to `app.activated`, `ticket.updated`, `ticket.typeChanged`, and `ticket.propertiesLoaded` to re-apply Refund rules without polling. Sidebar persistence re-applies saved property visibility silently on load, keeping UI state aligned with business rules.

* * * * *

### 5\. Role-Based Field Visibility Training

**Scenario**: Damazon onboards refund specialists and tier 1 agents with different field-access expectations. Trainers need a safe sandbox to demonstrate Interface Methods on live tickets.

**Use Case**: Hide Fields serves as both production automation (background) and an interactive catalog (sidebar). Trainers demo `hide`, `show`, `enable`, and `disable` on property fields while new hires practice on trial accounts, learning documented element IDs before building custom apps.
