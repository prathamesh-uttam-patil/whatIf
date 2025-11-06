import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Background3D from '@/components/Background3D';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResultCard, Chip, ConsequenceItem } from '@/components/ResultCard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WhatIfResult {
  summary: string;
  overall_risk: 'Low' | 'Medium' | 'High';
  confidence: number;
  timeframe: 'short-term' | 'mid-term' | 'long-term';
  consequences: Array<{
    title: string;
    detail: string;
    likelihood: string;
    impact: string;
    mitigation: string;
  }>;
  alternatives: string[];
  disclaimer: string;
}

export default function Index() {
  const [query, setQuery] = useState('');
  const [tone, setTone] = useState<'balanced' | 'optimistic' | 'pessimistic'>('balanced');
  const [scope, setScope] = useState<'personal' | 'career' | 'financial' | 'health' | 'societal' | 'global'>('personal');
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: 'Missing query',
        description: 'Please enter a "what if" scenario',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('whatif', {
        body: { query, tone, scope },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to analyze scenario',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskVariant = (risk: string): 'low' | 'medium' | 'high' => {
    const normalized = risk.toLowerCase();
    if (normalized === 'low') return 'low';
    if (normalized === 'medium') return 'medium';
    return 'high';
  };

  return (
    <div className="min-h-screen relative">
      <Background3D />
      
      <div className="container max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            WHAT IF
          </h1>
          <p className="text-xl text-muted-foreground">
            Imagine the consequences — before you act.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-8 space-y-4"
        >
          <Input
            placeholder="e.g., Quit my job to launch a startup next month"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="glass text-lg py-6 border-white/10 focus:border-primary/50 transition-colors"
            disabled={loading}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Tone</label>
              <Select value={tone} onValueChange={(v: any) => setTone(v)} disabled={loading}>
                <SelectTrigger className="glass border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="optimistic">Optimistic</SelectItem>
                  <SelectItem value="pessimistic">Pessimistic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Scope</label>
              <Select value={scope} onValueChange={(v: any) => setScope(v)} disabled={loading}>
                <SelectTrigger className="glass border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="societal">Societal</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full py-6 text-lg" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              'Explore Consequences'
            )}
          </Button>
        </motion.form>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Summary */}
            <ResultCard delay={0.1}>
              <h2 className="text-2xl font-bold mb-4">Summary</h2>
              <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
            </ResultCard>

            {/* Metrics */}
            <ResultCard delay={0.2}>
              <div className="flex flex-wrap gap-3">
                <Chip 
                  label="Overall Risk" 
                  value={result.overall_risk} 
                  variant={getRiskVariant(result.overall_risk)} 
                />
                <Chip label="Confidence" value={`${result.confidence}%`} />
                <Chip 
                  label="Timeframe" 
                  value={result.timeframe.replace('-', ' ')} 
                />
              </div>
            </ResultCard>

            {/* Consequences */}
            <ResultCard delay={0.3}>
              <h2 className="text-2xl font-bold mb-4">Consequences</h2>
              <div className="space-y-4">
                {result.consequences.map((consequence, index) => (
                  <ConsequenceItem key={index} {...consequence} />
                ))}
              </div>
            </ResultCard>

            {/* Alternatives */}
            {result.alternatives.length > 0 && (
              <ResultCard delay={0.4}>
                <h2 className="text-2xl font-bold mb-4">Alternatives</h2>
                <ul className="space-y-2">
                  {result.alternatives.map((alt, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{alt}</span>
                    </li>
                  ))}
                </ul>
              </ResultCard>
            )}

            {/* Disclaimer */}
            <ResultCard delay={0.5}>
              <p className="text-sm text-muted-foreground italic">{result.disclaimer}</p>
            </ResultCard>
          </div>
        )}
      </div>
    </div>
  );
}
