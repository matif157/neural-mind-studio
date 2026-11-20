import { describe, it, expect } from 'vitest';
import { analyzeText } from '../src/analysis/analyzer';

describe('analyzeText', () => {
  it('preserves original wording and extracts emotions', () => {
    const r = analyzeText('I felt anxious and sad today. I keep thinking what if everything goes wrong.');
    expect(r.emotions.map((e) => e.name)).toContain('Anxiety');
    expect(r.emotions.map((e) => e.name)).toContain('Sadness');
    expect(r.thoughts[0].original_text).toContain('anxious');
    expect(r.cognitive_patterns.map((p) => p.name)).toContain('Catastrophizing');
    expect(r.proposed_graph_nodes.length).toBeGreaterThan(0);
  });

  it('flags distress for professional support', () => {
    const r = analyzeText('I feel hopeless and worthless, I cannot go on.');
    expect(r.professional_support_considerations.length).toBeGreaterThan(0);
  });

  it('proposes needs when keywords present', () => {
    const r = analyzeText('I am exhausted and burned out, I need rest.');
    expect(r.possible_needs).toContain('Rest & recovery');
  });

  it('never returns empty thoughts for non-empty input', () => {
    const r = analyzeText('Hello world.');
    expect(r.thoughts.length).toBe(1);
    expect(r.conversation_summary).toBe('Hello world.');
  });
});
