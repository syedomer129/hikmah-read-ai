import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, MoreVertical, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChatModal } from './ChatModal';
import { AudioPlayer } from './AudioPlayer';
import { cn } from '@/lib/utils';

interface Book {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  progress: number;
  totalPages: number;
  lastRead: string;
  tags: string[];
}

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate();
  const [showChatModal, setShowChatModal] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const handleReadBook = () => {
    navigate('/reader', { state: { book } });
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative"
      >
        <div className="glass border border-glass-border rounded-xl overflow-hidden hover:shadow-glow transition-all duration-300">
          {/* Thumbnail */}
          <div className="relative aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 p-4">
            <div className="w-full h-full glass rounded-lg flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-primary/60" />
            </div>
            
            {/* Action Buttons - Hidden by default, shown on hover */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <Button variant="glass" size="icon-sm" className="backdrop-blur-md">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </motion.div>
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 space-y-2"
            >
              <Button 
                variant="hero" 
                size="sm" 
                className="w-full"
                onClick={handleReadBook}
              >
                <Play className="w-3 h-3 mr-2" />
                Continue Reading
              </Button>
              <Button 
                variant="glass" 
                size="sm" 
                className="w-full"
                onClick={() => setShowChatModal(true)}
              >
                <Sparkles className="w-3 h-3 mr-2" />
                AI Chat
              </Button>
            </motion.div>
          </div>
          
          {/* Content */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                by {book.author}
              </p>
            </div>
            
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{book.progress}%</span>
              </div>
              <Progress value={book.progress} className="h-1" />
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {book.tags.slice(0, 2).map((tag) => (
                <Badge 
                  key={tag}
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-secondary/20 text-secondary-foreground border-secondary/30"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Last Read */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Last read {book.lastRead}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <ChatModal 
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        bookTitle={book.title}
      />
      <AudioPlayer
        isOpen={showAudioPlayer}
        onClose={() => setShowAudioPlayer(false)}
        title={`${book.title} - Chapter Summary`}
        type="summary"
      />
    </>
  );
};