import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    file: File | null,
    comment: string,
    referenceNumber: string,
    resultIssueDate: string
  ) => void;
  isLoading?: boolean;
  title: string;
  description: string;
  confirmText: string;
  buttonStyle?: string;
}

const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title,
  confirmText,
  buttonStyle,
}) => {
  const [file, _setFile] = React.useState<File | null>(null);
  const [comment, setComment] = React.useState("");
  const [referenceNumber, setReferenceNumber] = React.useState("");
  const [resultIssueDate, setResultIssueDate] = React.useState("");

  const handleConfirm = () => {
    onConfirm(file, comment, referenceNumber, resultIssueDate);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reference">Reference ID</Label>
            <Input
              id="reference"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Enter reference ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueDate">Result Issue Date</Label>
            <Input
              id="issueDate"
              type="date"
              value={resultIssueDate}
              onChange={(e) => setResultIssueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment"
              rows={4}
            />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="file">Attachment (Optional)</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div> */}
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !referenceNumber || !resultIssueDate}
            className={buttonStyle}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionModal;
