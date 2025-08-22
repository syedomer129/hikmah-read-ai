import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Languages, FileText, MessageSquare, BookOpenText, 
  Search, Volume2, Copy, ChevronDown, ChevronRight,
  Globe, Sparkles, Brain, Headphones, History,
  PanelRightClose, PanelRightOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface PdfSidebarProps {
  currentPage: number;
  totalPages: number;
  collapsed: boolean;
  onToggle: () => void;
  onOpenChat: () => void;
}

export const PdfSidebar = ({ 
  currentPage, 
  totalPages, 
  collapsed, 
  onToggle, 
  onOpenChat 
}: PdfSidebarProps) => {
  const [activeSection, setActiveSection] = useState<string>('translate');
  const [translateProgress, setTranslateProgress] = useState<number>(0);
  const [summaryProgress, setSummaryProgress] = useState<number>(0);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  
  const sections = [
    {
      id: 'translate',
      title: 'Translate Page',
      icon: Languages,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      id: 'summarize',
      title: 'Summarize Page',
      icon: FileText,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    },
    {
      id: 'chat',
      title: 'Ask AI',
      icon: MessageSquare,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      id: 'book',
      title: 'Full Book',
      icon: BookOpenText,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    }
  ];

  const handleTranslate = () => {
    setIsTranslating(true);
    setTranslateProgress(0);
    
    // Simulate translation progress
    const interval = setInterval(() => {
      setTranslateProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTranslating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSummarize = () => {
    setIsSummarizing(true);
    setSummaryProgress(0);
    
    // Simulate summary progress
    const interval = setInterval(() => {
      setSummaryProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSummarizing(false);
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  if (collapsed) {
    return (
      <div className="w-14 border-l border-glass-border bg-glass backdrop-blur-glass h-full flex flex-col">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className="m-2"
        >
          <PanelRightOpen className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 flex flex-col gap-2 p-2">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Button
                key={section.id}
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setActiveSection(section.id);
                  onToggle();
                }}
                className={cn(
                  "h-10 w-10",
                  activeSection === section.id && `${section.bgColor} ${section.color}`
                )}
              >
                <IconComponent className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-96 border-l border-glass-border bg-glass backdrop-blur-glass h-full flex flex-col"
      initial={{ width: 56 }}
      animate={{ width: 384 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-glass-border/50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">AI Controls</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggle}
          >
            <PanelRightClose className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Page {currentPage} of {totalPages}</span>
          <Badge variant="outline" className="text-xs">
            Ready
          </Badge>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-glass-border/50">
        {sections.map((section) => {
          const IconComponent = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-all",
                "hover:bg-glass-highlight/10",
                isActive 
                  ? `${section.color} ${section.bgColor} border-b-2 ${section.borderColor}` 
                  : "text-muted-foreground"
              )}
            >
              <IconComponent className="h-4 w-4" />
              <span className="hidden sm:inline">{section.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {activeSection === 'translate' && (
            <motion.div
              key="translate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-500">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium">Translate Current Page</span>
                </div>
                
                <Select defaultValue="english">
                  <SelectTrigger>
                    <SelectValue placeholder="Target Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="arabic">Arabic</SelectItem>
                  </SelectContent>
                </Select>

                {isTranslating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Translating...</span>
                      <span>{translateProgress}%</span>
                    </div>
                    <Progress value={translateProgress} className="h-2" />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={handleTranslate}
                    disabled={isTranslating}
                    className="flex-1"
                    variant="hero"
                  >
                    {isTranslating ? 'Translating...' : '🌐 Translate'}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {translateProgress === 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-muted rounded-lg text-sm"
                  >
                    <p className="font-medium mb-2">Translation Complete:</p>
                    <p className="text-muted-foreground">
                      This is a sample translated text that would appear here after the AI processes the current page content...
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'summarize' && (
            <motion.div
              key="summarize"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-orange-500">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">Summarize Current Page</span>
                </div>
                
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Summary Length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brief">Brief (1-2 sentences)</SelectItem>
                    <SelectItem value="medium">Medium (1 paragraph)</SelectItem>
                    <SelectItem value="detailed">Detailed (Multiple paragraphs)</SelectItem>
                  </SelectContent>
                </Select>

                {isSummarizing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Generating summary...</span>
                      <span>{summaryProgress}%</span>
                    </div>
                    <Progress value={summaryProgress} className="h-2" />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSummarize}
                    disabled={isSummarizing}
                    className="flex-1"
                    variant="accent"
                  >
                    {isSummarizing ? 'Summarizing...' : '📝 Summarize'}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {summaryProgress === 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-muted rounded-lg text-sm"
                  >
                    <p className="font-medium mb-2">Page Summary:</p>
                    <p className="text-muted-foreground">
                      This page discusses the key concepts and methodologies related to the topic. The main points include several important considerations that readers should understand...
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-purple-500">
                  <Brain className="h-4 w-4" />
                  <span className="font-medium">Ask AI About Page</span>
                </div>
                
                <Textarea
                  placeholder="Ask about this page content..."
                  className="min-h-[100px] resize-none"
                />

                <div className="flex gap-2">
                  <Button 
                    onClick={onOpenChat}
                    className="flex-1"
                    variant="success"
                  >
                    🚀 Ask AI
                  </Button>
                  <Button variant="outline" size="icon">
                    <History className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Quick Questions</h4>
                  <div className="space-y-1">
                    {[
                      "What are the main points?",
                      "Explain this concept",
                      "How does this relate to...?",
                      "What are the implications?"
                    ].map((question, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left h-auto p-2 whitespace-normal"
                        onClick={onOpenChat}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'book' && (
            <motion.div
              key="book"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-500">
                  <BookOpenText className="h-4 w-4" />
                  <span className="font-medium">Full Book Actions</span>
                </div>
                
                <div className="grid gap-2">
                  <Button variant="hero" className="justify-start gap-2">
                    <Languages className="h-4 w-4" />
                    Translate Entire Book
                  </Button>
                  
                  <Button variant="accent" className="justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Book Summary
                  </Button>
                  
                  <Button variant="success" className="justify-start gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Chat About Book
                  </Button>
                  
                  <Button variant="floating" className="justify-start gap-2">
                    <Headphones className="h-4 w-4" />
                    Create Audiobook
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Smart Search
                  </h4>
                  
                  <Input placeholder="Search in document..." />
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      🤖 AI Search
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      📍 Keyword
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};