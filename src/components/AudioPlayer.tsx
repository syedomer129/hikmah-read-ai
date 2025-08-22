import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  X,
  Download,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface AudioPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  type?: 'summary' | 'translation' | 'chapter';
}

export const AudioPlayer = ({ 
  isOpen, 
  onClose, 
  title = "Chapter Summary",
  type = "summary" 
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(245); // 4:05 in seconds
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Here you would control actual audio playback
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
    // Here you would seek the audio
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const progress = (currentTime / duration) * 100;

  // Simulated waveform data
  const waveformData = Array.from({ length: 100 }, () => Math.random() * 40 + 10);

  const getTypeColor = () => {
    switch (type) {
      case 'summary': return 'bg-primary/20 text-primary border-primary/30';
      case 'translation': return 'bg-accent/20 text-accent border-accent/30';
      case 'chapter': return 'bg-secondary/20 text-secondary border-secondary/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'summary': return 'AI Summary';
      case 'translation': return 'Translation';
      case 'chapter': return 'Chapter Audio';
      default: return 'AI Audio';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-background/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-2xl glass border border-glass-border rounded-t-3xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge className={getTypeColor()}>
                    {getTypeLabel()}
                  </Badge>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Waveform Visualization */}
              <div className="relative h-20 bg-muted/20 rounded-xl overflow-hidden mb-6">
                <div className="flex items-end justify-center h-full px-2 gap-1">
                  {waveformData.map((height, index) => (
                    <motion.div
                      key={index}
                      className={`w-1 bg-gradient-to-t ${
                        index < (progress / 100) * waveformData.length
                          ? 'from-primary to-primary-glow'
                          : 'from-muted-foreground/30 to-muted-foreground/20'
                      } rounded-full transition-all duration-100`}
                      style={{ height: `${height}%` }}
                      animate={{
                        scaleY: isPlaying && index < (progress / 100) * waveformData.length 
                          ? [1, 1.2, 1] : 1
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: isPlaying ? Infinity : 0,
                        delay: index * 0.01
                      }}
                    />
                  ))}
                </div>
                
                {/* Progress overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-xl opacity-50" />
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-6">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="glass" size="icon">
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    onClick={handlePlayPause}
                    variant="hero"
                    size="icon-lg"
                    className="shadow-glow"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-1" />
                    )}
                  </Button>
                  
                  <Button variant="glass" size="icon">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 min-w-0 w-32">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};