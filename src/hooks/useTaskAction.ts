import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TaskController } from "@/controllers/Task.controller";

interface UseTaskActionProps {
  taskId?: string;
}

export const useTaskAction = ({ taskId }: UseTaskActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  //   const [comment, setComment] = useState<string>('');
  const navigate = useNavigate();

  const handleTaskAction = async (
    type: "approve" | "reject",
    comment?: string,
    referenceNumber?: string,
    resultIssueDate?: string
  ) => {
    setIsLoading(true);
    try {
      const controller = new TaskController();
      let rs;

      if (type === "approve") {
        const resGenerate = await controller.generatePdf(taskId || "", {
          reference_number: referenceNumber || "",
          result_issue_date: resultIssueDate || "",
          verify_comments: comment || "",
        });

        if (!resGenerate?.isSuccessful()) {
          toast.error("Failed to generate PDF");
          return;
        }

        setPdfUrl(resGenerate.data.pdf_url);
        setShowPDFPreview(true);
        setShowActionModal(false);
      } else {
        rs = await controller.rejectTask(taskId || "", comment || "");
        if (rs?.isSuccessful()) {
          toast.success("Task rejected successfully");
          navigate("/");
        } else {
          toast.error("Failed to reject task");
        }
      }
    } catch (error) {
      toast.error(`Failed to ${type} task`);
    } finally {
      setIsLoading(false);
      setShowRejectModal(false);
    }
  };

  const handlePDFConfirm = async () => {
    setIsLoading(true);
    try {
      const controller = new TaskController();
      const rs = await controller.submitTask(taskId || "");

      if (rs?.isSuccessful()) {
        toast.success("Task approved successfully");
        setShowPDFPreview(false);
        navigate("/");
      } else {
        toast.error("Failed to approve task");
      }
    } catch (error) {
      toast.error("Failed to approve task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalConfirm = async (
    _file?: File | null,
    comment?: string,
    referenceNumber?: string,
    resultIssueDate?: string
  ) => {
    await handleTaskAction(
      "approve",
      comment,
      referenceNumber,
      resultIssueDate
    );
  };

  const handleRejectModalConfirm = async (comment?: string) => {
    await handleTaskAction("reject", comment);
  };

  const handleActionClick = (type: "approve" | "reject") => {
    if (!isAuthorized) {
      toast.error("Please confirm that you are authorized");
      return;
    }
    if (type === "approve") {
      setShowActionModal(true);
    } else {
      setShowRejectModal(true);
    }
  };

  return {
    isLoading,
    isAuthorized,
    showActionModal,
    showRejectModal,
    showPDFPreview,
    pdfUrl,
    setIsAuthorized,
    setShowActionModal,
    setShowRejectModal,
    setShowPDFPreview,
    handleActionClick,
    handleModalConfirm,
    handleRejectModalConfirm,
    handlePDFConfirm,
  };
};
