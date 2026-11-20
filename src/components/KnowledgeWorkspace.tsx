import { useState } from 'react';
import { BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { KNOWLEDGE_DOMAINS } from '../data/taxonomy';

export default function KnowledgeWorkspace() {
  const [query, setQuery] = useState('');
  const filtered = KNOWLEDGE_DOMAINS.filter((d: any) => d.label.toLowerCase().includes(query.toLowerCase()) || d.scope.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="workspace-shell">
      <div className="workspace-header">
        <div>
          <div className="workspace-kicker">WORKSPACE I · KNOWLEDGE LIBRARY</div>
          <h2 className="workspace-title">Psychology & neuroscience domains</h2>
          <p className="workspace-sub">Educational reference for the disciplines that inform this platform. These are distinct fields with different scopes — not interchangeable professions.</p>
        </div>
      </div>
      <div className="conv-input-row" style={{ marginBottom: 16 }}>
        <input className="field-control" placeholder="Search domains…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="knowledge-grid">
        {filtered.map((d: any) => (
          <div key={d.id} className="knowledge-card">
            <div className="knowledge-title">{d.label}</div>
            <div className="knowledge-scope">{d.scope}</div>
          </div>
        ))}
      </div>
      <div className="pattern-note">
        <strong>Note:</strong> This library is educational. It does not provide professional diagnosis, treatment or medical advice. For clinical concerns, consult a qualified professional.
      </div>
    </div>
  );
}
