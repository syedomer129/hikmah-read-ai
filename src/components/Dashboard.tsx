import { motion } from 'framer-motion';
import { BookCard } from './BookCard';
import { EmptyState } from './EmptyState';
import { StatsCards } from './StatsCards';
import { RecentActivity } from './RecentActivity';

// Mock data for demonstration
const mockBooks = [
  {
    id: '1',
    title: 'The Art of Software Architecture',
    author: 'Martin Fowler',
    thumbnail: '/api/placeholder/200/280',
    progress: 65,
    totalPages: 324,
    lastRead: '2 hours ago',
    tags: ['Technology', 'Architecture']
  },
  {
    id: '2', 
    title: 'Deep Learning Fundamentals',
    author: 'Ian Goodfellow',
    thumbnail: '/api/placeholder/200/280',
    progress: 23,
    totalPages: 456,
    lastRead: '1 day ago',
    tags: ['AI', 'Machine Learning']
  },
  {
    id: '3',
    title: 'React Design Patterns',
    author: 'Michele Bertoli',
    thumbnail: '/api/placeholder/200/280',
    progress: 89,
    totalPages: 278,
    lastRead: '3 days ago',
    tags: ['React', 'Frontend']
  }
];

export const Dashboard = () => {
  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-2">
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Welcome back
            </h1>
            <p className="text-lg text-muted-foreground">
              Continue your learning journey with AI-powered insights
            </p>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Library Section */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Library</h2>
              <div className="flex gap-2">
                <select className="glass border border-glass-border rounded-lg px-3 py-2 text-sm bg-glass-background">
                  <option>All Books</option>
                  <option>Recently Added</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            {mockBooks.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
              >
                {mockBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.95 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: { duration: 0.4, ease: "easeOut" }
                      }
                    }}
                  >
                    <BookCard book={book} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState />
            )}
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};