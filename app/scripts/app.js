(async function init() {
  const client = await app.initialized();

  client.events.on("app.activated", handleTicketLoad);
  client.events.on("ticket.updated", handleTicketLoad);
  client.events.on("ticket.typeChanged", handleTicketLoad);
  client.events.on("ticket.propertiesLoaded", handleTicketLoad);

  async function handleTicketLoad() {
    try {
      // Add a small delay to ensure ticket data is fully loaded
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const { ticket } = await client.data.get("ticket");

      if (!ticket) {
        console.log("No ticket context available");
        return;
      }

      console.log("Ticket data:", JSON.stringify(ticket, null, 2));
      console.log("Ticket type:", ticket.type, "Type check:", ticket.type === "Refund");

      const ticketType = ticket.type?.toString().toLowerCase() || "";

      if (ticketType === "refund") {
        await client.interface.trigger("setValue", {
          id: "priority",
          value: 3
        });

        await client.interface.trigger("hide", {
          id: "note"
        });

        console.log("Refund ticket → Priority set to High + Internal Notes hidden");
      } else {
        // Explicitly show note for all other types including "Other"
        await client.interface.trigger("show", {
          id: "note"
        });

        console.log(`Ticket type: ${ticket.type || "N/A"} → Internal Notes shown`);
      }
    } catch (e) {
      console.error("Error handling ticket load:", e);
    }
  }
})();
