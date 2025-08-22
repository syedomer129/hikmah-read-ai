import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background mesh-gradient">
      <div className="flex h-screen w-full">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: sidebarCollapsed ? -240 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative z-20"
          >
            <Sidebar 
              collapsed={sidebarCollapsed} 
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
            />
          </motion.div>
        </AnimatePresence>

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar sidebarCollapsed={sidebarCollapsed} />
          
          <main className={cn("flex-1 overflow-hidden", className)}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};