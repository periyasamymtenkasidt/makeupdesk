import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PortfolioLightboxModal({ item, items = [], onClose, onSelect }) {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = items.findIndex((i) => i.id === item?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    if (hasPrev && onSelect) {
      onSelect(items[currentIndex - 1]);
    }
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    if (hasNext && onSelect) {
      onSelect(items[currentIndex + 1]);
    }
  };

  const handleBookLook = (e) => {
    e.stopPropagation();
    onClose();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const bookEl = document.getElementById("book");
        if (bookEl) bookEl.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const bookEl = document.getElementById("book");
      if (bookEl) bookEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!item) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, currentIndex, items]);

  if (!item) return null;

  const { title, category, subtitle, tag, img, accent, video } = item;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 select-none"
      style={{
        background: "rgba(6, 2, 14, 0.94)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* ── Top Bar Controls ── */}
      <div
        className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-30 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {category}
          </span>
          {tag && (
            <span
              className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
              style={{
                background: `${accent}30`,
                border: `1px solid ${accent}70`,
                color: accent,
              }}
            >
              {tag}
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          aria-label="Close Lightbox"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.22)",
            color: "#ffffff",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.25)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* ── Previous Item Button ── */}
      {hasPrev && (
        <button
          onClick={handlePrev}
          aria-label="Previous Look"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#ffffff",
            backdropFilter: "blur(12px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.25)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* ── Next Item Button ── */}
      {hasNext && (
        <button
          onClick={handleNext}
          aria-label="Next Look"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#ffffff",
            backdropFilter: "blur(12px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.25)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* ── Main Media Container ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center z-20 pointer-events-auto"
      >
        <div
          className="relative overflow-hidden rounded-2xl flex items-center justify-center"
          style={{
            maxWidth: "100%",
            maxHeight: "72vh",
            boxShadow: `0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px ${accent}40`,
          }}
        >
          {video ? (
            <video
              ref={videoRef}
              src={video}
              controls
              autoPlay
              playsInline
              className="max-w-full max-h-[72vh] object-contain rounded-2xl"
              style={{ background: "#000000" }}
            />
          ) : (
            <img
              src={img}
              alt={title}
              className="max-w-full max-h-[72vh] object-contain rounded-2xl select-none"
            />
          )}
        </div>

        {/* ── Footer Info & CTA ── */}
        <div className="mt-5 w-full flex flex-col sm:flex-row items-center justify-between gap-4 px-2 text-center sm:text-left">
          <div>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: accent,
                marginBottom: "3px",
              }}
            >
              {subtitle}
            </p>
            <h3
              className="font-display font-bold text-white text-xl sm:text-2xl"
              style={{ margin: 0 }}
            >
              {title}
            </h3>
          </div>

          <button
            onClick={handleBookLook}
            className="btn-primary"
            style={{
              padding: "10px 24px",
              fontSize: "13.5px",
              flexShrink: 0,
              cursor: "pointer",
            }}
          >
            <Sparkles size={15} /> Book This Look <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
