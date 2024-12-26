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
import VQSWiki from "@/components/task/VQSWiki";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";
import { TaskController } from "@/controllers/Task.controller";

interface QualCheckDetailProps {
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
  data?: VTaskDetail;
}) => (
  <section
    className={cn(
      "rounded-xl border shadow-sm overflow-hidden",
      "bg-gradient-to-br from-slate-50/50 via-white to-blue-50/20",
      "transition-all duration-300 ease-in-out",
      "hover:shadow-lg hover:border-primary/10",
      "backdrop-blur-sm",
      className
    )}
  >
    <div className="relative p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={cn(
                "p-2.5 rounded-xl",
                "bg-gradient-to-br from-primary/10 to-primary/5",
                "ring-1 ring-primary/10",
                "shadow-sm"
              )}
            >
              <Icon className="h-5 w-5 text-primary/70" />
            </div>
          )}
          <div>
            <Text variant="title-16-bold" className="text-foreground/90">
              {title}
            </Text>
            <br />
            <Text className="text-sm text-muted-foreground mt-0.5">
              {title === "Consent & Status Information" &&
                "Review applicant consent and qualification status"}
              {title === "Qualifications" &&
                "View submitted qualification details"}
              {title === "Other Names" && "Additional name records"}
              {title === "Verification Documents" &&
                "Upload supporting documents"}
            </Text>
          </div>
        </div>
      </div>
      <div className="animate-in fade-in duration-500">{children}</div>
    </div>
  </section>
);

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
      case "approved":
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

const QualificationCard = ({ qual, index }: { qual: any; index: number }) => (
  <div
    className={cn(
      "rounded-xl border transition-all duration-300",
      "bg-gradient-to-br from-rose-50/50 via-white to-purple-50/30",
      "hover:shadow-lg hover:border-primary/10",
      "animate-in fade-in slide-in-from-bottom-4 duration-500",
      "style={{ animationDelay: `${index * 100}ms` }}"
    )}
  >
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center",
            "bg-gradient-to-br from-rose-100/50 to-purple-100/50",
            "ring-1 ring-rose-200/20",
            "text-rose-600 font-semibold text-lg"
          )}
        >
          {index + 1}
        </div>
        <div>
          <Text variant="title-16-bold">Qualification #{index + 1}</Text>
          <br />
          <Text className="text-sm text-muted-foreground">
            {qual.document_details.graduation_date
              ? "Graduated"
              : "In Progress"}
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <InputWithLabel
          label="Student ID"
          value={qual.document_details.student_id}
          disabled
          className="bg-white/50 hover:border-primary/20 transition-colors"
        />
        <InputWithLabel
          label="First Name"
          value={qual.document_details.first_name}
          disabled
          className="bg-white/50 hover:border-primary/20 transition-colors"
        />
        <InputWithLabel
          label="Middle Name"
          value={qual.document_details.middle_name}
          disabled
          className="bg-white/50 hover:border-primary/20 transition-colors"
        />
        <InputWithLabel
          label="Last Name"
          value={qual.document_details.last_name}
          disabled
          className="bg-white/50 hover:border-primary/20 transition-colors"
        />
        <InputWithLabel
          label="Graduation Date"
          value={qual.document_details.graduation_date}
          disabled
          className="bg-white/50 hover:border-primary/20 transition-colors"
        />
        <InputWithLabel
          label="Country"
          value={qual.country_code3}
          disabled
          className="bg-white/50 hover:border-primary/20 transition-colors"
        />
      </div>

      {qual.qualification_photo && (
        <Gallery>
          <div className="mt-6">
            <Text
              variant="title-16-bold"
              className="mb-3 flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-primary/70" />
              Qualification Photo
            </Text>
            <Item
              original={qual.qualification_photo.download_url}
              thumbnail={qual.qualification_photo.download_url}
              width={qual.qualification_photo.attributes.width}
              height={qual.qualification_photo.attributes.height}
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
                    src={qual.qualification_photo.download_url}
                    alt="Qualification"
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
          </div>
        </Gallery>
      )}
      {qual.student_id_photo && (
        <Gallery>
          <div className="mt-6">
            <Text
              variant="title-16-bold"
              className="mb-3 flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-primary/70" />
              Student ID Photo
            </Text>
            <Item
              original={qual.student_id_photo.download_url}
              thumbnail={qual.student_id_photo.download_url}
              width={qual.student_id_photo.attributes.width}
              height={qual.student_id_photo.attributes.height}
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
                    src={qual.student_id_photo.download_url}
                    alt="Qualification"
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
          </div>
        </Gallery>
      )}
      {qual.transcript_photo && (
        <Gallery>
          <div className="mt-6">
            <Text
              variant="title-16-bold"
              className="mb-3 flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-primary/70" />
              Transcript Photo
            </Text>
            <Item
              original={qual.transcript_photo.download_url}
              thumbnail={qual.transcript_photo.download_url}
              width={qual.transcript_photo.attributes.width}
              height={qual.transcript_photo.attributes.height}
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
                    src={qual.transcript_photo.download_url}
                    alt="Qualification"
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
          </div>
        </Gallery>
      )}
    </div>
  </div>
);

const OtherNameCard = ({ name, index }: { name: any; index: number }) => (
  <div
    className={cn(
      "rounded-xl border transition-all duration-300",
      "bg-gradient-to-br from-sky-50/50 via-white to-indigo-50/30",
      "hover:shadow-lg hover:border-primary/10",
      "animate-in fade-in slide-in-from-bottom-4 duration-500",
      "style={{ animationDelay: `${index * 100}ms` }}"
    )}
  >
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center",
            "bg-gradient-to-br from-sky-100/50 to-indigo-100/50",
            "ring-1 ring-sky-200/20",
            "text-sky-600 font-semibold text-lg"
          )}
        >
          {index + 1}
        </div>
        <div>
          <Text variant="title-16-bold">Other Name #{index + 1}</Text>
          <br />
          <Text className="text-sm text-muted-foreground">
            Alternative name record
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <InputWithLabel
          label="First Name"
          value={name.first_name || name.firstName_1}
          disabled
          className="bg-white/50 hover:border-primary/20 transition-colors"
        />
        <InputWithLabel
          label="Middle Name"
          value={name.middle_name || name.middleName_1}
          disabled
          className="bg-white/50 hover:border-primary/20 transition-colors"
        />
        <InputWithLabel
          label="Last Name"
          value={name.last_name || name.lastName_1}
          disabled
          className="bg-white/50 hover:border-primary/20 transition-colors"
        />
      </div>
    </div>
  </div>
);

const QualCheckDetail: React.FC<QualCheckDetailProps> = ({ taskId, data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { taskId } = useParams();
  const methods = useForm();
  const [taskDetail, setTaskDetail] = React.useState<VTaskDetail | null>(
    () => data || null
  );
  const [isLoadingData, setIsLoadingData] = React.useState(!data);

  const {
    isLoading,
    // isAuthorized,
    showActionModal,
    showRejectModal,
    showPDFPreview,
    pdfUrl,
    // setIsAuthorized,
    setShowActionModal,
    setShowRejectModal,
    setShowPDFPreview,
    // handleActionClick,
    handleModalConfirm,
    handleRejectModalConfirm,
    handlePDFConfirm,
  } = useTaskAction({ taskId });

  useEffect(() => {
    const fetchTaskDetail = async () => {
      if (location.state?.task || !taskId) return;

      try {
        const taskController = new TaskController();
        const response = await taskController.getTaskDetail(taskId);

        if (response.isSuccessful()) {
          console.log("Task Detail Response:", response.data);
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
  console.log("Form Data:", formData);

  // Show loading state only when initially loading
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

  // Update radio group values to match the actual data
  const hasQualificationsValue =
    formData.has_qualifications === "more-then-one-qualification"
      ? "multiple-qualifications"
      : formData.has_qualifications;

  return (
    <FormProvider {...methods}>
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
          {data?.template_type && <VQSWiki templateType={data.template_type} />}
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <Section title="Consent & Status Information" icon={FileText}>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50/50 via-white to-emerald-50/30 rounded-lg border border-green-100/50">
                    <Checkbox
                      id="consent"
                      checked={formData.consent || formData.confirmation}
                      disabled
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                    <label
                      htmlFor="consent"
                      className="text-sm text-green-700 font-medium"
                    >
                      Consent given
                    </label>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 rounded-lg border">
                    <Text
                      variant="title-16-bold"
                      className="mb-3 text-muted-foreground"
                    >
                      Qualification Status
                    </Text>
                    <RadioGroup
                      value={hasQualificationsValue}
                      className="gap-3"
                      disabled
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem
                          value="only-one-qualification"
                          id="option-one"
                        />
                        <Label htmlFor="option-one">
                          Only one qualification
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem
                          value="multiple-qualifications"
                          id="option-two"
                        />
                        <Label htmlFor="option-two">
                          Multiple qualifications
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem
                          value="no-qualifications"
                          id="option-three"
                        />
                        <Label htmlFor="option-three">No qualifications</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 rounded-lg border">
                    <Text
                      variant="title-16-bold"
                      className="mb-3 text-muted-foreground"
                    >
                      International Status
                    </Text>
                    <RadioGroup
                      value={formData.international_status || "none"}
                      className="gap-3"
                      disabled
                    >
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="some" id="status-one" />
                        <Label htmlFor="status-one">
                          Some international status
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="none" id="status-two" />
                        <Label htmlFor="status-two">
                          No international status
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Section>

              <Section title="Other Names" icon={User2}>
                <div className="space-y-6">
                  {formData.other_names?.map((name: any, index: number) => (
                    <OtherNameCard key={index} name={name} index={index} />
                  ))}
                </div>
              </Section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Section title="Qualifications" icon={FileText}>
                <div className="space-y-6">
                  {formData.qualifications?.map((qual: any, index: number) => (
                    <QualificationCard
                      key={qual.id || index}
                      qual={qual}
                      index={index}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Verification Documents" icon={Upload}>
                <div className="space-y-4">
                  <Text
                    variant="title-16-bold"
                    className="text-muted-foreground"
                  >
                    Upload Verification Files
                  </Text>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg transition-all duration-200",
                      "hover:border-primary/30",
                      "bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30",
                      "group cursor-pointer"
                    )}
                  >
                    <input
                      type="file"
                      id="verification-file"
                      className="hidden"
                      onChange={(_e) => {
                        // const file = e.target.files?.[0];
                        // if (file) handleFileUpload(file);
                      }}
                    />
                    <label
                      htmlFor="verification-file"
                      className="flex flex-col items-center justify-center p-8"
                    >
                      <div className="p-3 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6" />
                      </div>
                      <Text className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                        Click to upload verification documents
                      </Text>
                      <Text className="text-sm text-muted-foreground mt-1">
                        PDF, PNG, JPG up to 10MB
                      </Text>
                    </label>
                  </div>
                </div>
              </Section>
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
    </FormProvider>
  );
};

export default QualCheckDetail;
