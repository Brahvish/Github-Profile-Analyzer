import { motion } from 'framer-motion';
import { Github, GitBranch, Shield, Zap, BarChart2, Code2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

const sections = [
  {
    icon: BarChart2,
    title: 'Profile Scoring',
    description:
      'We analyze 7 weighted dimensions: profile completeness, code quality, community engagement, consistency, language diversity, open-source activity, and documentation quality. Each is scored 0–100 and combined into an overall score.',
  },
  {
    icon: Code2,
    title: 'Repository Intelligence',
    description:
      'Every public repository is analyzed for health, complexity, documentation quality, and activity. We detect dormant repos, hidden gems, and your best project using heuristics derived from GitHub metadata.',
  },
  {
    icon: Zap,
    title: 'Developer Insights',
    description:
      'Insights like "Coding Personality" and "Career Level" are derived from account age, repo count, star count, topic diversity, and event patterns — not AI inference. Deterministic, transparent algorithms.',
  },
  {
    icon: Shield,
    title: 'Privacy & Data',
    description:
      'GitInsight only accesses public GitHub data via the unauthenticated public API. No GitHub OAuth, no login, no personal data stored on our servers. Reports are cached in your browser via localStorage.',
  },
];

export function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden bg-[#080A0F]">
      {/* Background orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-[#634FFF]/8 blur-[120px] pointer-events-none animate-orb-2 z-0" />
      <div className="absolute bottom-[10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#38BDF8]/6 blur-[110px] pointer-events-none animate-orb-1 z-0" />

      <div className="max-w-3xl mx-auto relative z-10">
        <AnimatedSection>
          <div className="mb-12">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-heading tracking-tight">About GitInsight</h1>
                <p className="text-sm text-slate-500">GitHub profile intelligence, no keys required</p>
              </div>
            </div>

            <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
              GitInsight is a free, open-source developer analytics tool that reads any public GitHub
              profile and generates a comprehensive intelligence report — covering scores, visual
              analytics, recruiter signals, and resume bullet points.
            </p>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Everything runs on GitHub's unauthenticated public API. No OAuth, no API keys, no
              accounts. The tool is rate-limited by GitHub (60 requests/hour per IP for unauthenticated
              access), so repeated analysis of the same profile is cached for 10 minutes.
            </p>
          </div>
        </AnimatedSection>

        {/* How it works */}
        <AnimatedSection delay={50}>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 font-heading">How It Works</h2>
          <div className="space-y-3 mb-12">
            {sections.map((section, i) => (
              <Card key={section.title} padding="md" className="bg-white/[0.02] border border-white/[0.06]">
                <div className="flex gap-4">
                  <div className="w-9 h-9 rounded-[10px] bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <section.icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1.5 font-heading tracking-tight">{section.title}</h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{section.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        {/* Rate limit notice */}
        <AnimatedSection delay={100}>
          <Card padding="md" className="bg-amber-400/[0.02] border-amber-400/15 mb-12">
            <div className="flex gap-3">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white mb-1 font-heading">GitHub API Rate Limits</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  GitHub allows 60 unauthenticated API requests per hour per IP address. GitInsight
                  caches each profile analysis for 10 minutes. If you hit a rate limit, wait an hour
                  or try from a different network.
                </p>
              </div>
            </div>
          </Card>
        </AnimatedSection>

        {/* Tech stack */}
        <AnimatedSection delay={150}>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 font-heading">Built With</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
            {[
              { name: 'React', role: 'Frontend' },
              { name: 'TypeScript', role: 'Language' },
              { name: 'Tailwind', role: 'Styling' },
              { name: 'Framer Motion', role: 'Animations' },
              { name: 'Recharts', role: 'Charts' },
              { name: 'Node.js', role: 'Backend' },
              { name: 'Express', role: 'API' },
              { name: 'Zustand', role: 'State' },
            ].map(tech => (
              <Card key={tech.name} padding="sm" className="text-center bg-white/[0.02] border border-white/[0.06]">
                <p className="text-sm font-semibold text-white">{tech.name}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{tech.role}</p>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        {/* GitHub link */}
        <AnimatedSection delay={200}>
          <div className="flex justify-center">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-white/[0.02] border border-white/[0.06] text-sm text-slate-300 hover:text-white hover:border-accent/40 transition-all font-medium"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
