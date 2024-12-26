import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import InputWithLabel from "@/components/forms/InputWithLabel";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import Text from "@/components/ui/Text";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  User2,
  FileText,
  Upload,
  Search,
  FileX,
} from "lucide-react";
import ActionModal from "./ActionModal";
import { cn } from "@/lib/utils";
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import { VTaskDetail } from "@/models/TaskDetail.model";
import PDFPreviewModal from "./PDFPreviewModel";
import ActionRejectModal from "./ActionRejectModal";
import { useTaskAction } from "@/hooks/useTaskAction";
// import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
// import Label from '@/components/ui/Label';
import { toast } from "sonner";
import { TaskController } from "@/controllers/Task.controller";

interface VEVODetailProps {
  taskId?: string;
  data?: VTaskDetail;
}

const Section = ({
  title,
  children,
  className,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <section
    className={cn(
      "rounded-xl border shadow-sm overflow-hidden",
      "bg-gradient-to-br from-slate-50/50 via-white to-blue-50/20",
      className
    )}
  >
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="h-5 w-5 text-primary/70" />}
        <Text variant="title-24-bold">{title}</Text>
      </div>
      {children}
    </div>
  </section>
);

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-700 ring-green-600/20";
      case "rejected":
        return "bg-red-50 text-red-700 ring-red-600/20";
      case "in_review":
        return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
      default:
        return "bg-blue-50 text-blue-700 ring-blue-600/20";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1",
        "text-sm font-medium ring-1 ring-inset",
        "transition-all duration-200 ease-in-out",
        getStatusStyles()
      )}
    >
      {status?.toUpperCase().replace("_", " ")}
    </span>
  );
};

const VEVODetail: React.FC<VEVODetailProps> = ({ taskId, data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [taskDetail, setTaskDetail] = React.useState<VTaskDetail | null>(
    () => data || null
  );
  const [isLoadingData, setIsLoadingData] = React.useState(!data);

  const {
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
  } = useTaskAction({ taskId });

  const methods = useForm({
    defaultValues: {
      country: data?.form_data?.country || "",
      documentType: data?.form_data?.documentType || "Australian passport",
    },
  });

  useEffect(() => {
    const fetchTaskDetail = async () => {
      if (location.state?.task || !taskId) return;

      try {
        const taskController = new TaskController();
        const response = await taskController.getTaskDetail(taskId);

        if (response.isSuccessful()) {
          setTaskDetail(response.data);
        } else {
          toast.error("Failed to load task details");
        }
      } catch (error) {
        console.error("Error fetching task detail:", error);
        toast.error("Failed to load task details");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchTaskDetail();
  }, [taskId, location.state]);

  const formData = taskDetail?.form_data || {};

  if (isLoadingData) {
    return (
      <FormProvider {...methods}>
        <div className="h-screen flex items-center justify-center bg-gray-50/50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-r-transparent"></div>
            <Text className="text-muted-foreground animate-pulse">
              Loading task details...
            </Text>
          </div>
        </div>
      </FormProvider>
    );
  }

  if (!taskDetail || !formData) {
    return (
      <FormProvider {...methods}>
        <div className="h-screen flex items-center justify-center bg-gray-50/50">
          <div className="text-center space-y-4">
            <FileX className="h-12 w-12 text-muted-foreground mx-auto" />
            <Text className="text-lg text-muted-foreground">
              No task data available
            </Text>
            <Button variant="outline" onClick={() => navigate("/")}>
              Return to Tasks
            </Button>
          </div>
        </div>
      </FormProvider>
    );
  }

  return (
    <FormProvider {...methods}>
      <Gallery>
        <div className="min-h-screen flex flex-col pt-6 px-6 bg-gray-50/50">
          <div className="max-w-[1920px] mx-auto w-full mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              className="gap-2 hover:bg-white/50"
              onClick={() => navigate("/")}
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Tasks
            </Button>

            <StatusBadge status={taskDetail.status || ""} />
          </div>

          <div className="flex-1 overflow-auto min-h-0 w-full pb-6 px-4 md:px-6">
            <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <Section title="ID Requirements" icon={FileText}>
                  <InputWithLabel
                    value={data?._id}
                    disabled
                    className="mt-2 bg-muted/50"
                  />
                </Section>

                <Section title="Selected Name Details" icon={User2}>
                  <div className="space-y-4 mt-2">
                    <InputWithLabel
                      label="Given Name"
                      value={data?.form_data?.first_name}
                      disabled
                      className="bg-muted/50"
                    />
                    <InputWithLabel
                      label="Family Name"
                      value={data?.form_data?.last_name}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                </Section>

                <Section title="Photo ID" icon={FileText}>
                  <Item
                    original={data?.form_data?.passport?.[0]?.download_url}
                    thumbnail={data?.form_data?.passport?.[0]?.download_url}
                    width="2942"
                    height="1961"
                  >
                    {({ ref, open }) => (
                      <div
                        className={cn(
                          "cursor-pointer rounded-xl overflow-hidden",
                          "ring-1 ring-primary/10 hover:ring-primary/30",
                          "transition-all duration-300 group relative",
                          "shadow-sm hover:shadow-md"
                        )}
                        ref={(node) => {
                          if (typeof ref === "function") {
                            ref(node);
                          }
                        }}
                        onClick={open}
                      >
                        <img
                          src={data?.form_data?.passport?.[0]?.download_url}
                          alt="Passport"
                          className="max-h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="flex items-center gap-2 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <Search className="w-5 h-5" />
                            <span className="font-medium">View Image</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Item>
                </Section>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <Section title="Evidence Documents" icon={Upload}>
                  <Item
                    original={data?.form_data?.evidence?.[0]?.download_url}
                    thumbnail={data?.form_data?.evidence?.[0]?.download_url}
                    width="2940"
                    height="1960"
                  >
                    {({ ref, open }) => (
                      <div
                        className={cn(
                          "cursor-pointer rounded-xl overflow-hidden",
                          "ring-1 ring-primary/10 hover:ring-primary/30",
                          "transition-all duration-300 group relative",
                          "shadow-sm hover:shadow-md"
                        )}
                        ref={(node) => {
                          if (typeof ref === "function") {
                            ref(node);
                          }
                        }}
                        onClick={open}
                      >
                        <img
                          src={data?.form_data?.evidence?.[0]?.download_url}
                          alt="Evidence"
                          className="max-h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="flex items-center gap-2 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <Search className="w-5 h-5" />
                            <span className="font-medium">View Image</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Item>
                </Section>

                <Section title="Additional Details" icon={FileText}>
                  <div className="space-y-4 mt-2">
                    <InputWithLabel
                      label="Country"
                      value="Australia"
                      disabled
                      className="bg-muted/50"
                    />
                    <InputWithLabel
                      label="Expiry"
                      value="**/**/*****"
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                </Section>

                <div className="p-6 bg-gradient-to-br from-slate-50/50 via-white to-blue-50/20 rounded-xl border shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50/50 via-white to-emerald-50/30 rounded-lg border border-green-100/50">
                      <Checkbox
                        id="authorized"
                        checked={isAuthorized}
                        onCheckedChange={(checked) =>
                          setIsAuthorized(checked as boolean)
                        }
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <label
                        htmlFor="authorized"
                        className="text-sm text-green-700 font-medium"
                      >
                        I confirm I validated the data
                      </label>
                    </div>

                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={() => handleActionClick("approve")}
                        disabled={isLoading || !isAuthorized}
                        className={cn(
                          "w-32 bg-green-600 hover:bg-green-700",
                          "transition-all duration-200 ease-in-out",
                          "shadow-lg hover:shadow-green-600/25",
                          !isAuthorized && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleActionClick("reject")}
                        disabled={isLoading || !isAuthorized}
                        variant="destructive"
                        className={cn(
                          "w-32",
                          "transition-all duration-200 ease-in-out",
                          "shadow-lg hover:shadow-red-600/25",
                          !isAuthorized && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ActionModal
            isOpen={showActionModal}
            onClose={() => setShowActionModal(false)}
            onConfirm={handleModalConfirm}
            isLoading={isLoading}
            title="Approve Task"
            description="Please provide additional information to approve this task."
            confirmText="Submit"
            buttonStyle="bg-green-600 hover:bg-green-700 text-white"
          />

          <ActionRejectModal
            isOpen={showRejectModal}
            onClose={() => setShowRejectModal(false)}
            onConfirm={handleRejectModalConfirm}
            isLoading={isLoading}
            title="Reject Task"
            description="Please provide a reason for rejecting this task."
            confirmText="Reject"
            buttonStyle="bg-red-600 hover:bg-red-700 text-white"
          />

          <PDFPreviewModal
            isOpen={showPDFPreview}
            onClose={() => setShowPDFPreview(false)}
            onConfirm={handlePDFConfirm}
            pdfUrl={pdfUrl}
            isLoading={isLoading}
          />
        </div>
      </Gallery>
    </FormProvider>
  );
};

export default VEVODetail;
