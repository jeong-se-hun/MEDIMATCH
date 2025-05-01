"use client";
import { AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type ErrorPopupProps = {
  error: Error | null;
  errorMessage?: string;
  onClose?: () => void;
};

export default function ErrorPopup({
  error,
  errorMessage = "오류가 발생했습니다 잠시 후 다시 시도해주세요.",
  onClose,
}: ErrorPopupProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(!!error);
  }, [error]);

  const handleClose = () => {
    setIsOpen(false);

    if (typeof onClose === "function") {
      onClose?.();
    } else {
      router.back();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="error-title"
    >
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center gap-2 mb-4">
          <h2 id="error-title" className="text-xl font-semibold text-gray-800">
            ERROR
          </h2>
          <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
        </div>
        <p className="text-gray-700 mb-6">{error?.message || errorMessage}</p>
        <div className="flex justify-end ">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="팝업 닫기"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
