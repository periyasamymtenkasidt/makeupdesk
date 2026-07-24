import { useState } from "react";
import { X, Calendar, User, Phone, MapPin, Send } from "lucide-react";
import { useBookingForm } from "../../hooks/useBookingForm";
import { buildWhatsAppUrl, chatOnWhatsApp } from "../../utils/whatsapp";
import { Input, Select } from "../ui/Input";
import { Button } from "../ui/Button";
import { SERVICE_NAMES } from "../../data/services";
import { SHIFTS } from "../../data/navigation";

function BookingModal({ onClose }) {
  const {
    step,
    form,
    setField,
    nextStep,
    prevStep,
    reset,
    step1Valid,
    step2Valid,
  } = useBookingForm();

  const handleSubmit = () => {
    window.open(buildWhatsAppUrl(form), "_blank");
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        background: "rgba(26,15,27,0.72)",
        backdropFilter: "blur(10px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "#fdf8f4", maxHeight: "92vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div
          className="px-8 pt-8 pb-6 relative"
          style={{ background: "linear-gradient(135deg,#2d1b2e,#4a2e4d)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X size={15} color="white" />
          </button>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-1"
            style={{ color: "#c9956c" }}
          >
            Step {step} of 2
          </p>
          <h3 className="font-display text-2xl font-semibold text-white">
            {step === 1 ? "Your Details" : "Event Details"}
          </h3>
          <div
            className="mt-4 h-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: step === 1 ? "50%" : "100%",
                background: "linear-gradient(90deg,#c9956c,#e8a4b8)",
              }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-4">
          {step === 1 ? (
            <>
              <Input
                label="Full Name *"
                icon={User}
                placeholder="e.g. Priya Sharma"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
              <Input
                label="WhatsApp Number *"
                icon={Phone}
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
              <Select
                label="Service *"
                icon={null}
                value={form.service}
                onChange={(e) => setField("service", e.target.value)}
              >
                <option value="">Select a service…</option>
                {SERVICE_NAMES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={nextStep}
                style={{ opacity: step1Valid ? 1 : 0.45, marginTop: "8px" }}
              >
                Next Step →
              </Button>
            </>
          ) : (
            <>
              <Input
                label="Event Date *"
                icon={Calendar}
                type="date"
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
              />
              <Select
                label="Preferred Shift *"
                value={form.shift}
                onChange={(e) => setField("shift", e.target.value)}
              >
                <option value="">Select shift…</option>
                {SHIFTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
              <Input
                label="Location / Address *"
                icon={MapPin}
                placeholder="e.g. Andheri West, Mumbai"
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
              />
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#8b6e7e",
                    marginBottom: "6px",
                  }}
                >
                  Additional Notes
                </label>
                <textarea
                  placeholder="Skin type, theme, reference images, etc."
                  value={form.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    resize: "vertical",
                    border: "1.5px solid rgba(201,149,108,0.25)",
                    fontSize: "14px",
                    color: "#2d1b2e",
                    background: "white",
                    minHeight: "72px",
                    fontFamily: "Inter,sans-serif",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div className="flex gap-3 mt-2">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={prevStep}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  ← Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    opacity: step2Valid ? 1 : 0.45,
                  }}
                >
                  <Send size={15} /> Send on WhatsApp
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section
        id="book"
        className="py-32 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0e0710 0%, #1a0f1b 40%, #2d1b2e 100%)" }}
      >
        {/* Dot texture */}
        <div className="absolute inset-0 hero-dots" style={{ opacity: 0.05 }} />

        {/* Glowing orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
             style={{ background: "radial-gradient(ellipse, rgba(201,149,108,0.18) 0%, transparent 65%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full pointer-events-none"
             style={{ background: "radial-gradient(circle, rgba(232,164,184,0.15) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full pointer-events-none"
             style={{ background: "radial-gradient(circle, rgba(201,149,108,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
               style={{ background: "rgba(201,149,108,0.1)", border: "1px solid rgba(201,149,108,0.3)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-gold animate-pulse" style={{ background: "#c9956c" }} />
            <span style={{ color: "#f5e1c0", fontSize: "11px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Ready to Glow?
            </span>
          </div>

          {/* Headline */}
          <h2
            className="font-display text-white"
            style={{ fontSize: "clamp(40px,7vw,80px)", fontWeight: 800, lineHeight: 1.06 }}
          >
            Book Your Dream
            <br />
            <span className="gradient-text italic">Makeup Look</span>
          </h2>

          <p className="mt-6 max-w-xl mx-auto text-base leading-relaxed"
             style={{ color: "rgba(255,255,255,0.55)" }}>
            Slots fill up fast — especially for weekends &amp; wedding seasons.
            Reserve yours today and get an instant quotation on WhatsApp.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button variant="dark" size="lg" onClick={() => setOpen(true)}>
              Book Appointment
            </Button>
            <Button
              variant="darkOutline"
              size="lg"
              as="a"
              href={chatOnWhatsApp()}
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {[
              "✓ Instant WhatsApp Quotation",
              "✓ UPI Advance Payment",
              "✓ Doorstep Service",
            ].map((b) => (
              <span
                key={b}
                className="px-4 py-2 rounded-full text-sm"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.45)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {open && <BookingModal onClose={() => setOpen(false)} />}
    </>
  );
}
