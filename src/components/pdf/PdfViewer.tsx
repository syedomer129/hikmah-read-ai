import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import { cn } from '@/lib/utils';
import { PdfToolbar } from './PdfToolbar';
import { PdfSidebar } from './PdfSidebar';
import { PdfChat } from './PdfChat';
import { PdfAudioPlayer } from './PdfAudioPlayer';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, ZoomIn, Play } from 'lucide-react';

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
  const [zoomModalOpen, setZoomModalOpen] = useState<boolean>(false);
  const [pageTranslations, setPageTranslations] = useState<Record<number, string>>({});
  const [pageSummaries, setPageSummaries] = useState<Record<number, string>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [confirmationModal, setConfirmationModal] = useState<{ type: 'translate' | 'summarize' | null, action: () => void }>({ type: null, action: () => {} });

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

  // AI Action Handlers
  const handleTranslatePage = useCallback(async (pageNum: number) => {
    const key = `translate-page-${pageNum}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    // Simulate API call - replace with actual AI integration
    setTimeout(() => {
      setPageTranslations(prev => ({ 
        ...prev, 
        [pageNum]: `Translation for page ${pageNum} content...` 
      }));
      setLoadingStates(prev => ({ ...prev, [key]: false }));
      toast({
        title: "Translation Complete",
        description: `Page ${pageNum} has been translated.`,
      });
    }, 2000);
  }, [toast]);

  const handleSummarizePage = useCallback(async (pageNum: number) => {
    const key = `summarize-page-${pageNum}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    // Simulate API call - replace with actual AI integration
    setTimeout(() => {
      setPageSummaries(prev => ({ 
        ...prev, 
        [pageNum]: `Summary for page ${pageNum}: Key points and insights...` 
      }));
      setLoadingStates(prev => ({ ...prev, [key]: false }));
      toast({
        title: "Summary Complete", 
        description: `Page ${pageNum} has been summarized.`,
      });
    }, 2000);
  }, [toast]);

  const handleFullBookAction = useCallback((action: 'translate' | 'summarize') => {
    setConfirmationModal({
      type: action,
      action: () => {
        const key = `${action}-book`;
        setLoadingStates(prev => ({ ...prev, [key]: true }));
        
        // Simulate full book processing
        setTimeout(() => {
          setLoadingStates(prev => ({ ...prev, [key]: false }));
          toast({
            title: `${action === 'translate' ? 'Translation' : 'Summary'} Complete`,
            description: `Full book ${action} has been completed.`,
          });
        }, 5000);
        
        setConfirmationModal({ type: null, action: () => {} });
      }
    });
  }, [toast]);

  const playAudio = useCallback((type: 'translation' | 'summary', pageNum: number) => {
    setAudioPlaying(true);
    toast({
      title: "Playing Audio",
      description: `Playing ${type} audio for page ${pageNum}`,
    });
  }, [toast]);

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
              onFullBookAction={handleFullBookAction}
              onOpenChat={() => setChatOpen(true)}
              onOpenAudio={() => setAudioPlaying(true)}
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
              className="shadow-glow rounded-lg overflow-hidden relative group"
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
                <div
                  className="cursor-zoom-in"
                  onClick={() => setZoomModalOpen(true)}
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
                </div>
              </Document>

              {/* Per-Page Controls Overlay */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-y-2">
                <div className="bg-glass backdrop-blur-sm border border-glass-border rounded-lg p-3 space-y-2">
                  <div className="text-xs font-medium text-foreground mb-2">Page {pageNumber} Actions</div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTranslatePage(pageNumber)}
                    disabled={loadingStates[`translate-page-${pageNumber}`]}
                    className="w-full justify-start gap-2 h-8"
                  >
                    🌐 {loadingStates[`translate-page-${pageNumber}`] ? 'Translating...' : 'Translate Page'}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSummarizePage(pageNumber)}
                    disabled={loadingStates[`summarize-page-${pageNumber}`]}
                    className="w-full justify-start gap-2 h-8"
                  >
                    📝 {loadingStates[`summarize-page-${pageNumber}`] ? 'Summarizing...' : 'Summarize Page'}
                  </Button>

                  {/* Audio Controls for Translated/Summarized Content */}
                  {pageTranslations[pageNumber] && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playAudio('translation', pageNumber)}
                      className="w-full justify-start gap-2 h-8"
                    >
                      <Play className="w-3 h-3" />
                      Play Translation
                    </Button>
                  )}

                  {pageSummaries[pageNumber] && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playAudio('summary', pageNumber)}
                      className="w-full justify-start gap-2 h-8"
                    >
                      <Play className="w-3 h-3" />
                      Play Summary
                    </Button>
                  )}
                </div>
              </div>
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

      {/* Zoom Modal */}
      <Dialog open={zoomModalOpen} onOpenChange={setZoomModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Page {pageNumber} - Detailed View</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoomModalOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex justify-center overflow-auto max-h-[70vh]">
            {file && (
              <Document file={file}>
                <Page
                  pageNumber={pageNumber}
                  scale={1.5}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Full Book Actions */}
      <Dialog open={confirmationModal.type !== null} onOpenChange={(open) => !open && setConfirmationModal({ type: null, action: () => {} })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirmationModal.type === 'translate' ? 'Translate Full Book?' : 'Summarize Full Book?'}
            </DialogTitle>
            <DialogDescription>
              This will {confirmationModal.type === 'translate' ? 'translate the entire book' : 'generate a complete summary'} and may take several minutes to complete.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmationModal({ type: null, action: () => {} })}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmationModal.action}
              disabled={loadingStates[`${confirmationModal.type}-book`]}
            >
              {loadingStates[`${confirmationModal.type}-book`] 
                ? `${confirmationModal.type === 'translate' ? 'Translating' : 'Summarizing'}...` 
                : `Yes, ${confirmationModal.type === 'translate' ? 'Translate' : 'Summarize'}`
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};