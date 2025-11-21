"use client";
import { useEffect } from "react";

export default function PlayerModal({
  videoKey,
  onClose,
}: {
  videoKey: string;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      <div className="bg-black rounded-2xl p-4 w-[90%] md:w-[60%] lg:w-[50%]">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-white text-xl hover:text-red-500"
          >
            ✖
          </button>
        </div>
        <div className="mt-2">
          <iframe
            width="100%"
            height="400"
            className="rounded-xl"
            src={`https://www.youtube.com/embed/${videoKey}`}
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
