import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Book, Settings, SkipBack, ChevronLeft, ChevronRight, 
  SkipForward, ZoomIn, ZoomOut, Monitor, BookOpen, Focus, 
  Presentation, Smartphone, Moon, Sun, Zap, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ViewMode } from './PdfViewer';

interface PdfToolbarProps {
  currentPage: number;
  totalPages: number;
  scale: number;
  viewMode: ViewMode;
  onPageChange: (direction: 'prev' | 'next' | 'first' | 'last' | number) => void;
  onZoomChange: (direction: 'in' | 'out' | 'fit-width' | 'fit-page' | number) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onBack?: () => void;
  loading?: boolean;
  onFullBookAction?: (action: 'translate' | 'summarize') => void;
  onOpenChat?: () => void;
  onOpenAudio?: () => void;
}

export const PdfToolbar = ({
  currentPage,
  totalPages,
  scale,
  viewMode,
  onPageChange,
  onZoomChange,
  onViewModeChange,
  onBack,
  loading = false,
  onFullBookAction,
  onOpenChat,
  onOpenAudio
}: PdfToolbarProps) => {
  const [pageInput, setPageInput] = useState<string>(currentPage.toString());
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handlePageInputChange = (value: string) => {
    setPageInput(value);
    const pageNumber = parseInt(value, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const viewModeConfig = {
    reading: { icon: BookOpen, label: 'Reading', variant: 'outline' as const },
    analysis: { icon: Focus, label: 'Analysis', variant: 'outline' as const },
    focus: { icon: Monitor, label: 'Focus', variant: 'outline' as const },
    presentation: { icon: Presentation, label: 'Present', variant: 'outline' as const },
    mobile: { icon: Smartphone, label: 'Mobile', variant: 'outline' as const },
  };

  return (
    <motion.div 
      className="border-b border-glass-border bg-glass backdrop-blur-glass p-3"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Section - Navigation & AI Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Exit</span>
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm truncate max-w-[200px]">
              Document.pdf
            </span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* AI Model Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Model:</span>
            <Select defaultValue="gemini">
              <SelectTrigger className="w-32 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Gemini 1.5 Flash</SelectItem>
                <SelectItem value="gpt4">GPT-4</SelectItem>
                <SelectItem value="claude">Claude 3 Haiku</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Language:</span>
            <Select defaultValue="english">
              <SelectTrigger className="w-24 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="urdu">Urdu</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
                <SelectItem value="arabic">Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Full Book Actions */}
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-xs"
              onClick={() => onFullBookAction?.('translate')}
            >
              🌐 Translate Full
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-xs"
              onClick={() => onFullBookAction?.('summarize')}
            >
              📚 Summarize Full
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-xs"
              onClick={() => onOpenChat?.()}
            >
              💬 Chat
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-xs"
              onClick={() => onOpenAudio?.()}
            >
              🔊 Audio
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-xs opacity-50">
              🎬 Video
            </Button>
          </div>
        </div>

        {/* Center Section - Page Controls */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={() => onPageChange('first')}
            disabled={currentPage === 1 || loading}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={() => onPageChange('prev')}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 mx-2">
            <Input
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={(e) => handlePageInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePageInputChange(pageInput);
                }
              }}
              className="w-16 h-8 text-center text-sm"
              disabled={loading}
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              of {totalPages}
            </span>
          </div>

          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={() => onPageChange('next')}
            disabled={currentPage === totalPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={() => onPageChange('last')}
            disabled={currentPage === totalPages || loading}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center gap-1">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 mr-2">
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={() => onZoomChange('out')}
              disabled={scale <= 0.25}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Select 
              value={(scale * 100).toFixed(0)} 
              onValueChange={(value) => onZoomChange(parseInt(value) / 100)}
            >
              <SelectTrigger className="w-20 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25%</SelectItem>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="75">75%</SelectItem>
                <SelectItem value="100">100%</SelectItem>
                <SelectItem value="125">125%</SelectItem>
                <SelectItem value="150">150%</SelectItem>
                <SelectItem value="200">200%</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={() => onZoomChange('in')}
              disabled={scale >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onZoomChange('fit-width')}
              className="text-xs px-2"
            >
              Fit Width
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onZoomChange('fit-page')}
              className="text-xs px-2"
            >
              Fit Page
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* View Mode Controls */}
          <div className="flex items-center gap-1 mr-2">
            {Object.entries(viewModeConfig).map(([mode, config]) => {
              const IconComponent = config.icon;
              const isActive = viewMode === mode;
              
              return (
                <Button
                  key={mode}
                  variant={isActive ? "secondary" : "ghost"}
                  size="icon-sm"
                  onClick={() => onViewModeChange(mode as ViewMode)}
                  className={cn(
                    "relative",
                    isActive && "bg-primary/10 text-primary border-primary/20"
                  )}
                >
                  <IconComponent className="h-4 w-4" />
                  {isActive && (
                    <motion.div
                      layoutId="activeViewMode"
                      className="absolute inset-0 bg-primary/5 rounded border border-primary/20"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                </Button>
              );
            })}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Utility Controls */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <Button variant="ghost" size="icon-sm">
              <Zap className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon-sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};