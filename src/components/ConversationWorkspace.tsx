import { useState } from 'react';
import { Brain, MessageSquare, Send, Sparkles, Trash2, Check, X, ShieldAlert } from 'lucide-react';
import { useConversationStore } from '../store/conversationStore';
import { useMindStore } from '../store/mindStore';
import { NODE_META } from '../types/mind';
import type { AnalysisResult } from '../types/mind';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="conv-section">
      <div className="conv-section-title">{title}</div>
      {children}
    </div>
  );
}

export default function ConversationWorkspace() {
  const messages = useConversationStore((s) => s.messages);
  const isAnalyzing = useConversationStore((s) => s.isAnalyzing);
  const lastAnalysis = useConversationStore((s) => s.lastAnalysis);
  const pendingProposal = useConversationStore((s) => s.pendingProposal);
  const proposalStatus = useConversationStore((s) => s.proposalStatus);
  const aiConsent = useConversationStore((s) => s.aiConsent);
  const provider = useConversationStore((s) => s.provider);
  const addUserMessage = useConversationStore((s) => s.addUserMessage);
  const runAnalysis = useConversationStore((s) => s.runAnalysis);
  const applyProposal = useConversationStore((s) => s.applyProposal);
  const rejectProposal = useConversationStore((s) => s.rejectProposal);
  const setAiConsent = useConversationStore((s) => s.setAiConsent);
  const setProvider = useConversationStore((s) => s.setProvider);
  const newConversation = useConversationStore((s) => s.newConversation);
  const clearAll = useConversationStore((s) => s.clearAll);

  const [input, setInput] = useState('');

  const submit = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    addUserMessage(text);
    await runAnalysis(text);
  };

  const analysis = lastAnalysis as AnalysisResult | null;

  return (
    <div className="workspace-shell">
      <div className="workspace-header">
        <div>
          <div className="workspace-kicker">WORKSPACE B · AI CONVERSATION</div>
          <h2 className="workspace-title">Reflective conversation</h2>
          <p className="workspace-sub">Share an experience. The system extracts possible thoughts, emotions, needs and patterns, then proposes graph changes for your review. Nothing is saved to your map without your approval.</p>
        </div>
        <div className="workspace-actions">
          <button className="ghost-button" onClick={newConversation}><MessageSquare size={14} /> New</button>
          <button className="ghost-button danger-ghost" onClick={() => { if (confirm('Delete all conversations?')) clearAll(); }}><Trash2 size={14} /> Clear</button>
        </div>
      </div>

      <div className="conv-grid">
        <div className="conv-chat">
          <div className="conv-messages">
            {messages.length === 0 && (
              <div className="conv-empty">
                <Brain size={32} />
                <p>Start by describing a recent experience, thought or feeling. Your words are preserved exactly as written.</p>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`conv-msg conv-msg-${m.role}`}>
                <div className="conv-msg-role">{m.role === 'user' ? 'You' : 'Studio'}</div>
                <div className="conv-msg-text">{m.text}</div>
              </div>
            ))}
            {isAnalyzing && <div className="conv-msg conv-msg-assistant"><div className="conv-msg-role">Studio</div><div className="conv-msg-text conv-typing">Analyzing…</div></div>}
          </div>
          <div className="conv-input-row">
            <textarea
              className="conv-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what happened, what you thought, and how you felt…"
              rows={3}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(); }}
            />
            <button className="primary-button" onClick={submit} disabled={isAnalyzing || !input.trim()}><Send size={14} /> Reflect</button>
          </div>
          <div className="conv-consent">
            <label className="consent-row">
              <input type="checkbox" checked={aiConsent} onChange={(e) => setAiConsent(e.target.checked)} />
              <span>Allow sending this conversation to an external AI provider</span>
            </label>
            <select className="field-control conv-provider" value={provider} onChange={(e) => setProvider(e.target.value as any)} disabled={!aiConsent}>
              <option value="local">Local heuristic (no data leaves device)</option>
              <option value="gemini">Google Gemini (server-side key)</option>
              <option value="openai">OpenAI (server-side key)</option>
              <option value="openrouter">OpenRouter (server-side key)</option>
            </select>
            <span className="conv-consent-note">API keys are read from server environment variables only. Never stored in the browser.</span>
          </div>
        </div>

        <div className="conv-analysis">
          {!analysis && (
            <div className="conv-analysis-empty">
              <Sparkles size={24} />
              <p>After you share a reflection, possible emotions, thoughts, patterns, needs and proposed graph changes will appear here for your review.</p>
            </div>
          )}
          {analysis && (
            <>
              <Section title="Situation">
                <ul className="conv-list">{analysis.situation.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </Section>
              <Section title="Possible emotions">
                {analysis.emotions.length ? analysis.emotions.map((e, i) => (
                  <div key={i} className="conv-chip-row">
                    <span className="conv-chip" style={{ background: NODE_META.emotion.tint, color: NODE_META.emotion.color }}>{e.name}</span>
                    <span className="conv-conf">confidence {Math.round(e.confidence * 100)}% · {e.certainty}</span>
                  </div>
                )) : <p className="muted-note">None detected.</p>}
              </Section>
              <Section title="Possible thoughts">
                {analysis.thoughts.length ? analysis.thoughts.map((t, i) => (
                  <div key={i} className="conv-thought">
                    <div className="conv-thought-text">“{t.original_text}”</div>
                    <div className="conv-thought-meta">{t.type} · {t.certainty}</div>
                  </div>
                )) : <p className="muted-note">None detected.</p>}
              </Section>
              <Section title="Possible cognitive patterns">
                {analysis.cognitive_patterns.length ? analysis.cognitive_patterns.map((p, i) => (
                  <div key={i} className="conv-pattern">
                    <strong>{p.name}</strong>
                    <span className="conv-conf">confidence {Math.round(p.confidence * 100)}% · requires your confirmation</span>
                    <div className="conv-evidence">“{p.evidence}”</div>
                  </div>
                )) : <p className="muted-note">None detected.</p>}
              </Section>
              {analysis.possible_needs.length > 0 && (
                <Section title="Possible needs">
                  <div className="conv-chips">{analysis.possible_needs.map((n) => <span key={n} className="conv-chip" style={{ background: NODE_META.need.tint, color: NODE_META.need.color }}>{n}</span>)}</div>
                </Section>
              )}
              {analysis.reported_behaviours.length > 0 && (
                <Section title="Reported behaviours">
                  <div className="conv-chips">{analysis.reported_behaviours.map((b) => <span key={b} className="conv-chip" style={{ background: NODE_META.behavior.tint, color: NODE_META.behavior.color }}>{b}</span>)}</div>
                </Section>
              )}
              <Section title="Alternative perspectives">
                <ul className="conv-list">{analysis.alternative_perspectives.map((a: string, i: number) => <li key={i}>{a}</li>)}</ul>
              </Section>
              <Section title="Suggested exercises">
                <ul className="conv-list">{analysis.suggested_exercises.map((a: string, i: number) => <li key={i}>{a}</li>)}</ul>
              </Section>
              {analysis.professional_support_considerations.length > 0 && (
                <Section title="Professional support">
                  <div className="conv-safety"><ShieldAlert size={14} /> {analysis.professional_support_considerations.join(' ')}</div>
                </Section>
              )}
              {analysis.clarifying_questions.length > 0 && (
                <Section title="Clarifying questions">
                  <ul className="conv-list">{analysis.clarifying_questions.map((q: string, i: number) => <li key={i}>{q}</li>)}</ul>
                </Section>
              )}

              {/* Proposal review */}
              {pendingProposal && pendingProposal.nodes.length > 0 && (
                <div className="proposal-card">
                  <div className="proposal-title"><Sparkles size={14} /> Proposed changes to your mind map</div>
                  <p className="proposal-sub">Review before anything is saved. {pendingProposal.nodes.length} node(s), {pendingProposal.edges.length} connection(s).</p>
                  <div className="proposal-list">
                    {pendingProposal.nodes.map((n: any) => (
                      <div key={n.tempId} className="proposal-item">
                        <span className="proposal-dot" style={{ background: NODE_META[n.kind as keyof typeof NODE_META].color }} />
                        <div>
                          <div className="proposal-label">{n.label} <span className="proposal-kind">({NODE_META[n.kind as keyof typeof NODE_META].label})</span></div>
                          <div className="proposal-meta">confidence {Math.round((n.confidence ?? 0.5) * 100)}% · {n.certainty ?? 'possible'} · ai-suggested</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="proposal-actions">
                    <button className="primary-button" onClick={applyProposal}><Check size={14} /> Add to my map</button>
                    <button className="ghost-button" onClick={rejectProposal}><X size={14} /> Reject</button>
                  </div>
                </div>
              )}
              {proposalStatus === 'applied' && <div className="proposal-status ok">Changes added to your map. You can edit or remove them in the Mind Map workspace.</div>}
              {proposalStatus === 'rejected' && <div className="proposal-status">Proposal rejected. Nothing was changed.</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
