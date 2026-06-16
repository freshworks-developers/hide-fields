import { useCallback, useEffect, useMemo, useState } from 'react';
import { FwButton, FwSpinner } from '@freshworks/crayons/react';
import '../bootstrap/crayonsInit';
import { useAppLifecycle } from './PlaceholderWrapper';

const PROPERTY_FIELDS = [
  { id: 'status', label: 'status' },
  { id: 'priority', label: 'priority' },
  { id: 'ticket_type', label: 'ticket_type' },
  { id: 'group', label: 'group' },
  { id: 'product', label: 'product' },
  { id: 'tag', label: 'tag' }
];

const ACTIONS = [
  { id: 'show', label: 'Show' },
  { id: 'hide', label: 'Hide' },
  { id: 'enable', label: 'Enable' },
  { id: 'disable', label: 'Disable' }
];

function storageKey(ticketId) {
  return ticketId ? `hide-fields-properties-${ticketId}` : 'hide-fields-properties';
}

function readState(ticketId) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(ticketId)) || '{}');
  } catch (error) {
    return {};
  }
}

function writeState(ticketId, next) {
  localStorage.setItem(storageKey(ticketId), JSON.stringify(next));
}

async function notify(client, type, message) {
  if (!client) {
    return;
  }
  return client.interface.trigger('showNotify', {
    type,
    title: type === 'success' ? 'Hide Fields' : 'Hide Fields error',
    message
  });
}

export default function TicketSidebarApp() {
  const { client, isInitialized } = useAppLifecycle();
  const [loading, setLoading] = useState(true);
  const [ticketId, setTicketId] = useState('');
  const [selected, setSelected] = useState({});
  const [running, setRunning] = useState(false);

  const selectedKey = useMemo(() => storageKey(ticketId), [ticketId]);

  const load = useCallback(async function () {
    if (!client) {
      return;
    }

    setLoading(true);

    try {
      const ticketData = await client.data.get('ticket');
      const currentTicketId = ticketData && ticketData.ticket ? String(ticketData.ticket.id) : '';
      setTicketId(currentTicketId);

      const initial = readState(currentTicketId);
      setSelected(initial);

      try {
        client.instance.resize({ height: '520px' });
      } catch (_) {}

      // Re-apply saved actions silently (no toasts) so refresh restores UI state.
      const entries = Object.entries(initial);
      for (let i = 0; i < entries.length; i += 1) {
        const [fieldId, action] = entries[i];
        if (!action) continue;
        try {
          // eslint-disable-next-line no-await-in-loop
          await client.interface.trigger(action, { id: fieldId });
        } catch (_) {
          // ignore - fields may not exist on some accounts
        }
      }
    } catch (error) {
      console.error('Failed to initialize properties catalog', error);
      await notify(client, 'danger', 'Could not load ticket context for this sidebar.');
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(function () {
    if (isInitialized && client) {
      load();
    }
  }, [isInitialized, client, load]);

  async function runAction(fieldId, action) {
    if (!client || running) {
      return;
    }

    setRunning(true);

    try {
      await client.interface.trigger(action, { id: fieldId });

      setSelected(function (prev) {
        const next = { ...prev, [fieldId]: action };
        writeState(ticketId, next);
        return next;
      });
    } catch (error) {
      console.error('Interface method failed', error);
      await notify(client, 'danger', error && error.message ? error.message : 'Action failed.');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="hf-root">
      <h3 className="hf-title">Properties widget</h3>
      <p className="hf-subtitle">Show/Hide/Enable/Disable for core ticket property fields. Selection persists per ticket.</p>

      {loading ? (
        <div className="hf-loadingRow">
          <FwSpinner size="small" />
          <span className="hf-hint">Loading…</span>
        </div>
      ) : (
        <div className="hf-catalog" key={selectedKey}>
          {PROPERTY_FIELDS.map((field) => (
            <div key={field.id} className="hf-field">
              <div className="hf-fieldLabel">{field.label}</div>
              <div className="hf-btnRow">
                {ACTIONS.map((a) => (
                  <FwButton
                    key={a.id}
                    size="small"
                    color={selected[field.id] === a.id ? 'primary' : 'secondary'}
                    disabled={running}
                    onClick={() => runAction(field.id, a.id)}
                  >
                    {a.label}
                  </FwButton>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

