"use client";

import { useState } from "react";
import { FiUpload } from "react-icons/fi";
import type { Analysis } from "./Inference";

interface UploadVideoProps {
  apiKey: string;
  onAnalysis: (analysis: Analysis) => void;
}

type UploadUrlResponse = {
  url: string;
  key: string;
};

type ErrorResponse = {
  error: string;
};

export default function UploadVideo({ apiKey, onAnalysis }: UploadVideoProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setStatus("uploading");
      setError(null);

      const fileType = `.${file.name.split(".").pop()}`;

      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileType }),
      });

      if (!res.ok) {
        const { error } = (await res.json()) as ErrorResponse;
        throw new Error(error || "Failed to get upload URL");
      }

      const { url, key } = (await res.json()) as UploadUrlResponse;

      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload file");

      setStatus("analyzing");

      const analysisRes = await fetch("/api/sentiment-inference", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      });

      if (!analysisRes.ok) {
        const { error } = (await analysisRes.json()) as ErrorResponse;
        throw new Error(error || "Failed to analyze video");
      }

      const analysis = (await analysisRes.json()) as Analysis;
      onAnalysis(analysis);
      setStatus("idle");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Upload failed");
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-3">
      <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center hover:border-gray-400 transition-all">
        <input
          id="video-upload"
          type="file"
          accept="video/mp4,video/mov,video/avi"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
          }}
        />
        <label
          htmlFor="video-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          <FiUpload className="h-8 w-8 text-white-400 mb-2" />
          <p className="text-base font-medium text-white-700">
            {status === "uploading"
              ? "Uploading..."
              : status === "analyzing"
              ? "Analyzing..."
              : "Upload a video"}
          </p>
          <p className="text-sm text-white-500 mt-1">
            Start sentiment detection by uploading a video file.
          </p>
        </label>
      </div>

      {error && (
        <div className="text-sm text-red-500 px-2 py-1 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

    </div>
  );
}
