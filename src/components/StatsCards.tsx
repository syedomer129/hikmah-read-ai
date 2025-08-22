import { motion } from 'framer-motion';
import { BookOpen, Clock, Zap, TrendingUp } from 'lucide-react';

const stats = [
  {
    icon: BookOpen,
    label: 'Total Books',
    value: '24',
    change: '+3 this month',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Clock,
    label: 'Reading Time',
    value: '127h',
    change: '+12h this week',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: Zap,
    label: 'AI Interactions',
    value: '1,247',
    change: '+89 today',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: TrendingUp,
    label: 'Progress',
    value: '68%',
    change: '+15% avg completion',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
];

export const StatsCards = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.95 },
            visible: { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { duration: 0.4, ease: "easeOut" }
            }
          }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="glass border border-glass-border rounded-xl p-6 hover:shadow-glow transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded-full">
              +{index + 1}
            </span>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              {stat.label}
            </div>
            <div className={`text-xs font-medium ${stat.color}`}>
              {stat.change}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};