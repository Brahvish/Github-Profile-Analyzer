import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Target, ShieldAlert, DollarSign, ThumbsUp } from 'lucide-react';
import { RecruiterReport } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface RecruiterModeProps {
  report: RecruiterReport;
}

export function RecruiterMode({ report }: RecruiterModeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <h3 className="text-base font-semibold text-ink">Recruiter Intelligence Report</h3>
        <p className="text-xs text-ink-muted mt-0.5">
          GitHub signal analysis for hiring decisions
        </p>
      </div>

      {/* Verdict card */}
      <Card padding="md" variant="bordered">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center shrink-0">
            <ThumbsUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-ink-faint mb-1">Hiring Verdict</p>
            <p className="text-sm font-medium text-ink leading-snug">{report.hiringVerdict}</p>
          </div>
          <Badge variant="success" size="md">{report.salaryRange}</Badge>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <Card padding="md">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-ink">Strengths</h4>
          </div>
          <ul className="space-y-2.5">
            {report.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-ink-muted leading-relaxed">
                <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </Card>

        {/* Weaknesses */}
        <Card padding="md">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-semibold text-ink">Gaps</h4>
          </div>
          <ul className="space-y-2.5">
            {report.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-ink-muted leading-relaxed">
                <span className="text-amber-400 mt-0.5 shrink-0">△</span>
                {w}
              </li>
            ))}
          </ul>
        </Card>

        {/* Interview Focus */}
        <Card padding="md">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-accent" />
            <h4 className="text-sm font-semibold text-ink">Interview Focus Areas</h4>
          </div>
          <ul className="space-y-2.5">
            {report.interviewFocusAreas.map((area, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-ink-muted leading-relaxed">
                <span className="text-accent shrink-0 font-mono">{String(i + 1).padStart(2, '0')}</span>
                {area}
              </li>
            ))}
          </ul>
        </Card>

        {/* Risk */}
        <Card padding="md">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h4 className="text-sm font-semibold text-ink">Risk Analysis</h4>
          </div>
          <ul className="space-y-2.5">
            {report.riskAnalysis.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-ink-muted leading-relaxed">
                <span className="text-rose-400 mt-0.5 shrink-0">⚠</span>
                {risk}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <p className="text-xs text-ink-faint text-center pt-1">
        Analysis based on public GitHub data only. Human judgment required for final decisions.
      </p>
    </motion.div>
  );
}
