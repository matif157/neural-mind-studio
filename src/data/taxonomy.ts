// Taxonomy definitions for the Living Mind Atlas.
// These are educational, non-diagnostic concepts. Extend by adding entries here.

export interface TaxonomyEntry {
  id: string;
  label: string;
  kind: 'emotion' | 'thought' | 'pattern' | 'need' | 'behavior' | 'belief' | 'coping';
  definition: string;
  aliases?: string[];
  related?: string[];
}

export const EMOTION_TAXONOMY: TaxonomyEntry[] = [
  { id: 'joy', label: 'Joy', kind: 'emotion', definition: 'A positive state of happiness, pleasure or delight.', aliases: ['happy', 'joyful', 'delighted', 'cheerful'] },
  { id: 'sadness', label: 'Sadness', kind: 'emotion', definition: 'A low mood often linked to loss, disappointment or disconnection.', aliases: ['sad', 'down', 'blue', 'low'] },
  { id: 'anxiety', label: 'Anxiety', kind: 'emotion', definition: 'Anticipatory unease about possible future threat or uncertainty.', aliases: ['anxious', 'nervous', 'on edge', 'worried'] },
  { id: 'fear', label: 'Fear', kind: 'emotion', definition: 'A response to perceived immediate threat.', aliases: ['afraid', 'scared', 'terrified', 'frightened'] },
  { id: 'anger', label: 'Anger', kind: 'emotion', definition: 'A response to perceived injustice, boundary violation or frustration.', aliases: ['angry', 'mad', 'furious', 'irritated'] },
  { id: 'frustration', label: 'Frustration', kind: 'emotion', definition: 'Unpleasant state when a goal is blocked.', aliases: ['frustrated', 'stuck'] },
  { id: 'shame', label: 'Shame', kind: 'emotion', definition: 'A painful sense of being exposed or inadequate.', aliases: ['ashamed', 'humiliated'] },
  { id: 'guilt', label: 'Guilt', kind: 'emotion', definition: 'Discomfort about a perceived responsibility or harm.', aliases: ['guilty', 'regretful'] },
  { id: 'loneliness', label: 'Loneliness', kind: 'emotion', definition: 'Painful sense of social disconnection.', aliases: ['lonely', 'isolated', 'alone'] },
  { id: 'grief', label: 'Grief', kind: 'emotion', definition: 'Response to significant loss.', aliases: ['grieving', 'mourning', 'bereaved'] },
  { id: 'hope', label: 'Hope', kind: 'emotion', definition: 'Future-oriented sense that improvement is possible.', aliases: ['hopeful', 'optimistic'] },
  { id: 'calm', label: 'Calm', kind: 'emotion', definition: 'Lower-arousal steady state.', aliases: ['calm', 'peaceful', 'relaxed'] },
  { id: 'curiosity', label: 'Curiosity', kind: 'emotion', definition: 'Interest-based openness to exploration.', aliases: ['curious', 'interested'] },
  { id: 'gratitude', label: 'Gratitude', kind: 'emotion', definition: 'Appreciation for something valued.', aliases: ['grateful', 'thankful'] },
  { id: 'overwhelm', label: 'Overwhelm', kind: 'emotion', definition: 'Demands exceeding perceived capacity.', aliases: ['overwhelmed', 'too much'] },
  { id: 'confusion', label: 'Confusion', kind: 'emotion', definition: 'Uncertainty about meaning or next steps.', aliases: ['confused', 'uncertain'] },
  { id: 'contentment', label: 'Contentment', kind: 'emotion', definition: 'Quiet satisfaction with the present.', aliases: ['content', 'satisfied'] },
  { id: 'pride', label: 'Pride', kind: 'emotion', definition: 'Positive self-evaluation about an achievement.', aliases: ['proud'] },
  { id: 'disappointment', label: 'Disappointment', kind: 'emotion', definition: 'Sadness when expectations are unmet.', aliases: ['disappointed'] },
  { id: 'embarrassment', label: 'Embarrassment', kind: 'emotion', definition: 'Discomfort about social exposure.', aliases: ['embarrassed'] },
  { id: 'nostalgia', label: 'Nostalgia', kind: 'emotion', definition: 'Bittersweet longing for the past.', aliases: ['nostalgic'] },
  { id: 'relief', label: 'Relief', kind: 'emotion', definition: 'Release of tension after a threat passes.', aliases: ['relieved'] },
  { id: 'envy', label: 'Envy', kind: 'emotion', definition: 'Discomfort about another\u2019s advantage.', aliases: ['envious', 'jealous'] },
];

export const PATTERN_TAXONOMY: TaxonomyEntry[] = [
  { id: 'rumination', label: 'Rumination', kind: 'pattern', definition: 'Repeated thinking about distress without new understanding.', aliases: ['replaying', 'can\'t stop thinking', 'looping'] },
  { id: 'catastrophizing', label: 'Catastrophizing', kind: 'pattern', definition: 'Treating the worst outcome as likely.', aliases: ['worst case', 'everything will fall apart', 'disaster'] },
  { id: 'all-or-nothing', label: 'All-or-nothing thinking', kind: 'pattern', definition: 'Seeing outcomes as total success or total failure.', aliases: ['always', 'never', 'completely', 'total failure'] },
  { id: 'mind-reading', label: 'Mind-reading', kind: 'pattern', definition: 'Assuming others\u2019 thoughts without evidence.', aliases: ['they think', 'they must think', 'they probably think'] },
  { id: 'fortune-telling', label: 'Fortune-telling', kind: 'pattern', definition: 'Predicting negative outcomes as if certain.', aliases: ['will definitely', 'going to fail', 'won\'t work'] },
  { id: 'self-criticism', label: 'Self-criticism', kind: 'pattern', definition: 'Harsh global self-judgement from a specific event.', aliases: ['I always', 'I never', 'I ruin', 'I am such a'] },
  { id: 'personalization', label: 'Personalization', kind: 'pattern', definition: 'Taking excessive responsibility for external events.', aliases: ['my fault', 'because of me'] },
  { id: 'emotional-reasoning', label: 'Emotional reasoning', kind: 'pattern', definition: 'Treating a feeling as proof of fact.', aliases: ['I feel so it must be true'] },
  { id: 'avoidance', label: 'Avoidance', kind: 'pattern', definition: 'Moving away from a cue for short-term relief.', aliases: ['avoid', 'putting off', 'can\'t face'] },
  { id: 'reassurance-seeking', label: 'Reassurance seeking', kind: 'pattern', definition: 'Repeatedly seeking confirmation to reduce anxiety.', aliases: ['need to know', 'are you sure', 'tell me it\'s okay'] },
  { id: 'perfectionism', label: 'Perfectionism', kind: 'pattern', definition: 'Demanding flawless performance.', aliases: ['perfect', 'not good enough', 'must be flawless'] },
  { id: 'reappraisal', label: 'Cognitive reappraisal', kind: 'pattern', definition: 'Reconsidering meaning with added context.', aliases: ['maybe', 'another way', 'could be'] },
  { id: 'self-compassion', label: 'Self-compassion', kind: 'pattern', definition: 'Responding to difficulty with care and fairness.', aliases: ['be kind to myself', 'it\'s okay to struggle'] },
];

export const NEED_TAXONOMY: TaxonomyEntry[] = [
  { id: 'safety', label: 'Safety & clarity', kind: 'need', definition: 'Predictability, information, protection.', aliases: ['safe', 'clarity', 'know what is happening'] },
  { id: 'connection', label: 'Connection', kind: 'need', definition: 'Belonging, understanding, supportive contact.', aliases: ['connected', 'belong', 'not alone'] },
  { id: 'respect', label: 'Respect', kind: 'need', definition: 'Being valued and treated fairly.', aliases: ['respected', 'valued', 'appreciated'] },
  { id: 'autonomy', label: 'Autonomy', kind: 'need', definition: 'Choice and self-direction.', aliases: ['control', 'my own decision', 'freedom'] },
  { id: 'competence', label: 'Competence', kind: 'need', definition: 'Capability and effectiveness.', aliases: ['capable', 'good at', 'competent'] },
  { id: 'rest', label: 'Rest & recovery', kind: 'need', definition: 'Reduced demands and recovery.', aliases: ['rest', 'tired', 'exhausted', 'burned out'] },
  { id: 'meaning', label: 'Meaning', kind: 'need', definition: 'Purpose and significance.', aliases: ['meaningful', 'purpose', 'matters'] },
  { id: 'acceptance', label: 'Acceptance', kind: 'need', definition: 'Being accepted as one is.', aliases: ['accepted', 'understood', 'seen'] },
  { id: 'privacy', label: 'Privacy', kind: 'need', definition: 'Space and boundaries.', aliases: ['space', 'privacy', 'boundaries'] },
  { id: 'recognition', label: 'Recognition', kind: 'need', definition: 'Acknowledgement of effort or worth.', aliases: ['recognized', 'noticed', 'appreciated'] },
];

export const THOUGHT_TYPES = [
  { id: 'automatic', label: 'Automatic thought', description: 'A quick, often habitual thought.' },
  { id: 'intrusive', label: 'Intrusive thought', description: 'An unwanted thought that pops up.' },
  { id: 'prediction', label: 'Prediction', description: 'A forecast about the future.' },
  { id: 'assumption', label: 'Assumption', description: 'An unverified belief about a situation.' },
  { id: 'self-evaluation', label: 'Self-evaluation', description: 'A judgement about oneself.' },
  { id: 'social-comparison', label: 'Social comparison', description: 'Comparing oneself to others.' },
  { id: 'decision', label: 'Decision-making thought', description: 'A thought about choosing a course of action.' },
  { id: 'existential', label: 'Existential thought', description: 'A thought about meaning, purpose or existence.' },
];

export const KNOWLEDGE_DOMAINS = [
  { id: 'psychiatry', label: 'Psychiatry', scope: 'Medical diagnosis and treatment of mental disorders by qualified physicians.' },
  { id: 'neurology', label: 'Neurology', scope: 'Nervous system structure and function.' },
  { id: 'clinical-psychology', label: 'Clinical Psychology', scope: 'Assessment and treatment of psychological difficulties.' },
  { id: 'counseling', label: 'Counseling Psychology', scope: 'Support for life challenges and well-being.' },
  { id: 'neuropsychology', label: 'Neuropsychology', scope: 'Brain-behaviour relationships.' },
  { id: 'cognitive-psychology', label: 'Cognitive Psychology', scope: 'Thinking, memory, attention and perception.' },
  { id: 'behavioural', label: 'Behavioural Psychology', scope: 'Learning and behaviour change.' },
  { id: 'developmental', label: 'Developmental Psychology', scope: 'Lifespan development.' },
  { id: 'health-psychology', label: 'Health Psychology', scope: 'Psychological factors in health and illness.' },
  { id: 'cbt', label: 'Cognitive Behavioural Therapy', scope: 'Evidence-based therapy targeting thoughts and behaviours.' },
  { id: 'dbt', label: 'Dialectical Behaviour Therapy', scope: 'Skills for emotion regulation and distress tolerance.' },
  { id: 'neuroscience', label: 'Neuroscience', scope: 'Study of the nervous system.' },
  { id: 'cognitive-science', label: 'Cognitive Science', scope: 'Interdisciplinary study of mind and intelligence.' },
  { id: 'memory-science', label: 'Memory Science', scope: 'How memories are formed and retrieved.' },
  { id: 'mindfulness', label: 'Mindfulness & Meditation', scope: 'Present-moment awareness practices.' },
  { id: 'occupational-therapy', label: 'Occupational Therapy', scope: 'Daily functioning and meaningful activity.' },
];

export const NEURON_PARTS = [
  { id: 'dendrite', label: 'Dendrite', description: 'Receives signals from other neurons.' },
  { id: 'soma', label: 'Soma (cell body)', description: 'Integrates incoming signals.' },
  { id: 'axon', label: 'Axon', description: 'Transmits electrical impulses away.' },
  { id: 'myelin', label: 'Myelin sheath', description: 'Insulates the axon, speeding transmission.' },
  { id: 'synapse', label: 'Synapse', description: 'Junction where neurotransmitters cross between neurons.' },
  { id: 'terminal', label: 'Axon terminal', description: 'Releases neurotransmitters into the synapse.' },
];
