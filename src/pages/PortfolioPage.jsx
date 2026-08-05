import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  ITEMS,
  CATEGORIES,
  PortfolioCard,
} from "../components/landing/Portfolio";
import PortfolioLightboxModal from "../components/landing/PortfolioLightboxModal";

export default function PortfolioPage() {
  const [active, setActive] = useState("All");
  const [hovered, setHovered] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const filtered =
    active === "All" ? ITEMS : ITEMS.filter((i) => i.category === active);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--land-sec4-bg)",
        transition: "background 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--land-nav-bg)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--land-divider)",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--land-text-sub)",
            fontSize: "13px",
            fontWeight: 600,
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c9956c")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--land-text-sub)")
          }
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
        <span
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--land-text)",
            letterSpacing: "0.04em",
          }}
        >
          Full Portfolio
        </span>
        <div style={{ width: 100 }} />
      </div>

      <div
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "48px 24px" }}
      >
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
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
          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(32px,5vw,52px)",
              fontWeight: 800,
              color: "var(--land-text)",
              lineHeight: 1.1,
              margin: "12px 0 0",
            }}
          >
            Looks We've Created
          </h1>
          <p
            style={{
              marginTop: "16px",
              color: "var(--land-text-muted)",
              fontSize: "15px",
              lineHeight: 1.6,
            }}
          >
            Every look tells a story — of confidence, beauty, and artistry.
          </p>
        </div>

        {/* Filter pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "40px",
          }}
        >
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
                style={{
                  padding: "8px 20px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  transition: "all 0.25s",
                  ...(isActive
                    ? {
                        background: "linear-gradient(135deg,#c9956c,#d4728f)",
                        color: "#fff",
                        boxShadow: "0 4px 20px rgba(201,149,108,0.4)",
                        border: "1px solid transparent",
                      }
                    : {
                        background: "var(--land-pill-bg)",
                        color: "var(--land-pill-text)",
                        border: "1px solid var(--land-pill-border)",
                      }),
                }}
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
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "9999px",
                    fontWeight: 700,
                    background: isActive
                      ? "rgba(255,255,255,0.2)"
                      : "var(--land-card-bg)",
                    color: isActive ? "#fff" : "var(--land-text-faint)",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
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
      </div>

      <PortfolioLightboxModal
        item={selectedItem}
        items={filtered}
        onClose={() => setSelectedItem(null)}
        onSelect={setSelectedItem}
      />
    </div>
  );
}
