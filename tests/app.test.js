// Vanilla JS test file using Vitest

const client = {
  events: {
    on: vi.fn()
  },
  data: {
    get: vi.fn()
  },
  interface: {
    trigger: vi.fn(() => Promise.resolve())
  }
};

global.app = {
  initialized: vi.fn(() => Promise.resolve(client))
};

describe('app.js — background field rules', function () {
  beforeEach(async function () {
    vi.clearAllMocks();
    vi.resetModules();

    client.data.get.mockResolvedValue({ ticket: { type: 'Refund' } });
    await import('../app/scripts/app.js');
    await new Promise(function (resolve) { setTimeout(resolve, 0); });
  });

  test('app.initialized is called on load', function () {
    expect(global.app.initialized).toHaveBeenCalled();
  });

  test('registers ticket lifecycle event handlers', function () {
    const events = client.events.on.mock.calls.map(function (call) { return call[0]; });
    expect(events).toContain('app.activated');
    expect(events).toContain('ticket.typeChanged');
    expect(events).toContain('ticket.propertiesLoaded');
  });

  test('Refund type hides note and sets High priority', async function () {
    client.data.get.mockResolvedValue({ ticket: { type: 'Refund' } });
    const activatedHandler = client.events.on.mock.calls.find(function (call) {
      return call[0] === 'app.activated';
    })[1];

    await activatedHandler();
    await new Promise(function (resolve) { setTimeout(resolve, 250); });

    expect(client.interface.trigger).toHaveBeenCalledWith('setValue', { id: 'priority', value: 3 });
    expect(client.interface.trigger).toHaveBeenCalledWith('hide', { id: 'note' });
  });

  test('non-Refund type shows note', async function () {
    client.data.get.mockResolvedValue({ ticket: { type: 'Other' } });
    const activatedHandler = client.events.on.mock.calls.find(function (call) {
      return call[0] === 'app.activated';
    })[1];

    await activatedHandler();
    await new Promise(function (resolve) { setTimeout(resolve, 250); });

    expect(client.interface.trigger).toHaveBeenCalledWith('show', { id: 'note' });
  });
});
