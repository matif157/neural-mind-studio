// Heuristic cognitive-analysis pipeline.
// This runs entirely client-side and requires no API key. It produces a structured
// AnalysisResult that the user reviews before any graph change is persisted.
// It is intentionally conservative: suggestions are labelled "possible" / "ai-suggested"
// and never presented as diagnoses.

import type { AnalysisResult, ProposedGraphEdge, ProposedGraphNode } from '../types/mind';
import { EMOTION_TAXONOMY, PATTERN_TAXONOMY, NEED_TAXONOMY, THOUGHT_TYPES } from '../data/taxonomy';

function lower(s: string) { return s.toLowerCase(); }

function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
}

function containsAny(text: string, terms: string[]): boolean {
  const t = lower(text);
  return terms.some((term) => t.includes(term));
}

function matchTaxonomy(text: string, list: { id: string; label: string; aliases?: string[] }[]) {
  const t = lower(text);
  const out: string[] = [];
  for (const entry of list) {
    const terms = [entry.label.toLowerCase(), ...(entry.aliases ?? []).map((a) => a.toLowerCase())];
    if (terms.some((term) => t.includes(term))) out.push(entry.label);
  }
  return out;
}

export function analyzeText(text: string): AnalysisResult {
  const trimmed = text.trim();
  const sents = sentences(trimmed);
  const situation = sents.length ? sents.slice(0, 3) : [trimmed];

  // Emotions
  const emotionLabels = matchTaxonomy(trimmed, EMOTION_TAXONOMY);
  const emotions = emotionLabels.map((name) => ({
    name,
    evidence: trimmed.slice(0, 140),
    confidence: 0.62,
    intensity: null,
    certainty: 'possible' as const,
  }));

  // Cognitive patterns: detect via aliases
  const cognitive_patterns = PATTERN_TAXONOMY
    .filter((p) => {
      const aliasHit = (p.aliases ?? []).some((a) => lower(trimmed).includes(a.toLowerCase()));
      const labelHit = lower(trimmed).includes(p.label.toLowerCase());
      // Targeted phrase heuristics for common predictive worries.
      let phraseHit = false;
      if (p.id === 'catastrophizing' && /what if\b.*\b(wrong|fail|bad|happen|disaster|ruin|everything)/i.test(trimmed)) phraseHit = true;
      if (p.id === 'fortune-telling' && /\b(will definitely|going to (fail|be bad)|won't work|it'll never)\b/i.test(trimmed)) phraseHit = true;
      if (p.id === 'rumination' && /\b(keep thinking|can't stop thinking|replaying|over and over)\b/i.test(trimmed)) phraseHit = true;
      return aliasHit || labelHit || phraseHit;
    })
    .map((p) => ({
      name: p.label,
      evidence: trimmed.slice(0, 140),
      confidence: 0.6,
      requires_confirmation: true,
    }));

  // Needs
  const possible_needs = matchTaxonomy(trimmed, NEED_TAXONOMY);

  // Reported behaviours: simple verb-phrase heuristics
  const behaviourMarkers = ['avoid', 'withdraw', 'procrastinate', 'snap', 'shout', 'cry', 'sleep', 'exercise', 'talk to', 'message', 'isolate', 'drink', 'scroll'];
  const reported_behaviours = behaviourMarkers.filter((m) => lower(trimmed).includes(m));

  // Thoughts: treat each sentence as a candidate thought; classify type
  const thoughts = sents.map((s) => {
    const t = lower(s);
    let type = 'automatic';
    if (t.includes('what if') || t.includes('might') || t.includes('could') || t.includes('probably')) type = 'prediction';
    else if (t.includes('i am') || t.includes("i'm") || t.includes('i always') || t.includes('i never')) type = 'self-evaluation';
    else if (t.includes('they') && (t.includes('think') || t.includes('must'))) type = 'assumption';
    else if (t.includes('should') || t.includes('must')) type = 'assumption';
    else if (t.includes('why') || t.includes('meaning')) type = 'existential';
    return { original_text: s, normalized_text: s.length > 80 ? s.slice(0, 77) + '…' : s, type, certainty: 'possible' as const };
  });

  // Alternative perspectives
  const alternative_perspectives: string[] = [];
  if (cognitive_patterns.length) {
    alternative_perspectives.push('Consider whether the most likely outcome is less extreme than the worst imagined one.');
  }
  if (emotions.length) {
    alternative_perspectives.push('Notice the feeling without treating it as proof of the thought.');
  }
  if (possible_needs.length) {
    alternative_perspectives.push('The feeling may signal an unmet need; naming the need can open new responses.');
  }
  if (!alternative_perspectives.length) {
    alternative_perspectives.push('Explore what else could be true while still respecting how you feel.');
  }

  // Exercises
  const suggested_exercises: string[] = ['Thought journaling', 'Emotion identification'];
  if (cognitive_patterns.some((p) => p.name === 'Rumination')) suggested_exercises.push('Scheduled worry time and attention shifting');
  if (emotions.some((e) => e.name === 'Anxiety' || e.name === 'Overwhelm')) suggested_exercises.push('Grounding (5-4-3-2-1) and slow breathing');
  if (possible_needs.includes('Connection')) suggested_exercises.push('Reach out to one trusted person');
  if (reported_behaviours.includes('avoid')) suggested_exercises.push('One small approach step');

  // Professional support considerations
  const professional_support_considerations: string[] = [];
  const distressMarkers = ['suicide', 'kill myself', 'end it', 'hopeless', 'worthless', 'can\'t go on', 'self-harm', 'hurt myself'];
  if (containsAny(trimmed, distressMarkers)) {
    professional_support_considerations.push('Some of what you shared may indicate significant distress. This conversation cannot diagnose or treat. Please consider contacting a qualified mental health professional or, if you are in immediate danger, emergency services and a trusted person.');
  }

  // Proposed graph nodes
  const proposed_graph_nodes: ProposedGraphNode[] = [];
  const tempId = (k: string, label: string) => `prop-${k}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  // Emotion nodes
  for (const e of emotions) {
    proposed_graph_nodes.push({
      tempId: tempId('emotion', e.name),
      kind: 'emotion',
      label: e.name,
      description: e.evidence,
      evidence: e.evidence,
      confidence: e.confidence,
      certainty: e.certainty,
      valence: 'mixed',
      intensity: 0.5,
      tags: ['ai-suggested', 'from conversation'],
    });
  }
  // Thought nodes
  for (const t of thoughts.slice(0, 4)) {
    proposed_graph_nodes.push({
      tempId: tempId('thought', t.original_text.slice(0, 24)),
      kind: 'thought',
      label: t.original_text.length > 48 ? t.original_text.slice(0, 45) + '…' : t.original_text,
      description: t.original_text,
      evidence: t.original_text,
      confidence: 0.58,
      certainty: t.certainty,
      valence: 'neutral',
      intensity: 0.5,
      tags: ['ai-suggested', t.type],
    });
  }
  // Pattern nodes
  for (const p of cognitive_patterns) {
    proposed_graph_nodes.push({
      tempId: tempId('pattern', p.name),
      kind: 'pattern',
      label: p.name,
      description: p.evidence,
      evidence: p.evidence,
      confidence: p.confidence,
      certainty: 'possible',
      valence: 'negative',
      intensity: 0.5,
      tags: ['ai-suggested', 'requires confirmation'],
    });
  }
  // Need nodes
  for (const n of possible_needs) {
    proposed_graph_nodes.push({
      tempId: tempId('need', n),
      kind: 'need',
      label: n,
      description: 'Possible need suggested from the conversation.',
      evidence: trimmed.slice(0, 120),
      confidence: 0.55,
      certainty: 'possible',
      valence: 'neutral',
      intensity: 0.5,
      tags: ['ai-suggested'],
    });
  }
  // Behaviour nodes
  for (const b of reported_behaviours) {
    proposed_graph_nodes.push({
      tempId: tempId('behavior', b),
      kind: 'behavior',
      label: b,
      description: 'Reported behaviour from the conversation.',
      evidence: trimmed.slice(0, 120),
      confidence: 0.5,
      certainty: 'possible',
      valence: 'neutral',
      intensity: 0.5,
      tags: ['ai-suggested'],
    });
  }

  // Proposed edges: connect each emotion to each thought; patterns to thoughts; needs to emotions
  const proposed_graph_edges: ProposedGraphEdge[] = [];
  const emotionTemps = proposed_graph_nodes.filter((n) => n.kind === 'emotion').map((n) => n.tempId);
  const thoughtTemps = proposed_graph_nodes.filter((n) => n.kind === 'thought').map((n) => n.tempId);
  const patternTemps = proposed_graph_nodes.filter((n) => n.kind === 'pattern').map((n) => n.tempId);
  const needTemps = proposed_graph_nodes.filter((n) => n.kind === 'need').map((n) => n.tempId);
  const behaviorTemps = proposed_graph_nodes.filter((n) => n.kind === 'behavior').map((n) => n.tempId);

  for (const e of emotionTemps) {
    for (const t of thoughtTemps) {
      proposed_graph_edges.push({ tempId: `e-${e}-${t}`, source: t, target: e, relation: 'activates', weight: 0.6, confidence: 0.55 });
    }
  }
  for (const p of patternTemps) {
    for (const t of thoughtTemps) {
      proposed_graph_edges.push({ tempId: `e-${p}-${t}`, source: t, target: p, relation: 'reinforces', weight: 0.6, confidence: 0.55 });
    }
  }
  for (const n of needTemps) {
    for (const e of emotionTemps) {
      proposed_graph_edges.push({ tempId: `e-${n}-${e}`, source: e, target: n, relation: 'signals a need', weight: 0.6, confidence: 0.55 });
    }
  }
  for (const b of behaviorTemps) {
    for (const e of emotionTemps) {
      proposed_graph_edges.push({ tempId: `e-${b}-${e}`, source: e, target: b, relation: 'leads to', weight: 0.55, confidence: 0.5 });
    }
  }

  const clarifying_questions: string[] = [];
  if (!emotions.length) clarifying_questions.push('How would you describe what you are feeling in a few words?');
  if (!thoughts.length) clarifying_questions.push('What thoughts are going through your mind right now?');
  if (cognitive_patterns.length) clarifying_questions.push('Does this interpretation fit what you were experiencing?');

  return {
    conversation_summary: trimmed.length > 200 ? trimmed.slice(0, 197) + '…' : trimmed,
    situation,
    emotions,
    thoughts,
    cognitive_patterns,
    possible_needs,
    reported_behaviours,
    alternative_perspectives,
    suggested_exercises,
    professional_support_considerations,
    proposed_graph_nodes,
    proposed_graph_edges,
    clarifying_questions,
  };
}
