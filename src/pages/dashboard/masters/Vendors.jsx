import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Phone,
  MessageCircle,
  Filter,
  Sparkles,
  Building2,
  Users,
} from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Pagination } from "../../../components/ui/Pagination";
import { EmptyState } from "../../../components/ui/EmptyState";
import { useMaster } from "../../../hooks/useMaster";
import { usePagination } from "../../../hooks/usePagination";
import { formatCurrency } from "../../../utils/formatCurrency";
import {
  VENDOR_KEY,
  VENDOR_DEFAULTS,
  VENDOR_CATEGORIES,
  ALL_DAYS,
} from "../../../data/vendors";
import { CustomSelect } from "../../../components/ui/CustomSelect";

const CATEGORIES = VENDOR_CATEGORIES;
const DEFAULTS = VENDOR_DEFAULTS;

const EMPTY = {
  name: "",
  category: "Hair Stylist",
  customCategory: "",
  contact: "",
  whatsapp: "",
  charges: "",
  serviceArea: "",
  availability: "Available",
  rating: 5,
  notes: "",
  workDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  shiftStart: "08:00",
  shiftEnd: "20:00",
};

const AVAIL_COLORS = {
  Available: {
    color: "var(--badge-confirmed)",
    bg: "var(--badge-confirmed-bg)",
  },
  Busy: { color: "var(--badge-pending)", bg: "var(--badge-pending-bg)" },
  Inactive: {
    color: "var(--dash-text-muted)",
    bg: "var(--dash-subtle-row-bg)",
  },
};

const inp = {
  width: "100%",
  padding: "9.5px 14px",
  borderRadius: "10px",
  border: "1.5px solid var(--dash-border)",
  background: "var(--dash-input-bg)",
  fontSize: "13px",
  color: "var(--dash-input-text)",
  outline: "none",
  fontFamily: "Inter, sans-serif",
  boxSizing: "border-box",
};
const lbl = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--dash-label-text)",
  marginBottom: "5px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

function Stars({ rating }) {
  return (
    <span style={{ letterSpacing: "1px", fontSize: "13px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            color: s <= rating ? "var(--icon-booking)" : "var(--dash-border)",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function Vendors() {
  const { items, add, update, remove } = useMaster(VENDOR_KEY, DEFAULTS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const cats = ["All", ...CATEGORIES];

  const filtered = items.filter((i) => {
    const matchSearch =
      !search ||
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || i.category === catFilter;
    return matchSearch && matchCat;
  });

  const { page, setPage, totalPages, paginated } = usePagination(
    filtered,
    6,
    catFilter + search,
  );

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(i) {
    setEditing(i.id);
    setForm({
      name: i.name,
      category: i.category,
      customCategory: i.customCategory || "",
      contact: i.contact,
      whatsapp: i.whatsapp,
      charges: i.charges,
      serviceArea: i.serviceArea,
      availability: i.availability,
      rating: i.rating,
      notes: i.notes,
      workDays: i.workDays || ["Mon","Tue","Wed","Thu","Fri","Sat"],
      shiftStart: i.shiftStart || "08:00",
      shiftEnd: i.shiftEnd || "20:00",
    });
    setOpen(true);
  }
  function handleSave() {
    if (!form.name.trim()) { alert('Vendor name is required.'); return; }
    if (form.category === 'Other' && !form.customCategory.trim()) {
      alert('Please specify the category.'); return;
    }
    if (form.contact && form.contact.replace(/\s/g, '').length !== 10) {
      alert('Contact number must be exactly 10 digits.'); return;
    }
    if (form.whatsapp && form.whatsapp.replace(/\s/g, '').length !== 10) {
      alert('WhatsApp number must be exactly 10 digits.'); return;
    }
    const data = {
      ...form,
      charges: Number(form.charges) || 0,
      rating: Number(form.rating),
    };
    editing ? update(editing, data) : add(data);
    setOpen(false);
  }
  function handleDelete(id) {
    if (window.confirm("Remove this vendor?")) remove(id);
  }
  function openWhatsApp(v) {
    const phone =
      v.whatsapp?.replace(/[^0-9]/g, "") || v.contact?.replace(/[^0-9]/g, "");
    if (phone) window.open(`https://wa.me/${phone}`, "_blank");
  }

  const availCount = items.filter((i) => i.availability === "Available").length;

  return (
    <div
      style={{
        padding: "20px 32px 24px 32px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Fixed Header Section */}
      <div
        className="master-sticky-header"
        style={{
          flexShrink: 0,
          background: "var(--dash-bg)",
          paddingBottom: "14px",
          marginBottom: "16px",
        }}
      >
        {/* Master Tab Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            borderBottom: "1.5px solid var(--dash-border)",
            marginBottom: "14px",
          }}
        >
          <Link
            to="/dashboard/masters/services"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              paddingBottom: "12px",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--dash-text-secondary)",
              borderBottom: "2.5px solid transparent",
              textDecoration: "none",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <Sparkles size={15} /> Service Master
          </Link>
          <Link
            to="/dashboard/masters/venues"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              paddingBottom: "12px",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--dash-text-secondary)",
              borderBottom: "2.5px solid transparent",
              textDecoration: "none",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <Building2 size={15} /> Venue Pricing Master
          </Link>
          <Link
            to="/dashboard/masters/vendors"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              paddingBottom: "12px",
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--icon-booking)",
              borderBottom: "2.5px solid var(--icon-booking)",
              textDecoration: "none",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <Users size={15} style={{ color: "var(--icon-booking)" }} /> Vendor
            Master
          </Link>
        </div>

        {/* Contextual Action Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px",
            background: "var(--dash-card-bg)",
            padding: "14px 18px",
            borderRadius: "14px",
            border: "1.5px solid var(--dash-border)",
            boxShadow: "0 2px 10px var(--dash-shadow)",
          }}
        >
          {/* Left: Stats & Filter Vendors input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              flexWrap: "wrap",
              flex: 1,
            }}
          >
            <div
              style={{
                background: "var(--btn-ghost-bg)",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12.5px",
                fontWeight: 650,
                color: "var(--dash-text-secondary)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
                border: "1px solid var(--btn-ghost-border)",
              }}
            >
              <span>{items.length} vendors</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ color: "var(--badge-confirmed)" }}>
                {availCount} available
              </span>
            </div>

            <div
              style={{
                position: "relative",
                minWidth: "220px",
                maxWidth: "300px",
                flex: 1,
              }}
            >
              <Filter
                size={13}
                style={{
                  position: "absolute",
                  left: "11px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--icon-booking)",
                  pointerEvents: "none",
                }}
              />
              <input
                placeholder="Filter vendors by name/category…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ ...inp, paddingLeft: "32px", height: "36px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {[
                "All",
                "Makeup Artist",
                "Hair Stylist",
                "Photographer",
                "Saree Draper",
                "Mehendi Artist",
              ].map((c) => (
                <button
                  key={c}
                  onClick={() => setCatFilter(c)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    ...(catFilter === c
                      ? {
                          background: "var(--dash-filter-active-bg)",
                          color: "var(--dash-filter-active-tx)",
                          border: "1px solid transparent",
                        }
                      : {
                          background: "var(--dash-filter-wrap)",
                          color: "var(--dash-filter-muted-tx)",
                          border: "1px solid var(--dash-border-subtle)",
                        }),
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Action */}
          <Button variant="primary" size="sm" onClick={openAdd}>
            <Plus size={15} /> Add Vendor
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          padding: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{ flex: 1, minHeight: 0, overflow: "auto" }}
          className="no-scrollbar"
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              fontSize: "13px",
            }}
          >
            <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
              <tr>
                {[
                  "Vendor",
                  "Category",
                  "Contact",
                  "Charges / Event",
                  "Service Area",
                  "Availability",
                  "Rating",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--dash-text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      whiteSpace: "nowrap",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      background: "var(--dash-surface)",
                      borderBottom: "1px solid var(--dash-border)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((item) => {
                const avail =
                  AVAIL_COLORS[item.availability] ?? AVAIL_COLORS.Inactive;
                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: "1px solid var(--dash-border-subtle)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "var(--dash-row-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* Vendor */}
                    <td style={{ padding: "14px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            flexShrink: 0,
                            background:
                              "linear-gradient(135deg,#c9956c,#e8a4b8)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "white",
                          }}
                        >
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: "var(--dash-text-primary)",
                            }}
                          >
                            {item.name}
                          </div>
                          {item.notes && (
                            <div
                              style={{
                                fontSize: "11px",
                                color: "var(--dash-text-muted)",
                              }}
                            >
                              {item.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 500,
                          padding: "3px 9px",
                          borderRadius: "6px",
                          background: "var(--icon-booking-bg)",
                          color: "var(--icon-booking)",
                          border: "1px solid var(--dash-border)",
                        }}
                      >
                        {item.category === "Other" && item.customCategory ? item.customCategory : item.category}
                      </span>
                    </td>

                    {/* Contact */}
                    <td style={{ padding: "14px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--dash-text-primary)",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Phone
                            size={11}
                            style={{ color: "var(--icon-booking)" }}
                          />{" "}
                          {item.contact}
                        </span>
                      </div>
                    </td>

                    {/* Charges */}
                    <td
                      style={{
                        padding: "14px 16px",
                        fontWeight: 600,
                        color: "var(--icon-booking)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatCurrency(item.charges)}
                    </td>

                    {/* Service Area */}
                    <td
                      style={{
                        padding: "14px 16px",
                        color: "var(--dash-text-muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.serviceArea || "—"}
                    </td>

                    {/* Availability */}
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "3px 10px",
                          borderRadius: "9999px",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: avail.color,
                          background: avail.bg,
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: avail.color,
                          }}
                        />
                        {item.availability}
                      </span>
                    </td>

                    {/* Rating */}
                    <td style={{ padding: "14px 16px" }}>
                      <Stars rating={item.rating} />
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => openWhatsApp(item)}
                          title="WhatsApp"
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "8px",
                            border: "1.5px solid rgba(37,211,102,0.3)",
                            background: "rgba(37,211,102,0.1)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MessageCircle
                            size={13}
                            style={{ color: "#25D366" }}
                          />
                        </button>
                        <button
                          onClick={() => openEdit(item)}
                          title="Edit"
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "8px",
                            border: "1.5px solid var(--btn-ghost-border)",
                            background: "var(--btn-ghost-bg)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Pencil
                            size={13}
                            style={{ color: "var(--icon-booking)" }}
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "8px",
                            border: "1.5px solid var(--badge-rejected-bg)",
                            background: "var(--badge-rejected-bg)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Trash2
                            size={13}
                            style={{ color: "var(--badge-rejected)" }}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <EmptyState
              icon={Users}
              title="No Vendors Found"
              subtitle={
                search
                  ? `No vendor matches "${search}". Try adjusting your search or category filter.`
                  : "Add your first vendor or team member to start managing team availability."
              }
              actionLabel={!search ? "+ Add Vendor" : undefined}
              onAction={openAdd}
              style={{ border: "none", background: "transparent" }}
            />
          )}
        </div>
      </Card>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Vendor" : "Add Vendor"}
        onSave={handleSave}
        saveLabel={editing ? "Update" : "Add Vendor"}
        width="580px"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <label style={lbl}>Vendor Name</label>
              <input
                style={inp}
                placeholder="Full name"
                value={form.name}
                onChange={(e) => set("name", e.target.value.replace(/[^a-zA-Z\s.]/g, ""))}
              />
            </div>
            <CustomSelect
              label="Category"
              value={form.category}
              options={CATEGORIES}
              onChange={(val) => {
                set("category", val);
                if (val !== "Other") set("customCategory", "");
              }}
            />
          </div>
          {form.category === "Other" && (
            <div>
              <label style={lbl}>Specify Category</label>
              <input
                style={inp}
                placeholder="e.g. Florist, Decorator..."
                value={form.customCategory}
                onChange={(e) => set("customCategory", e.target.value)}
              />
            </div>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <label style={lbl}>Contact Number</label>
              <input
                style={inp}
                placeholder="99999 88888"
                value={form.contact}
                onChange={(e) => set("contact", e.target.value.replace(/[^0-9 ]/g, "").slice(0, 11))}
              />
            </div>
            <div>
              <label style={lbl}>WhatsApp Number</label>
              <input
                style={inp}
                placeholder="99999 88888"
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value.replace(/[^0-9 ]/g, '').slice(0, 15))}
              />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <label style={lbl}>Standard Charges (₹ / event)</label>
              <input
                style={inp}
                type="number"
                placeholder="2500"
                value={form.charges}
                onChange={(e) => set("charges", e.target.value)}
              />
            </div>
            <div>
              <label style={lbl}>Service Area</label>
              <input
                style={inp}
                placeholder="e.g. , Pune"
                value={form.serviceArea}
                onChange={(e) => set("serviceArea", e.target.value)}
              />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <CustomSelect
              label="Availability"
              value={form.availability}
              options={["Available", "Busy", "Inactive"]}
              onChange={(val) => set("availability", val)}
            />
            <CustomSelect
              label="Rating"
              value={form.rating}
              options={[5, 4, 3, 2, 1].map((r) => ({
                value: r,
                label: `${r} Star${r !== 1 ? "s" : ""}`,
              }))}
              onChange={(val) => set("rating", Number(val))}
            />
          </div>
          {/* Working Days */}
          <div>
            <label style={lbl}>Working Days</label>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {ALL_DAYS.map((day) => {
                const active = (form.workDays || []).includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const cur = form.workDays || [];
                      set("workDays", active ? cur.filter((d) => d !== day) : [...cur, day]);
                    }}
                    style={{
                      padding: "5px 11px", borderRadius: "8px", fontSize: "12px",
                      fontWeight: 600, cursor: "pointer", border: "1.5px solid",
                      borderColor: active ? "var(--icon-booking)" : "var(--dash-border)",
                      background: active ? "var(--icon-booking-bg)" : "var(--dash-input-bg)",
                      color: active ? "var(--icon-booking)" : "var(--dash-text-muted)",
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shift Hours */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={lbl}>Shift Start</label>
              <input
                type="time"
                style={inp}
                value={form.shiftStart || "08:00"}
                onChange={(e) => set("shiftStart", e.target.value)}
              />
            </div>
            <div>
              <label style={lbl}>Shift End</label>
              <input
                type="time"
                style={inp}
                value={form.shiftEnd || "20:00"}
                onChange={(e) => set("shiftEnd", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={lbl}>Notes</label>
            <input
              style={inp}
              placeholder="Any special notes about this vendor…"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
