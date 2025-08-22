import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Library, 
  MessageSquare, 
  Settings, 
  User, 
  Search,
  Plus,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems = [
  { icon: Library, label: 'Library', href: '/', active: true },
  { icon: BookOpen, label: 'Recent', href: '/recent' },
  { icon: MessageSquare, label: 'Chat History', href: '/chat' },
  { icon: Sparkles, label: 'AI Features', href: '/ai' },
];

const bottomItems = [
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export const Sidebar = ({ collapsed, onToggleCollapse }: SidebarProps) => {
  return (
    <motion.div 
      className={cn(
        "h-full glass border-r border-glass-border backdrop-blur-glass flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
      layout
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-glass-border">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-gradient">Hikmah</h1>
                  <p className="text-xs text-muted-foreground">Reader</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleCollapse}
            className="hover:bg-glass-highlight/10"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 space-y-2">
        <Button
          variant="hero"
          size={collapsed ? "icon" : "default"}
          className="w-full justify-start"
        >
          <Plus className="w-4 h-4" />
          {!collapsed && <span className="ml-2">Upload PDF</span>}
        </Button>
        
        {!collapsed && (
          <Button
            variant="glass"
            size="default"
            className="w-full justify-start"
          >
            <Search className="w-4 h-4" />
            <span className="ml-2">Search Library</span>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2">
        <div className="space-y-1">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Button
                variant={item.active ? "secondary" : "ghost"}
                size={collapsed ? "icon" : "default"}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  item.active && "shadow-elegant bg-secondary/80 text-secondary-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-4 left-2 right-2 space-y-1">
          {bottomItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Button
                variant="ghost"
                size={collapsed ? "icon" : "default"}
                className="w-full justify-start"
              >
                <item.icon className="w-4 h-4" />
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Button>
            </motion.div>
          ))}
        </div>
      </nav>
    </motion.div>
  );
};