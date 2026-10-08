import { useState, type ButtonHTMLAttributes } from "react";
import { Download } from "lucide-react";
import CVDownloadModal from "./CVDownloadModal";

const CVDownloadButton = ({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className={`
          inline-flex items-center justify-center gap-1.5 px-[18px] py-2 cursor-pointer
          text-[0.92rem] font-semibold rounded-xl transition-all duration-100
          bg-background text-text shadow-pixel-ring hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-pixel-pressed
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
