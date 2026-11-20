import { useMemo } from 'react';
import { Activity, TrendingUp, Clock, Link2 } from 'lucide-react';
import { useMindStore } from '../store/mindStore';
import { NODE_META, getMindNodeColor } from '../types/mind';

export default function PatternWorkspace() {
  const nodes = useMindStore((s) => s.nodes);
  const edges = useMindStore((s) => s.edges);

  const byKind = useMemo(() => {
    const map: Record<string, number> = {};
    for (const n of nodes) map[n.data.kind] = (map[n.data.kind] ?? 0) + 1;
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [nodes]);

  const topConnected = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of edges) { counts[e.source] = (counts[e.source] ?? 0) + 1; counts[e.target] = (counts[e.target] ?? 0) + 1; }
    return nodes.map((n) => ({ node: n, c: counts[n.id] ?? 0 })).sort((a, b) => b.c - a.c).slice(0, 8);
  }, [nodes, edges]);

  const aiSuggested = nodes.filter((n) => n.data.provenance === 'ai-suggested').length;
  const userConfirmed = nodes.filter((n) => n.data.provenance === 'user-confirmed' || n.data.provenance === 'user-stated').length;

  const timeline = useMemo(() => {
    return [...nodes]
      .filter((n) => n.data.createdAt && n.data.createdAt !== 'seed')
      .sort((a, b) => (a.data.createdAt! < b.data.createdAt! ? -1 : 1))
      .slice(-12);
  }, [nodes]);

  return (
    <div className="workspace-shell">
      <div className="workspace-header">
        <div>
          <div className="workspace-kicker">WORKSPACE F · PATTERN INTELLIGENCE</div>
          <h2 className="workspace-title">Observed patterns</h2>
          <p className="workspace-sub">Descriptive trends from your stored reflections. These are observations, not diagnoses. Nothing here implies a disorder or severity score.</p>
        </div>
      </div>

      <div className="pattern-grid">
        <div className="pattern-card">
          <div className="pattern-card-title"><Activity size={14} /> Concept counts by type</div>
          <div className="pattern-bars">
            {byKind.map(([kind, count]) => {
              const meta = NODE_META[kind as keyof typeof NODE_META];
              const max = byKind[0]?.[1] ?? 1;
              return (
                <div key={kind} className="pattern-bar-row">
                  <span className="pattern-bar-label">{meta?.label ?? kind}</span>
                  <div className="pattern-bar-track"><div className="pattern-bar-fill" style={{ width: `${(count / max) * 100}%`, background: meta?.color ?? '#888' }} /></div>
                  <span className="pattern-bar-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-title"><Link2 size={14} /> Most connected concepts</div>
          <div className="pattern-list">
            {topConnected.map(({ node, c }) => (
              <div key={node.id} className="pattern-row">
                <span className="pattern-dot" style={{ background: getMindNodeColor(node.data) }} />
                <span className="pattern-row-label">{node.data.label}</span>
                <span className="pattern-row-count">{c} links</span>
              </div>
            ))}
            {topConnected.length === 0 && <p className="muted-note">No connections yet.</p>}
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-title"><TrendingUp size={14} /> Provenance</div>
          <div className="pattern-list">
            <div className="pattern-row"><span className="pattern-row-label">User-stated / confirmed</span><span className="pattern-row-count">{userConfirmed}</span></div>
            <div className="pattern-row"><span className="pattern-row-label">AI-suggested</span><span className="pattern-row-count">{aiSuggested}</span></div>
            <div className="pattern-row"><span className="pattern-row-label">Total nodes</span><span className="pattern-row-count">{nodes.length}</span></div>
            <div className="pattern-row"><span className="pattern-row-label">Total connections</span><span className="pattern-row-count">{edges.length}</span></div>
          </div>
        </div>

        <div className="pattern-card pattern-card-wide">
          <div className="pattern-card-title"><Clock size={14} /> Recent additions (timeline)</div>
          {timeline.length === 0 ? (
            <p className="muted-note">No timestamped additions yet. Nodes you create or import with timestamps will appear here.</p>
          ) : (
            <div className="timeline-list">
              {timeline.map((n) => (
                <div key={n.id} className="timeline-row">
                  <span className="timeline-dot" style={{ background: getMindNodeColor(n.data) }} />
                  <span className="timeline-label">{n.data.label}</span>
                  <span className="timeline-kind">{NODE_META[n.data.kind].label}</span>
                  <span className="timeline-date">{new Date(n.data.createdAt!).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pattern-note">
        <strong>How to read this:</strong> These figures describe what is stored in your map. They are not psychological assessments, severity scores or predictions. Recurrence counts reflect how many times a concept appears in your own map, not how often something occurs in your life unless you recorded it.
      </div>
    </div>
  );
}
