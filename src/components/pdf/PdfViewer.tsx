import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import { cn } from '@/lib/utils';
import { PdfToolbar } from './PdfToolbar';
import { PdfSidebar } from './PdfSidebar';
import { PdfChat } from './PdfChat';
import { PdfAudioPlayer } from './PdfAudioPlayer';
import { useToast } from '@/hooks/use-toast';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export type ViewMode = 'reading' | 'analysis' | 'focus' | 'presentation' | 'mobile';

interface PdfViewerProps {
  file?: string | File;
  className?: string;
  onClose?: () => void;
}

export const PdfViewer = ({ file, className, onClose }: PdfViewerProps) => {
  const { toast } = useToast();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>('reading');
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    toast({
      title: "PDF Loaded Successfully",
      description: `Document with ${numPages} pages is ready for analysis.`,
    });
  }, [toast]);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('Error loading PDF:', error);
    setLoading(false);
    toast({
      title: "Error Loading PDF",
      description: "Failed to load the document. Please try again.",
      variant: "destructive",
    });
  }, [toast]);

  const navigatePage = useCallback((direction: 'prev' | 'next' | 'first' | 'last' | number) => {
    if (typeof direction === 'number') {
      setPageNumber(Math.max(1, Math.min(numPages, direction)));
    } else {
      switch (direction) {
        case 'prev':
          setPageNumber(prev => Math.max(1, prev - 1));
          break;
        case 'next':
          setPageNumber(prev => Math.min(numPages, prev + 1));
          break;
        case 'first':
          setPageNumber(1);
          break;
        case 'last':
          setPageNumber(numPages);
          break;
      }
    }
  }, [numPages]);

  const handleZoom = useCallback((direction: 'in' | 'out' | 'fit-width' | 'fit-page' | number) => {
    if (typeof direction === 'number') {
      setScale(direction);
    } else {
      switch (direction) {
        case 'in':
          setScale(prev => Math.min(3, prev + 0.25));
          break;
        case 'out':
          setScale(prev => Math.max(0.25, prev - 0.25));
          break;
        case 'fit-width':
          setScale(1.0);
          break;
        case 'fit-page':
          setScale(0.8);
          break;
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 't':
            event.preventDefault();
            // Trigger translate current page
            break;
          case 's':
            event.preventDefault();
            // Trigger summarize current page
            break;
          case 'q':
            event.preventDefault();
            setChatOpen(true);
            break;
          case '=':
          case '+':
            event.preventDefault();
            handleZoom('in');
            break;
          case '-':
            event.preventDefault();
            handleZoom('out');
            break;
          case '0':
            event.preventDefault();
            handleZoom('fit-width');
            break;
        }
      } else {
        switch (event.key) {
          case 'ArrowLeft':
            navigatePage('prev');
            break;
          case 'ArrowRight':
            navigatePage('next');
            break;
          case 'Home':
            navigatePage('first');
            break;
          case 'End':
            navigatePage('last');
            break;
          case ' ':
            event.preventDefault();
            if (event.shiftKey) {
              navigatePage('prev');
            } else {
              navigatePage('next');
            }
            break;
          case 'f':
          case 'F':
            setViewMode(prev => prev === 'presentation' ? 'reading' : 'presentation');
            break;
          case 'Escape':
            if (chatOpen) setChatOpen(false);
            else if (viewMode === 'presentation') setViewMode('reading');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigatePage, handleZoom, chatOpen, viewMode]);

  const getViewModeClasses = () => {
    switch (viewMode) {
      case 'analysis':
        return 'grid grid-cols-[1fr_400px] gap-4';
      case 'focus':
        return 'flex justify-center';
      case 'presentation':
        return 'fixed inset-0 z-50 bg-background';
      case 'mobile':
        return 'flex flex-col';
      default:
        return 'flex justify-center';
    }
  };

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No PDF file selected</p>
          <p className="text-sm text-muted-foreground">Choose a file to start reading</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-full flex flex-col bg-background", className)}>
      <AnimatePresence mode="wait">
        {viewMode !== 'presentation' && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PdfToolbar
              currentPage={pageNumber}
              totalPages={numPages}
              scale={scale}
              viewMode={viewMode}
              onPageChange={navigatePage}
              onZoomChange={handleZoom}
              onViewModeChange={setViewMode}
              onBack={onClose}
              loading={loading}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("flex-1 overflow-hidden", getViewModeClasses())}>
        <motion.div 
          className="flex-1 overflow-auto pdf-container"
          layout
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="p-4 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="shadow-glow rounded-lg overflow-hidden"
            >
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                }
                error={
                  <div className="flex items-center justify-center p-8 text-destructive">
                    <p>Failed to load PDF</p>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  loading={
                    <div className="flex items-center justify-center p-4 bg-muted rounded">
                      <div className="animate-pulse text-muted-foreground">Loading page...</div>
                    </div>
                  }
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </motion.div>
          </div>
        </motion.div>

        {viewMode === 'analysis' && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <PdfSidebar
              currentPage={pageNumber}
              totalPages={numPages}
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              onOpenChat={() => setChatOpen(true)}
            />
          </motion.div>
        )}
      </div>

      {/* Floating Chat Button */}
      {viewMode !== 'analysis' && !chatOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-accent text-accent-foreground rounded-full shadow-glow hover:shadow-accent flex items-center justify-center z-40"
        >
          💬
        </motion.button>
      )}

      {/* Chat Modal */}
      <PdfChat 
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        currentPage={pageNumber}
      />

      {/* Audio Player */}
      <AnimatePresence>
        {audioPlaying && (
          <PdfAudioPlayer
            onClose={() => setAudioPlaying(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};