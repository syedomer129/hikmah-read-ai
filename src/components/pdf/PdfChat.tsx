import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, BookOpen, History, Settings, Bot, User,
  RotateCcw, Copy, Volume2, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  pageContext?: number;
  isTyping?: boolean;
}

interface PdfChatProps {
  open: boolean;
  onClose: () => void;
  currentPage: number;
}

export const PdfChat = ({ open, onClose, currentPage }: PdfChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m your AI reading assistant. Ask me anything about this document or specific pages. I can help you understand concepts, summarize content, or answer questions.',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      pageContext: currentPage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI typing
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Based on page ${currentPage}, here's what I can tell you: ${getSimulatedResponse(inputValue)}`,
        timestamp: new Date(),
        pageContext: currentPage,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getSimulatedResponse = (question: string) => {
    const responses = [
      "This section discusses key concepts that are fundamental to understanding the broader topic. The main ideas presented include detailed analysis of methodologies and their practical applications.",
      "From what I can see on this page, there are several important points worth highlighting. The author emphasizes the significance of these concepts in the context of the overall framework.",
      "This page contains valuable information about the theoretical foundations. The content builds upon previous chapters to establish a comprehensive understanding of the subject matter.",
      "The material on this page provides crucial insights into the practical implementation of these concepts. It offers detailed examples and case studies that illustrate the principles in action."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Keep the welcome message
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl h-[80vh] bg-glass backdrop-blur-glass border border-glass-border rounded-xl shadow-glow flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-glass-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg text-primary-foreground">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Chat with AI Assistant</h2>
                <p className="text-sm text-muted-foreground">
                  Currently discussing page {currentPage}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-sm" onClick={clearChat}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm">
                <History className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex gap-3",
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={cn(
                      message.type === 'ai' 
                        ? 'bg-gradient-primary text-primary-foreground' 
                        : 'bg-gradient-accent text-accent-foreground'
                    )}>
                      {message.type === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>

                  <div className={cn(
                    "flex-1 max-w-[80%]",
                    message.type === 'user' ? 'flex flex-col items-end' : 'flex flex-col items-start'
                  )}>
                    <div className={cn(
                      "rounded-xl px-4 py-3 text-sm",
                      message.type === 'user'
                        ? 'bg-gradient-accent text-accent-foreground'
                        : 'bg-glass border border-glass-border'
                    )}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>

                    <div className={cn(
                      "flex items-center gap-2 mt-2",
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      
                      {message.pageContext && (
                        <Badge variant="outline" className="text-xs">
                          <BookOpen className="h-3 w-3 mr-1" />
                          Page {message.pageContext}
                        </Badge>
                      )}

                      {message.type === 'ai' && (
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Volume2 className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="bg-glass border border-glass-border rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-glass-border/50">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about this page or the entire document..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                variant="hero"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                Context: Page {currentPage}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Press Enter to send • Shift + Enter for new line
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};