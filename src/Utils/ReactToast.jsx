import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export const SuccessToast = ({ message }) => (
  <div className="flex items-center gap-2 bg-green-300 border border-green-500 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
    <CheckCircle2 className="text-green-500" size={20} />
    <p className="text-sm text-white font-semibold">{message}</p>
  </div>
);

export const ErrorToast = ({ message }) => (
  <div className="flex items-center gap-2 bg-red-300 border border-red-500 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
    <XCircle className="text-red-500" size={20} />
    <p className="text-sm text-white font-semibold">{message}</p>
  </div>
);
