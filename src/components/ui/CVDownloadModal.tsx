import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { Download, X } from "lucide-react";

const CV_FILES = [
  {
    lang: "en",
    label: "English",
    href: "/assets/cv.pdf",
    filename: "Cevdet_Baran_Oral_CV_EN.pdf",
  },
  {
    lang: "tr",
    label: "Türkçe",
    href: "/assets/cv_tr.pdf",
    filename: "Cevdet_Baran_Oral_CV_TR.pdf",
  },
];

interface CVDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* Native <dialog> opened with showModal(): it renders in the top layer
   (above every stacking context, transformed ancestors included), and the
   browser handles Esc, the focus trap and the inert background. Page scroll
   is locked by the `html:has(dialog:modal)` rule in index.css. */
const CVDownloadModal = ({ isOpen, onClose }: CVDownloadModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      // JRPG menus open with the cursor on the first entry
      dialog.querySelector("a")?.focus();
    }
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const close = () => ref.current?.close();

  // Arrow keys walk the menu, wrapping at the ends
  const moveCursor = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const links = [...e.currentTarget.querySelectorAll("a")];
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    const step = e.key === "ArrowDown" ? 1 : -1;
    links[(i + step + links.length) % links.length]?.focus();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // a click that lands on the <dialog> itself, not its window, is the backdrop
      onClick={(e) => e.target === e.currentTarget && close()}
      className="
        m-auto p-0 bg-transparent text-text overflow-visible
        backdrop:bg-black/60
        motion-safe:open:animate-[windowUnfold_160ms_steps(4,end)]
        motion-safe:backdrop:animate-[backdropFade_160ms_ease-out]
      "
    >
      <div className="bg-card pixel-frame w-[min(340px,calc(100vw-32px))]">
        <div className="flex items-center justify-between gap-4 pl-4 pr-2 pt-2.5 pb-2">
          <h2 id={titleId} className="font-heading text-title text-text">
            Download CV
          </h2>
          <button
            onClick={close}
            aria-label="Close"
            className="w-7 h-7 shrink-0 flex items-center justify-center cursor-pointer text-secondary hover:text-accent transition-colors duration-100"
          >
            <X size={16} />
          </button>
        </div>

        <div aria-hidden className="h-0.5 mx-2 bg-outline/30" />

        <ul className="p-2" onKeyDown={moveCursor}>
          {CV_FILES.map((f) => (
            <li key={f.lang}>
              <a
                href={f.href}
                download={f.filename}
                hrefLang={f.lang}
                onClick={close}
                // the cursor follows the mouse too, so only one ▸ ever shows
                onMouseEnter={(e) => e.currentTarget.focus()}
                className="
                  group relative flex items-center gap-3 pl-8 pr-3 py-2.5 no-underline
                  text-text focus:outline-none focus:bg-primary/10 focus:text-primary
                "
              >
                <span
                  aria-hidden
                  className="absolute left-3 text-primary invisible group-focus:visible"
                >
                  ▸
                </span>
                <span className="flex-1">{f.label}</span>
                <span className="text-label tracking-wider text-secondary">
                  PDF
                </span>
                <Download size={15} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
};

export default CVDownloadModal;
