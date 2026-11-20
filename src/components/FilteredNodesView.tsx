import { useMemo } from 'react';
import { useMindStore } from '../store/mindStore';
import { NODE_META, getMindNodeColor } from '../types/mind';

interface Props {
  kinds: string[];
  title: string;
  subtitle: string;
  emptyHint: string;
}

export default function FilteredNodesView({ kinds, title, subtitle, emptyHint }: Props) {
  const nodes = useMindStore((s) => s.nodes);
  const edges = useMindStore((s) => s.edges);
  const setNodes = useMindStore((s) => s.setNodes);

  const filtered = useMemo(() => nodes.filter((n) => kinds.includes(n.data.kind) && !n.data.archived), [nodes, kinds]);
  const kindSet = new Set(kinds);

  const focusNode = (id: string) => {
    setNodes(nodes.map((n) => ({ ...n, selected: n.id === id })));
  };

  return (
    <div className="workspace-shell">
      <div className="workspace-header">
        <div>
          <div className="workspace-kicker">FILTERED VIEW</div>
          <h2 className="workspace-title">{title}</h2>
          <p className="workspace-sub">{subtitle}</p>
        </div>
        <div className="workspace-actions">
          <div className="title-stat"><strong>{filtered.length}</strong><span>NODES</span></div>
          <div className="title-stat"><strong>{edges.filter((e) => filtered.some((n) => n.id === e.source || n.id === e.target)).length}</strong><span>LINKS</span></div>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="conv-analysis-empty"><p>{emptyHint}</p></div>
      ) : (
        <div className="filtered-grid">
          {filtered.map((n) => {
            const meta = NODE_META[n.data.kind];
            const color = getMindNodeColor(n.data);
            const connected = edges.filter((e) => e.source === n.id || e.target === n.id).length;
            return (
              <button key={n.id} className="filtered-card" onClick={() => focusNode(n.id)}>
                <span className="filtered-dot" style={{ background: color }} />
                <div className="filtered-body">
                  <div className="filtered-label">{n.data.label}</div>
                  <div className="filtered-meta">{meta.label} · {connected} connection{connected === 1 ? '' : 's'} · intensity {Math.round(Number(n.data.intensity) * 100)}%</div>
                  {n.data.description ? <div className="filtered-desc">{String(n.data.description)}</div> : null}
                  {n.data.evidence ? <div className="filtered-evidence">"{String(n.data.evidence)}"</div> : null}
                  <div className="filtered-prov">{String(n.data.provenance ?? 'user-stated')}{n.data.confidence != null ? ` · confidence ${Math.round(Number(n.data.confidence) * 100)}%` : ''}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
