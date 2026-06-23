import { GitBranch, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
              <GitBranch className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="font-semibold text-ink text-sm">
              Git<span className="text-accent">Insight</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400/20" />
            <span>using GitHub's public API</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
