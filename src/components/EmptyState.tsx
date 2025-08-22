import { motion } from 'framer-motion';
import { Upload, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col items-center justify-center py-16 px-8"
    >
      <div className="glass rounded-2xl p-12 text-center max-w-md border border-glass-border">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <BookOpen className="w-10 h-10 text-primary-foreground" />
          </div>
        </motion.div>
        
        <h3 className="text-2xl font-bold text-gradient mb-3">
          Start Your Journey
        </h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Upload your first PDF and discover the power of AI-enhanced reading with translations, summaries, and intelligent conversations.
        </p>
        
        <div className="space-y-3">
          <Button variant="hero" size="lg" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Upload Your First PDF
          </Button>
          <Button variant="glass" size="lg" className="w-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Explore AI Features
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-glass-border">
          <p className="text-xs text-muted-foreground">
            Supports PDF files up to 100MB • AI-powered translations in 50+ languages
          </p>
        </div>
      </div>
    </motion.div>
  );
};