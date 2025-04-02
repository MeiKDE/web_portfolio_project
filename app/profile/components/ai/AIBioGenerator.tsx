"use client";

import React, { JSX } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AIBioGeneratorProps {
  generatedBio: string;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export function AIBioGenerator({
  generatedBio,
  onRegenerate,
  isGenerating,
}: AIBioGeneratorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Your AI-Generated Bio:</h3>

      <Card className="border-primary">
        <CardContent className="p-4">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-4 text-sm text-gray-500">
                Generating your professional bio...
              </p>
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed">{generatedBio}</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center pt-2">
        <Button
          variant="outline"
          onClick={onRegenerate}
          disabled={isGenerating}
          className="flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-refresh-cw mr-1"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          {isGenerating ? "Regenerating..." : "Regenerate Bio"}
        </Button>
      </div>
    </div>
  );
}
