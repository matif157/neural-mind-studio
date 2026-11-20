import { Brain, MessageSquare, Heart, Lightbulb, Layers, Activity, BookOpen, Settings as SettingsIcon, Sparkles } from 'lucide-react';

export type WorkspaceId =
  | 'mindmap' | 'conversation' | 'emotion' | 'thought' | 'memory'
  | 'pattern' | 'reflection' | 'neuro' | 'knowledge' | 'settings';

interface NavItem { id: WorkspaceId; label: string; icon: any; }

const NAV: NavItem[] = [
  { id: 'mindmap', label: 'Mind Map', icon: Brain },
  { id: 'conversation', label: 'Conversation', icon: MessageSquare },
  { id: 'emotion', label: 'Emotions', icon: Heart },
  { id: 'thought', label: 'Thoughts', icon: Lightbulb },
  { id: 'memory', label: 'Memory', icon: Layers },
  { id: 'pattern', label: 'Patterns', icon: Activity },
  { id: 'reflection', label: 'Reflection', icon: Sparkles },
  { id: 'neuro', label: 'Neuroscience', icon: Brain },
  { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

interface Props { active: WorkspaceId; onChange: (id: WorkspaceId) => void; }

export default function WorkspaceNav({ active, onChange }: Props) {
  return (
    <nav className="workspace-nav">
      {NAV.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className={`workspace-nav-item ${active === item.id ? 'is-active' : ''}`}
            onClick={() => onChange(item.id)}
            title={item.label}
          >
            <Icon size={16} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
