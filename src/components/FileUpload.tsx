"use client";

import { useState } from "react";

interface FileUploadProps {
  onFileUploaded: (fileData: any) => void;
}

export default function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        onFileUploaded(result);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileUpload}
        disabled={uploading}
        accept=".txt,.md,.json,.csv"
        style={{ display: "none" }}
        id="file-input"
      />
      <label
        htmlFor="file-input"
        style={{
          padding: "8px 16px",
          backgroundColor: "#333",
          color: "white",
          borderRadius: "4px",
          cursor: uploading ? "not-allowed" : "pointer",
          display: "inline-block",
          margin: "8px"
        }}
      >
        {uploading ? "Uploading..." : "📎 Upload File"}
      </label>
    </div>
  );
}