import { Bell, Search, User, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TopBarProps {
  sidebarCollapsed: boolean;
}

export const TopBar = ({ sidebarCollapsed }: TopBarProps) => {
  return (
    <header className="h-16 glass border-b border-glass-border backdrop-blur-glass">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search your library..."
              className="pl-10 glass border-glass-border bg-glass-background/50 focus:bg-glass-background"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" className="relative">
            <Bell className="w-4 h-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-2 h-2 p-0 text-[10px] animate-pulse"
            />
          </Button>
          
          <Button variant="ghost" size="icon-sm">
            <Sun className="w-4 h-4" />
          </Button>
          
          <Button variant="glass" size="icon">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};