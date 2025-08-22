import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, BookOpen, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatModal } from './ChatModal';
import { AudioPlayer } from './AudioPlayer';

const activities = [
  {
    type: 'chat',
    title: 'AI Chat Session',
    description: 'Discussed "Deep Learning" concepts',
    time: '2 hours ago',
    icon: MessageSquare,
    color: 'text-primary',
  },
  {
    type: 'summary',
    title: 'Generated Summary',
    description: 'Chapter 5: Neural Networks',
    time: '4 hours ago',
    icon: Sparkles,
    color: 'text-accent',
  },
  {
    type: 'reading',
    title: 'Reading Progress',
    description: 'Completed 15 pages in "React Patterns"',
    time: '1 day ago',
    icon: BookOpen,
    color: 'text-secondary',
  },
  {
    type: 'translation',
    title: 'Translation Request',
    description: 'Translated page to Spanish',
    time: '2 days ago',
    icon: Sparkles,
    color: 'text-accent',
  },
];

export const RecentActivity = () => {
  const [showChatModal, setShowChatModal] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  return (
    <>
      <div className="glass border border-glass-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            View All
          </Button>
        </div>
        
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
          className="space-y-4"
        >
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { duration: 0.3, ease: "easeOut" }
                }
              }}
              whileHover={{ x: 4 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-glass-highlight/10 transition-all duration-200 cursor-pointer border border-transparent hover:border-glass-border"
              onClick={() => {
                if (activity.type === 'chat') setShowChatModal(true);
                if (activity.type === 'summary') setShowAudioPlayer(true);
              }}
            >
              <div className={`w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center mt-0.5`}>
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground truncate">
                  {activity.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {activity.description}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-6 pt-4 border-t border-glass-border space-y-2">
          <Button 
            variant="glass" 
            size="sm" 
            className="w-full"
            onClick={() => setShowChatModal(true)}
          >
            <Sparkles className="w-3 h-3 mr-2" />
            Start AI Chat
          </Button>
          <Button 
            variant="accent" 
            size="sm" 
            className="w-full"
            onClick={() => setShowAudioPlayer(true)}
          >
            <MessageSquare className="w-3 h-3 mr-2" />
            Demo Audio Player
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ChatModal 
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        bookTitle="Demo Book - AI Features"
      />
      <AudioPlayer
        isOpen={showAudioPlayer}
        onClose={() => setShowAudioPlayer(false)}
        title="Demo Audio - AI Summary"
        type="summary"
      />
    </>
  );
};