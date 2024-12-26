import { useState, useRef, useEffect, Suspense, lazy } from "react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { PlusIcon, BookOpen, PencilIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

const JoditEditor = lazy(() => import("@/components/common/JoditEdito"));

interface VQSWikiProps {
  templateType: string;
}

interface WikiContent {
  content: string;
  updatedAt: string;
  updatedBy?: string;
}

const STORAGE_KEY = "vqs_wiki_contents";

const editorConfig = {
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  buttons: [
    "source",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "ul",
    "ol",
    "|",
    "table",
    "link",
    "hr",
    "|",
    "undo",
    "redo",
    "|",
    "eraser",
  ],
  height: 600,
  toolbarAdaptive: false,
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
};

export default function VQSWiki({ templateType }: VQSWikiProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState<WikiContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    loadWikiContent();
  }, [templateType]);

  const loadWikiContent = () => {
    const storedContents = localStorage.getItem(STORAGE_KEY);
    if (storedContents) {
      const contents = JSON.parse(storedContents);
      if (contents[templateType]) {
        setSavedContent(contents[templateType]);
        setContent(contents[templateType].content);
      } else {
        setSavedContent(null);
        setContent("");
      }
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      const storedContents = localStorage.getItem(STORAGE_KEY);
      const contents = storedContents ? JSON.parse(storedContents) : {};

      contents[templateType] = {
        content,
        updatedAt: new Date().toISOString(),
        updatedBy: "Current User", // Replace with actual user info
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(contents));
      setSavedContent(contents[templateType]);
      setIsEditing(false);
      toast.success("Wiki content saved successfully");
    } catch (error) {
      toast.error("Failed to save wiki content");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    if (isEditing) {
      if (window.confirm("Are you sure you want to discard your changes?")) {
        setIsEditing(false);
        setContent(savedContent?.content || "");
        setIsDialogOpen(false);
      }
    } else {
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      {savedContent ? (
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-primary hover:text-primary/80"
          onClick={() => setIsDialogOpen(true)}
        >
          <BookOpen className="h-4 w-4" />
          View Guide
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-primary hover:text-primary/80"
          onClick={() => {
            setIsDialogOpen(true);
            setIsEditing(true);
          }}
        >
          <PlusIcon className="h-4 w-4" />
          Add Guide
        </Button>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">
                VQS Wiki - {templateType.toUpperCase()} Guide
              </DialogTitle>
              {savedContent && !isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 mt-4"
                  onClick={handleEdit}
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
            {savedContent && !isEditing && (
              <div className="text-sm text-gray-500">
                Last updated:{" "}
                {new Date(savedContent.updatedAt).toLocaleString()}
                {savedContent.updatedBy && ` by ${savedContent.updatedBy}`}
              </div>
            )}
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-auto">
            {isEditing ? (
              <Suspense
                fallback={
                  <div className="h-[400px] flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                }
              >
                <JoditEditor
                  ref={editorRef}
                  content={content}
                  config={editorConfig}
                  onChange={(newContent: string) => setContent(newContent)}
                  className="h-full"
                />
              </Suspense>
            ) : (
              <div
                className="prose prose-blue max-w-none p-6"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>

          {isEditing && (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
