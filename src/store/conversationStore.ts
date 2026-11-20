import { create } from 'zustand';
import type { ConversationMessage, ConversationRecord, AnalysisResult, ProposedGraphNode, ProposedGraphEdge } from '../types/mind';
import { analyzeText } from '../analysis/analyzer';
import { useMindStore } from './mindStore';

const CONV_KEY = 'neural-mind-studio-conversations-v1';

function makeId(prefix: string) { return `${prefix}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)}`; }

interface ConversationState {
  conversations: ConversationRecord[];
  activeConversationId: string | null;
  messages: ConversationMessage[];
  lastAnalysis: AnalysisResult | null;
  pendingProposal: { nodes: ProposedGraphNode[]; edges: ProposedGraphEdge[] } | null;
  proposalStatus: 'idle' | 'pending' | 'applied' | 'rejected';
  aiConsent: boolean;
  provider: 'local' | 'gemini' | 'openai' | 'openrouter';
  isAnalyzing: boolean;
  newConversation: () => void;
  loadConversation: (id: string) => void;
  addUserMessage: (text: string) => void;
  runAnalysis: (text: string) => Promise<void>;
  applyProposal: () => void;
  rejectProposal: () => void;
  setAiConsent: (v: boolean) => void;
  setProvider: (p: ConversationState['provider']) => void;
  clearAll: () => void;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: (() => { try { const r = localStorage.getItem(CONV_KEY); return r ? JSON.parse(r) : []; } catch { return []; } })(),
  activeConversationId: null,
  messages: [],
  lastAnalysis: null,
  pendingProposal: null,
  proposalStatus: 'idle',
  aiConsent: false,
  provider: 'local',
  isAnalyzing: false,

  newConversation: () => {
    const id = makeId('conv');
    const rec: ConversationRecord = { id, title: 'New reflection', messages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    set((s) => ({ conversations: [rec, ...s.conversations], activeConversationId: id, messages: [], lastAnalysis: null, pendingProposal: null, proposalStatus: 'idle' }));
    persist(get);
  },

  loadConversation: (id) => {
    const rec = get().conversations.find((c) => c.id === id);
    if (!rec) return;
    set({ activeConversationId: id, messages: rec.messages, lastAnalysis: null, pendingProposal: null, proposalStatus: 'idle' });
  },

  addUserMessage: (text) => {
    const msg: ConversationMessage = { id: makeId('m'), role: 'user', text, createdAt: new Date().toISOString() };
    set((s) => {
      const messages = [...s.messages, msg];
      // update conversation record
      const conversations = s.conversations.map((c) => c.id === s.activeConversationId ? { ...c, messages, updatedAt: new Date().toISOString(), title: c.title === 'New reflection' ? text.slice(0, 40) : c.title } : c);
      return { messages, conversations };
    });
    persist(get);
  },

  runAnalysis: async (text) => {
    set({ isAnalyzing: true });
    // Optional real AI via serverless endpoint (only if consent + provider configured)
    let analysis: AnalysisResult | null = null;
    const state = get();
    if (state.aiConsent && state.provider !== 'local') {
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, provider: state.provider }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.analysis) analysis = data.analysis as AnalysisResult;
        }
      } catch { /* fall back */ }
    }
    if (!analysis) analysis = analyzeText(text);

    const assistantMsg: ConversationMessage = {
      id: makeId('m'), role: 'assistant',
      text: analysis.conversation_summary ? `I noticed: ${analysis.conversation_summary}` : 'I have prepared a reflection for you to review.',
      createdAt: new Date().toISOString(),
    };
    set((s) => {
      const messages = [...s.messages, assistantMsg];
      const conversations = s.conversations.map((c) => c.id === s.activeConversationId ? { ...c, messages, updatedAt: new Date().toISOString() } : c);
      return { messages, conversations, lastAnalysis: analysis, pendingProposal: { nodes: analysis!.proposed_graph_nodes, edges: analysis!.proposed_graph_edges }, proposalStatus: 'pending', isAnalyzing: false };
    });
    persist(get);
  },

  applyProposal: () => {
    const p = get().pendingProposal;
    if (!p) return;
    const store = useMindStore.getState();
    store.captureHistory();
    // map tempId -> real id
    const mapping = new Map<string, string>();
    for (const pn of p.nodes) {
      const id = store.addNode(pn.kind, { x: 400 + Math.random() * 200, y: 300 + Math.random() * 200 }, pn.label);
      // apply metadata
      useMindStore.getState().updateNode(id, {
        description: pn.description ?? '',
        intensity: pn.intensity ?? 0.5,
        valence: pn.valence ?? 'neutral',
        tags: pn.tags ?? [],
        provenance: 'ai-suggested',
        confidence: pn.confidence,
        certainty: pn.certainty ?? 'possible',
        evidence: pn.evidence,
      });
      mapping.set(pn.tempId, id);
    }
    for (const pe of p.edges) {
      const src = mapping.get(pe.source) ?? pe.source;
      const tgt = mapping.get(pe.target) ?? pe.target;
      if (src === tgt) continue;
      useMindStore.getState().addConnection({ source: src, target: tgt, sourceHandle: null, targetHandle: null }, pe.relation);
    }
    set({ proposalStatus: 'applied', pendingProposal: null });
  },

  rejectProposal: () => set({ proposalStatus: 'rejected', pendingProposal: null }),

  setAiConsent: (v) => set({ aiConsent: v }),
  setProvider: (p) => set({ provider: p }),

  clearAll: () => {
    try { localStorage.removeItem(CONV_KEY); } catch { /* */ }
    set({ conversations: [], activeConversationId: null, messages: [], lastAnalysis: null, pendingProposal: null, proposalStatus: 'idle' });
  },
}));

function persist(get: () => ConversationState) {
  try { localStorage.setItem(CONV_KEY, JSON.stringify(get().conversations)); } catch { /* */ }
}
