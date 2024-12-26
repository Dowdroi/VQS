import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pdfUrl: string;
  isLoading?: boolean;
}

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  pdfUrl,
  isLoading,
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-4xl h-[80vh]">
      <DialogHeader>
        <DialogTitle>Preview PDF</DialogTitle>
      </DialogHeader>
      <div className="flex-1 min-h-0">
        <iframe
          src={pdfUrl}
          className="w-full h-[calc(80vh-8rem)] border rounded"
        />
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={isLoading}>
          Confirm
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default PDFPreviewModal;
