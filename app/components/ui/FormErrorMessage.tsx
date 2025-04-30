import React from "react";

interface FormErrorMessageProps {
  error?: string;
}

export const FormErrorMessage = ({ error }: FormErrorMessageProps) => {
  if (!error) return null;

  return <p className="text-red-500 text-xs mt-1">{error}</p>;
};
