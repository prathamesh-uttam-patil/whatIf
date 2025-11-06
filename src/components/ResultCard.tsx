import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ResultCardProps {
  children: ReactNode;
  delay?: number;
}

export function ResultCard({ children, delay = 0 }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass glass-hover rounded-2xl p-6 shadow-lg"
    >
      {children}
    </motion.div>
  );
}

interface ChipProps {
  label: string;
  value: string | number;
  variant?: 'low' | 'medium' | 'high' | 'default';
}

export function Chip({ label, value, variant = 'default' }: ChipProps) {
  const variantStyles = {
    low: 'bg-green-500/20 border-green-500/30 text-green-300',
    medium: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
    high: 'bg-red-500/20 border-red-500/30 text-red-300',
    default: 'bg-primary/20 border-primary/30 text-primary-foreground',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${variantStyles[variant]}`}>
      <span className="text-sm font-medium opacity-70">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

interface ConsequenceItemProps {
  title: string;
  detail: string;
  likelihood: string;
  impact: string;
  mitigation: string;
}

export function ConsequenceItem({ title, detail, likelihood, impact, mitigation }: ConsequenceItemProps) {
  const getImpactVariant = (impact: string): 'low' | 'medium' | 'high' | 'default' => {
    const normalized = impact.toLowerCase();
    if (normalized === 'low') return 'low';
    if (normalized === 'moderate' || normalized === 'medium') return 'medium';
    if (normalized === 'high' || normalized === 'severe') return 'high';
    return 'default';
  };

  return (
    <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/5">
      <div>
        <h4 className="font-semibold text-lg mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Chip label="Likelihood" value={likelihood} variant="default" />
        <Chip label="Impact" value={impact} variant={getImpactVariant(impact)} />
      </div>
      
      <div className="pt-2 border-t border-white/10">
        <p className="text-sm">
          <span className="font-medium text-primary">Mitigation:</span>{' '}
          <span className="text-muted-foreground">{mitigation}</span>
        </p>
      </div>
    </div>
  );
}
