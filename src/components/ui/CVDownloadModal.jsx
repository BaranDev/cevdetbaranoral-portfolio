import React from "react";

const cvFile = "/assets/cv.pdf";
const cvTrFile = "/assets/cv_tr.pdf";

const CVDownloadModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownload = (file, filename) => {
    const link = document.createElement("a");
    link.href = file;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[1000] bg-zinc-900/60 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-glass-morphism rounded-3xl p-8 max-w-[400px] w-[90%] shadow-2xl backdrop-blur-md border border-glass-border animate-[slideIn_0.4s_ease-out] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-transparent border-none text-text text-2xl cursor-pointer hover:text-primary transition-colors duration-200"
        >
          ×
        </button>
        <h3 className="m-0 mb-6 text-text text-center text-xl font-semibold">
          Choose CV Language
        </h3>

        <div className="flex gap-6 justify-center">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🇬🇧</div>
            <button
              onClick={() =>
                handleDownload(cvFile, "Cevdet_Baran_Oral_CV_EN.pdf")
              }
              className="px-4 py-3 w-full text-center mt-2 flex items-center justify-center gap-2 bg-primary text-white font-medium rounded-xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer border-none"
            >
              <i className="fas fa-download"></i>
              English
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🇹🇷</div>
            <button
              onClick={() =>
                handleDownload(cvTrFile, "Cevdet_Baran_Oral_CV_TR.pdf")
              }
              className="px-4 py-3 w-full text-center mt-2 flex items-center justify-center gap-2 bg-card text-text font-medium rounded-xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:text-primary cursor-pointer border border-primary/10"
            >
              <i className="fas fa-download"></i>
              Turkish
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default CVDownloadModal;
