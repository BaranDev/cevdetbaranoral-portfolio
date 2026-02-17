import React, { useState } from "react";
import CVDownloadModal from "./CVDownloadModal";

const CVDownloadButton = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className={`
          flex items-center justify-center px-6 py-2 font-medium bg-card text-text 
          border border-primary/30 rounded-xl shadow-md transition-all duration-300
          hover:shadow-lg hover:-translate-y-1 hover:border-primary/50
          active:translate-y-0 active:shadow-inner cursor-pointer
        `}
        {...props}
      >
        <i className="fas fa-download mr-2"></i>
        Download CV
      </button>

      <CVDownloadModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default CVDownloadButton;
