// JEFF'S INSTALLATION — App Component

import { useState, useEffect, useRef } from "react"

// ─── Scroll Animation Hook ────────────────────────────────────────────────────
// Injects a global <style> once, then returns a ref you attach to any element.
// The element starts invisible/translated and fades+slides in when it enters the viewport.

const ANIM_STYLE_ID = "jeff-scroll-anims"

function injectAnimStyles() {
  if (typeof document === "undefined") return
  if (document.getElementById(ANIM_STYLE_ID)) return
  const style = document.createElement("style")
  style.id = ANIM_STYLE_ID
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1);
    }
    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .reveal-left {
      opacity: 0;
      transform: translateX(-40px);
      transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
    }
    .reveal-left.visible {
      opacity: 1;
      transform: translateX(0);
    }
    .reveal-right {
      opacity: 0;
      transform: translateX(40px);
      transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
    }
    .reveal-right.visible {
      opacity: 1;
      transform: translateX(0);
    }
    .reveal-scale {
      opacity: 0;
      transform: scale(0.93);
      transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
    }
    .reveal-scale.visible {
      opacity: 1;
      transform: scale(1);
    }

    @keyframes fadeInPhoto {
      from { opacity: 0; transform: scale(1.03); }
      to   { opacity: 1; transform: scale(1); }
    }

    /* ── Default desktop ── */
    .jeff-reviews-desktop { display: block; }
    .jeff-reviews-mobile  { display: none; }

    /* ── What We Install tag cloud: responsive columns ── */
    .jeff-tag-cloud { display: flex; flex-wrap: wrap; gap: 10px; }

    /* ── Tablet (768–1024px): 2-col reviews, smaller tags ── */
    @media (max-width: 1024px) and (min-width: 769px) {
      .jeff-reviews-desktop .jeff-reviews-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .jeff-tag { font-size: 12px !important; padding: 5px 10px !important; }
      .jeff-wwi-grid { gap: 36px !important; }
      .jeff-hiw-grid { gap: 40px !important; }
    }

    /* ── Mobile (max 768px) ── */
    @media (max-width: 768px) {
      .jeff-nav-links { display: none !important; }
      .jeff-nav-hamburger { display: flex !important; }
      .jeff-mobile-menu { display: flex !important; }
      .jeff-two-col { grid-template-columns: 1fr !important; gap: 28px !important; }
      .jeff-three-col { grid-template-columns: 1fr !important; }
      .jeff-service-row { grid-template-columns: 1fr !important; direction: ltr !important; }
      .jeff-hero-stats { gap: 20px !important; flex-wrap: wrap; }
      .jeff-contact-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
      .jeff-form-row { grid-template-columns: 1fr !important; }
      .jeff-footer-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
      .jeff-footer-bottom { flex-direction: column !important; gap: 8px !important; text-align: center !important; align-items: center !important; }
      .jeff-builder-btns { flex-direction: column !important; align-items: center !important; }
      .jeff-review-rating { flex-wrap: wrap; justify-content: center; }
      .jeff-reviews-desktop { display: none !important; }
      .jeff-reviews-mobile  { display: block !important; }

      /* How It Works — stack image below accordion on mobile */
      .jeff-hiw-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
      .jeff-hiw-img  { order: 2 !important; height: 220px !important; }
      .jeff-hiw-text { order: 1 !important; }

      /* What We Install — stack text above photos, hide photo grid, show single slideshow */
      .jeff-wwi-grid       { grid-template-columns: 1fr !important; gap: 24px !important; }
      .jeff-wwi-photogrid  { display: none !important; }
      .jeff-wwi-mobilephoto { display: block !important; }

      /* Tag cloud: max 1 tag per row (full width pills) on mobile */
      .jeff-tag-cloud { gap: 8px !important; }
      .jeff-tag { font-size: 13px !important; }
    }
  `
  document.head.appendChild(style)
}

// useReveal(type, delay) — attach the returned ref to any DOM element
// type: "reveal" | "reveal-left" | "reveal-right" | "reveal-scale"
function useReveal(type = "reveal", delay = 0) {
  const ref = useRef(null)
  useEffect(() => {
    injectAnimStyles()
    const el = ref.current
    if (!el) return
    el.classList.add(type)
    if (delay) el.style.transitionDelay = `${delay}ms`
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.disconnect() } },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [type, delay])
  return ref
}

// ─── Gold Check Icon ──────────────────────────────────────────────────────────
// A small filled gold circle with a white tick — matches the navy/gold palette.
function GoldCheck({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <circle cx="9" cy="9" r="9" fill="#c9973a" />
      <path d="M5 9.5l2.8 2.8 5.2-5.6" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── NavBar ───────────────────────────────────────────────────────────────────
function NavBar({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = (page) => { setMenuOpen(false); onNavigate(page) }

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "#0d1b2a",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 5%", height: 70,
        borderBottom: "1px solid rgba(201,151,58,0.2)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ cursor: "pointer" }} onClick={() => nav("home")}>
          <img
            src="https://images.squarespace-cdn.com/content/v1/6799665bac32f337ec645c92/1765612357840-OST6GM1BR7M33IYC0XUC/public.png?format=1500w"
            alt="Jeff's Installation"
            style={{ height: 42, display: "block" }}
          />
        </div>

        {/* Desktop links */}
        <div className="jeff-nav-links" style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {[["services", "What We Offer"], ["about", "About"], ["contact", "Contact"]].map(([page, label]) => (
            <button key={page} onClick={() => nav(page)} style={{
              color: "rgba(255,255,255,0.82)", background: "none", border: "none",
              fontSize: 14, fontWeight: 500, letterSpacing: "0.04em",
              textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>{label}</button>
          ))}
          <button onClick={() => nav("book")} style={{
            background: "#c9973a", color: "#0d1b2a", padding: "9px 20px",
            borderRadius: 4, border: "none", fontSize: 14, fontWeight: 600,
            letterSpacing: "0.04em", textTransform: "uppercase",
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>Book an Installation</button>
        </div>

        {/* Hamburger — hidden on desktop via CSS, shown on mobile */}
        <button
          className="jeff-nav-hamburger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none", flexDirection: "column", gap: 5,
            background: "none", border: "none", cursor: "pointer", padding: 8,
          }}
        >
          {menuOpen
            ? <span style={{ color: "#fff", fontSize: 22, lineHeight: 1 }}>✕</span>
            : [0, 1, 2].map(i => (
              <span key={i} style={{ display: "block", width: 24, height: 2, background: "#fff", borderRadius: 2 }} />
            ))
          }
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="jeff-mobile-menu"
          style={{
            display: "none", // overridden by CSS on mobile
            flexDirection: "column",
            position: "fixed", top: 70, left: 0, right: 0, zIndex: 99,
            background: "#0d1b2a",
            borderBottom: "1px solid rgba(201,151,58,0.2)",
            padding: "20px 5% 28px",
            gap: 4,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {[["services", "What We Offer"], ["about", "About"], ["contact", "Contact"]].map(([page, label]) => (
            <button key={page} onClick={() => nav(page)} style={{
              color: "rgba(255,255,255,0.82)", background: "none", border: "none",
              fontSize: 16, fontWeight: 500, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", textAlign: "left",
              padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>{label}</button>
          ))}
          <button onClick={() => nav("book")} style={{
            background: "#c9973a", color: "#0d1b2a", padding: "13px 20px",
            borderRadius: 4, border: "none", fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            marginTop: 12, textAlign: "center",
          }}>Book an Installation</button>
        </div>
      )}
    </>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection({ onNavigate }) {
  const badge = useReveal("reveal", 0)
  const heading = useReveal("reveal", 100)
  const sub = useReveal("reveal", 200)
  const btns = useReveal("reveal", 300)
  const stats = useReveal("reveal", 400)
  return (
    <div style={{
      background: "#0d1b2a", minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "100px 5% 80px", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 60% 40%, rgba(201,151,58,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div ref={badge} style={{
        background: "rgba(201,151,58,0.15)", border: "1px solid rgba(201,151,58,0.4)",
        color: "#e4b86a", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em",
        textTransform: "uppercase", padding: "6px 16px", borderRadius: 20, marginBottom: 28,
      }}>Serving Edmonton · Calgary · Kelowna</div>
      <h1 ref={heading} style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(38px, 6vw, 72px)", color: "#ffffff",
        lineHeight: 1.12, marginBottom: 24, maxWidth: 800, marginTop: 0,
      }}>
        Appliance Installation<br />
        <span style={{ color: "#c9973a" }}>Done Right.</span>
      </h1>
      <p ref={sub} style={{ color: "rgba(255,255,255,0.65)", fontSize: 18, maxWidth: 560, lineHeight: 1.7, marginBottom: 44 }}>
        Trusted appliance installation services based in Edmonton, proudly serving customers across Alberta and BC with quality workmanship and dependable service.
      </p>
      <div ref={btns} style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => onNavigate("book")} style={{
          background: "#c9973a", color: "#0d1b2a", padding: "14px 32px", borderRadius: 5,
          border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>Book an Installation</button>
        <button onClick={() => onNavigate("services")} style={{
          background: "transparent", color: "#ffffff", border: "1px solid rgba(255,255,255,0.35)",
          padding: "14px 32px", borderRadius: 5, fontWeight: 500, fontSize: 15,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>See Our Services</button>
      </div>
      <div ref={stats} style={{
        display: "flex", gap: 52, marginTop: 72,
        borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 44,
        flexWrap: "wrap", justifyContent: "center",
      }}>
        {[["5+", "Years Experience"], ["1yr", "Install Warranty"], ["3", "Cities Served"], ["0", "Hidden Fees"]].map(([num, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, color: "#c9973a", lineHeight: 1, marginBottom: 6 }}>{num}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Services Cards ───────────────────────────────────────────────────────────
const servicesData = [
  { tag: "Homeowners", title: "Standard Installation", description: "Designed for single buyers — whether installing one appliance or an entire home setup.", image: "/images/General2.webp", items: ["Professional appliance installation", "Testing and verification included", "On-time, reliable service"] },
  { tag: "Builders & Realtors", title: "Multi-Family Installation", description: "Targeted for developers, realtors, and property managers needing bulk installation services.", image: "/images/General5.webp", items: ["Competitive bulk pricing", "On-site measuring", "No hidden fees"] },
  { tag: "Custom", title: "Custom Services", description: "Contact us for a free quote on specialty or non-standard installations. Whether your project involves built-in appliances, waterline or drain extensions, venting modifications, custom panels, or unique installation requirements, we can review the details and provide a solution tailored to your setup.", image: "/images/General.webp", items: ["Custom quotes for specialty installations", "Standard and built-in appliance solutions", "Guidance on additional requirements and modifications", "Competitive pricing with professional workmanship"], footer: "Send us your model numbers or a few photos, and we'll help get you sorted." },
]

function ServicesCards({ onNavigate }) {
  const header = useReveal("reveal", 0)
  return (
    <div style={{ background: "#f8f5f0", padding: "100px 5%", fontFamily: "'DM Sans', sans-serif" }}>
      <div ref={header} style={{ textAlign: "center", marginBottom: 64 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9973a", marginBottom: 14 }}>Our Services</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", color: "#0d1b2a", lineHeight: 1.2, margin: 0 }}>Tailored Installation Packages</h2>
        <p style={{ fontSize: 17, color: "#6b7c8d", maxWidth: 520, margin: "16px auto 0", lineHeight: 1.7 }}>Whether you're a homeowner, realtor, or property manager, we have a package that fits.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28, maxWidth: 1100, margin: "0 auto" }}>
        {servicesData.map((s, idx) => {
          const cardRef = useReveal("reveal-scale", idx * 120)
          return (
            <div ref={cardRef} key={s.title} style={{ background: "#ffffff", borderRadius: 12, overflow: "hidden", border: "1px solid #ddd8d0", display: "flex", flexDirection: "column" }}>
              <img src={s.image} alt={`${s.title} - Jeff's Installation Edmonton`} loading="lazy" style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
              <div style={{ padding: 28, flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9973a", marginBottom: 10 }}>{s.tag}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#0d1b2a", marginBottom: 12, marginTop: 0 }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: "#6b7c8d", lineHeight: 1.7, marginBottom: 20, marginTop: 0 }}>{s.description}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {s.items.map((item) => (
                    <li key={item} style={{ fontSize: 14, color: "#1c2b3a", padding: "5px 0 5px 22px", position: "relative" }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}><polyline points="2,7 5.5,10.5 12,3.5" fill="none" stroke="#c9973a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                {s.footer && (
                  <p style={{ fontSize: 13, color: "#6b7c8d", lineHeight: 1.65, margin: "18px 0 0", fontStyle: "italic", borderTop: "1px solid #f0ece6", paddingTop: 14 }}>{s.footer}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ textAlign: "center", marginTop: 48 }}>
        <button
          onClick={() => onNavigate("book")}
          style={{
            background: "#0d1b2a", color: "#ffffff",
            border: "none", padding: "14px 40px",
            borderRadius: 40, fontFamily: "'DM Sans', sans-serif",
            fontSize: 15, fontWeight: 600, cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          Book Now →
        </button>
      </div>
    </div>
  )
}
const howItWorksItems = [
  {
    title: "How Booking Works",
    content: "Select your services on our pricing page and submit a booking request. No payment is collected upfront — we'll review your request and follow up within the day to confirm pricing, scheduling, and any project details.",
  },
  {
    title: "Lead Times & Scheduling",
    content: "We typically book installs within 1–3 business days of your request. Same-day availability is often possible. Once we confirm your appliance details and location, we'll lock in a time that works for you.",
  },
  {
    title: "Customization",
    content: "Every home is different. If your project involves non-standard cabinet sizes, unusual configurations, or built-in appliances, just let us know. We'll assess the requirements and provide a tailored solution before any work begins.",
  },
  {
    title: "Additional Charges & Labour",
    content: "Standard pricing applies when existing hookups are in place and no modifications are needed. Additional charges may apply for waterline extensions, venting, electrical work, or cabinet modifications. We'll always be transparent about costs upfront.",
  },
]

function HowItWorks({ onNavigate }) {
  const [openIndex, setOpenIndex] = useState(0)
  const textCol = useReveal("reveal-left", 0)
  const imgCol = useReveal("reveal-right", 150)

  return (
    <div style={{ background: "#f8f5f0", padding: "80px 5%", fontFamily: "'DM Sans', sans-serif" }}>
      <div className="jeff-hiw-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

        {/* Left — photo */}
        <img
          ref={imgCol}
          className="jeff-hiw-img"
          src="/images/General.webp"
          alt="Completed kitchen appliance installation in Edmonton"
          loading="lazy" style={{ width: "100%", height: 480, objectFit: "cover", borderRadius: 12, display: "block" }}
        />

        {/* Right — accordion */}
        <div ref={textCol} className="jeff-hiw-text">
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9973a", marginBottom: 14 }}>Process</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 42px)", color: "#0d1b2a", marginBottom: 36, marginTop: 0 }}>How It Works</h2>

          {howItWorksItems.map((item, i) => (
            <div key={i} style={{ borderTop: "1px solid #ddd8d0" }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: "#0d1b2a", textAlign: "left" }}>{item.title}</span>
                <span style={{ fontSize: 22, color: "#c9973a", fontWeight: 300, lineHeight: 1, flexShrink: 0, marginLeft: 16, transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>+</span>
              </button>
              {openIndex === i && (
                <div style={{ paddingBottom: 20 }}>
                  <p style={{ fontSize: 14, color: "#6b7c8d", lineHeight: 1.75, margin: 0 }}>{item.content}</p>
                </div>
              )}
            </div>
          ))}
          <div style={{ borderTop: "1px solid #ddd8d0", marginBottom: 28 }} />

          <button
            onClick={() => onNavigate("book")}
            style={{
              background: "#0d1b2a", color: "#ffffff",
              padding: "14px 32px", borderRadius: 40,
              border: "none", fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase", cursor: "pointer",
            }}
          >Book Now</button>
        </div>
      </div>
    </div>
  )
}

// ─── What We Install ──────────────────────────────────────────────────────────
const installTags = ["Dishwashers", "Over-range Microwaves", "Wall Ovens", "Gas & Electric Ranges", "Cooktops", "Hood Fans", "Refrigerators", "Washers & Dryers", "Panel Appliances"]

const allInstallPhotos = [
  "/images/General.webp",
  "/images/General2.webp",
  "/images/General3.webp",
  "/images/Dishwasher.webp",
  "/images/Washer-and-Dryer-Stacked.webp",
  "/images/General4.webp",
]

function WhatWeInstall() {
  const textCol = useReveal("reveal-left", 0)
  const photoCol = useReveal("reveal-right", 150)
  const [photoIndexes, setPhotoIndexes] = useState([0, 1, 2])
  const [mobilePhotoIdx, setMobilePhotoIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndexes(prev => [
        (prev[0] + 3) % allInstallPhotos.length,
        (prev[1] + 3) % allInstallPhotos.length,
        (prev[2] + 3) % allInstallPhotos.length,
      ])
      setMobilePhotoIdx(prev => (prev + 1) % allInstallPhotos.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ background: "#ffffff", padding: "80px 5% 60px", fontFamily: "'DM Sans', sans-serif" }}>
      <div className="jeff-wwi-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div ref={textCol}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9973a", marginBottom: 14 }}>Appliances & More</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 32px)", color: "#0d1b2a", marginBottom: 16, marginTop: 0 }}>What We Install</h3>
          <p style={{ fontSize: 15, color: "#6b7c8d", lineHeight: 1.75, marginBottom: 20, marginTop: 0 }}>From kitchen to laundry appliances, our team handles all the hard stuff with precision and care.</p>
          <div className="jeff-wwi-mobilephoto" style={{ display: "none", marginBottom: 20 }}>
            <img key={mobilePhotoIdx} src={allInstallPhotos[mobilePhotoIdx]} alt="Installation work" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 10, display: "block", animation: "fadeInPhoto 0.6s ease" }} />
          </div>
          <div className="jeff-tag-cloud" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {installTags.map((tag) => (
              <span key={tag} className="jeff-tag" style={{ background: "#f8f5f0", border: "1px solid #ddd8d0", color: "#0d1b2a", fontSize: 13, fontWeight: 500, padding: "7px 14px", borderRadius: 20 }}>{tag}</span>
            ))}
          </div>
        </div>
        <div ref={photoCol} className="jeff-wwi-photogrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <img key={photoIndexes[0]} src={allInstallPhotos[photoIndexes[0]]} alt="Installation work" style={{ gridColumn: "1 / -1", width: "100%", height: 220, objectFit: "cover", borderRadius: 8, display: "block", animation: "fadeInPhoto 0.6s ease" }} />
          {[1, 2].map((slot) => (
            <img key={`${slot}-${photoIndexes[slot]}`} src={allInstallPhotos[photoIndexes[slot]]} alt="Installation work" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8, display: "block", animation: "fadeInPhoto 0.6s ease" }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
const galleryPhotos = [
  "/images/General4.webp",
  "/images/General.webp",
  "/images/General2.webp",
  "/images/General3.webp",
]

function PhotoGallery() {
  return (
    <div style={{ background: "#0d1b2a", padding: "100px 5%", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#e4b86a", marginBottom: 14 }}>Our Work</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", color: "#ffffff", lineHeight: 1.2, margin: 0 }}>Recent Installations</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, maxWidth: 1100, margin: "0 auto" }}>
        {galleryPhotos.map((src, i) => (
          <img key={i} src={src} alt={`Jeff's Installation - professional appliance installation work in Edmonton`} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 6, display: "block" }} />
        ))}
      </div>
    </div>
  )
}

// ─── About Page ───────────────────────────────────────────────────────────────
function AboutPage() {
  const whyItems = ["Professional, detail-oriented team", "On-time, reliable service", "Skilled with modern and smart appliances", "Customer-first approach", "Competitive, transparent pricing"]
  const heroText = useReveal("reveal", 0)
  const bodyLeft = useReveal("reveal-left", 0)
  const bodyRight = useReveal("reveal-right", 150)
  const locSection = useReveal("reveal", 0)
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#0d1b2a", padding: "90px 5% 80px", textAlign: "center" }}>
        <div ref={heroText}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9973a", marginBottom: 14 }}>Who We Are</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 56px)", color: "#ffffff", marginBottom: 20, marginTop: 0 }}>Local, Trusted, Experienced</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>A locally owned installation company with 5 years of experience serving homeowners, builders, and property managers across Western Canada.</p>
        </div>
      </div>
      <div style={{ background: "#ffffff", padding: "100px 5% 60px" }}>
        <div className="jeff-two-col" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div ref={bodyLeft}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, color: "#0d1b2a", marginBottom: 20, marginTop: 0 }}>Built on Quality & Reliability</h2>
            <p style={{ fontSize: 16, color: "#6b7c8d", lineHeight: 1.8, marginBottom: 20, marginTop: 0 }}>At Jeff's Installation, we're an energetic, detail-oriented team that takes pride in every install we complete. From single fridges to full multi-unit kitchen buildouts, we show up on time and get it done right the first time.</p>
            <p style={{ fontSize: 16, color: "#6b7c8d", lineHeight: 1.8, marginBottom: 20, marginTop: 0 }}>We work with homeowners, builders, realtors, and property managers across Alberta and British Columbia — delivering seamless, efficient service every step of the way.</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "28px 0 0" }}>
              {whyItems.map((item) => (
                <li key={item} style={{ fontSize: 15, color: "#1c2b3a", padding: "10px 0 10px 28px", borderBottom: "1px solid #ddd8d0", position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}><GoldCheck size={18} /></span>{item}
                </li>
              ))}
            </ul>
          </div>
          <img ref={bodyRight} src="/images/General4.webp" alt="Edmonton Alberta cityscape - Jeff's Installation serves Edmonton and surrounding areas" loading="lazy" style={{ width: "100%", height: 420, objectFit: "cover", borderRadius: 12, display: "block" }} />
        </div>
      </div>
      <div ref={locSection} style={{ background: "#f8f5f0", padding: "80px 5%", textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9973a", marginBottom: 14 }}>Where We Work</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: "#0d1b2a", marginTop: 12, marginBottom: 32 }}>Serving Alberta & BC</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          {["Edmonton, AB", "Calgary, AB", "Kelowna, BC"].map((city) => (
            <div key={city} style={{ background: "#ffffff", border: "1px solid #ddd8d0", padding: "14px 30px", borderRadius: 40, fontSize: 16, fontWeight: 500, color: "#0d1b2a", display: "flex", alignItems: "center", gap: 8 }}>
              {city}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Contact Page ─────────────────────────────────────────────────────────────
function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", service: "", message: "" })
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const inputStyle = { width: "100%", background: "#f8f5f0", border: "1px solid #ddd8d0", borderRadius: 6, padding: "11px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#1c2b3a", outline: "none", boxSizing: "border-box" }
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#6b7c8d", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }
  const heroText = useReveal("reveal", 0)
  const infoCol = useReveal("reveal-left", 0)
  const formCol = useReveal("reveal-right", 150)

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.phone) {
      setError("Please fill in your name, email, and phone number.")
      return
    }
    setError("")
    setLoading(true)
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "e0932ab2-9493-4b71-a98c-10ce22fbddcc",
          subject: `Contact Request — ${form.firstName} ${form.lastName}`,
          from_name: "Jeff's Installation Website",
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
          service: form.service || "Not specified",
          message: form.message || "No message provided",
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        setError("Something went wrong. Please try again or call us directly.")
      }
    } catch {
      setError("Network error. Please try again or call us directly.")
    }
    setLoading(false)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#0d1b2a", padding: "90px 5% 70px", textAlign: "center" }}>
        <div ref={heroText}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9973a", marginBottom: 14 }}>Get in Touch</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 52px)", color: "#ffffff", marginBottom: 16, marginTop: 0 }}>Let's Get You Booked</h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>Fill out the form and we'll get back to you within the day. Same-day availability often possible.</p>
        </div>
      </div>
      <div style={{ background: "#f8f5f0", padding: "100px 5% 60px" }}>
        <div className="jeff-contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 60, maxWidth: 1000, margin: "0 auto", alignItems: "start" }}>
          <div ref={infoCol}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "#0d1b2a", marginBottom: 24, marginTop: 0 }}>Contact Details</h3>
            {[
              { label: "Email", value: "Jeff.InstallationsLTD@gmail.com", href: "mailto:Jeff.InstallationsLTD@gmail.com" },
              { label: "Phone", value: "(780) 938-1176  |  (780) 938-8004", href: null },
              { label: "Locations", value: "Edmonton · Calgary · Kelowna", href: null },
              { label: "Availability", value: "Same-day · Response within the day", href: null },
            ].map((d) => (
              <div key={d.label} style={{ marginBottom: 22 }}>
                <strong style={{ display: "block", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b7c8d", marginBottom: 4 }}>{d.label}</strong>
                {d.href
                  ? <a href={d.href} style={{ fontSize: 15, color: "#0d1b2a", fontWeight: 500, textDecoration: "none" }}>{d.value}</a>
                  : <span style={{ fontSize: 15, color: "#0d1b2a", fontWeight: 500 }}>{d.value}</span>
                }
              </div>
            ))}
          </div>
          <div ref={formCol} style={{ background: "#ffffff", borderRadius: 14, border: "1px solid #ddd8d0", padding: 40 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#0d1b2a", marginBottom: 28, marginTop: 0 }}>Request a Booking</h3>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><GoldCheck size={52} /></div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 12, marginTop: 0 }}>Request Received!</h4>
                <p style={{ color: "#6b7c8d", lineHeight: 1.7, margin: 0 }}>Thanks! Jeff's team will be in touch with you within the day.</p>
              </div>
            ) : (
              <>
                <div className="jeff-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  {[["First Name", "firstName", "John"], ["Last Name", "lastName", "Smith"]].map(([label, name, ph]) => (
                    <div key={name}><label style={labelStyle}>{label}</label><input type="text" name={name} placeholder={ph} value={form[name]} onChange={handleChange} style={inputStyle} /></div>
                  ))}
                </div>
                {[["Email Address", "email", "you@example.com", "email"], ["Phone Number", "phone", "(780) 000-0000", "tel"]].map(([label, name, ph, type]) => (
                  <div key={name} style={{ marginBottom: 20 }}><label style={labelStyle}>{label}</label><input type={type} name={name} placeholder={ph} value={form[name]} onChange={handleChange} style={inputStyle} /></div>
                ))}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Service Type</label>
                  <select name="service" value={form.service} onChange={handleChange} style={inputStyle}>
                    <option value="">Select a package...</option>
                    <option>Standard Installation</option>
                    <option>Multi-Family Installation</option>
                    <option>Custom / Free Quote</option>
                    <option>Panel Appliances</option>
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Message</label>
                  <textarea name="message" placeholder="Tell us about your project..." value={form.message} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
                </div>
                {error && <p style={{ fontSize: 13, color: "#c0392b", marginBottom: 12, margin: "0 0 12px" }}>{error}</p>}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ width: "100%", background: loading ? "#6b7c8d" : "#0d1b2a", color: "#ffffff", border: "none", padding: 14, borderRadius: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: loading ? "default" : "pointer" }}
                >
                  {loading ? "Sending..." : "Send Request →"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Services Page ────────────────────────────────────────────────────────────
function ServicesPage({ onNavigate }) {
  const rows = [
    { tag: "Homeowners", title: "Standard Installation", description: "Designed for single buyers, whether installing one appliance or multiple. We handle setup, testing, and verification — all in one visit.", image: "/images/Genera2.webp", items: ["Professional appliance installation", "Testing and verification of every install", "On-time, reliable service", "No hidden fees"], reverse: false },
    { tag: "Builders · Realtors · Property Managers", title: "Multi-Family Installation", description: "From 3-suite townhouses to 550+ unit towers, our team has successfully delivered countless kitchen installations across Western Canada.", image: "/images/General5.webp", items: ["Competitive bulk pricing", "On-site measuring and scoping", "No hidden fees — ever"], reverse: true },
    { tag: "Specialty", title: "Built-In, Panel Appliance & Bundle Packages", description: "When Jeff's Installation installs the appliance and the panels together, you get that flawless seamless look — done right by professionals.", image: "/images/General.webp", items: ["Custom panel installs", "Microwave trim kits", "Corner cabinet dishwasher setup", "Seamless flush-fit finishes", "Built-in fridges"], reverse: false },
  ]
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#0d1b2a", padding: "90px 5% 70px", textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9973a", marginBottom: 14 }}>What We Offer</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 56px)", color: "#ffffff", marginBottom: 20, marginTop: 0 }}>Professional Installation Services</h1>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 580, margin: "0 auto", lineHeight: 1.75 }}>At Jeff's Installation LTD, we provide seamless appliance installation for homeowners, builders, realtors, and property managers across Alberta and BC.</p>
      </div>
      <div style={{ background: "#1a2f45", padding: "24px 5%", textAlign: "center" }}>
        <p style={{ fontSize: 16, margin: 0, color: "rgba(255,255,255,0.9)" }}><strong style={{ color: "#c9973a" }}>1-Year Installation Warranty</strong> on all services &nbsp;·&nbsp; Edmonton · Calgary · Kelowna &nbsp;·&nbsp; Same-day availability</p>
      </div>
      <div style={{ background: "#ffffff", padding: "100px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {rows.map((s, i) => {
            const textBlock = (
              <div key="text">
                <div style={{ fontSize: 14, fontWeight: 600, color: "#c9973a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{s.tag}</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: "#0d1b2a", marginBottom: 14, marginTop: 0 }}>{s.title}</h2>
                <p style={{ fontSize: 16, color: "#6b7c8d", lineHeight: 1.75, marginBottom: 22, marginTop: 0 }}>{s.description}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {s.items.map((item) => (
                    <li key={item} style={{ fontSize: 14, color: "#1c2b3a", padding: "5px 0 5px 22px", position: "relative" }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}><polyline points="2,7 5.5,10.5 12,3.5" fill="none" stroke="#c9973a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
            const imgBlock = <img key="img" src={s.image} alt={s.title} style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 10, display: "block" }} />
            return (
              <div key={s.title} className="jeff-service-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", padding: "60px 0", borderBottom: i < rows.length - 1 ? "1px solid #ddd8d0" : "none" }}>
                {s.reverse ? [textBlock, imgBlock] : [imgBlock, textBlock]}
              </div>
            )
          })}
        </div>
      </div>
      {/* Book Now CTA */}
      <div style={{ textAlign: "center", padding: "60px 5% 80px", background: "#ffffff" }}>
        <p style={{ fontSize: 16, color: "#6b7c8d", marginBottom: 24, marginTop: 0 }}>Ready to get started? Book your installation online in minutes.</p>
        <button
          onClick={() => onNavigate("book")}
          style={{
            background: "#0d1b2a", color: "#ffffff",
            border: "none", padding: "15px 44px",
            borderRadius: 40, fontFamily: "'DM Sans', sans-serif",
            fontSize: 15, fontWeight: 600, cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          Book Now →
        </button>
      </div>
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ onNavigate }) {
  return (
    <footer style={{ background: "#0d1b2a", padding: "60px 5% 32px", borderTop: "1px solid rgba(255,255,255,0.07)", fontFamily: "'DM Sans', sans-serif" }}>
      <div
        className="jeff-footer-grid"
        style={{
          maxWidth: 1100, margin: "0 auto",
          display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr",
          gap: 40, paddingBottom: 48,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Brand */}
        <div>
          <img
            src="https://images.squarespace-cdn.com/content/v1/6799665bac32f337ec645c92/1765612357840-OST6GM1BR7M33IYC0XUC/public.png?format=1500w"
            alt="Jeff's Installation"
            style={{ height: 46, marginBottom: 16, display: "block" }}
          />
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, maxWidth: 280, margin: 0 }}>
            Professional appliance installation for homes and multi-unit properties across Western Canada.
          </p>
        </div>

        {/* Pages */}
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9973a", marginBottom: 18, marginTop: 0 }}>Pages</h4>
          {[["home", "Home"], ["services", "What We Offer"], ["about", "About"], ["contact", "Contact"]].map(([page, label]) => (
            <button key={page} onClick={() => onNavigate(page)} style={{
              display: "block", fontSize: 14, color: "rgba(255,255,255,0.5)",
              background: "none", border: "none", cursor: "pointer",
              padding: "0 0 10px", fontFamily: "'DM Sans', sans-serif",
              textAlign: "left",
            }}>{label}</button>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9973a", marginBottom: 18, marginTop: 0 }}>Contact</h4>
          <a href="mailto:Jeff.InstallationsLTD@gmail.com" style={{
            display: "block", fontSize: 14, color: "rgba(255,255,255,0.5)",
            textDecoration: "none", marginBottom: 10,
            wordBreak: "break-all",
          }}>Jeff.InstallationsLTD@gmail.com</a>
          <a href="tel:7809381176" style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 10 }}>(780) 938-1176</a>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0 }}>Edmonton · Calgary · Kelowna</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="jeff-footer-bottom"
        style={{
          maxWidth: 1100, margin: "28px auto 0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: 13, color: "rgba(255,255,255,0.3)",
        }}
      >
        <span>© 2025 Jeff's Installation LTD. All rights reserved.</span>
        <span>Serving Alberta & BC</span>
      </div>
    </footer>
  )
}

// ─── Book Page ────────────────────────────────────────────────────────────────
// ─── Book Page Price Data ─────────────────────────────────────────────────────
const PRICE_CATEGORIES = [
  {
    id: "fridge", title: "Fridge & Waterline Install",
    images: [
      "/images/Fridge.webp",
      "/images/Fridge2.webp",
    ],
    photoLabels: ["Standard Fridge", "Panel-Ready Fridge"],
    waterline: true,
    includes: ["Deliver & position fridge", "Connect waterline for ice maker", "Level and secure unit", "Test ice maker & water dispenser"],
    note: "Panel-ready and built-in fridge installs available — contact us for a custom quote.",
    items: [
      { label: "Refrigerator Detail", price: 20 },
      { label: "Refrigerator with Waterline Installation", price: 120 },
    ],
  },
  {
    id: "dishwasher", title: "Dishwasher Installation",
    images: [
      "/images/Dishwasher.webp",
      "/images/Dishwasher2.webp",
      "/images/Dishwasher3.webp",
      "/images/Dishwasher4.webp",
    ],
    photoLabels: ["Dishwasher", "Install View", "Panel Dishwasher", "Detail View"],
    includes: ["Disconnect & remove old unit", "Connect water supply & drain lines", "Secure and level dishwasher", "Test full cycle before leaving"],
    note: "Corner cabinet setup: additional charge applies.",
    items: [
      { label: "Dishwasher Installation with Waterline", price: 160 },
      { label: "Dishwasher Installation without Waterline", price: 140 },
    ],
  },
  {
    id: "microwave", title: "Microwave Installation",
    images: [
      "/images/MicrowaveOTR.webp",
      "/images/Trim-Kit-Microwave.webp",
    ],
    photoLabels: ["OTR Microwave", "Trim-Kit / Built-In"],
    includes: ["Remove existing unit", "Mount & secure over-range microwave", "Install trim kit if required", "Test all functions"],
    note: "Built-in microwave and trim kit installs also available.",
    items: [
      { label: "OTR Microwave Installation", price: 100 },
      { label: "Built-In Microwave / Trim Kit Installation", price: 110 },
    ],
  },
  {
    id: "range", title: "Gas & Electric Range",
    images: [
      "/images/Gas-Range.webp",
      "/images/Electric-Range.webp",
    ],
    photoLabels: ["Gas Range", "Electric Range"],
    includes: ["Disconnect & remove old unit", "Position and level range", "Connect gas or electrical supply", "Test all burners and oven functions"],
    note: "Gas line modifications are not included and may require a licensed gas fitter.",
    items: [
      { label: "Gas Range Installation", price: 95 },
      { label: "Electric Range Installation", price: 20 },
    ],
  },
  {
    id: "hoodfan", title: "Hood Fan Installation",
    images: [
      "/images/Under-Cabinet-Hood-Fan.webp",
      "/images/Insert-Hood-Fan.webp",
    ],
    photoLabels: ["Under-Cabinet Hood", "Insert Hood Fan"],
    includes: ["Chimney, insert & under-cabinet hood fans", "Ductwork connection", "Secure mounting", "Test fan speeds & lighting"],
    note: "Custom chimney hood installs available — pricing varies.",
    items: [
      { label: "Under-Cabinet Hood Fan Installation", price: 110 },
      { label: "Chimney Hood Fan Installation", price: 280 },
      { label: "Insert Hood Fan Installation", price: 110 },
    ],
  },
  {
    id: "cooktop", title: "Cook Top Installation",
    images: [
      "/images/Gas-CookTop.webp",
      "/images/Electric-Cooktop.webp",
    ],
    photoLabels: ["Gas Cooktop", "Electric Cooktop"],
    includes: ["Gas or electric cooktop installation", "Cutout & sealing", "Connect supply lines", "Full safety test"],
    note: "Gas line modifications are not included and may require a licensed gas fitter.",
    items: [
      { label: "Cooktop Installation Gas", price: 160 },
      { label: "Cooktop Installation Electric", price: 110 },
    ],
  },
  {
    id: "walloven", title: "Wall Oven",
    images: [
      "/images/Wall-Oven.webp",
      "/images/Double-Wall-Oven.webp",
    ],
    photoLabels: ["Single Wall Oven", "Double Wall Oven"],
    includes: ["Single or double wall oven installation", "Electrical connection", "Secure in cabinet cutout", "Test all oven functions"],
    note: "Cabinet modifications are not included in standard pricing.",
    items: [
      { label: "Wall Oven Installation", price: 160 },
      { label: "Double-Wall Oven", price: 200 },
    ],
  },
  {
    id: "laundry", title: "Washer & Dryer",
    images: [
      "/images/Washer-and-Dryer-Stacked.webp",
      "/images/Washer-and-dryer-sidebyside.webp",
    ],
    photoLabels: ["Stacked Unit", "Side by Side"],
    includes: ["Washer & dryer hookup", "Connect water supply & drain", "Vent connection for dryers", "Level and test both units"],
    note: "Gas dryer connections available. Venting modifications are an additional charge.",
    items: [
      { label: "Stacked", price: 160 },
      { label: "Side by Side", price: 120 },
      { label: "Gas Stacked", price: 180 },
      { label: "Gas Side by Side", price: 180 },
    ],
  },
]

// ─── Price Card (extracted so useState hook works per card) ───────────────────
function PriceCard({ cat, isSelected, toggleItem, setDetailModal }) {
  const [photoIdx, setPhotoIdx] = useState(0)
  const imgs = cat.images || [cat.image]

  return (
    <div style={{ border: "1px solid #ddd8d0", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Photo carousel */}
      <div style={{ position: "relative" }}>
        <img
          src={imgs[photoIdx]}
          alt={`${cat.title} - ${cat.photoLabels?.[photoIdx] || cat.title} - professional appliance installation Edmonton`}
          loading="lazy"
          style={{ width: "100%", height: 180, objectFit: "cover", display: "block", transition: "opacity 0.3s" }}
        />
        {cat.waterline && (
          <div style={{ position: "absolute", top: 10, right: 10, fontSize: 11, fontWeight: 600, color: "#0d1b2a", background: "#e4b86a", borderRadius: 20, padding: "3px 10px" }}>Leak Detector Included</div>
        )}
        {cat.photoLabels && (
          <div style={{ position: "absolute", bottom: imgs.length > 1 ? 22 : 8, left: 10, fontSize: 11, fontWeight: 600, color: "#fff", background: "rgba(0,0,0,0.5)", borderRadius: 12, padding: "2px 10px" }}>
            {cat.photoLabels[photoIdx]}
          </div>
        )}
        {imgs.length > 1 && (
          <>
            <button onClick={() => setPhotoIdx(i => (i - 1 + imgs.length) % imgs.length)}
              style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            <button onClick={() => setPhotoIdx(i => (i + 1) % imgs.length)}
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
            <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
              {imgs.map((_, i) => (
                <button key={i} onClick={() => setPhotoIdx(i)} style={{ width: i === photoIdx ? 16 : 6, height: 6, borderRadius: 3, border: "none", background: i === photoIdx ? "#c9973a" : "rgba(255,255,255,0.65)", cursor: "pointer", padding: 0, transition: "width 0.2s" }} />
              ))}
            </div>
          </>
        )}
      </div>
      {/* Header */}
      <div style={{ background: "#0d1b2a", padding: "12px 18px" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#ffffff", margin: 0 }}>{cat.title}</h3>
      </div>
      {/* Items */}
      <div style={{ flex: 1 }}>
        {cat.items.map((item, idx) => {
          const sel = isSelected(cat.title, item)
          return (
            <div key={idx} onClick={() => toggleItem(cat.title, item)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderBottom: idx < cat.items.length - 1 ? "1px solid #f0ece6" : "none", cursor: "pointer", background: sel ? "rgba(201,151,58,0.06)" : "#ffffff", transition: "background 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 19, height: 19, borderRadius: 4, flexShrink: 0, border: sel ? "2px solid #c9973a" : "2px solid #ddd8d0", background: sel ? "#c9973a" : "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                  {sel && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1,5 3.5,8 9,2" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
                <span style={{ fontSize: 14, color: "#1c2b3a", fontWeight: sel ? 600 : 400, lineHeight: 1.4 }}>{item.label}</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#0d1b2a", marginLeft: 12, whiteSpace: "nowrap" }}>${item.price}</span>
            </div>
          )
        })}
      </div>
      {/* View Details */}
      <div style={{ padding: "14px 18px", borderTop: "1px solid #f0ece6" }}>
        <button onClick={() => setDetailModal(cat)}
          style={{ width: "100%", background: "#0d1b2a", color: "#ffffff", border: "none", padding: "10px", borderRadius: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em" }}>
          View Details
        </button>
      </div>
    </div>
  )
}

function BookPage({ onNavigate }) {
  const [selectedItems, setSelectedItems] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [detailModal, setDetailModal] = useState(null)
  const [haulawy, setHaulawy] = useState(null)
  const [hookups, setHookups] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", date: "", model: "", notes: "" })
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const toggleItem = (catTitle, item) => {
    const key = `${catTitle}__${item.label}`
    setSelectedItems(prev =>
      prev.find(i => i.key === key)
        ? prev.filter(i => i.key !== key)
        : [...prev, { key, label: item.label, category: catTitle, price: item.price }]
    )
  }
  const isSelected = (catTitle, item) => !!selectedItems.find(i => i.key === `${catTitle}__${item.label}`)
  const total = selectedItems.reduce((sum, i) => sum + i.price, 0)

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.email || !form.address) {
      setError("Please fill in your name, phone, email, and address.")
      return
    }
    setError("")
    setLoading(true)

    const servicesText = selectedItems.length > 0
      ? selectedItems.map(i => `${i.label} — $${i.price}`).join("\n")
      : "No services selected (custom quote requested)"

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "e0932ab2-9493-4b71-a98c-10ce22fbddcc",
          subject: `Booking Request — ${form.name} ($${total})`,
          from_name: "Jeff's Installation Website",
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          preferred_date: form.date || "Not specified",
          services_requested: servicesText,
          estimated_total: `$${total}`,
          haul_away_needed: haulawy || "Not specified",
          existing_hookups_ready: hookups || "Not specified",
          model_number: form.model || "Not provided",
          notes: form.notes || "None",
          photo_attached: photoFile ? photoFile.name : "None",
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        setError("Something went wrong. Please try again or call us directly.")
      }
    } catch {
      setError("Network error. Please try again or call us directly.")
    }
    setLoading(false)
  }

  const inputStyle = { width: "100%", background: "#f8f5f0", border: "1px solid #ddd8d0", borderRadius: 6, padding: "13px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#1c2b3a", outline: "none", boxSizing: "border-box" }
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#6b7c8d", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 7 }

  const ToggleBtn = ({ value, current, onClick, children }) => (
    <button onClick={() => onClick(current === value ? null : value)} style={{
      padding: "9px 22px", borderRadius: 6, border: `1px solid ${current === value ? "#c9973a" : "#ddd8d0"}`,
      background: current === value ? "rgba(201,151,58,0.1)" : "#f8f5f0",
      color: current === value ? "#0d1b2a" : "#6b7c8d",
      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: current === value ? 600 : 400,
      cursor: "pointer", transition: "all 0.15s",
    }}>{children}</button>
  )

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Hero */}
      <div style={{ background: "#0d1b2a", padding: "80px 5% 60px", textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9973a", marginBottom: 14 }}>Book an Installation</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 50px)", color: "#ffffff", marginBottom: 16, marginTop: 0 }}>Appliance Installation Price List</h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.75 }}>
          Select your services below and submit a booking request — we'll confirm pricing and scheduling with you directly.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
          {["Fully Insured", "1-Year Warranty", "Trusted by Builders", "Same-Day Available"].map((label) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 40, padding: "7px 16px", fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{label}</div>
          ))}
        </div>
        <div style={{ maxWidth: 580, margin: "0 auto", background: "rgba(201,151,58,0.12)", border: "1px solid rgba(201,151,58,0.35)", borderRadius: 12, padding: "18px 22px", textAlign: "left" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#e4b86a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Water Leak Protection</div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, margin: 0 }}>A water leak detector is included with all waterline installations, backed by our 1-year workmanship warranty.</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: "#1a2f45", padding: "14px 5%", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 auto", maxWidth: 820, lineHeight: 1.6 }}>
          <strong style={{ color: "rgba(255,255,255,0.85)" }}>Standard Pricing Disclaimer:</strong>{" "}
          Prices shown reflect standard installations only, where existing hookups are in place and no venting, plumbing, electrical, or cabinet modifications are required.
        </p>
      </div>

      {/* Price List with Photos */}
      <div style={{ background: "#ffffff", padding: "60px 5%" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 3.5vw, 34px)", color: "#0d1b2a", margin: "0 0 10px" }}>Choose Your Services</h2>
            <p style={{ fontSize: 15, color: "#6b7c8d", margin: 0 }}>Select one or more — we'll confirm scheduling and final price after reviewing your request.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {PRICE_CATEGORIES.map((cat) => (
              <PriceCard
                key={cat.id}
                cat={cat}
                isSelected={isSelected}
                toggleItem={toggleItem}
                setDetailModal={setDetailModal}
              />
            ))}

            {/* Built-In / Specialty card */}
            <div style={{ border: "2px solid #c9973a", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <img src="/images/General3.webp" alt="Built-in and panel appliance installation - Jeff's Installation Edmonton" loading="lazy" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
              <div style={{ background: "#c9973a", padding: "12px 18px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#0d1b2a", margin: 0 }}>Built-In, Specialty & Bundle Packages</h3>
              </div>
              <div style={{ padding: "20px 18px", background: "#fffdf9", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <p style={{ fontSize: 14, color: "#1c2b3a", lineHeight: 1.7, margin: "0 0 16px" }}>For built-in, luxury, or unique appliance installations, contact us for a free custom quote or ask about bundled package pricing.</p>
                <button onClick={() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })}
                  style={{ background: "#0d1b2a", color: "#ffffff", border: "none", padding: "11px 20px", borderRadius: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" }}>
                  Request a Custom Quote →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky summary bar */}
      {selectedItems.length > 0 && (
        <div style={{ position: "sticky", bottom: 0, zIndex: 50, background: "#0d1b2a", borderTop: "2px solid #c9973a", padding: "14px 5%" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ color: "#ffffff", fontSize: 14 }}>
              <span style={{ color: "#e4b86a", fontWeight: 700 }}>{selectedItems.length}</span> service{selectedItems.length > 1 ? "s" : ""} selected
              <span style={{ color: "rgba(255,255,255,0.35)", margin: "0 10px" }}>·</span>
              Estimated: <span style={{ color: "#e4b86a", fontWeight: 700 }}>${total}</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: 8 }}>(subject to confirmation)</span>
            </div>
            <button onClick={() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: "#c9973a", color: "#0d1b2a", border: "none", padding: "10px 22px", borderRadius: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Book Selected Services →
            </button>
          </div>
        </div>
      )}

      {/* Booking Form */}
      <div id="booking-form" style={{ background: "#f8f5f0", padding: "80px 5%" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9973a", marginBottom: 12 }}>Next Step</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 3.5vw, 34px)", color: "#0d1b2a", margin: "0 0 12px" }}>Submit Your Booking Request</h2>
            {/* Key UX line */}
            <div style={{ display: "inline-block", background: "rgba(201,151,58,0.1)", border: "1px solid rgba(201,151,58,0.3)", borderRadius: 8, padding: "10px 18px", fontSize: 14, color: "#0d1b2a", fontWeight: 500, marginBottom: 12 }}>
              Quick 30-second request — we'll confirm details and pricing with you before booking.
            </div>
            <p style={{ fontSize: 14, color: "#6b7c8d", lineHeight: 1.65, margin: 0 }}>No payment is collected at this stage. We'll review your request and follow up to confirm.</p>
          </div>

          {submitted ? (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #ddd8d0", padding: "56px 40px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><GoldCheck size={52} /></div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#0d1b2a", marginBottom: 12, marginTop: 0 }}>Booking Request Sent!</h3>
              <p style={{ fontSize: 15, color: "#6b7c8d", lineHeight: 1.7, margin: "0 0 16px" }}>Jeff's team will review your request and reach out within the day to confirm pricing and scheduling.</p>
              <div style={{ display: "inline-block", background: "rgba(201,151,58,0.1)", border: "1px solid rgba(201,151,58,0.3)", borderRadius: 8, padding: "10px 18px", fontSize: 14, color: "#0d1b2a", fontWeight: 600 }}>
                Payment is not required at this stage.
              </div>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #ddd8d0", padding: "36px 40px" }}>

              {/* Selected services summary */}
              {selectedItems.length > 0 && (
                <div style={{ marginBottom: 24, background: "#f8f5f0", borderRadius: 10, padding: "16px 18px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b7c8d", marginBottom: 10 }}>Selected Services</div>
                  {selectedItems.map((item) => (
                    <div key={item.key} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #ede9e2" }}>
                      <span style={{ fontSize: 13, color: "#1c2b3a" }}>{item.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0d1b2a" }}>${item.price}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 12, color: "#6b7c8d" }}>Estimated Total</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#c9973a" }}>${total}</span>
                  </div>
                  <p style={{ fontSize: 11, color: "#9aabb8", margin: "6px 0 0" }}>Final price confirmed after review.</p>
                </div>
              )}

              {/* Required Information */}
              <div style={{ fontSize: 12, fontWeight: 700, color: "#c9973a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Required Information</div>
              <div style={{ marginBottom: 14 }}><label style={labelStyle}>Full Name *</label><input name="name" placeholder="Your name" value={form.name} onChange={handleChange} style={inputStyle} /></div>
              <div style={{ marginBottom: 14 }}><label style={labelStyle}>Phone Number *</label><input name="phone" placeholder="Your phone number" value={form.phone} onChange={handleChange} style={inputStyle} /></div>
              <div style={{ marginBottom: 14 }}><label style={labelStyle}>Email Address *</label><input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} style={inputStyle} /></div>
              <div style={{ marginBottom: 14 }}><label style={labelStyle}>Service Address *</label><input name="address" placeholder="Service address" value={form.address} onChange={handleChange} style={inputStyle} /></div>
              <div style={{ marginBottom: 22 }}><label style={labelStyle}>Preferred Installation Date *</label><input name="date" type="date" value={form.date} onChange={handleChange} style={inputStyle} /></div>

              {/* Quick Details */}
              <div style={{ fontSize: 12, fontWeight: 700, color: "#c9973a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Quick Details</div>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Haul-away needed?</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <ToggleBtn value="yes" current={haulawy} onClick={setHaulawy}>Yes</ToggleBtn>
                  <ToggleBtn value="no" current={haulawy} onClick={setHaulawy}>No</ToggleBtn>
                </div>
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={labelStyle}>Existing hookups ready?</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <ToggleBtn value="yes" current={hookups} onClick={setHookups}>Yes</ToggleBtn>
                  <ToggleBtn value="not sure" current={hookups} onClick={setHookups}>Not sure</ToggleBtn>
                </div>
              </div>

              {/* Optional Details */}
              <div style={{ fontSize: 12, fontWeight: 700, color: "#c9973a", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Optional Details</div>
              <div style={{ marginBottom: 14 }}><label style={labelStyle}>Model number (if available)</label><input name="model" placeholder="Enter model number" value={form.model} onChange={handleChange} style={inputStyle} /></div>

              {/* Photo upload */}
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Upload a photo (optional)</label>
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, border: "2px dashed #ddd8d0", borderRadius: 8, padding: "28px 20px", cursor: "pointer", background: "#f8f5f0", textAlign: "center" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9aabb8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21,15 16,10 5,21" /></svg>
                  <span style={{ fontSize: 13, color: "#9aabb8" }}>{photoFile ? photoFile.name : "Click to upload or drag and drop"}</span>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              <div style={{ marginBottom: 24 }}><label style={labelStyle}>Additional notes (optional)</label><textarea name="notes" placeholder="Type your notes here..." value={form.notes} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: "vertical" }} /></div>

              {error && <p style={{ fontSize: 13, color: "#c0392b", margin: "0 0 12px" }}>{error}</p>}
              <button onClick={handleSubmit} disabled={loading}
                style={{ width: "100%", background: loading ? "#6b7c8d" : "#0d1b2a", color: "#ffffff", border: "none", padding: 16, borderRadius: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, cursor: loading ? "default" : "pointer" }}>
                {loading ? "Sending..." : "Submit Request"}
              </button>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 14, padding: "12px 14px", background: "#f8f5f0", borderRadius: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aabb8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <p style={{ fontSize: 12, color: "#9aabb8", margin: 0, lineHeight: 1.6 }}>Payment is not required at this stage. We'll confirm details, pricing, and scheduling with you.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Detail Modal */}
      {detailModal && (
        <div
          onClick={() => setDetailModal(null)}
          style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'DM Sans', sans-serif" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#ffffff", borderRadius: 16, maxWidth: 540, width: "100%", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto" }}
          >
            {/* Photo */}
            <div style={{ position: "relative" }}>
              <img src={(detailModal.images || [detailModal.image])[0]} alt={detailModal.title} style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }} />
              <button
                onClick={() => setDetailModal(null)}
                style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
              >✕</button>
              {detailModal.waterline && (
                <div style={{ position: "absolute", bottom: 14, left: 14, fontSize: 11, fontWeight: 700, color: "#0d1b2a", background: "#e4b86a", borderRadius: 20, padding: "4px 12px" }}>Leak Detector Included</div>
              )}
            </div>

            <div style={{ padding: "28px 32px 32px" }}>
              {/* Title + starting price */}
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "#0d1b2a", margin: "0 0 12px" }}>{detailModal.title}</h2>
              <div style={{ display: "inline-block", background: "rgba(201,151,58,0.12)", border: "1px solid rgba(201,151,58,0.4)", color: "#c9973a", fontSize: 13, fontWeight: 600, padding: "5px 14px", borderRadius: 20, marginBottom: 22 }}>
                Starting at <span style={{ fontSize: 18 }}>${Math.min(...detailModal.items.map(i => i.price))}</span>
              </div>

              {/* Pricing options */}
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7c8d", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Pricing Options</div>
              {detailModal.items.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0ece6" }}>
                  <span style={{ fontSize: 14, color: "#1c2b3a" }}>{item.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#0d1b2a" }}>${item.price}</span>
                </div>
              ))}

              {/* What's included */}
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7c8d", letterSpacing: "0.08em", textTransform: "uppercase", margin: "22px 0 12px" }}>What's Included</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 18px" }}>
                {detailModal.includes.map((inc) => (
                  <li key={inc} style={{ fontSize: 15, color: "#1c2b3a", padding: "7px 0 7px 24px", borderBottom: "1px solid #f0ece6", position: "relative" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}>
                      <polyline points="2,7 5.5,10.5 12,3.5" fill="none" stroke="#c9973a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {inc}
                  </li>
                ))}
              </ul>

              {/* Note */}
              {detailModal.note && (
                <p style={{ fontSize: 13, color: "#6b7c8d", background: "#f8f5f0", borderRadius: 6, padding: "10px 14px", margin: "0 0 8px", borderLeft: "3px solid #c9973a", lineHeight: 1.65 }}>{detailModal.note}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
// ─── Reviews Section (Elfsight) ──────────────────────────────────────────────
function ReviewsSection() {
  const headerRef = useReveal("reveal", 0)

  return (
    <div style={{ background: "#f8f5f0", padding: "100px 5%", fontFamily: "'DM Sans', sans-serif" }}>
      <div ref={headerRef} style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9973a", marginBottom: 14 }}>Customer Reviews</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 42px)", color: "#0d1b2a", margin: 0 }}>What Our Customers Say</h2>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          className="elfsight-app-99714d21-023e-405f-8f3f-781dea6c3cfe"
          data-elfsight-app-lazy
        />
      </div>
    </div>
  )
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home")

  const navigate = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div lang="en" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <NavBar onNavigate={navigate} />
      <main style={{ paddingTop: 70 }}>
        {page === "home" && (
          <>
            <HeroSection onNavigate={navigate} />
            <ServicesCards onNavigate={navigate} />
            <HowItWorks onNavigate={navigate} />
            <WhatWeInstall />
            <ReviewsSection />
          </>
        )}
        {page === "services" && <ServicesPage onNavigate={navigate} />}
        {page === "about" && <AboutPage />}
        {page === "contact" && <ContactPage />}
        {page === "book" && <BookPage onNavigate={navigate} />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  )
}
