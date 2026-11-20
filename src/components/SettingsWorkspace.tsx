import { useState } from 'react';
import { useMindStore } from '../store/mindStore';
import { useConversationStore } from '../store/conversationStore';

export default function SettingsWorkspace() {
  const nodes = useMindStore((s) => s.nodes);
  const edges = useMindStore((s) => s.edges);
  const resetToStarter = useMindStore((s) => s.resetToStarter);
  const loadProject = useMindStore((s) => s.loadProject);
  const clearAllConvs = useConversationStore((s) => s.clearAll);
  const [confirmText, setConfirmText] = useState('');

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ nodes, edges, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'neural-mind-studio-export.json'; a.click(); URL.revokeObjectURL(url);
  };

  const clearMap = () => {
    if (confirmText !== 'DELETE') { alert('Type DELETE to confirm.'); return; }
    resetToStarter();
    setConfirmText('');
  };

  return (
    <div className="workspace-shell">
      <div className="workspace-header">
        <div>
          <div className="workspace-kicker">WORKSPACE J · SETTINGS & DATA CONTROL</div>
          <h2 className="workspace-title">Privacy and data control</h2>
          <p className="workspace-sub">Your map and conversations are stored on this device (localStorage). You own your data and can export or delete it at any time.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h3>Data</h3>
          <p>Nodes: {nodes.length} · Connections: {edges.length}</p>
          <div className="settings-actions">
            <button className="primary-button" onClick={exportData}>Export all data (JSON)</button>
            <button className="ghost-button" onClick={() => { try { localStorage.removeItem('neural-mind-studio-project-v1'); alert('Local autosave cleared. Reload to reset.'); } catch { /* */ } }}>Clear autosave</button>
            <button className="danger-button" onClick={() => { if (confirm('Delete all conversations?')) clearAllConvs(); }}>Delete all conversations</button>
          </div>
        </div>

        <div className="settings-card">
          <h3>Delete mind map</h3>
          <p>This resets your map to the starter example. Type <strong>DELETE</strong> to confirm.</p>
          <input className="field-control" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE" />
          <button className="danger-button" onClick={clearMap} style={{ marginTop: 8 }}>Reset mind map</button>
        </div>

        <div className="settings-card">
          <h3>AI providers</h3>
          <p>API keys are read from server environment variables only (GEMINI_API_KEY, OPENAI_API_KEY). They are never stored in the browser or sent to the client. Configure them in your Vercel project settings.</p>
          <p>Local heuristic analysis works without any key and never leaves your device.</p>
        </div>

        <div className="settings-card">
          <h3>Privacy principles</h3>
          <ul className="conv-list">
            <li>No background recording or monitoring.</li>
            <li>Voice features require explicit user interaction.</li>
            <li>External AI is used only with your consent per conversation.</li>
            <li>Raw audio is not stored unless you enable it.</li>
            <li>No sensitive data is written to application logs.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
