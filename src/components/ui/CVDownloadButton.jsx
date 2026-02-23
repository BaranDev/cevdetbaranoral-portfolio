import React, { useState } from "react";
import { Download } from "lucide-react";
import CVDownloadModal from "./CVDownloadModal";

const CVDownloadButton = ({ className = "", ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className={`
          inline-flex items-center justify-center gap-1.5 px-[18px] py-2 
          text-[0.82rem] font-semibold rounded-xl transition-all duration-300
          bg-background text-text shadow-neumorphic hover:-translate-y-[2px] hover:animate-glow
          ${className}
        `}
        {...props}
      >
        <Download size={15} />
        Download CV
      </button>

      <CVDownloadModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default CVDownloadButton;
