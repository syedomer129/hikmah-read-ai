import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PdfViewer } from '@/components/pdf/PdfViewer';

export const PdfReader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pdfFile, setPdfFile] = useState<File | string | undefined>(
    location.state?.file || '/placeholder.pdf'
  );

  const handleBack = () => {
    navigate('/');
  };

  return (
    <motion.div 
      className="h-screen w-full bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PdfViewer 
        file={pdfFile}
        onClose={handleBack}
        className="h-full"
      />
    </motion.div>
  );
};