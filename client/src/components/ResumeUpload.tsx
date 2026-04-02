import { useCallback, useState } from "react";
import { Upload, FileText, CheckCircle2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ResumeUploadProps {
  onUpload?: (file: File) => Promise<void>;
  currentResumeUrl?: string | null;
  isUploading?: boolean;
}

export function ResumeUpload({ onUpload, currentResumeUrl, isUploading = false }: ResumeUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await handleFile(files[0]);
    }
  }, [onUpload]);

  const handleFile = async (file: File) => {
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      try {
        await onUpload?.(file);
        setUploadProgress(100);
      } catch (error) {
        setUploadProgress(0);
      } finally {
        clearInterval(interval);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      await handleFile(files[0]);
    }
  };

  return (
    <Card 
      data-testid="card-resume-upload"
      className={`p-6 transition-all ${
        dragActive ? "border-primary bg-primary/5" : ""
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {currentResumeUrl ? (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground mb-1">Resume Uploaded</p>
            <p className="text-sm text-muted-foreground">Your resume is ready</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            data-testid="button-remove-resume"
            onClick={() => {}}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          
          {isUploading || uploadProgress > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Uploading resume...</p>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
            </div>
          ) : (
            <>
              <p className="font-medium text-foreground mb-1">Upload Your Resume</p>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop or click to browse
              </p>
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf"
                onChange={handleFileInput}
                data-testid="input-resume-file"
              />
              <label htmlFor="resume-upload">
                <Button
                  asChild
                  size="sm"
                  data-testid="button-browse-resume"
                >
                  <span className="cursor-pointer">
                    <FileText className="w-4 h-4 mr-2" />
                    Browse Files
                  </span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-3">
                PDF files only, max 5MB
              </p>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
