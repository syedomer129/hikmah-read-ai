import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Square, SkipBack, SkipForward, Volume2, 
  VolumeX, Repeat, Download, X, Maximize2, Minimize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PdfAudioPlayerProps {
  onClose: () => void;
  title?: string;
  audioUrl?: string;
  className?: string;
}

export const PdfAudioPlayer = ({ 
  onClose, 
  title = "Page Translation Audio",
  audioUrl,
  className 
}: PdfAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(245); // 4:05 in seconds
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Simulate audio progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            if (isLooping) {
              return 0;
            } else {
              setIsPlaying(false);
              return duration;
            }
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration, isLooping]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const skip = (seconds: number) => {
    setCurrentTime(prev => Math.max(0, Math.min(duration, prev + seconds)));
  };

  const progress = (currentTime / duration) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "fixed bottom-4 right-4 z-40",
          isExpanded ? "inset-4" : "w-96"
        )}
      >
        <div className={cn(
          "bg-glass backdrop-blur-glass border border-glass-border rounded-xl shadow-glow overflow-hidden",
          isExpanded ? "h-full flex flex-col" : ""
        )}>
          {/* Header */}
          <div className="p-4 border-b border-glass-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-accent rounded-lg text-accent-foreground">
                  <Volume2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{title}</h3>
                  <p className="text-xs text-muted-foreground">AI Generated Audio</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">
                  {isPlaying ? 'Playing' : 'Paused'}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Waveform Visualization (Expanded Mode) */}
          {isExpanded && (
            <div className="flex-1 p-4 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
              <motion.div 
                className="flex items-end gap-1 h-32"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {Array.from({ length: 40 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "w-2 rounded-full",
                      i < (progress / 100) * 40 
                        ? "bg-gradient-primary" 
                        : "bg-muted/30"
                    )}
                    style={{
                      height: `${Math.random() * 80 + 20}%`
                    }}
                    animate={{
                      scaleY: isPlaying && i < (progress / 100) * 40 
                        ? [1, 1.2, 1] 
                        : 1
                    }}
                    transition={{
                      repeat: isPlaying ? Infinity : 0,
                      duration: 0.5,
                      delay: i * 0.05
                    }}
                  />
                ))}
              </motion.div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1">
                <Slider
                  value={[progress]}
                  onValueChange={handleSeek}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 space-y-3">
            {/* Main Controls */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => skip(-10)}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant="hero"
                size="icon-lg"
                onClick={handlePlayPause}
                className="shadow-glow hover:shadow-accent"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => skip(10)}
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleStop}
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center justify-between">
              {/* Volume */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Additional Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant={isLooping ? "secondary" : "ghost"}
                  size="icon-sm"
                  onClick={() => setIsLooping(!isLooping)}
                >
                  <Repeat className="h-4 w-4" />
                </Button>
                
                <Button variant="ghost" size="icon-sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Speed Control (Expanded Mode) */}
            {isExpanded && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <span className="text-xs text-muted-foreground">Speed:</span>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <Button
                    key={speed}
                    variant={speed === 1 ? "secondary" : "ghost"}
                    size="sm"
                    className="text-xs px-2 py-1 h-6"
                  >
                    {speed}x
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};