import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export const SuccessToast = ({ message }) => (
  <div className="flex items-center gap-3 bg-green-100 border-l-4 border-green-500 p-3 rounded-lg shadow-md">
    <CheckCircle2 className="text-green-600" size={24} />
    <div>
      <p className="font-semibold text-green-700">Success!</p>
      <p className="text-sm text-green-600">{message}</p>
    </div>
  </div>
);

export const ErrorToast = ({ message }) => (
  <div className="flex items-center gap-3 bg-red-100 border-l-4 border-red-500 p-3 rounded-lg shadow-md">
    <XCircle className="text-red-600" size={24} />
    <div>
      <p className="font-semibold text-red-700">Error!</p>
      <p className="text-sm text-red-600">{message}</p>
    </div>
  </div>
);
