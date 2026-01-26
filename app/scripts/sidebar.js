(async function init() {
  const client = await app.initialized();

  async function loadTicketInfo() {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { ticket } = await client.data.get("ticket");
      const statusElement = document.getElementById("status");
      const toggleButton = document.getElementById("toggleBtn");

      if (!ticket) {
        statusElement.textContent = "No ticket";
        toggleButton.disabled = true;
        return;
      }

      const currentType = ticket.type || "N/A";
      statusElement.textContent = `Type: ${currentType}`;
      toggleButton.textContent = currentType === "Refund" ? "Set to Other" : "Set to Refund";
      toggleButton.disabled = false;
    } catch (e) {
      console.error("Error loading ticket info:", e);
      document.getElementById("status").textContent = "Error";
    }
  }

  document.getElementById("toggleBtn").addEventListener("click", async () => {
    try {
      const { ticket } = await client.data.get("ticket");
      const newType = ticket.type === "Refund" ? "Other" : "Refund";

      await client.interface.trigger("setValue", {
        id: "ticket_type",
        value: newType
      });

      // Update UI immediately
      await loadTicketInfo();
      
      // The background script (app.js) will automatically handle note visibility
      // via the ticket.typeChanged event that fires when setValue is called
    } catch (e) {
      console.error("Error toggling ticket type:", e);
      client.interface.trigger("showNotify", {
        type: "danger",
        message: `Error: ${e?.message || "Failed to toggle type"}`
      });
    }
  });

  client.events.on("app.activated", loadTicketInfo);
  client.events.on("ticket.updated", loadTicketInfo);
  client.events.on("ticket.typeChanged", loadTicketInfo);

  loadTicketInfo();
})();
