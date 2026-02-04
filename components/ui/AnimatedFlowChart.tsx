'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Database, Brain, Sparkles, Zap, BarChart3, CheckCircle2,
  ArrowRight, Settings, Target, Send
} from 'lucide-react';

interface FlowStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  details: string[];
}

const flowSteps: FlowStep[] = [
  {
    id: 1,
    title: 'Data Input',
    subtitle: 'Business Intelligence Gathering',
    description: 'Your business info feeds our AI engine',
    icon: Database,
    color: 'from-blue-500 to-cyan-500',
    details: ['Industry analysis', 'Competitor mapping', 'Audience profiling', 'Goal alignment'],
  },
  {
    id: 2,
    title: 'AI Analysis',
    subtitle: 'Neural Processing Engine',
    description: 'Our AI processes 10M+ data points',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    details: ['Pattern recognition', 'Trend prediction', 'Sentiment mapping', 'Engagement modeling'],
  },
  {
    id: 3,
    title: 'Content Generation',
    subtitle: 'Scientific Content Creation',
    description: '14 modules create optimized content',
    icon: Sparkles,
    color: 'from-brand-teal to-brand-green',
    details: ['Hook optimization', 'Value structuring', 'CTA placement', 'Platform adaptation'],
  },
  {
    id: 4,
    title: 'Timing Optimization',
    subtitle: 'Algorithm-Aware Scheduling',
    description: 'Posts scheduled for peak performance',
    icon: Settings,
    color: 'from-orange-500 to-amber-500',
    details: ['Peak hour detection', 'Audience timezone', 'Platform algorithms', 'Engagement windows'],
  },
  {
    id: 5,
    title: 'Campaign Launch',
    subtitle: 'Automated Distribution',
    description: 'Content goes live across platforms',
    icon: Send,
    color: 'from-green-500 to-emerald-500',
    details: ['Multi-platform sync', 'Safe posting limits', 'Hashtag optimization', 'Cross-promotion'],
  },
  {
    id: 6,
    title: 'Performance Tracking',
    subtitle: 'Real-Time Analytics',
    description: 'AI monitors and adapts in real-time',
    icon: BarChart3,
    color: 'from-red-500 to-rose-500',
    details: ['Engagement metrics', 'Conversion tracking', 'A/B analysis', 'ROI calculation'],
  },
];

export function AnimatedFlowChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className="relative py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-teal/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            The Scientific Content Pipeline
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Every campaign flows through our AI-powered optimization engine
          </p>
        </motion.div>

        {/* Flow Chart - Desktop */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#00FF88" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              {/* Top row connections */}
              <motion.line
                x1="20%" y1="25%" x2="50%" y2="25%"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeDasharray="8 4"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.line
                x1="50%" y1="25%" x2="80%" y2="25%"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeDasharray="8 4"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1, delay: 1 }}
              />
              {/* Connector to bottom row */}
              <motion.line
                x1="80%" y1="25%" x2="80%" y2="75%"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeDasharray="8 4"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.5 }}
              />
              {/* Bottom row connections */}
              <motion.line
                x1="80%" y1="75%" x2="50%" y2="75%"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeDasharray="8 4"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1, delay: 2 }}
              />
              <motion.line
                x1="50%" y1="75%" x2="20%" y2="75%"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeDasharray="8 4"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1, delay: 2.5 }}
              />
            </svg>

            {/* Top Row - Steps 1-3 */}
            <div className="grid grid-cols-3 gap-8 mb-16">
              {flowSteps.slice(0, 3).map((step, index) => (
                <FlowStepCard
                  key={step.id}
                  step={step}
                  index={index}
                  isInView={isInView}
                />
              ))}
            </div>

            {/* Bottom Row - Steps 4-6 (reversed for flow) */}
            <div className="grid grid-cols-3 gap-8">
              {flowSteps.slice(3, 6).reverse().map((step, index) => (
                <FlowStepCard
                  key={step.id}
                  step={step}
                  index={index + 3}
                  isInView={isInView}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Flow Chart - Mobile */}
        <div className="lg:hidden space-y-6">
          {flowSteps.map((step, index) => (
            <MobileFlowStep
              key={step.id}
              step={step}
              index={index}
              isInView={isInView}
              isLast={index === flowSteps.length - 1}
            />
          ))}
        </div>

        {/* Result indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 3 }}
          className="mt-16 flex justify-center"
        >
          <div className="glass-card rounded-2xl px-8 py-6 border border-brand-green/30 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-green to-brand-teal flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">Result: Optimized Content</div>
              <div className="text-zinc-400">30 days of scientifically-crafted posts ready to perform</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FlowStepCard({ step, index, isInView }: { step: FlowStep; index: number; isInView: boolean }) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group"
    >
      {/* Step number badge */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-brand-teal to-brand-green flex items-center justify-center text-white font-bold text-sm z-10 shadow-glow-brand">
        {step.id}
      </div>

      <div className="glass-card rounded-2xl p-6 border border-white/5 hover:border-brand-teal/30 transition-all h-full">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-lg group-hover:shadow-glow-brand transition-shadow`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
        <p className="text-sm text-brand-teal mb-3">{step.subtitle}</p>
        <p className="text-zinc-400 text-sm mb-4">{step.description}</p>

        {/* Details */}
        <div className="space-y-2">
          {step.details.map((detail, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.15 + i * 0.1 }}
              className="flex items-center gap-2 text-xs text-zinc-500"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
              {detail}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MobileFlowStep({ step, index, isInView, isLast }: { step: FlowStep; index: number; isInView: boolean; isLast: boolean }) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
      className="relative"
    >
      {/* Connection line */}
      {!isLast && (
        <div className="absolute left-7 top-20 bottom-0 w-0.5 bg-gradient-to-b from-brand-teal to-brand-green/20" />
      )}

      <div className="flex gap-5">
        {/* Step number */}
        <div className="flex-shrink-0">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="glass-card rounded-xl p-5 border border-white/5 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-brand-teal">STEP {step.id}</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
          <p className="text-sm text-zinc-400 mb-3">{step.description}</p>
          <div className="flex flex-wrap gap-2">
            {step.details.map((detail, i) => (
              <span key={i} className="px-2 py-1 text-xs rounded-full bg-white/5 text-zinc-500">
                {detail}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Simplified linear version for landing page
export function SimpleFlowChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const steps = [
    { icon: Database, label: 'Input', color: 'from-blue-500 to-cyan-500' },
    { icon: Brain, label: 'Analyze', color: 'from-purple-500 to-pink-500' },
    { icon: Sparkles, label: 'Generate', color: 'from-brand-teal to-brand-green' },
    { icon: Send, label: 'Publish', color: 'from-green-500 to-emerald-500' },
    { icon: BarChart3, label: 'Track', color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div ref={ref} className="py-12">
      <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                type: 'spring',
                stiffness: 200
              }}
              className="flex items-center gap-4"
            >
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </motion.div>
                <span className="text-xs md:text-sm font-medium text-zinc-400">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.15 }}
                  className="hidden md:block"
                >
                  <ArrowRight className="w-6 h-6 text-brand-teal/50" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
