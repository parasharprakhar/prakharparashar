import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Mail } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
}

const ShareDialog = ({ open, onClose }: ShareDialogProps) => {
  const url = window.location.href;
  const text = "Check out Prakhar Parashar's portfolio — Senior Operations & Digital Transformation Leader";

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
  };

  const shareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent("Portfolio: " + url)}`, "_blank");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-xl p-6 w-80"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-foreground font-semibold">Share Profile</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              📝 Note: No email IDs are stored or collected when sharing.
            </p>
            <div className="flex gap-3">
              <button
                onClick={shareWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              <button
                onClick={shareEmail}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Email
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareDialog;
