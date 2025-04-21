"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  label: string;
};

export default function BackButton({ label }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center text-gray-500 hover:text-primary transition-colors cursor-pointer`}
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      <span>{label}</span>
    </button>
  );
}
