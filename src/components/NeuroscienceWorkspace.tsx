import { NEURON_PARTS } from '../data/taxonomy';

export default function NeuroscienceWorkspace() {
  return (
    <div className="workspace-shell">
      <div className="workspace-header">
        <div>
          <div className="workspace-kicker">WORKSPACE H · NEUROSCIENCE EXPLORER</div>
          <h2 className="workspace-title">Neuron anatomy & conceptual communication</h2>
          <p className="workspace-sub">Educational view of biological neuron structure. The mind map nodes in this app are <em>conceptual</em> — they are not biological neurons and do not represent measured brain activity.</p>
        </div>
      </div>
      <div className="neuro-grid">
        {NEURON_PARTS.map((p: any) => (
          <div key={p.id} className="neuro-card">
            <div className="neuro-title">{p.label}</div>
            <div className="neuro-desc">{p.description}</div>
          </div>
        ))}
      </div>
      <div className="neuro-explainer">
        <h3>How a signal travels</h3>
        <p>Dendrites receive input → the soma integrates it → if threshold is reached, an action potential travels down the axon (sped by myelin) → neurotransmitters cross the synapse → the next neuron receives the signal.</p>
        <h3>How this relates to the app</h3>
        <p>The graph\u2019s nodes and edges are <strong>conceptual relationships you define</strong> — not synaptic wiring, not brain scans, not measurements. The animation is a visual metaphor for influence and connection between ideas, not neural firing.</p>
      </div>
    </div>
  );
}
