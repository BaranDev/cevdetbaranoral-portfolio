import React, { useEffect } from "react";

const Modal = ({
  title,
  children,
  isOpen,
  onClose,
  onStart,
  startButtonText = "Start",
  showCancel = true,
  showStartButton = true,
}) => {
  // Handle escape key press and scrolling
  useEffect(() => {
    const handleEscPress = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscPress);

    // Store original overflow value
    const originalOverflow = document.body.style.overflow;

    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEscPress);
      // Always restore scrolling on unmount, regardless of isOpen state
      document.body.style.overflow = originalOverflow || "auto";
    };
  }, [isOpen, onClose]);

  // Don't render anything if modal is not open
  if (!isOpen) {
    document.body.style.overflow = "auto";
    return null;
  }

  // Close if overlay is clicked
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle close button click
  const handleClose = () => {
    document.body.style.overflow = "auto";
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/40 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-glass-morphism rounded-3xl p-8 shadow-2xl backdrop-blur-md border border-glass-border animate-[slideIn_0.4s_ease-out]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="m-0 text-text text-xl font-semibold">{title}</h2>
          <button
            onClick={handleClose}
            className="bg-none border-none text-text text-lg cursor-pointer transition-all duration-200 hover:text-primary hover:scale-110"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="mb-6 text-text">{children}</div>

        <div className="flex justify-end gap-4">
          {showCancel && (
            <button
              onClick={handleClose}
              className="px-6 py-2 font-medium bg-card text-text border border-primary/30 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 cursor-pointer"
            >
              Cancel
            </button>
          )}
          {showStartButton && (
            <button
              onClick={onStart}
              className="px-6 py-2 font-medium bg-primary text-white border border-primary/30 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 cursor-pointer"
            >
              {startButtonText}
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Modal;
