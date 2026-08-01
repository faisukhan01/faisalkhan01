'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-2xl' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative z-10 w-full ${maxWidth} rounded-2xl border border-white/[0.15] bg-[#111827] shadow-2xl shadow-black/50`}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-lg text-white/75 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="max-h-[70vh]">
              <div className="px-6 py-4">{children}</div>
            </ScrollArea>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
