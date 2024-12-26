import React from "react";
import { FormProvider, useForm } from "react-hook-form";
// import { FormSelect } from '@/components/forms/FormSelect';
import InputWithLabel from "@/components/forms/InputWithLabel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Text from "@/components/ui/Text";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, User2, FileText, Search } from "lucide-react";
import ActionModal from "./ActionModal";
import { cn } from "@/lib/utils";
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import { VTaskDetail } from "@/models/TaskDetail.model";
import PDFPreviewModal from "./PDFPreviewModel";
import ActionRejectModal from "./ActionRejectModal";
import { useTaskAction } from "@/hooks/useTaskAction";
import VQSWiki from "@/components/task/VQSWiki";

interface WWCDetailProps {
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
      "rounded-lg border border-border/50 p-4 shadow-sm",
      className
    )}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <Text variant="title-16-bold" className="text-foreground">
          {title}
        </Text>
      </div>
    </div>
    {children}
  </section>
);

const WWCDetail: React.FC<WWCDetailProps> = ({ taskId, data }) => {
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
    },
  });

  const navigate = useNavigate();

  console.log(taskId);

  const demoImages = {
    cardFront: {
      src:
        data?.form_data?.card_front?.[0]?.download_url ??
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Ppt_card_front.jpg/640px-Ppt_card_front.jpg",
      width: 2971,
      height: 1981,
    },
    cardBack: {
      src:
        data?.form_data?.card_back?.[0]?.download_url ??
        "https://upload.wikimedia.org/wikipedia/commons/c/c5/Italian_electronic_ID_card_%28back%29.png",
      width: 2970,
      height: 1980,
    },
  };

  return (
    <FormProvider {...methods}>
      <Gallery>
        <div className="h-screen flex flex-col pt-6 px-6 max-w-[1920px] mx-auto w-full">
          <div className="flex items-center justify-between max-w-[1920px] mx-auto w-full mb-6">
            <Button
              variant="ghost"
              className="gap-2 hover:bg-background"
              onClick={() => navigate("/")}
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Tasks
            </Button>
          </div>

          <div className="flex-1 overflow-auto min-h-0 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-6 justify-between">
              {data?.template_type && (
                <VQSWiki templateType={data.template_type} />
              )}
              <div className="text-sm text-muted-foreground">
                Status:
                <span className="ml-2 inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                  {data?.status === "pending"
                    ? "Pending Review"
                    : data?.status?.toUpperCase().replace("_", " ")}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-w-[1920px] mx-auto w-full">
              {/* Left Column */}
              <div className="space-y-4">
                <Section title="Card Information" icon={FileText} data={data}>
                  <div className="space-y-3">
                    <InputWithLabel
                      label="Card Number"
                      value={data?.form_data?.card_no}
                      disabled
                      className="bg-muted/50"
                    />
                    <InputWithLabel
                      label="License Number"
                      value={data?.form_data?.license_no}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                </Section>

                <Section title="Personal Information" icon={User2}>
                  <div className="space-y-3">
                    <InputWithLabel
                      label="First Name"
                      value={data?.form_data?.first_name}
                      disabled
                      className="bg-muted/50"
                    />
                    <InputWithLabel
                      label="Middle Name"
                      value={data?.form_data?.middle_name}
                      disabled
                      className="bg-muted/50"
                    />
                    <InputWithLabel
                      label="Last Name"
                      value={data?.form_data?.last_name}
                      disabled
                      className="bg-muted/50"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputWithLabel
                        label="Phone Number"
                        value={data?.form_data?.phone_number}
                        disabled
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputWithLabel
                        label="Date of Birth"
                        value={data?.form_data?.date_of_birth}
                        disabled
                        className="bg-muted/50"
                      />
                      <InputWithLabel
                        label="Gender"
                        value={data?.form_data?.gender}
                        disabled
                        className="bg-muted/50"
                      />
                    </div>
                  </div>
                </Section>
                {data?.form_data?.card_front &&
                data?.form_data?.card_front.length > 0 ? (
                  <Section title="Card Front" className="bg-muted/5">
                    <Item
                      original={demoImages.cardFront.src}
                      thumbnail={demoImages.cardFront.src}
                      width={demoImages.cardFront.width}
                      height={demoImages.cardFront.height}
                    >
                      {({ ref, open }) => (
                        <div
                          ref={
                            ref as unknown as React.RefObject<HTMLDivElement>
                          }
                          onClick={open}
                          className="rounded-lg border-2 border-dashed border-muted-foreground/20 relative group cursor-pointer overflow-hidden"
                        >
                          <img
                            src={demoImages.cardFront.src}
                            alt="Card Front"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="flex items-center gap-2 text-white text-sm">
                              <Search className="w-4 h-4" />
                              <span>View</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </Item>
                  </Section>
                ) : null}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <Section title="Address Information" icon={FileText}>
                  <InputWithLabel
                    label="Address"
                    value={data?.form_data?.address}
                    disabled
                    className="bg-muted/50"
                  />
                </Section>

                <Section title="Additional Details" icon={FileText}>
                  <div className="space-y-3">
                    <InputWithLabel
                      label="Expiry Date"
                      value={data?.form_data?.expiry}
                      disabled
                      className="bg-muted/50"
                    />
                    <InputWithLabel
                      label="Country"
                      value={data?.form_data?.country}
                      disabled
                      className="bg-muted/50"
                    />
                    <InputWithLabel
                      label="Country Code"
                      value={data?.form_data?.country_code_3}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                </Section>
                {data?.form_data?.card_back &&
                data?.form_data?.card_back.length > 0 ? (
                  <Section title="Card Back">
                    <Item
                      original={demoImages.cardBack.src}
                      thumbnail={demoImages.cardBack.src}
                      width={demoImages.cardBack.width}
                      height={demoImages.cardBack.height}
                    >
                      {({ ref, open }) => (
                        <div
                          ref={
                            ref as unknown as React.RefObject<HTMLDivElement>
                          }
                          onClick={open}
                          className="rounded-lg border-2 border-dashed border-muted-foreground/20 relative group cursor-pointer overflow-hidden"
                        >
                          <img
                            src={demoImages.cardBack.src}
                            alt="Card Back"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="flex items-center gap-2 text-white text-sm">
                              <Search className="w-4 h-4" />
                              <span>View</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </Item>
                  </Section>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-4 max-w-[1920px] mx-auto w-full">
            <Card className="p-4 border-primary/20">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="authorized"
                    checked={isAuthorized}
                    onCheckedChange={(checked) =>
                      setIsAuthorized(checked as boolean)
                    }
                    className="data-[state=checked]:bg-green-600"
                  />
                  <label
                    htmlFor="authorized"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I confirm I validated the data.
                  </label>
                </div>

                <div className="flex justify-center space-x-4">
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
            </Card>
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

export default WWCDetail;
