import { motion } from 'framer-motion';
import { Copy, CheckCheck } from 'lucide-react';
import { ResumePoints } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCopyToClipboard } from '@/hooks/useLocalStorage';

interface ResumeModeProps {
  resume: ResumePoints;
  username: string;
}

function CopyableSection({
  title,
  items,
  isList = true,
}: {
  title: string;
  items: string[];
  isList?: boolean;
}) {
  const { copy, copied } = useCopyToClipboard();

  const text = isList
    ? items.map(item => `• ${item}`).join('\n')
    : items.join('\n');

  if (!items.length) return null;

  return (
    <div className="group relative">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">{title}</h4>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => copy(text)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          iconLeft={copied ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-ink leading-snug">
            <span className="text-accent mt-1 shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResumeMode({ resume, username }: ResumeModeProps) {
  const { copy, copied } = useCopyToClipboard();

  const fullResumeText = `
GITHUB: github.com/${username}

PROFESSIONAL SUMMARY
${resume.summary}

TECHNICAL SKILLS
${resume.skills.join(' · ')}

KEY ACHIEVEMENTS
${resume.achievements.map(a => `• ${a}`).join('\n')}

PROJECT HIGHLIGHTS
${resume.projectHighlights.map(p => `• ${p}`).join('\n')}

OPEN SOURCE
${resume.openSourceContributions.map(o => `• ${o}`).join('\n')}
`.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-ink">Resume Mode</h3>
          <p className="text-xs text-ink-muted mt-0.5">
            GitHub data formatted as resume bullet points
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => copy(fullResumeText)}
          iconLeft={copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        >
          {copied ? 'Copied!' : 'Copy All'}
        </Button>
      </div>

      {/* Summary */}
      <Card padding="md" variant="bordered">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Professional Summary</h4>
        </div>
        <p className="text-sm text-ink leading-relaxed">{resume.summary}</p>
      </Card>

      {/* Skills */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Technical Skills</h4>
        </div>
        <p className="text-sm text-ink">{resume.skills.join(' · ')}</p>
      </Card>

      <Card padding="md">
        <div className="space-y-5">
          <CopyableSection title="Key Achievements" items={resume.achievements} />
          <CopyableSection title="Project Highlights" items={resume.projectHighlights} />
          {resume.openSourceContributions.length > 0 && (
            <CopyableSection title="Open Source" items={resume.openSourceContributions} />
          )}
        </div>
      </Card>
    </motion.div>
  );
}
