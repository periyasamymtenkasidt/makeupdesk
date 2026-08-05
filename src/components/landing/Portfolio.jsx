import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";
import PortfolioLightboxModal from "./PortfolioLightboxModal";
import bride1 from "../../assets/images/Bride_1.png";
import bride2 from "../../assets/images/Bride_2.png";
import bride3 from "../../assets/images/Bride_3.png";
import bride4 from "../../assets/images/Bride_4.png";
import partyMakeup from "../../assets/images/Party_makeup.png";
import engagementBride from "../../assets/images/Engagement_bridal.png";
import haldi from "../../assets/images/Haldi_makeup.png";
import reception from "../../assets/images/Reception_makeup.png";
import pvid1 from "../../assets/videos/portfolio_1.mp4";
import pvid2 from "../../assets/videos/portfolio_2.mp4";
import pvid3 from "../../assets/videos/portfolio_3.mp4";
import pvid4 from "../../assets/videos/portfolio_4.mp4";
import pvid5 from "../../assets/videos/portfolio_5.mp4";

export const CATEGORIES = [
  "All",
  "Bridal",
  "Party",
  "Editorial",
  "Pre-Wedding",
  "HD",
  "Video",
];

export const ITEMS = [
  {
    id: 0,
    title: "The Golden Bride",
    category: "Bridal",
    subtitle: "Reception Look · Chennai",
    tag: "Featured",
    accent: "#c9956c",
    glow: "rgba(201,149,108,0.4)",
    img: bride1,
    pos: "center 15%",
    img2: bride2,
    pos2: "center 18%",
  },
  {
    id: 1,
    title: "Midnight Glamour",
    category: "Party",
    subtitle: "Cocktail Evening · Delhi",
    tag: null,
    accent: "#e8a4b8",
    glow: "rgba(232,164,184,0.35)",
    img: partyMakeup,
    pos: "top center",
    img2: partyMakeup,
    pos2: "center 58%",
  },
  {
    id: 2,
    title: "Ethereal Vision",
    category: "Editorial",
    subtitle: "Magazine Feature · Vogue India",
    tag: null,
    accent: "#d4b8e8",
    glow: "rgba(212,184,232,0.35)",
    img: engagementBride,
    pos: "center 12%",
    img2: engagementBride,
    pos2: "center 60%",
  },
  {
    id: 3,
    title: "Rose & Gold",
    category: "Pre-Wedding",
    subtitle: "Pre-Shoot · Goa Beachside",
    tag: null,
    accent: "#e8a4b8",
    glow: "rgba(232,164,184,0.35)",
    img: reception,
    pos: "center 10%",
    img2: haldi,
    pos2: "center 58%",
  },
  {
    id: 4,
    title: "Crystal Clear",
    category: "HD",
    subtitle: "HD Close-Up · Bangalore",
    tag: null,
    accent: "#f5e1c0",
    glow: "rgba(245,225,192,0.32)",
    img: bride3,
    pos: "center 12%",
    img2: bride4,
    pos2: "center 22%",
  },
  {
    id: 5,
    title: "Dark Siren",
    category: "Editorial",
    subtitle: "Fashion Week · Lakme",
    tag: "Award Winner",
    accent: "#d4728f",
    glow: "rgba(212,114,143,0.4)",
    img: bride4,
    pos: "center 12%",
    img2: bride2,
    pos2: "center 58%",
  },
  {
    id: 6,
    title: "Midnight Party Glam",
    category: "Video",
    subtitle: "Cocktail Makeup · Delhi",
    tag: "Video",
    accent: "#c9956c",
    glow: "rgba(201,149,108,0.4)",
    video: pvid1,
  },
  {
    id: 7,
    title: "Bridal Transformation",
    category: "Video",
    subtitle: "Bridal Makeup · Chennai",
    tag: "Video",
    accent: "#e8a4b8",
    glow: "rgba(232,164,184,0.4)",
    video: pvid2,
  },
  {
    id: 8,
    title: "Pre-Wedding Glow",
    category: "Video",
    subtitle: "Pre-Wedding Shoot · Goa",
    tag: "Video",
    accent: "#d4728f",
    glow: "rgba(212,114,143,0.4)",
    video: pvid3,
  },
  {
    id: 9,
    title: "Editorial Close-Up",
    category: "Video",
    subtitle: "HD Makeup · Bangalore",
    tag: "Video",
    accent: "#f5e1c0",
    glow: "rgba(245,225,192,0.35)",
    video: pvid4,
  },
  {
    id: 10,
    title: "Reception Royale",
    category: "Video",
    subtitle: "Reception Glam · Kolkata",
    tag: "Video",
    accent: "#9b51e0",
    glow: "rgba(155,81,224,0.35)",
    video: pvid5,
  },
];

export default function Portfolio() {
  const [active, setActive] = useState("All");
  const [hovered, setHovered] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const ref = useReveal(0.08);
  const navigate = useNavigate();

  const imageItems = ITEMS.filter((i) => !i.video);
  const videoItems = ITEMS.filter((i) => i.video);
  const filtered =
    active === "All" ? ITEMS : ITEMS.filter((i) => i.category === active);
  const isBento = active === "All";

  return (
    <section
      id="portfolio"
      ref={ref}
      className="py-28 relative overflow-hidden"
      style={{ background: "var(--land-sec4-bg)" }}
    >
      {/* Background ambience */}
      <div className="absolute inset-0 hero-dots" style={{ opacity: 0.035 }} />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201,149,108,0.07) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute top-2/3 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(180,80,120,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="text-center mb-12 reveal">
          <span
            style={{
              color: "#c9956c",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Our Work
          </span>
          <h2
            className="font-display mt-3"
            style={{
              fontSize: "clamp(36px,5vw,56px)",
              fontWeight: 800,
              lineHeight: 1.08,
              color: "var(--land-text)",
            }}
          >
            Looks We've Created
          </h2>
          <div className="section-divider" />
          <p
            className="mt-5 max-w-lg mx-auto text-base leading-relaxed"
            style={{ color: "var(--land-text-muted)" }}
          >
            Every look tells a story — of confidence, beauty, and artistry.
          </p>
        </div>

        {/* ── Filter pills ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 reveal">
          {CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? ITEMS.length
                : ITEMS.filter((i) => i.category === cat).length;
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="filter-tab px-5 py-2 rounded-full text-sm font-medium transition-all duration-250 flex items-center gap-2"
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg, #c9956c, #d4728f)",
                        color: "white",
                        boxShadow: "0 4px 20px rgba(201,149,108,0.4)",
                        border: "1px solid transparent",
                      }
                    : {
                        background: "var(--land-pill-bg)",
                        color: "var(--land-pill-text)",
                        border: "1px solid var(--land-pill-border)",
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.borderColor =
                      "rgba(201,149,108,0.45)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.borderColor =
                      "var(--land-pill-border)";
                }}
              >
                {cat}
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                  style={{
                    background: isActive
                      ? "rgba(255,255,255,0.2)"
                      : "var(--land-card-bg)",
                    color: isActive ? "white" : "var(--land-text-faint)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Grid ── */}
        {isBento ? (
          <div className="space-y-5">
            {/* Row 1: Featured + 2 stacked */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <PortfolioCard
                item={imageItems[0]}
                hovered={hovered}
                setHovered={setHovered}
                onClick={setSelectedItem}
                height="460px"
                className="lg:col-span-2"
                featured
              />
              <div className="flex flex-col gap-5">
                <PortfolioCard
                  item={imageItems[1]}
                  hovered={hovered}
                  setHovered={setHovered}
                  onClick={setSelectedItem}
                  height="220px"
                />
                <PortfolioCard
                  item={imageItems[2]}
                  hovered={hovered}
                  setHovered={setHovered}
                  onClick={setSelectedItem}
                  height="220px"
                />
              </div>
            </div>
            {/* Row 2: 2 stacked + Featured */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="flex flex-col gap-5">
                <PortfolioCard
                  item={imageItems[3]}
                  hovered={hovered}
                  setHovered={setHovered}
                  onClick={setSelectedItem}
                  height="220px"
                />
                <PortfolioCard
                  item={imageItems[4]}
                  hovered={hovered}
                  setHovered={setHovered}
                  onClick={setSelectedItem}
                  height="220px"
                />
              </div>
              <PortfolioCard
                item={imageItems[5]}
                hovered={hovered}
                setHovered={setHovered}
                onClick={setSelectedItem}
                height="460px"
                className="lg:col-span-2"
                featured
              />
            </div>
            {/* Video strip */}
            {videoItems.length > 0 && (
              <div>
                <p
                  style={{
                    textAlign: "center",
                    color: "#c9956c",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    margin: "12px 0 20px",
                  }}
                >
                  Client Stories
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                  {videoItems.map((item) => (
                    <PortfolioCard
                      key={item.id}
                      item={item}
                      hovered={hovered}
                      setHovered={setHovered}
                      onClick={setSelectedItem}
                      height="280px"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <PortfolioCard
                key={item.id}
                item={item}
                hovered={hovered}
                setHovered={setHovered}
                onClick={setSelectedItem}
                height="340px"
              />
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="mt-14 text-center reveal">
          <button
            className="btn-primary"
            onClick={() => navigate("/portfolio")}
          >
            View Full Portfolio <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <PortfolioLightboxModal
        item={selectedItem}
        items={filtered}
        onClose={() => setSelectedItem(null)}
        onSelect={setSelectedItem}
      />
    </section>
  );
}

/* ── Portfolio Card Component ── */
export function PortfolioCard({
  item,
  hovered,
  setHovered,
  height,
  className = "",
  featured = false,
  onClick,
}) {
  const { id, title, category, subtitle, tag, img, pos, accent, glow, video } =
    item;
  const isHovered = hovered === id;
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isHovered) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <div
      onClick={() => onClick && onClick(item)}
      className={`relative overflow-hidden cursor-pointer select-none animate-fade-in-up ${className}`}
      style={{
        height,
        borderRadius: "20px",
        transition:
          "transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s ease",
        transform: isHovered
          ? "translateY(-6px) scale(1.012)"
          : "translateY(0) scale(1)",
        boxShadow: isHovered
          ? `0 32px 72px rgba(0,0,0,0.65), 0 0 0 1px ${glow}`
          : "0 8px 32px rgba(0,0,0,0.32)",
      }}
      onMouseEnter={() => setHovered(id)}
      onMouseLeave={() => setHovered(null)}
    >
      {/* ── Media ── */}
      <div className="absolute inset-0" style={{ background: "#060210" }}>
        {video ? (
          <video
            ref={videoRef}
            src={video}
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.75s cubic-bezier(0.16,1,0.3,1)",
              transform: isHovered ? "scale(1.07)" : "scale(1)",
            }}
          />
        ) : (
          <div className="relative overflow-hidden w-full h-full">
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover"
              style={{
                objectPosition: pos,
                transition: "transform 0.75s cubic-bezier(0.16,1,0.3,1)",
                transform: isHovered ? "scale(1.07)" : "scale(1)",
              }}
            />
          </div>
        )}
      </div>

      {/* Top-edge shadow for badge readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.06) 26%, transparent 48%)",
        }}
      />

      {/* Bottom gradient for title area */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(4,2,7,0.97) 0%, rgba(4,2,7,0.72) 30%, rgba(4,2,7,0.08) 58%, transparent 100%)",
        }}
      />

      {/* Play icon for video cards when not hovering */}
      {video && !isHovered && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 5 }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              border: "1.5px solid rgba(255,255,255,0.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play
              size={18}
              fill="white"
              color="white"
              style={{ marginLeft: 3 }}
            />
          </div>
        </div>
      )}

      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <div
          className="px-3 py-1.5 rounded-full text-[11px] font-semibold"
          style={{
            background: "rgba(0,0,0,0.52)",
            backdropFilter: "blur(14px)",
            color: "rgba(255,255,255,0.93)",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          {category}
        </div>
        {tag && (
          <div
            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: `${accent}28`,
              border: `1px solid ${accent}60`,
              color: accent,
              backdropFilter: "blur(12px)",
            }}
          >
            {tag}
          </div>
        )}
      </div>

      {/* Bottom info */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ padding: featured ? "68px 24px 24px" : "48px 20px 18px" }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: accent,
            marginBottom: "6px",
            opacity: isHovered ? 1 : 0.75,
            transform: isHovered ? "translateY(0)" : "translateY(3px)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}
        >
          {subtitle}
        </p>
        <div className="flex items-end justify-between">
          <h3
            className="font-display font-bold text-white leading-tight"
            style={{ fontSize: featured ? "clamp(20px,2.2vw,26px)" : "17px" }}
          >
            {title}
          </h3>
        </div>
      </div>

      {/* Hover glow border */}
      <div
        className="absolute inset-0 rounded-[20px] pointer-events-none"
        style={{
          boxShadow: isHovered
            ? `inset 0 0 0 1.5px ${accent}45`
            : "inset 0 0 0 1px rgba(255,255,255,0.08)",
          transition: "box-shadow 0.38s ease",
        }}
      />
    </div>
  );
}
