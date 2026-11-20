import type { Edge, Node } from '@xyflow/react';

export type MindNodeKind =
  | 'emotion'
  | 'thought'
  | 'memory'
  | 'pattern'
  | 'need'
  | 'body'
  | 'behavior'
  | 'trigger'
  | 'belief'
  | 'context'
  | 'value'
  | 'goal'
  | 'strength'
  | 'coping'
  | 'identity'
  | 'relationship'
  | 'concept';

export type MindRelation =
  | 'activates'
  | 'intensifies'
  | 'soothes'
  | 'arises from'
  | 'recalls'
  | 'reinforces'
  | 'inhibits'
  | 'signals a need'
  | 'leads to'
  | 'reframes'
  | 'supports'
  | 'conflicts with'
  | 'co-occurs with'
  | 'belongs to'
  | 'influences'
  | 'challenges'
  | 'fulfils';

export type ThoughtValence = 'positive' | 'negative' | 'mixed' | 'neutral';

export type Provenance = 'user-stated' | 'user-confirmed' | 'ai-suggested' | 'user-corrected' | 'uncertain' | 'archived';

export type Certainty = 'possible' | 'likely' | 'confirmed' | 'uncertain';

export interface MindNodeData extends Record<string, unknown> {
  label: string;
  kind: MindNodeKind;
  description: string;
  innerVoice: string;
  balancedVoice: string;
  intensity: number;
  valence: ThoughtValence;
  tags: string[];
  source?: string;
  isCore?: boolean;
  createdAt?: string;
  updatedAt?: string;
  provenance?: Provenance;
  confidence?: number;
  certainty?: Certainty;
  evidence?: string;
  occurrenceCount?: number;
  archived?: boolean;
  emotionFamily?: string;
  thoughtType?: string;
  patternType?: string;
  needType?: string;
}

export interface MindEdgeData extends Record<string, unknown> {
  relation: MindRelation;
  weight: number;
  note?: string;
  signal?: boolean;
  provenance?: Provenance;
  confidence?: number;
  createdAt?: string;
}

export type MindNode = Node<MindNodeData, 'mind'>;
export type MindEdge = Edge<MindEdgeData, 'neural'>;

export interface MindScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  nodeIds: string[];
  color: string;
}

export interface MindProjectFile {
  app: 'neural-mind-studio';
  schemaVersion: number;
  exportedAt: string;
  nodes: MindNode[];
  edges: MindEdge[];
  conversations?: ConversationRecord[];
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
}

export interface ConversationRecord {
  id: string;
  title: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProposedGraphNode {
  tempId: string;
  kind: MindNodeKind;
  label: string;
  description?: string;
  evidence?: string;
  confidence?: number;
  certainty?: Certainty;
  valence?: ThoughtValence;
  intensity?: number;
  tags?: string[];
}

export interface ProposedGraphEdge {
  tempId: string;
  source: string;
  target: string;
  relation: MindRelation;
  weight?: number;
  note?: string;
  confidence?: number;
}

export interface AnalysisResult {
  conversation_summary: string;
  situation: string[];
  emotions: { name: string; evidence: string; confidence: number; intensity: number | null; certainty: Certainty }[];
  thoughts: { original_text: string; normalized_text?: string; type: string; certainty: Certainty }[];
  cognitive_patterns: { name: string; evidence: string; confidence: number; requires_confirmation: boolean }[];
  possible_needs: string[];
  reported_behaviours: string[];
  alternative_perspectives: string[];
  suggested_exercises: string[];
  professional_support_considerations: string[];
  proposed_graph_nodes: ProposedGraphNode[];
  proposed_graph_edges: ProposedGraphEdge[];
  clarifying_questions: string[];
}

export const NODE_META: Record<MindNodeKind, { label: string; color: string; tint: string; icon: string; description: string }> = {
  emotion: { label: 'Emotion', color: '#f5b94c', tint: 'rgba(245,185,76,.15)', icon: '◉', description: 'A felt emotional experience.' },
  thought: { label: 'Thought', color: '#70a7ff', tint: 'rgba(112,167,255,.15)', icon: '✧', description: 'An idea, prediction, assumption or reflection.' },
  memory: { label: 'Memory', color: '#b99aff', tint: 'rgba(185,154,255,.15)', icon: '◈', description: 'A user-described experience or recollection.' },
  pattern: { label: 'Pattern', color: '#ff8d68', tint: 'rgba(255,141,104,.15)', icon: '⟳', description: 'A possible recurring cognitive pattern.' },
  need: { label: 'Need', color: '#59d3c2', tint: 'rgba(89,211,194,.15)', icon: '◇', description: 'An unmet or fulfilled personal need.' },
  body: { label: 'Body signal', color: '#f18db3', tint: 'rgba(241,141,179,.15)', icon: '⌁', description: 'A physical sensation or body state.' },
  behavior: { label: 'Behavior', color: '#81d69b', tint: 'rgba(129,214,155,.15)', icon: '↗', description: 'An action or response.' },
  trigger: { label: 'Trigger', color: '#ff6d79', tint: 'rgba(255,109,121,.15)', icon: '⚡', description: 'A situation or cue that precedes a response.' },
  belief: { label: 'Core belief', color: '#b4c0d3', tint: 'rgba(180,192,211,.15)', icon: '◎', description: 'A belief about self, others or the world.' },
  context: { label: 'Context', color: '#8ba7bd', tint: 'rgba(139,167,189,.15)', icon: '▧', description: 'A setting, circumstance or environment.' },
  value: { label: 'Value', color: '#f0c36d', tint: 'rgba(240,195,109,.15)', icon: '★', description: 'A personal value or guiding principle.' },
  goal: { label: 'Goal', color: '#6fd3a8', tint: 'rgba(111,211,168,.15)', icon: '◎', description: 'A personal goal or intention.' },
  strength: { label: 'Strength', color: '#7dd3fc', tint: 'rgba(125,211,252,.15)', icon: '▲', description: 'A personal strength or resource.' },
  coping: { label: 'Coping strategy', color: '#c4b5fd', tint: 'rgba(196,181,253,.15)', icon: '◆', description: 'A strategy used to manage difficulty.' },
  identity: { label: 'Identity', color: '#f9a8d4', tint: 'rgba(249,168,212,.15)', icon: '●', description: 'An aspect of self-concept or identity.' },
  relationship: { label: 'Relationship', color: '#fdba74', tint: 'rgba(253,186,116,.15)', icon: '♡', description: 'A person or relationship in the user\u2019s life.' },
  concept: { label: 'Concept', color: '#94a3b8', tint: 'rgba(148,163,184,.15)', icon: '○', description: 'A general concept or theme.' },
};

export const RELATIONS: MindRelation[] = [
  'activates', 'intensifies', 'soothes', 'arises from', 'recalls', 'reinforces',
  'inhibits', 'signals a need', 'leads to', 'reframes', 'supports', 'conflicts with', 'co-occurs with',
  'belongs to', 'influences', 'challenges', 'fulfils',
];

export function getMindNodeColor(data: Pick<MindNodeData, 'kind' | 'label'>): string {
  if (data.kind === 'emotion') {
    const label = data.label.toLowerCase();
    const emotionColors: Array<[string[], string]> = [
      [['joy', 'happiness', 'happy', 'gratitude', 'hope', 'excitement', 'contentment', 'relief'], '#f5c65e'],
      [['sadness', 'sad', 'grief', 'sorrow', 'disappointment'], '#70a7ff'],
      [['anxiety', 'worry', 'fear', 'panic', 'overwhelm'], '#ff9a68'],
      [['anger', 'rage', 'irritation', 'frustration', 'resentment'], '#ff6879'],
      [['regret', 'guilt'], '#b99aff'],
      [['calm', 'relief', 'peace', 'contentment'], '#59d3c2'],
      [['shame', 'embarrassment'], '#e58ab8'],
      [['loneliness', 'isolation'], '#9197e8'],
      [['curiosity', 'interest'], '#70d4c4'],
    ];
    const match = emotionColors.find(([aliases]) => aliases.some((alias) => label.includes(alias)));
    if (match) return match[1];
  }
  return NODE_META[data.kind].color;
}

export const SCHEMA_VERSION = 2;
