import { useState } from 'react';
import { CheckCircle2, Circle, PlayCircle } from 'lucide-react';

interface Exercise { id: string; title: string; purpose: string; duration: string; steps: string[]; }

const EXERCISES: Exercise[] = [
  { id: 'journal', title: 'Thought journaling', purpose: 'Capture a thought with its context and evidence.', duration: '5–10 min', steps: ['Write down one recent thought.', 'Note the situation it occurred in.', 'Name any feeling and its intensity.', 'List one piece of evidence for and one against.', 'Write a balanced alternative.'] },
  { id: 'emotion-id', title: 'Emotion identification', purpose: 'Name and locate an emotion without judging it.', duration: '3–5 min', steps: ['Pause and scan your body.', 'Name the strongest feeling.', 'Rate intensity 0–100.', 'Note what triggered it.', 'Allow it to be present without fixing it.'] },
  { id: 'reappraisal', title: 'Cognitive reappraisal', purpose: 'Reconsider a situation with added context.', duration: '8–12 min', steps: ['State the automatic thought.', 'Ask: what is the evidence?', 'Generate two alternative interpretations.', 'Choose the most balanced one.', 'Note how the feeling shifts.'] },
  { id: 'grounding', title: 'Grounding (5-4-3-2-1)', purpose: 'Anchor attention in the present.', duration: '2–3 min', steps: ['Name 5 things you see.', '4 you can touch.', '3 you hear.', '2 you smell.', '1 you taste.'] },
  { id: 'breath', title: 'Slow breathing', purpose: 'Settle physiological arousal.', duration: '3–5 min', steps: ['Inhale gently for 4 counts.', 'Hold for 2.', 'Exhale for 6.', 'Repeat 6 times.', 'Stop if uncomfortable.'] },
  { id: 'values', title: 'Values clarification', purpose: 'Connect actions to what matters.', duration: '10 min', steps: ['List 3 moments you felt proud.', 'Identify the value behind each.', 'Choose one value to honour today.', 'Plan one small action.'] },
  { id: 'self-compassion', title: 'Self-compassion reflection', purpose: 'Respond to difficulty with care.', duration: '5 min', steps: ['Name the difficulty plainly.', 'Acknowledge it is hard.', 'Say: this is part of being human.', 'Ask what you would tell a friend.', 'Offer yourself one kind sentence.'] },
  { id: 'problem-solve', title: 'Problem solving', purpose: 'Move from rumination to action.', duration: '10 min', steps: ['Define the problem in one sentence.', 'Brainstorm 5 options.', 'Pick the smallest useful step.', 'Identify obstacles.', 'Schedule the step.'] },
];

const STORAGE_KEY = 'nms-exercise-completion';

function loadDone(): Record<string, boolean> { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); } catch { return {}; } }
function saveDone(d: Record<string, boolean>) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch { /* */ } }

export default function ReflectionWorkspace() {
  const [done, setDone] = useState<Record<string, boolean>>(loadDone);
  const [active, setActive] = useState<string | null>(null);

  const toggle = (id: string) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next); saveDone(next);
  };

  const ex = EXERCISES.find((e) => e.id === active);

  return (
    <div className="workspace-shell">
      <div className="workspace-header">
        <div>
          <div className="workspace-kicker">WORKSPACE G · REFLECTION STUDIO</div>
          <h2 className="workspace-title">Guided exercises</h2>
          <p className="workspace-sub">Optional, educational exercises. Not treatment. Stop any exercise that feels unpleasant.</p>
        </div>
      </div>
      <div className="reflection-grid">
        <div className="reflection-list">
          {EXERCISES.map((e) => (
            <button key={e.id} className={`reflection-item ${active === e.id ? 'is-active' : ''}`} onClick={() => setActive(e.id)}>
              <span className="reflection-check" onClick={(ev) => { ev.stopPropagation(); toggle(e.id); }}>
                {done[e.id] ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </span>
              <div>
                <div className="reflection-title">{e.title}</div>
                <div className="reflection-meta">{e.duration} · {e.purpose}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="reflection-detail">
          {ex ? (
            <>
              <h3>{ex.title}</h3>
              <div className="reflection-meta">{ex.duration} · {ex.purpose}</div>
              <ol className="reflection-steps">{ex.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              <button className="primary-button" onClick={() => toggle(ex.id)}><PlayCircle size={14} /> {done[ex.id] ? 'Mark incomplete' : 'Mark complete'}</button>
            </>
          ) : (
            <p className="muted-note">Select an exercise to see its steps.</p>
          )}
        </div>
      </div>
    </div>
  );
}
